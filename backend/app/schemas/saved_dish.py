from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict, field_validator


class SavedDishCreate(BaseModel):
    user_id: int
    dish_id: str


class SavedDishItemResponse(BaseModel):
    """Schema for items in the user's liked dishes collection."""
    model_config = ConfigDict(from_attributes=True)

    saved_id: int
    dish_id: str
    saved_at: datetime
    name: str
    english_name: Optional[str] = None
    cuisine: str
    cook_time_minutes: int
    difficulty: str = "Dễ"
    image: str
    short_description: str

    @field_validator("cuisine", mode="before")
    @classmethod
    def extract_cuisine_name(cls, v: Any) -> str:
        if hasattr(v, "name"):
            return v.name
        return str(v) if v is not None else ""


class MessageResponse(BaseModel):
    success: bool
    message: str
    saved_id: Optional[int] = None
