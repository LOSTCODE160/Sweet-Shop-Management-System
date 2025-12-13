from fastapi import status

def test_purchase_sweet_success(client, normal_user_token_headers, admin_user_token_headers):
    """Authenticated user can purchase a sweet, decreasing quantity."""
    # Setup: Admin creates a sweet with quantity 10
    create_payload = {"name": "Candy Bar", "category": "Tests", "price": 1.50, "quantity": 10}
    create_res = client.post("/api/sweets", json=create_payload, headers=admin_user_token_headers)
    sweet_id = create_res.json()["id"]

    # Action: User purchases 1 unit
    # Requirement says /purchase decreases by 1. Usually implies buying 1 unit.
    # Could arguably take a quantity in body, but simplified requirement implies atomic purchase of 1.
    res = client.post(f"/api/sweets/{sweet_id}/purchase", headers=normal_user_token_headers)
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data["msg"] == "Purchase successful"
    assert data["remaining_quantity"] == 9
    
    # Verify persistence
    get_res = client.get(f"/api/sweets/{sweet_id}", headers=normal_user_token_headers)
    assert get_res.json()["quantity"] == 9

def test_purchase_out_of_stock(client, normal_user_token_headers, admin_user_token_headers):
    """Purchasing an out-of-stock item should fail."""
    # Setup: Create sweet with 0 quantity
    create_payload = {"name": "Empty Candy", "category": "Tests", "price": 1.00, "quantity": 0}
    create_res = client.post("/api/sweets", json=create_payload, headers=admin_user_token_headers)
    sweet_id = create_res.json()["id"]

    # Action: Purchase
    res = client.post(f"/api/sweets/{sweet_id}/purchase", headers=normal_user_token_headers)
    
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert "Out of stock" in res.json()["detail"]

def test_purchase_unauthorized(client):
    """Unauthenticated user cannot purchase."""
    # Try ID 1 (doesn't matter if exists, auth check comes first)
    res = client.post("/api/sweets/1/purchase")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED

def test_admin_restock_sweet(client, admin_user_token_headers):
    """Admin can restock a sweet, increasing quantity."""
    # Setup: Create sweet with 5 quantity
    create_payload = {"name": "Restock Bar", "category": "Tests", "price": 2.00, "quantity": 5}
    create_res = client.post("/api/sweets", json=create_payload, headers=admin_user_token_headers)
    sweet_id = create_res.json()["id"]

    # Action: Restock by 20
    # Assuming body carries amount
    restock_payload = {"amount": 20}
    res = client.post(f"/api/sweets/{sweet_id}/restock", json=restock_payload, headers=admin_user_token_headers)
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data["msg"] == "Restock successful"
    assert data["new_quantity"] == 25
    
    # Verify persistence
    get_res = client.get(f"/api/sweets/{sweet_id}", headers=admin_user_token_headers)
    assert get_res.json()["quantity"] == 25

def test_user_cannot_restock(client, normal_user_token_headers, admin_user_token_headers):
    """Normal user cannot restock sweets."""
    # Setup
    create_payload = {"name": "User Restock", "category": "Tests", "price": 1.0, "quantity": 10}
    create_res = client.post("/api/sweets", json=create_payload, headers=admin_user_token_headers)
    sweet_id = create_res.json()["id"]

    res = client.post(f"/api/sweets/{sweet_id}/restock", json={"amount": 10}, headers=normal_user_token_headers)
    assert res.status_code == status.HTTP_403_FORBIDDEN

def test_restock_non_existent(client, admin_user_token_headers):
    """Restocking a non-existent sweet checks 404."""
    res = client.post("/api/sweets/999999/restock", json={"amount": 10}, headers=admin_user_token_headers)
    assert res.status_code == status.HTTP_404_NOT_FOUND
