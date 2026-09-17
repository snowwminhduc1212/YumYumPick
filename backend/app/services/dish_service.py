from typing import List, Optional
from fastapi import HTTPException

from app.repositories.dish_repo import DishRepository
from app.schemas.dish import DishCardResponse, DishDetailResponse
from app.schemas.filter import (
    FilterMetadataResponse,
    CuisineFilterItem,
    FilterOptionItem,
)


class DishService:
    def __init__(self, repo: DishRepository):
        self.repo = repo

    def get_random_dishes(
        self,
        limit: int = 10,
        cuisine: Optional[str] = None,
        spicy_level: Optional[int] = None,
        max_time: Optional[int] = None,
        exclude_ids: Optional[str] = None,
    ) -> List[DishCardResponse]:
        parsed_excludes: Optional[List[str]] = None
        if exclude_ids:
            parsed_excludes = [x.strip() for x in exclude_ids.split(",") if x.strip()]

        dishes = self.repo.get_random_dishes(
            limit=limit,
            cuisine=cuisine,
            spicy_level=spicy_level,
            max_time=max_time,
            exclude_ids=parsed_excludes,
        )
        return [DishCardResponse.model_validate(d) for d in dishes]

    def get_dish_detail(self, dish_id: str) -> DishDetailResponse:
        dish = self.repo.get_dish_by_id(dish_id)
        if not dish:
            raise HTTPException(status_code=404, detail="Không tìm thấy món ăn")
        return DishDetailResponse.model_validate(dish)

    def get_filter_metadata(self) -> FilterMetadataResponse:
        cuisines = self.repo.get_all_cuisines()
        cuisines_data = [CuisineFilterItem.model_validate(c) for c in cuisines]

        spicy_levels = [
            FilterOptionItem(value=None, label="Tất cả"),
            FilterOptionItem(value=0, label="Không cay"),
            FilterOptionItem(value=1, label="Cay nhẹ"),
            FilterOptionItem(value=2, label="Cay vừa"),
            FilterOptionItem(value=3, label="Cay nhiều"),
        ]

        time_ranges = [
            FilterOptionItem(value=None, label="Tất cả"),
            FilterOptionItem(value=15, label="Dưới 15 phút"),
            FilterOptionItem(value=30, label="Dưới 30 phút"),
            FilterOptionItem(value=45, label="Dưới 45 phút"),
            FilterOptionItem(value=60, label="Dưới 60 phút"),
        ]

        return FilterMetadataResponse(
            cuisines=cuisines_data,
            spicy_levels=spicy_levels,
            time_ranges=time_ranges,
        )
