from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import api
from app.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title=settings.APP_NAME,
    description="Car Management System API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "https://fast-api-management.vercel.app",  # Vercel production
    ],
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

app.include_router(api.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Starter!"} 