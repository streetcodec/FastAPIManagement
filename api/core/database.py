from motor.motor_asyncio import AsyncIOMotorClient
from api.config import settings
import certifi
from typing import AsyncGenerator

client = None
database = None

async def connect_to_mongo():
    global client, database
    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000
        )
        database = client[settings.DATABASE_NAME]
        # Test the connection
        await client.admin.command('ping')
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    global client
    if client is not None:
        client.close()
        print("MongoDB connection closed")

async def get_db() -> AsyncGenerator:
    global database
    try:
        if database is None:
            await connect_to_mongo()
        yield database
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

def get_database():
    global database
    if database is None:
        raise Exception("Database not initialized")
    return database