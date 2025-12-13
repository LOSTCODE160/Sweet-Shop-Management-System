from fastapi import status

def test_read_users_me_no_token(client):
    """Accessing protected endpoint without token should return 401."""
    response = client.get("/test/users/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_read_users_me_valid_token(client):
    """Accessing protected endpoint with valid token should return 200."""
    # Register a user first to have a valid ID in DB
    register_payload = {
        "name": "Normal User",
        "email": "normal@example.com",
        "password": "password123"
    }
    client.post("/auth/register", json=register_payload)
    
    # Login to get token
    login_payload = {"username": "normal@example.com", "password": "password123"}
    login_res = client.post("/auth/token", json=login_payload)
    token = login_res.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/test/users/me", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["email"] == "normal@example.com"

def test_admin_route_as_user(client):
    """Regular user accessing admin route should return 403."""
    # Register regular user
    register_payload = {
        "name": "Just User",
        "email": "justuser@example.com",
        "password": "password123"
    }
    client.post("/auth/register", json=register_payload)
    
    # Get token
    login_payload = {"username": "justuser@example.com", "password": "password123"}
    login_res = client.post("/auth/token", json=login_payload)
    token = login_res.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/test/admin", headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_admin_route_as_admin(client, db):
    """Admin user accessing admin route should return 200."""
    # We need to manually create an ADMIN user since registration defaults to USER
    # or we can use a fixture, but here manual insertion is fine for clarity
    from app.models.user import User
    from app.core.security import get_password_hash
    
    admin_user = User(
        name="Admin User",
        email="admin@example.com",
        password_hash=get_password_hash("adminpass"),
        role="ADMIN"
    )
    db.add(admin_user)
    db.commit()
    
    # Login as admin
    login_payload = {"username": "admin@example.com", "password": "adminpass"}
    login_res = client.post("/auth/token", json=login_payload)
    token = login_res.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/test/admin", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["msg"] == "Welcome Admin"
