from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.orm import Session, selectinload

from app.models.models import Dish, Cuisine


class DishRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_random_dishes(
        self,
        limit: int = 10,
        cuisine: Optional[str] = None,
        spicy_level: Optional[int] = None,
        max_time: Optional[int] = None,
        exclude_ids: Optional[List[str]] = None,
    ) -> List[Dish]:
        stmt = select(Dish)

        if cuisine:
            stmt = stmt.where(func.lower(Dish.cuisine) == cuisine.strip().lower())

        if spicy_level is not None:
            stmt = stmt.where(Dish.spicy_level == spicy_level)

        if max_time is not None:
            stmt = stmt.where(Dish.cook_time_minutes <= max_time)

        if exclude_ids:
            stmt = stmt.where(Dish.id.notin_(exclude_ids))

        stmt = stmt.order_by(func.random()).limit(limit)
        return list(self.db.scalars(stmt).all())

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
