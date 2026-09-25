from fastapi import APIRouter, Depends, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.session import get_db
from app.models.part import Part
from app.schemas.part import PartPaginatedResponse
from app.api.services.parts_sync import sync_jlcpcb_parts

router = APIRouter()

@router.get("", response_model=PartPaginatedResponse)
def get_parts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Part)

    if category:
        cat_fmt = f"%{category.lower()}%"
        query = query.filter(
            or_(
                Part.category.ilike(cat_fmt),
                Part.type.ilike(cat_fmt),
                Part.describe.ilike(cat_fmt)
            )
        )

    if search:
        search_fmt = f"%{search.lower().strip()}%"
        query = query.filter(
            or_(
                Part.code.ilike(search_fmt),
                Part.brand.ilike(search_fmt),
                Part.category.ilike(search_fmt),
                Part.type.ilike(search_fmt),
                Part.describe.ilike(search_fmt)
            )
        )

    total_items = query.count()
    total_pages = (total_items + limit - 1) // limit if total_items > 0 else 1

    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()

    return {
        "items": items,
        "total_items": total_items,
        "total_pages": total_pages,
        "page": page,
        "limit": limit
    }

@router.post("/sync", status_code=202)
def trigger_parts_sync(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(sync_jlcpcb_parts, db)
    return {"message": "JLCPCB parts sync started in the background."}