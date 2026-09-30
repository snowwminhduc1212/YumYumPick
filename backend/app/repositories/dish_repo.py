from datetime import datetime, timedelta
from typing import List, Optional, Set
from sqlalchemy import select, func, delete
from sqlalchemy.orm import Session, selectinload

from app.models.models import Dish, Cuisine, UserSavedDish, UserSkippedDish


class DishRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_random_dishes(
        self,
        limit: int = 10,
        cuisine: Optional[str] = None,
        difficulty: Optional[str] = None,
        spicy_level: Optional[int] = None,
        max_time: Optional[int] = None,
        exclude_ids: Optional[List[str]] = None,
        user_id: Optional[int] = None,
    ) -> List[Dish]:
        stmt = select(Dish)

        final_exclude_ids: Set[str] = set(exclude_ids or [])

        if user_id is not None:
            seven_days_ago = datetime.utcnow() - timedelta(days=7)

            # 1. Loại trừ món đã thích (Saved) trong vòng 7 ngày qua
            saved_stmt = select(UserSavedDish.dish_id).where(
                UserSavedDish.user_id == user_id,
                UserSavedDish.saved_at >= seven_days_ago,
            )
            saved_ids = self.db.scalars(saved_stmt).all()
            final_exclude_ids.update(saved_ids)

            # 2. Loại trừ món đã quẹt trái (Skipped) trong vòng 7 ngày qua
            skipped_stmt = select(UserSkippedDish.dish_id).where(
                UserSkippedDish.user_id == user_id,
                UserSkippedDish.skipped_at >= seven_days_ago,
            )
            skipped_ids = self.db.scalars(skipped_stmt).all()
            final_exclude_ids.update(skipped_ids)

        if cuisine:
            stmt = stmt.where(func.lower(Dish.cuisine) == cuisine.strip().lower())

        if difficulty:
            stmt = stmt.where(func.lower(Dish.difficulty) == difficulty.strip().lower())

        if spicy_level is not None:
            stmt = stmt.where(Dish.spicy_level == spicy_level)

        if max_time is not None:
            stmt = stmt.where(Dish.cook_time_minutes <= max_time)

        if final_exclude_ids:
            stmt = stmt.where(Dish.id.notin_(list(final_exclude_ids)))

        stmt = stmt.order_by(func.random()).limit(limit)
        return list(self.db.scalars(stmt).all())

    def skip_dish(self, user_id: int, dish_id: str) -> None:
        stmt = select(UserSkippedDish).where(
            UserSkippedDish.user_id == user_id,
            UserSkippedDish.dish_id == dish_id,
        )
        existing = self.db.scalars(stmt).first()
        if existing:
            existing.skipped_at = datetime.utcnow()
        else:
            new_skip = UserSkippedDish(
                user_id=user_id,
                dish_id=dish_id,
                skipped_at=datetime.utcnow(),
            )
            self.db.add(new_skip)
        self.db.commit()

    def clear_user_skips(self, user_id: int) -> int:
        stmt = delete(UserSkippedDish).where(UserSkippedDish.user_id == user_id)
        result = self.db.execute(stmt)
        self.db.commit()
        return result.rowcount

    def get_dish_by_id(self, dish_id: str) -> Optional[Dish]:
        stmt = (
            select(Dish)
            .options(
                selectinload(Dish.ingredients),
                selectinload(Dish.cooking_steps),
            )
            .where(Dish.id == dish_id)
        )
        return self.db.scalars(stmt).first()

    def get_all_cuisines(self) -> List[Cuisine]:
        stmt = select(Cuisine)
        return list(self.db.scalars(stmt).all())
