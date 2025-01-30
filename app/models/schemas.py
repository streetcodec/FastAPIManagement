from pydantic import BaseModel, EmailStr, HttpUrl, Field, AnyHttpUrl
from typing import Optional, List
from datetime import datetime

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    is_active: bool = True
    created_at: Optional[datetime] = None
    hashed_password: Optional[str] = None
    
    class Config:
        from_attributes = True
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Car schemas
class CarBase(BaseModel):
    title: str
    description: str
    car_type: str
    company: str
    dealer: str
    tags: List[str] = []
    images: List[str] = []  # Change from AnyHttpUrl to str

class CarCreate(CarBase):
    pass

class CarUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    car_type: Optional[str] = None
    company: Optional[str] = None
    dealer: Optional[str] = None
    tags: Optional[List[str]] = None
    images: Optional[List[str]] = None  # Change from AnyHttpUrl to str

class Car(CarBase):
    id: str
    owner_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Item(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None 