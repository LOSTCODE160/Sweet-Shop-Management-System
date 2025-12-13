from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
# Import db session setup to ensure it's loaded (even if not used yet)
from app.db.session import engine
# Import Base to ensure models are registered
from app.db.base import Base
# Import all models to ensure they are attached to Base.metadata
from app.models import User, Sweet
from app.api.auth import router as auth_router
from app.api.sweets import router as sweets_router
from jose import jwt

# Create tables on application startup
Base.metadata.create_all(bind=engine) 

def create_application() -> FastAPI:
    """
    Application Factory to create and configure the FastAPI application.
    """
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
        description="Backend for Sweet Shop Management System",
    )
    
    # Register Routers
    application.include_router(auth_router, prefix="/auth", tags=["Authentication"])
    application.include_router(sweets_router, prefix="/api/sweets", tags=["Sweets"])

    # --- Temporary Test Routes for Phase 5 TDD ---
    from fastapi import Depends
    from app.core.deps import get_current_user, get_current_active_admin
    from app.models.user import User

    @application.get("/test/users/me", tags=["Test"])
    def read_users_me(current_user: User = Depends(get_current_user)):
        return {"email": current_user.email, "role": current_user.role}

    @application.get("/test/admin", tags=["Test"])
    def read_admin_data(current_user: User = Depends(get_current_active_admin)):
        return {"msg": "Welcome Admin", "email": current_user.email}
    # ---------------------------------------------

    # Simple Health Check Endpoint
    @application.get("/health", tags=["Health"])
    def health_check():
        """
        Checks if the application is running.
        Returns a simple status ok message.
        """
        return {"status": "ok", "app_name": settings.PROJECT_NAME}

    return application

app = create_application()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    # Run the application using Uvicorn
    # host 127.0.0.1 is localhost
    # reload=True enables auto-reload on code changes (dev mode)
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
