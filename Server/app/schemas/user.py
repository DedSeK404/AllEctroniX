from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Base schema containing shared public attributes
class UserBase(BaseModel):
    username: str = Field(
        ..., 
        min_length=2, 
        max_length=50, 
        pattern=r"^[a-zA-Z\s'-]+$",
        description="User's full name or display username"
    )
    email: EmailStr
    is_active: bool = True


# Input schema for registration (includes password)
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


# Dedicated login schema (only requires email & password)
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


# Response schema (excludes password to prevent leaking sensitive data)
class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)