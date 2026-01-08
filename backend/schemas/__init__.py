# Import order matters for forward references
from .task import TaskCreate, TaskUpdate, TaskResponse, TaskStatus
from .event import EventCreate, EventUpdate, EventResponse

# Rebuild models to resolve forward references
EventResponse.model_rebuild()

__all__ = [
    "EventCreate",
    "EventUpdate",
    "EventResponse",
    "TaskCreate",
    "TaskUpdate",
    "TaskResponse",
    "TaskStatus",
]

