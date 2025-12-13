from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SweetBase(BaseModel):
    name: str
    category: str
    price: float
    quantity: int

class SweetCreate(SweetBase):
    pass

class SweetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

class SweetResponse(SweetBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
