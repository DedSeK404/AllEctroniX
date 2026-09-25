from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import UserModel
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.token import Token
from app.schemas.user import UserLogin
from app.schemas.user import UserResponse
from app.schemas.user import UserCreate

router = APIRouter()

@router.post(
    "/register",
    response_model=UserResponse,  # <--- Filters outgoing JSON shape
    status_code=status.HTTP_201_CREATED,  # <--- Sets HTTP status code to 201 Created
)
def register(credentials: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(UserModel)
        .filter(UserModel.email == credentials.email)
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_pwd = get_password_hash(credentials.password)
    new_user = UserModel(username=credentials.username, email=credentials.email, hashed_password=hashed_pwd)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Returning the database object directly—FastAPI uses UserResponse to convert it to JSON!
    return new_user

# 2. Login Endpoint
@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: UserModel = Depends(get_current_user)):
    """Retrieve details for the currently authenticated user."""
    return current_user