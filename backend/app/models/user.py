from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base

class User(Base):
    """
    User model representing a system user (Customer or Admin).
    
    Attributes:
        id (int): Primary key.
        name (str): Full name of the user.
        email (str): Unique email address (used for login).
        password_hash (str): Hashed password string.
        role (str): Role of the user ('USER' or 'ADMIN').
        created_at (datetime): Timestamp when the user was created.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    # Defaulting to USER. In a real app, strict validation or Enum is used.
    role = Column(String, default="USER", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
