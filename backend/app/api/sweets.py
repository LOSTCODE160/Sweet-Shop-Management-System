from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.sweet import Sweet
from app.models.user import User
from app.schemas.sweet import SweetCreate, SweetUpdate, SweetResponse
from app.core.deps import get_current_user, get_current_active_admin

router = APIRouter()

@router.post("/", response_model=SweetResponse, status_code=status.HTTP_201_CREATED)
def create_sweet(
    sweet_in: SweetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    """
    Create a new sweet. Only Admins.
    """
    sweet = Sweet(
        name=sweet_in.name,
        category=sweet_in.category,
        price=sweet_in.price,
        quantity=sweet_in.quantity
    )
    db.add(sweet)
    db.commit()
    db.refresh(sweet)
    return sweet

@router.get("/", response_model=List[SweetResponse])
def read_sweets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all sweets. Authenticated users.
    """
    sweets = db.query(Sweet).offset(skip).limit(limit).all()
    return sweets

@router.get("/search", response_model=List[SweetResponse])
def search_sweets(
    q: Optional[str] = Query(None, description="Search by name (partial)"),
    category: Optional[str] = Query(None, description="Exact category match"),
    price_min: Optional[float] = Query(None, description="Minimum price"),
    price_max: Optional[float] = Query(None, description="Maximum price"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Search sweets with filters. Authenticated users.
    """
    query = db.query(Sweet)
    
    if q:
        query = query.filter(Sweet.name.ilike(f"%{q}%"))
    if category:
        query = query.filter(Sweet.category == category)
    if price_min is not None:
        query = query.filter(Sweet.price >= price_min)
    if price_max is not None:
        query = query.filter(Sweet.price <= price_max)
        
    sweets = query.all()
    return sweets

@router.get("/{sweet_id}", response_model=SweetResponse)
def read_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific sweet by ID. Authenticated users.
    """
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not sweet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sweet not found")
    return sweet

@router.put("/{sweet_id}", response_model=SweetResponse)
def update_sweet(
    sweet_id: int,
    sweet_in: SweetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    """
    Update a sweet. Only Admins.
    """
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not sweet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sweet not found")
    
    update_data = sweet_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sweet, field, value)
        
    db.add(sweet)
    db.commit()
    db.refresh(sweet)
    return sweet

@router.delete("/{sweet_id}", status_code=status.HTTP_200_OK)
def delete_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    """
    Delete a sweet. Only Admins.
    """
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not sweet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sweet not found")
        
    db.delete(sweet)
    db.commit()
    return {"msg": "Sweet deleted successfully"}
