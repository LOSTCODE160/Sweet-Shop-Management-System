from fastapi import status

def test_admin_create_sweet(client, admin_user_token_headers):
    """Admin should be able to create a sweet."""
    payload = {
        "name": "Chocolate Fudge",
        "category": "Chocolate",
        "price": 5.99,
        "quantity": 100
    }
    response = client.post("/api/sweets", json=payload, headers=admin_user_token_headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["id"] is not None

def test_user_cannot_create_sweet(client, normal_user_token_headers):
    """Normal user should NOT be able to create a sweet (403)."""
    payload = {
        "name": "Forbidden Candy",
        "category": "Gummy",
        "price": 1.00,
        "quantity": 10
    }
    response = client.post("/api/sweets", json=payload, headers=normal_user_token_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_read_sweets(client, normal_user_token_headers):
    """Authenticated user should be able to list sweets."""
    response = client.get("/api/sweets", headers=normal_user_token_headers)
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

def test_read_sweets_unauthorized(client):
    """Unauthenticated user receives 401."""
    response = client.get("/api/sweets")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_search_sweets(client, normal_user_token_headers):
    """Search sweets by query parameters (name, category)."""
    # Assuming search implementation might return empty list if nothing found, 
    # but the endpoint must exist.
    response = client.get("/api/sweets/search?q=Chocolate", headers=normal_user_token_headers)
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

def test_admin_update_sweet(client, admin_user_token_headers):
    """Admin should be able to update a sweet."""
    # First create
    create_payload = {"name": "Old Name", "category": "Old", "price": 10.0, "quantity": 10}
    create_res = client.post("/api/sweets", json=create_payload, headers=admin_user_token_headers)
    sweet_id = create_res.json()["id"]

    # Update
    update_payload = {"name": "New Name", "price": 12.0}
    response = client.put(f"/api/sweets/{sweet_id}", json=update_payload, headers=admin_user_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "New Name"
    assert data["price"] == 12.0

def test_admin_delete_sweet(client, admin_user_token_headers):
    """Admin should be able to delete a sweet."""
    # Create
    create_payload = {"name": "To Delete", "category": "Temp", "price": 1.0, "quantity": 1}
    create_res = client.post("/api/sweets", json=create_payload, headers=admin_user_token_headers)
    sweet_id = create_res.json()["id"]

    # Delete
    response = client.delete(f"/api/sweets/{sweet_id}", headers=admin_user_token_headers)
    assert response.status_code == status.HTTP_200_OK # Or 204 No Content

    # Verify 404 on get
    get_res = client.get(f"/api/sweets/{sweet_id}", headers=admin_user_token_headers)
    assert get_res.status_code == status.HTTP_404_NOT_FOUND

def test_delete_non_existent_sweet(client, admin_user_token_headers):
    """Deleting a non-existent sweet should return 404."""
    response = client.delete("/api/sweets/999999", headers=admin_user_token_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND
