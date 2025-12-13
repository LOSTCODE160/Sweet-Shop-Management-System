def test_register_user_success(client):
    """
    Test that a new user can register successfully.
    Expected: HTTP 201 Created and JSON response with user details.
    """
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "strongpassword123"
    }
    response = client.post("/auth/register", json=payload)
    
    # This assertion will FAIL until the endpoint is implemented
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == payload["email"]
    assert "id" in data
    # Password should NOT be returned in response
    assert "password" not in data
    assert "password_hash" not in data

def test_register_duplicate_email(client):
    """
    Test that registering with an existing email fails.
    Expected: HTTP 400 Bad Request.
    """
    payload = {
        "name": "First User",
        "email": "unique@example.com",
        "password": "password123"
    }
    # First registration
    client.post("/auth/register", json=payload)
    
    # Second registration with same email
    response = client.post("/auth/register", json=payload)
    
    # This assertion will FAIL until logic is implemented
    assert response.status_code == 400
    assert "detail" in response.json()

def test_login_success(client):
    """
    Test that a registered user can login and receive an access token.
    Expected: HTTP 200 OK and JWT token in response.
    """
    # Setup: Register a user first
    register_payload = {
        "name": "Login User",
        "email": "login@example.com",
        "password": "password123"
    }
    client.post("/auth/register", json=register_payload)
    
    # Attempt login (OAuth2 standard expects form data usually, but implementation plan said POST /auth/token.
    # We will assume JSON for simplicity unless OAuth2PasswordRequestForm is strictly required by constraints.
    # Phase 0 plan simply said "POST /auth/token". Standard FastAPI OAuth2 uses form data.
    # Let's assume standard form-data for compatibility with OAuth2PasswordBearer later, 
    # OR json if specifically designed that way. Given it's a placement assignment, JSON is often acceptable,
    # but `username` and `password` fields are standard.
    # Let's stick to the Phase 0 plan routes.
    login_payload = {
        "username": "login@example.com", # OAuth2 spec often calls email 'username'
        "password": "password123"
    }
    
    # Note: Using data=... sends form-data, json=... sends JSON. 
    # TDD implies we define the contract now. Let's assume JSON body for modern API design unless specified otherwise.
    response = client.post("/auth/token", json=login_payload)
    
    # This assertion will FAIL
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client):
    """
    Test that login fails with incorrect password.
    Expected: HTTP 401 Unauthorized.
    """
    # Setup: Register
    register_payload = {
        "name": "Wrong Pass User",
        "email": "wrong@example.com",
        "password": "correctpassword"
    }
    client.post("/auth/register", json=register_payload)
    
    # Attempt login with wrong password
    login_payload = {
        "username": "wrong@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/auth/token", json=login_payload)
    
    # This assertion will FAIL
    assert response.status_code == 401
