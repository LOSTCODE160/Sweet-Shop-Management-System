from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.db.base import Base

class Sweet(Base):
    """
    Sweet model representing a product in the shop.
    
    Attributes:
        id (int): Primary key.
        name (str): Name of the sweet.
        category (str): Category (e.g., 'Chocolate', 'Gummy').
        price (float): Price per unit.
        quantity (int): Stock quantity available.
        created_at (datetime): Timestamp when the product was added.
        updated_at (datetime): Timestamp when the product was last updated.
    """
    __tablename__ = "sweets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
