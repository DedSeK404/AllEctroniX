import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database and Session imports
from app.db.session import Base, SessionLocal, engine
from app.models.chat import Conversation, Message  # Ensure models are imported so Base registers them
from app.models.part import Part
from app.models.user import UserModel

# Import sync service
from app.api.services.parts_sync import sync_jlcpcb_parts

# Router imports
from app.api.endpoints.cart import router as cart_router
from app.api.endpoints.chat import router as chat_router
from app.api.endpoints.parts import router as parts_router
from app.api.endpoints.user import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP LOGIC ---
    # 1. Create database tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # 2. Check if DB is empty and auto-trigger initial sync in the background
    db = SessionLocal()
    try:
        if db.query(Part).count() == 0:
            print("Database is empty. Initializing JLCPCB parts sync in background...")
            # Runs sync_jlcpcb_parts in an asynchronous worker thread without blocking startup
            asyncio.create_task(asyncio.to_thread(sync_jlcpcb_parts))
    except Exception as e:
        print(f"Error checking DB during startup: {e}")
    finally:
        db.close()

    yield

    # --- SHUTDOWN LOGIC ---
    # (Clean up resources here if needed in the future)


# Initialize single FastAPI instance with lifespan
app = FastAPI(
    title="AllEctronix AI Repair API",
    version="1.0.0",
    lifespan=lifespan
)

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

# Include Routers directly on app
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(parts_router, prefix="/api/parts", tags=["Parts"])
app.include_router(cart_router, prefix="/api/cart", tags=["Cart"])
app.include_router(chat_router, prefix="/api/chat", tags=["Diagnostic Chat"])


@app.get("/")
def read_root():
    return {"message": "AllEctronix Backend API is running!"}