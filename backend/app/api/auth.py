from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import User
from app.schemas.auth import UserCreate, UserLogin, AuthResponse

router = APIRouter()

@router.post("/signup", response_model=AuthResponse, status_code=201)
def signup(user_data: UserCreate, db:Session = Depends(get_db)):
    #Tìm trực tiếp trong DB xem username đã tồn tại chưa
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username đã tồn tại")

    new_user = User(
        username=user_data.username,
        password=user_data.password,
        full_name=user_data.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return AuthResponse(
        success=True,
        message="Đăng ký thành công",
        user=new_user
    )

@router.post("/login", response_model=AuthResponse)
def login(user_data: UserLogin, db:Session = Depends(get_db)):
    #Tìm user trực tiếp trong DB
    user = db.query(User).filter(User.username == user_data.username).first()

    #So sánh chuỗi password thô trực tiếp
    if not user or user.password != user_data.password:
        raise HTTPException(status_code=401, detail="Sai username hoặc mật khẩu")

    return AuthResponse(
        success=True,
        message="Đăng nhập thành công",
        user=user
    )

@router.get("/me/{user_id}", response_model=AuthResponse)
def get_current_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    return AuthResponse(
        success=True,
        message="Lấy thông tin thành công",
        user=user
    )