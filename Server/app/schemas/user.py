from pydantic import BaseModel, ConfigDict, EmailStr


# Base schema containing shared public attributes
class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True


# Input schema for registration (includes password)
class UserCreate(UserBase):
    password: str


# Response schema (excludes password to prevent leaking sensitive data)
class UserResponse(UserBase):
    id: str

    model_config = ConfigDict(from_attributes=True)