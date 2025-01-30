from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import sys
import os

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.routes import api
from app.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Since frontend and backend are on same domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Test route
@app.get("/api/test")
async def test_route():
    return {"message": "API is working"}

app.include_router(api.router, prefix="/api")

# Vercel handler
handler = Mangum(app) 