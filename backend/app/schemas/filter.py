from typing import List, Optional, Union
from pydantic import BaseModel, ConfigDict


class CuisineFilterItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    flag: str


class FilterOptionItem(BaseModel):
    value: Optional[Union[int, str]] = None
    label: str


class FilterMetadataResponse(BaseModel):
    """Metadata for rendering the quick filter modal."""
    cuisines: List[CuisineFilterItem]
    spicy_levels: List[FilterOptionItem]
    time_ranges: List[FilterOptionItem]
