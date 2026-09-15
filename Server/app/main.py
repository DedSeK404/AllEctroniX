from fastapi import FastAPI

# 1. Import Base and engine from session
from app.db.session import Base, engine

# 2. Import all models so SQLAlchemy registers them
from app.models.component import ComponentModel
from app.models.user import UserModel

# 3. Create tables for all models bound to Base
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AllEctronix AI Repair API", version="1.0.0")

# Router imports
from app.api.endpoints.component import router as components_router
from app.api.endpoints.user import router as auth_router

# Include Routers
app.include_router(
    components_router, prefix="/api/components", tags=["Components"]
)
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])


@app.get("/")
def read_root():
    return {"message": "AllEctronix Backend API is running!"}