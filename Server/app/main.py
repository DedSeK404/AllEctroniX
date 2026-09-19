from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Import Base and engine from session
from app.db.session import Base, engine

# 2. Import all models so SQLAlchemy registers them
from app.models.component import ComponentModel
from app.models.user import UserModel

# 3. Router imports
from app.api.endpoints.component import router as components_router
from app.api.endpoints.user import router as auth_router

# Initialize single FastAPI instance
app = FastAPI(title="AllEctronix AI Repair API", version="1.0.0")

# Configure CORS Middleware on the app instance
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables in database
Base.metadata.create_all(bind=engine)

# Include Routers AFTER middleware setup
app.include_router(
    components_router, prefix="/api/components", tags=["Components"]
)
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])


@app.get("/")
def read_root():
    return {"message": "AllEctronix Backend API is running!"}