from pydantic import BaseModel, ConfigDict
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