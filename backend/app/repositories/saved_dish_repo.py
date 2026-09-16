from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.models import UserSavedDish


class SavedDishRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_saved_dish(self, user_id: int, dish_id: str) -> UserSavedDish:
        saved = UserSavedDish(user_id=user_id, dish_id=dish_id)
        self.db.add(saved)
        self.db.flush()
        return saved

    def get_saved_dishes_by_user(self, user_id: int) -> List[UserSavedDish]:
        stmt = (
            select(UserSavedDish)
            .options(selectinload(UserSavedDish.dish))
            .where(UserSavedDish.user_id == user_id)
            .order_by(UserSavedDish.saved_at.desc())
        )
        return list(self.db.scalars(stmt).all())

    def delete_saved_dish(self, user_id: int, dish_id: str) -> bool:
        stmt = select(UserSavedDish).where(
            UserSavedDish.user_id == user_id,
            UserSavedDish.dish_id == dish_id,
        )
        saved = self.db.scalars(stmt).first()
        if not saved:
            return False
        self.db.delete(saved)
        self.db.flush()
        return True
