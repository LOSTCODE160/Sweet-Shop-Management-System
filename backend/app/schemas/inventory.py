from pydantic import BaseModel, Field

class RestockRequest(BaseModel):
    amount: int = Field(gt=0, description="Amount to restock, must be positive")
