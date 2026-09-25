from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class PartBase(BaseModel):
    code: str
    brand: Optional[str] = None
    package: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    describe: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = 0

class PartResponse(PartBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class PartPaginatedResponse(BaseModel):
    items: List[PartResponse]
    total_items: int
    total_pages: int
    page: int
    limit: int