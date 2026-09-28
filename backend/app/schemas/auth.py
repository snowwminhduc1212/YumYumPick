from pydantic import BaseModel,field_validator

class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v:str) -> str:
        v = v.strip()
        if len(v) < 3 or len(v)>20:
            raise ValueError("Tên đăng nhập phải dài từ 3 đến 20 ký tự")
        if not v.replace("_", "").isalnum():
            raise ValueError("Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới")
        return v.lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v:str) -> str:
        v = v.strip()
        if len(v) < 6:
            raise ValueError("Mật khẩu phải từ 6 kí tự trở lên")
        return v

    @field_validator("full_name")
    @classmethod
    def valitdate_full_name(cls, v:str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Họ tên không được để trống")
        return v

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
    
