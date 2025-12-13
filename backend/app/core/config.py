import os
from pathlib import Path

# Project base path
# referencing up to the 'backend' folder
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    PROJECT_NAME: str = "Sweet Shop Management System"
    PROJECT_VERSION: str = "1.0.0"
    
    # Database settings
    # SQLite database file will be created in the backend directory
    # 'sqlite:///./sweet_shop.db' is also common but using absolute path is safer
    SQLALCHEMY_DATABASE_URL: str = f"sqlite:///{BASE_DIR}/sweet_shop.db"

settings = Settings()
