from app.db.session import SessionLocal
from app.models.sweet import Sweet
from app.models.user import User
from app.core.security import get_password_hash

def seed():
    db = SessionLocal()
    
    # Check if data exists
    if db.query(Sweet).count() > 0:
        print("Sweets already exist. Skipping seed.")
        return

    print("Seeding database...")
    
    # Create Admin User if not exists
    admin_email = "admin@sweetshop.com"
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        admin = User(
            name="Admin User",
            email=admin_email,
            password_hash=get_password_hash("admin123"),
            role="ADMIN"
        )
        db.add(admin)
        print(f"Created Admin: {admin_email} / admin123")
    
    # Create Sweets
    sweets = [
        Sweet(name="Dark Heaven Chocolate", category="Chocolate", price=5.99, quantity=50),
        Sweet(name="Rainbow Lollipop", category="Candy", price=1.50, quantity=100),
        Sweet(name="Strawberry Cheesecake", category="Cake", price=25.00, quantity=10),
        Sweet(name="Gummy Bears", category="Candy", price=3.00, quantity=200),
        Sweet(name="Hazelnut Truffle", category="Chocolate", price=8.50, quantity=40),
    ]
    
    for s in sweets:
        db.add(s)
    
    db.commit()
    print(f"Added {len(sweets)} sweets.")
    db.close()

if __name__ == "__main__":
    seed()
