from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

@app.get("/api/test")
async def test_route():
    try:
        return {"message": "API is working"}
    except Exception as e:
        logger.error(f"Error in test route: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

handler = Mangum(app, lifespan="off") 