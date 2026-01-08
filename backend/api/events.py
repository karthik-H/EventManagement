from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..services.event_service import EventService
from ..schemas.event import EventCreate, EventUpdate, EventResponse

router = APIRouter(prefix="/api/events", tags=["events"])


@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    service = EventService(db)
    return service.create_event(event)


@router.get("", response_model=List[EventResponse])
def get_all_events(db: Session = Depends(get_db)):
    service = EventService(db)
    return service.get_all_events()


@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    service = EventService(db)
    return service.get_event(event_id)


@router.put("/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event: EventUpdate, db: Session = Depends(get_db)):
    service = EventService(db)
    return service.update_event(event_id, event)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    service = EventService(db)
    service.delete_event(event_id)
    return None

