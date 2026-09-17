from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict, field_validator


class IngredientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    amount: str
    unit: str
    category: Optional[str] = "nguyên liệu chính"


class CookingStepResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    step_number: int
    title: str
    description: str


class DishCardResponse(BaseModel):
    """Schema for swipe deck cards (lightweight, contains short_description)."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    english_name: Optional[str] = None
    cuisine: str
    cook_time_minutes: int
    spicy_level: int = 0
    calories_approx: int = 400
    image: str
    short_description: str

    @field_validator("cuisine", mode="before")
    @classmethod
    def extract_cuisine_name(cls, v: Any) -> str:
        if hasattr(v, "name"):
            return v.name
        return str(v) if v is not None else ""


class DishDetailResponse(BaseModel):
    """Schema for full dish recipe details including ingredients and 3 cooking steps."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    english_name: Optional[str] = None
    cuisine: str
    region: Optional[str] = None
    cook_time_minutes: int
    prep_time_minutes: int = 10
    difficulty: str = "Dễ"
    spicy_level: int = 0
    calories_approx: int = 400
    image: str
    short_description: str
    tips: Optional[str] = None
    ingredients: List[IngredientResponse] = []
    steps: List[CookingStepResponse] = []
