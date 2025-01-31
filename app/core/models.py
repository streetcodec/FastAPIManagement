from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional
from datetime import datetime

class UserModel(BaseModel):
    email: EmailStr
    username: str
    hashed_password: str
    created_at: datetime = datetime.utcnow()

class CarModel(BaseModel):
    title: str
    description: str
    images: List[HttpUrl]
    car_type: str
    company: str
    dealer: str
    tags: List[str]
    owner_id: str
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow() 