from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

# --- REST Response Schemas ---

class MessageOut(BaseModel):
    id: str
    conversation_id: str
    sender: str
    content: str
    image_url: Optional[str] = None
    metadata_json: Optional[Any] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationOut(BaseModel):
    id: str
    user_id: int  # Aligned with Integer ForeignKey("users.id")
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- WebSocket Payload Schemas ---

class WSIncomingMessage(BaseModel):
    type: str  # e.g., "USER_MESSAGE"
    conversation_id: Optional[str] = None
    content: str
    image_base64: Optional[str] = None


class WSOutgoingChunk(BaseModel):
    type: str = "STREAM_CHUNK"
    conversation_id: str
    delta: str


class WSOutgoingEnd(BaseModel):
    type: str = "STREAM_END"
    conversation_id: str
    message_id: str
    title: Optional[str] = None