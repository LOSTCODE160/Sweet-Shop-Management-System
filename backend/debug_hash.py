from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    hashed = pwd_context.hash("password123")
    print(f"Hash success: {hashed}")
except Exception as e:
    print(f"Hash failed: {e}")
    import traceback
    traceback.print_exc()
