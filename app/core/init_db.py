from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

async def init_db():
    client = AsyncIOMotorClient(settings.DATABASE_URL,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=None,
        connect=False
    )
    try:
        # Verify the connection
        await client.admin.command('ping')
        print("Connected successfully to MongoDB Atlas!")
        
        db = client.car_management

        # Create indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        await db.cars.create_index("owner_id")
        await db.cars.create_index("title")
        await db.cars.create_index("car_type")
        await db.cars.create_index("company")
        
        # Create text indexes for search
        await db.cars.create_index([
            ("title", "text"),
            ("description", "text"),
            ("tags", "text")
        ])

        print("Database initialized successfully!")

    except Exception as e:
        print(f"Database initialization error: {e}")
        raise
    finally:
        client.close() 