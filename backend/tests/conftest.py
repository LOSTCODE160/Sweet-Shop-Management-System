import pytest
from typing import Generator, Dict
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.core.security import get_password_hash
from app.models.user import User

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

@pytest.fixture(scope="function")
def normal_user_token_headers(client, db) -> Dict[str, str]:
    """
    Fixture creates a normal user and returns valid Authorization headers.
    """
    password = "password123"
    user_in = User(
        name="Normal User",
        email="normal@test.com",
        password_hash=get_password_hash(password),
        role="USER"
    )
    db.add(user_in)
    db.commit()
    
    login_res = client.post("/auth/token", json={"username": user_in.email, "password": password})
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="function")
def admin_user_token_headers(client, db) -> Dict[str, str]:
    """
    Fixture creates an admin user and returns valid Authorization headers.
    """
    password = "adminpass123"
    user_in = User(
        name="Admin User",
        email="admin@test.com",
        password_hash=get_password_hash(password),
        role="ADMIN"
    )
    db.add(user_in)
    db.commit()
    
    login_res = client.post("/auth/token", json={"username": user_in.email, "password": password})
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
