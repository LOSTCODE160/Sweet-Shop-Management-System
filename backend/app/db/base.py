from sqlalchemy.ext.declarative import declarative_base

# Create the Base class for all SQLAlchemy models to inherit from
# This maintains a catalog of classes and tables
Base = declarative_base()
