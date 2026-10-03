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

from app.api.services.inventory import search_store_inventory
from app.models.chat import Conversation, Message

MODEL_NAME = "gemini-3.5-flash-lite" 
MAX_CONTEXT_MESSAGES = 30

SYSTEM_INSTRUCTION = """
You are an expert AI hardware diagnostic and component-matching assistant for an electronics store.

STRICT INVENTORY AND HALLUCINATION RULES:
1. Analyze user symptoms and inspect any uploaded circuit images for damaged components (e.g., blown casing, bulging caps, burnt PCB traces) or part numbers (e.g., 2SC5200, TDA7388, LM1875).
2. Provide concise isolation steps and mandatory high-voltage safety precautions first.
3. Whenever a component replacement or drop-in substitute is identified, execute the `search_store_inventory` tool with the extracted part number or generic search query.
4. STRICT GROUNDING REQUIREMENT: Never invent or assume stock availability, part names, part numbers, or prices. State prices and availability ONLY if returned directly by `search_store_inventory`.
5. IF `search_store_inventory` returns empty results or no direct match, explicitly state that the part is currently not found in store stock. Do NOT present hypothetical pricing or fake catalog items.
"""

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set. Please check your .env file.")

client = genai.Client(api_key=api_key)


def get_user_conversations(db: Session, user_id: int) -> List[Conversation]:
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
    limit: int = 6,
    before_id: Optional[int] = None,
) -> dict:
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

    if before_id:
        target_msg = db.query(Message).filter(Message.id == before_id).first()
        if target_msg:
            query = query.filter(Message.created_at < target_msg.created_at)

    messages_desc = query.order_by(desc(Message.created_at)).limit(limit + 1).all()

    has_more = len(messages_desc) > limit
    paginated_messages = messages_desc[:limit]

    paginated_messages.reverse()

    return {
        "messages": paginated_messages,
        "has_more": has_more,
        "next_cursor": paginated_messages[0].id if paginated_messages and has_more else None,
    }


def soft_delete_conversation(db: Session, conversation_id: str, user_id: int) -> None:
    conv = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == user_id)
        .first()
    )
    if not conv:
        raise ValueError("Conversation not found.")

    conv.is_deleted = True
    db.commit()


def _fetch_gemini_stream(contents_payload: list, db: Session):
    tools = [search_store_inventory]
    
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_INSTRUCTION,
        tools=tools,
        temperature=0.2
    )

    matched_products = []

    for attempt in range(3):
        try:
            initial_response = client.models.generate_content(
                model=MODEL_NAME,
                contents=contents_payload,
                config=config
            )

            if initial_response.function_calls:
                function_responses = []

                for function_call in initial_response.function_calls:
                    if function_call.name == "search_store_inventory":
                        query = function_call.args.get("query") or function_call.args.get("part_number") or ""
                        
                        try:
                            tool_result = search_store_inventory(query, db)
                        except TypeError:
                            tool_result = search_store_inventory(query)

                        if isinstance(tool_result, dict) and "products" in tool_result:
                            matched_products.extend(tool_result["products"])
                        elif isinstance(tool_result, list):
                            matched_products.extend(tool_result)

                        function_responses.append(
                            types.Part.from_function_response(
                                name="search_store_inventory",
                                response={"result": tool_result}
                            )
                        )

                if initial_response.candidates:
                    contents_payload.append(initial_response.candidates[0].content)

                contents_payload.append(
                    types.Content(role="user", parts=function_responses)
                )

            response_stream = client.models.generate_content_stream(
                model=MODEL_NAME,
                contents=contents_payload,
                config=config
            )

            chunks = []
            for chunk in response_stream:
                if chunk.text:
                    chunks.append({"type": "text", "content": chunk.text})

            return {"chunks": chunks, "matched_products": matched_products}

        except APIError as e:
            if e.code in (503, 429) and attempt < 2:
                time.sleep(1)
                continue
            raise e


async def process_websocket_message(
    db: Session, websocket: WebSocket, user_id: int, raw_data: str
):
    try:
        payload = json.loads(raw_data)
    except json.JSONDecodeError:
        await websocket.send_json({"type": "ERROR", "message": "Invalid JSON format."})
        return

    content = payload.get("content", "")
    conv_id = payload.get("conversation_id")
    image_base64 = payload.get("image_base64")

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
    history_messages.reverse()

    contents_payload = []
    for msg in history_messages:
        role = "user" if msg.sender == "user" else "model"
        contents_payload.append(
            types.Content(role=role, parts=[types.Part.from_text(text=msg.content)])
        )

    if image_base64:
        try:
            mime_type = "image/jpeg"
            
            if "," in image_base64:
                header, image_base64 = image_base64.split(",", 1)
                if "data:" in header and ";base64" in header:
                    mime_type = header.split(";")[0].replace("data:", "")

            image_bytes = base64.b64decode(image_base64)
            contents_payload[-1].parts.append(
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            )
        except Exception as e:
            await websocket.send_json(
                {"type": "ERROR", "message": f"Invalid base64 image data: {str(e)}"}
            )
            return

    stream_result = await anyio.to_thread.run_sync(_fetch_gemini_stream, contents_payload, db)

    full_response_text = ""
    matched_products = stream_result.get("matched_products", [])

    for item in stream_result["chunks"]:
        if item["type"] == "text":
            full_response_text += item["content"]
            await websocket.send_json(
                {
                    "type": "STREAM_CHUNK",
                    "conversation_id": conv_id,
                    "delta": item["content"],
                }
            )

    # Persist assistant response with consistent metadata format
    assistant_msg = Message(
        conversation_id=conv_id,
        sender="assistant",
        content=full_response_text,
        metadata_json={"matched_products": matched_products} if matched_products else None,
    )
    db.add(assistant_msg)

    if conv.title == "New Diagnostic Session":
        conv.title = content[:30] + "..." if len(content) > 30 else content

    db.commit()

    # Emit completion payload with metadata so the frontend renders cards immediately
    await websocket.send_json(
        {
            "type": "STREAM_END",
            "conversation_id": conv_id,
            "message_id": assistant_msg.id,
            "title": conv.title,
            "metadata": {"matched_products": matched_products},
        }
    )