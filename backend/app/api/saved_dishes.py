from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.saved_dish_repo import SavedDishRepository
from app.services.saved_dish_service import SavedDishService
from app.schemas.saved_dish import (
    SavedDishCreate,
    SavedDishItemResponse,
    MessageResponse,
)

router = APIRouter()


def get_saved_dish_repo(db: Session = Depends(get_db)) -> SavedDishRepository:
    return SavedDishRepository(db)


def get_saved_dish_service(
    repo: SavedDishRepository = Depends(get_saved_dish_repo),
    db: Session = Depends(get_db),
) -> SavedDishService:
    return SavedDishService(repo, db)


@router.post("", response_model=MessageResponse)
@router.post("/", response_model=MessageResponse, include_in_schema=False)
def save_dish(
    payload: SavedDishCreate,
    service: SavedDishService = Depends(get_saved_dish_service),
):
    """
    Lưu một món ăn vào danh sách yêu thích của người dùng.
    Trả về 409 Conflict nếu món ăn đã được lưu trước đó.
    """
    return service.save_dish(payload)


@router.get("/{user_id}", response_model=List[SavedDishItemResponse])
def get_user_saved_dishes(
    user_id: int,
    service: SavedDishService = Depends(get_saved_dish_service),
):
    """
    Lấy danh sách các món ăn đã lưu của người dùng theo user_id.
    """
    return service.get_user_saved_dishes(user_id)


@router.delete("/{user_id}/{dish_id}", response_model=MessageResponse)
def unsave_dish(
    user_id: int,
    dish_id: str,
    service: SavedDishService = Depends(get_saved_dish_service),
):
    """
    Xóa một món ăn khỏi danh sách đã lưu của người dùng.
    Trả về 404 nếu không tìm thấy món ăn đã lưu.
    """
    return service.unsave_dish(user_id, dish_id)
