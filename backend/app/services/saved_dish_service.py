from typing import List
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.repositories.saved_dish_repo import SavedDishRepository
from app.schemas.saved_dish import (
    SavedDishCreate,
    SavedDishItemResponse,
    MessageResponse,
)


class SavedDishService:
    def __init__(self, repo: SavedDishRepository, db: Session):
        self.repo = repo
        self.db = db

    def save_dish(self, payload: SavedDishCreate) -> MessageResponse:
        try:
            saved = self.repo.create_saved_dish(payload.user_id, payload.dish_id)
            self.db.commit()
            self.db.refresh(saved)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(status_code=409, detail="Món ăn đã được lưu trước đó")
        return MessageResponse(success=True, message="Đã lưu món ăn", saved_id=saved.id)

    def get_user_saved_dishes(self, user_id: int) -> List[SavedDishItemResponse]:
        saved_items = self.repo.get_saved_dishes_by_user(user_id)
        results: List[SavedDishItemResponse] = []
        for saved in saved_items:
            dish = saved.dish
            results.append(
                SavedDishItemResponse(
                    saved_id=saved.id,
                    dish_id=saved.dish_id,
                    saved_at=saved.saved_at,
                    name=dish.name if dish else "",
                    english_name=dish.english_name if dish else None,
                    cuisine=dish.cuisine if dish else "",
                    cook_time_minutes=dish.cook_time_minutes if dish else 0,
                    difficulty=dish.difficulty if dish and dish.difficulty else "Dễ",
                    image=dish.image if dish else "",
                    short_description=dish.short_description if dish else "",
                )
            )
        return results

    def unsave_dish(self, user_id: int, dish_id: str) -> MessageResponse:
        deleted = self.repo.delete_saved_dish(user_id, dish_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Không tìm thấy món ăn đã lưu")
        self.db.commit()
        return MessageResponse(success=True, message="Đã xóa món ăn khỏi danh sách lưu")
