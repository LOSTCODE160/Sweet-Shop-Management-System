from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, EmailStr, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sweet Shop Management System"
    PROJECT_VERSION: str = "1.0.0"
    
    # Secrets
    # In production, these should be loaded from env vars.
    # We provide defaults here for the local assignment dev environment.
    SECRET_KEY: str = "CHANGE_THIS_TO_A_STRING_SECRET_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    SQLALCHEMY_DATABASE_URL: str = "sqlite:///./sweet_shop.db"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
