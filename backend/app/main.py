import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.db.session import engine

from app.db.base import Base

from app.models import User, Sweet
from app.api.auth import router as auth_router
from app.api.sweets import router as sweets_router
from jose import jwt


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

    @application.get("/health", tags=["Health"])
    def health_check():
        """
        Checks if the application is running.
        Returns a simple status ok message.
        """
        return {"status": "ok", "app_name": settings.PROJECT_NAME}

    return application

app = create_application()

@app.on_event("startup")
def on_startup():
    from app.db.init_db import init_db
    init_db()
    
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
   
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
