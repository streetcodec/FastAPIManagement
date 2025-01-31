from datetime import datetime
from fastapi import HTTPException, status
from app.models import schemas
from motor.motor_asyncio import AsyncIOMotorDatabase

async def get_user_by_email_for_auth(db: AsyncIOMotorDatabase, email: str):
    user = await db.users.find_one({"email": email})
    if user:
        user["id"] = str(user["_id"])
        return schemas.User(**user)
    return None 