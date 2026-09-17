from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.dish_repo import DishRepository
from app.services.dish_service import DishService
from app.schemas.dish import DishCardResponse, DishDetailResponse
from app.schemas.filter import FilterMetadataResponse

router = APIRouter()


def get_dish_repo(db: Session = Depends(get_db)) -> DishRepository:
    return DishRepository(db)


def get_dish_service(repo: DishRepository = Depends(get_dish_repo)) -> DishService:
    return DishService(repo)


# 1. Route GET /random MUST be declared before /{dish_id}
@router.get("/random", response_model=List[DishCardResponse])
def get_random_dishes(
    limit: int = Query(10, ge=1, le=50, description="Số lượng món ăn ngẫu nhiên"),
    cuisine: Optional[str] = Query(None, description="Mã ẩm thực (vd: Vietnam, Korea)"),
    spicy_level: Optional[int] = Query(None, ge=0, le=3, description="Độ cay (0-3)"),
    max_time: Optional[int] = Query(None, ge=1, description="Thời gian nấu tối đa (phút)"),
    exclude_ids: Optional[str] = Query(None, description="Danh sách dish_id loại trừ, ngăn cách bởi dấu phẩy"),
    service: DishService = Depends(get_dish_service),
):
    """
    Lấy danh sách món ăn ngẫu nhiên cho tính năng vuốt quẹt (Swipe Deck).
    Hỗ trợ lọc theo quốc gia (cuisine), độ cay (spicy_level), thời gian (max_time),
    và loại trừ các món đã xem (exclude_ids).
    """
    return service.get_random_dishes(
        limit=limit,
        cuisine=cuisine,
        spicy_level=spicy_level,
        max_time=max_time,
        exclude_ids=exclude_ids,
    )


# 2. Route GET /filters/metadata MUST be declared before /{dish_id}
@router.get("/filters/metadata", response_model=FilterMetadataResponse)
def get_filter_metadata(
    service: DishService = Depends(get_dish_service),
):
    """
    Lấy metadata phục vụ hiển thị modal bộ lọc (quốc gia, độ cay, thời gian nấu).
    """
    return service.get_filter_metadata()


# 3. Route GET /{dish_id} matches dynamic path
@router.get("/{dish_id}", response_model=DishDetailResponse)
def get_dish_detail(
    dish_id: str,
    service: DishService = Depends(get_dish_service),
):
    """
    Lấy thông tin chi tiết đầy đủ của một món ăn bao gồm nguyên liệu và các bước nấu.
    """
    return service.get_dish_detail(dish_id)
