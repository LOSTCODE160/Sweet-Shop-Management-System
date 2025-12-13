import pytest
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.db.base import Base
from app.db.session import get_db

# Use a separate SQLite database for testing to avoid affecting the development DB
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

# Create engine for test DB
engine_test = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Testing SessionLocal
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

@pytest.fixture(scope="function")
def db() -> Generator:
    """
    Fixture that creates a fresh database for each test function.
    Creates tables before the test and drops them after.
    """
    # Create tables
    Base.metadata.create_all(bind=engine_test)
    
    session = TestingSessionLocal()
    yield session
    
    # Teardown
    session.close()
    Base.metadata.drop_all(bind=engine_test)

@pytest.fixture(scope="function")
def client(db) -> Generator:
    """
    Fixture that returns a FastAPI TestClient.
    Overrides the get_db dependency to use the test database session.
    """
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c
    
    # Clear overrides after test
    app.dependency_overrides.clear()
