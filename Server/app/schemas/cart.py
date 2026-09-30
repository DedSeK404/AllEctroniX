from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional
from app.schemas.part import PartResponse 


# --- CART ITEM SCHEMAS ---

class CartItemCreate(BaseModel):
    part_code: str
    quantity: int = 1

class CartItemUpdate(CartItemCreate):
    quantity: int       

class CartItemResponse(BaseModel):
    id: int
    cart_id: int
    part_code: str
    quantity: int
    part: PartResponse  

    model_config = ConfigDict(from_attributes=True)


# --- CART SCHEMAS ---

class CartResponse(BaseModel):
    id: int
    user_id: int
    items: List[CartItemResponse] = []  

    model_config = ConfigDict(from_attributes=True)

class OrderItemSnapshot(BaseModel):
    part_code: str
    product_name: str
    price: float
    image_url: Optional[str] = None
    quantity: int

class CartHistory(BaseModel):
    cart_id: int
    user_id: int
  

# Response schema returned by API endpoints
class CartHistoryResponse(BaseModel):
    id: int
    cart_id: int
    user_id: int
    creation_date: datetime
    items_snapshot: List[OrderItemSnapshot] = []

    model_config = ConfigDict(from_attributes=True)