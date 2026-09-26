from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Import Base and engine from session
from app.db.session import Base, engine

# 2. Import ALL models so SQLAlchemy registers them for table creation
# (Ensure your Cart model is also imported if you have one, e.g., from app.models.cart import Cart)
from app.models.component import ComponentModel
from app.models.user import UserModel
from app.models.part import Part

# 3. Router imports
from app.api.endpoints.component import router as components_router
from app.api.endpoints.user import router as auth_router
from app.api.endpoints.parts import router as parts_router
from app.api.endpoints.cart import router as cart_router

# Initialize single FastAPI instance
app = FastAPI(title="AllEctronix AI Repair API", version="1.0.0")

# Configure CORS Middleware
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

# Include Routers directly on app
app.include_router(
    components_router, prefix="/api/components", tags=["Components"]
)
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(parts_router, prefix="/api/parts", tags=["Parts"])
app.include_router(cart_router, prefix="/api/cart", tags=["Cart"])


@app.get("/")
def read_root():
    return {"message": "AllEctronix Backend API is running!"}