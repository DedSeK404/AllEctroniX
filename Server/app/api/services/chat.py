import base64
import json
import os
import time
from typing import List, Optional

import anyio
from dotenv import load_dotenv
from fastapi import WebSocket
from google import genai
from google.genai import types
from google.genai.errors import APIError
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models.chat import Conversation, Message

MODEL_NAME = "gemini-3.5-flash-lite"
MAX_CONTEXT_MESSAGES = 30  # 👈 CHANGE THIS TO 30 LATER for production!

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set. Please check your .env file.")

client = genai.Client(api_key=api_key)


def get_user_conversations(db: Session, user_id: int) -> List[Conversation]:
    """Retrieves all active (non-deleted) conversations for a user."""
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id, Conversation.is_deleted == False)
        .order_by(Conversation.updated_at.desc())
        .all()
    )


def get_messages_by_conversation(
    db: Session,
    conversation_id: str,
    user_id: int,
    limit: int = 6,  # 👈 CHANGE THIS TO 30 LATER (Default batch size for UI pagination)
    before_id: Optional[int] = None,
) -> dict:
    """
    Retrieves paginated messages for a specific user conversation using cursor-based pagination.
    Returns messages ordered chronologically (asc) alongside pagination metadata.
    """
    conv = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
            Conversation.is_deleted == False,
        )
        .first()
    )
    if not conv:
        raise ValueError("Conversation not found.")

    query = db.query(Message).filter(Message.conversation_id == conversation_id)

    # Apply cursor filter if user is scrolling up for older history
    if before_id:
        target_msg = db.query(Message).filter(Message.id == before_id).first()
        if target_msg:
            query = query.filter(Message.created_at < target_msg.created_at)

    # Fetch newest records matching the cursor limit in descending order
    messages_desc = query.order_by(desc(Message.created_at)).limit(limit + 1).all()

    has_more = len(messages_desc) > limit
    paginated_messages = messages_desc[:limit]

    # Re-sort chronologically (ascending) for UI rendering
    paginated_messages.reverse()

    return {
        "messages": paginated_messages,
        "has_more": has_more,
        "next_cursor": paginated_messages[0].id if paginated_messages and has_more else None,
    }


def soft_delete_conversation(db: Session, conversation_id: str, user_id: int) -> None:
    """Soft-deletes a chat conversation."""
    conv = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == user_id)
        .first()
    )
    if not conv:
        raise ValueError("Conversation not found.")

    conv.is_deleted = True
    db.commit()


def _fetch_gemini_stream(contents_payload: list):
    """Fetches streaming response using a single stable model with transient error protection."""
    for attempt in range(3):
        try:
            response_stream = client.models.generate_content_stream(
                model=MODEL_NAME,
                contents=contents_payload,
            )
            chunks = []
            for chunk in response_stream:
                if chunk.text:
                    chunks.append(chunk.text)
            return chunks
        except APIError as e:
            if e.code in (503, 429) and attempt < 2:
                time.sleep(1)
                continue
            raise e
        except Exception as e:
            raise e


async def process_websocket_message(
    db: Session, websocket: WebSocket, user_id: int, raw_data: str
):
    """
    Handles payload parsing, conversation creation, multi-turn history loading,
    streaming from Gemini without blocking the asyncio loop, and persisting message history.
    """
    try:
        payload = json.loads(raw_data)
    except json.JSONDecodeError:
        await websocket.send_json({"type": "ERROR", "message": "Invalid JSON format."})
        return

    content = payload.get("content", "")
    conv_id = payload.get("conversation_id")
    image_base64 = payload.get("image_base64")

    # 1. Get or Create Conversation
    if not conv_id:
        conv = Conversation(user_id=user_id, title="New Diagnostic Session")
        db.add(conv)
        db.commit()
        db.refresh(conv)
        conv_id = conv.id
    else:
        conv = (
            db.query(Conversation)
            .filter(
                Conversation.id == conv_id,
                Conversation.user_id == user_id,
                Conversation.is_deleted == False,
            )
            .first()
        )
        if not conv:
            await websocket.send_json(
                {"type": "ERROR", "message": "Conversation not found or access denied."}
            )
            return

    # 2. Persist User Message
    user_msg = Message(conversation_id=conv_id, sender="user", content=content)
    db.add(user_msg)
    db.commit()


    history_messages = (
        db.query(Message)
        .filter(Message.conversation_id == conv_id)
        .order_by(desc(Message.created_at))
        .limit(MAX_CONTEXT_MESSAGES) 
        .all()
    )
    history_messages.reverse()  # Restore ascending chronological order

    contents_payload = []
    for msg in history_messages:
        role = "user" if msg.sender == "user" else "model"
        contents_payload.append(
            types.Content(role=role, parts=[types.Part.from_text(text=msg.content)])
        )

    # Append image data if present in current message
    if image_base64:
        try:
            image_bytes = base64.b64decode(image_base64)
            contents_payload[-1].parts.append(
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
            )
        except Exception as e:
            await websocket.send_json(
                {"type": "ERROR", "message": f"Invalid base64 image data: {str(e)}"}
            )
            return

    # 4. Stream Response safely using worker thread execution
    chunks = await anyio.to_thread.run_sync(_fetch_gemini_stream, contents_payload)

    full_response_text = ""
    for chunk_text in chunks:
        full_response_text += chunk_text
        await websocket.send_json(
            {
                "type": "STREAM_CHUNK",
                "conversation_id": conv_id,
                "delta": chunk_text,
            }
        )

    # 5. Persist Assistant Response
    assistant_msg = Message(
        conversation_id=conv_id, sender="assistant", content=full_response_text
    )
    db.add(assistant_msg)

    # 6. Auto-update Title on First Exchange
    if conv.title == "New Diagnostic Session":
        conv.title = content[:30] + "..." if len(content) > 30 else content

    db.commit()

    # 7. Notify Stream Completion
    await websocket.send_json(
        {
            "type": "STREAM_END",
            "conversation_id": conv_id,
            "message_id": assistant_msg.id,
            "title": conv.title,
        }
    )