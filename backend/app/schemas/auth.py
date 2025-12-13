from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    
    model_config = {"from_attributes": True}

class UserLogin(BaseModel):
    username: str # Using 'username' to match standard OAuth2, but we treat it as email
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
