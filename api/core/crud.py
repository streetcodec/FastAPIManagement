from bson import ObjectId
from typing import List, Optional
from app.models import schemas
from app.core.security import get_password_hash
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

async def create_user(db: AsyncIOMotorDatabase, user: schemas.UserCreate) -> schemas.User:
    hashed_password = get_password_hash(user.password)
    db_user = {
        "email": user.email,
        "username": user.username,
        "hashed_password": hashed_password,
        "is_active": True
    }
    result = await db.users.insert_one(db_user)
    db_user["id"] = str(result.inserted_id)
    return schemas.User(**db_user)

async def get_user_by_email(db: AsyncIOMotorDatabase, email: str):
    user = await db.users.find_one({"email": email})
    if user:
        user["id"] = str(user["_id"])
        return schemas.User(**user)

async def get_cars(
    db: AsyncIOMotorDatabase,
    owner_id: str,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[schemas.Car]:
    query = {"owner_id": owner_id}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search]}}
        ]
    
    cursor = db.cars.find(query).skip(skip).limit(limit)
    cars = []
    async for car in cursor:
        car["id"] = str(car["_id"])
        cars.append(schemas.Car(**car))
    return cars

async def get_car(db: AsyncIOMotorDatabase, car_id: str):
    try:
        car = await db.cars.find_one({"_id": ObjectId(car_id)})
        if car:
            car["id"] = str(car["_id"])
            return schemas.Car(**car)
        return None
    except Exception as e:
        print(f"Error getting car: {e}")
        raise e

async def create_car(db: AsyncIOMotorDatabase, car: schemas.CarCreate, owner_id: str):
    try:
        car_dict = car.dict()
        car_dict.update({
            "owner_id": owner_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        
        # Convert URLs to strings if they aren't already
        if car_dict.get('images'):
            car_dict['images'] = [str(url) for url in car_dict['images']]
            
        result = await db.cars.insert_one(car_dict)
        car_dict["id"] = str(result.inserted_id)
        return schemas.Car(**car_dict)
    except Exception as e:
        print(f"Error creating car: {e}")
        raise e

async def update_car(db: AsyncIOMotorDatabase, car_id: str, car: schemas.CarUpdate):
    try:
        car_data = {k: v for k, v in car.dict(exclude_unset=True).items() if v is not None}
        
        # Convert URLs to strings if they exist
        if car_data.get('images'):
            car_data['images'] = [str(url) for url in car_data['images']]
            
        car_data["updated_at"] = datetime.utcnow()
        
        result = await db.cars.update_one(
            {"_id": ObjectId(car_id)},
            {"$set": car_data}
        )
        
        if result.modified_count == 0:
            raise ValueError("Car not found or no changes made")

        updated_car = await db.cars.find_one({"_id": ObjectId(car_id)})
        if updated_car:
            updated_car["id"] = str(updated_car["_id"])
            return schemas.Car(**updated_car)
        raise ValueError("Failed to fetch updated car")
    except Exception as e:
        print(f"Error updating car: {e}")
        raise e

async def delete_car(db: AsyncIOMotorDatabase, car_id: str):
    await db.cars.delete_one({"_id": ObjectId(car_id)}) 