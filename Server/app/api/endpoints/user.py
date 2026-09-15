import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import UserModel
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user in PostgreSQL."""
    # 1. Check if user with this email already exists
    existing_user = (
        db.query(UserModel).filter(UserModel.email == user_in.email).first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    # 2. Instantiate new UserModel object
    new_user = UserModel(
        id=f"user-{uuid.uuid4().hex[:8]}",
        email=user_in.email,
        password=user_in.password,  # Note: Hashing will be added later!
    )

    # 3. Stage, commit, and refresh instance
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 4. Return new user (FastAPI converts it using UserResponse schema)
    return new_user


@router.post("/login", response_model=UserResponse)
def login_user(credentials: UserCreate, db: Session = Depends(get_db)):
    """Authenticate a user against PostgreSQL."""
    # 1. Look up user by email
    user = (
        db.query(UserModel)
        .filter(UserModel.email == credentials.email)
        .first()
    )

    # 2. Verify existence and match password
    if not user or user.password != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # 3. Return user profile upon successful verification
    return user