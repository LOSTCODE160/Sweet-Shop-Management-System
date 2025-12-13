# Import all models here so that Base has them before being imported by Alembic or Main
from app.db.base import Base # noqa
from app.models.user import User # noqa
from app.models.sweet import Sweet # noqa
