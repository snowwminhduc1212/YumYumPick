from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserData(BaseModel):
    id: int
    username: str
    full_name: str

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    success: bool
    message: str
    user: UserData
    
