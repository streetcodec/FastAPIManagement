from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "Car Management System"
    MONGODB_URL: str
    DATABASE_NAME: str = "car_management"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "allow"
        env_file_encoding = 'utf-8'

    @classmethod
    def get_settings(cls):
        try:
            return cls()
        except Exception as e:
            print(f"Error loading settings: {e}")
            print("Make sure all required environment variables are set!")
            raise

settings = Settings.get_settings() 