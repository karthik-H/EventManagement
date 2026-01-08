from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .task import TaskResponse


class EventCreate(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime


class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class EventResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    start_date: datetime
    end_date: datetime
    created_at: datetime
    updated_at: datetime
    tasks: List["TaskResponse"] = []

    class Config:
        from_attributes = True

