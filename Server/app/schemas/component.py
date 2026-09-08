from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Shared properties
class ComponentBase(BaseModel):
    part_number: str
    name: str
    category: str
    subcategory: str
    price: float
    stock: int = 0
    package: Optional[str] = None
    description: Optional[str] = None
    symptoms: List[str] = []
    specs: Dict[str, Any] = {}

# Properties needed on creation
class ComponentCreate(ComponentBase):
    pass

# Properties returned to the client
class Component(ComponentBase):
    id: str

    class Config:
        from_attributes = True