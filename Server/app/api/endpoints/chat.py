from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.services import chat as chat_service
from app.core.deps import get_current_user
from app.db.session import SessionLocal, get_db
from app.models.user import UserModel as User
from app.schemas.chat import ConversationOut, MessageOut

router = APIRouter()


# --- SCHEMAS ---

class PaginatedMessagesResponse(BaseModel):
    messages: List[MessageOut]
    has_more: bool
    next_cursor: Optional[str] = None

    class Config:
        from_attributes = True


# --- REST ENDPOINTS ---

@router.get("/conversations", response_model=List[ConversationOut])
def get_user_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch all active (non-deleted) chat sessions for the authenticated user."""
    return chat_service.get_user_conversations(db=db, user_id=current_user.id)


@router.get("/conversations/{conversation_id}/messages", response_model=PaginatedMessagesResponse)
def get_conversation_history(
    conversation_id: str,
    before_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch paginated message history for a specific conversation session."""
    try:
        return chat_service.get_messages_by_conversation(
            db=db, 
            conversation_id=conversation_id, 
            user_id=current_user.id,
            before_id=before_id
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soft-delete a conversation for the authenticated user."""
    try:
        chat_service.soft_delete_conversation(
            db=db, 
            conversation_id=conversation_id, 
            user_id=current_user.id
        )
        return None
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# --- WEBSOCKET STREAMING ENDPOINT ---

@router.websocket("/ws")
async def websocket_chat(websocket: WebSocket, user_id: int):
    """
    Real-time streaming diagnostic chat via WebSocket.
    Client connects to ws://<server>/api/chat/ws?user_id=<USER_ID>
    """
    await websocket.accept()
    try:
        while True:
            raw_data = await websocket.receive_text()
            
            db = SessionLocal()
            try:
                await chat_service.process_websocket_message(
                    db=db,
                    websocket=websocket,
                    user_id=user_id,
                    raw_data=raw_data
                )
            except Exception as e:
                print(f"❌ Error processing WebSocket message for user {user_id}: {e}")
                await websocket.send_json({"type": "ERROR", "message": str(e)})
            finally:
                db.close()

    except WebSocketDisconnect:
        print(f"Client user_id={user_id} disconnected normally.")
    except Exception as e:
        print(f"🔥 Unexpected WebSocket connection failure for user {user_id}: {e}")