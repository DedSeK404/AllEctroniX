from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.component import ComponentModel
from app.schemas.component import Component

router = APIRouter()

@router.get("/", response_model=List[Component])
def get_all_components(db: Session = Depends(get_db)):
    """Fetch all electronic components from the database."""
    components = db.query(ComponentModel).all()
    return components

@router.get("/{component_id}", response_model=Component)
def get_component_by_id(component_id: str, db: Session = Depends(get_db)):
    """Fetch a single electronic component by ID."""
    component = db.query(ComponentModel).filter(ComponentModel.id == component_id).first()
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    return component