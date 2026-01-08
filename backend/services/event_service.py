from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..models.event import Event
from ..repositories.event_repository import EventRepository
from ..schemas.event import EventCreate, EventUpdate, EventResponse
from fastapi import HTTPException, status


class EventService:
    def __init__(self, db: Session):
        self.repository = EventRepository(db)
        self.db = db

    def create_event(self, event_data: EventCreate) -> EventResponse:
        # Validate dates
        if event_data.start_date >= event_data.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End date must be after start date"
            )

        event = Event(
            name=event_data.name,
            description=event_data.description,
            start_date=event_data.start_date,
            end_date=event_data.end_date
        )
        created_event = self.repository.create(event)
        return EventResponse.model_validate(created_event)

    def get_event(self, event_id: int) -> EventResponse:
        event = self.repository.get_by_id(event_id)
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with id {event_id} not found"
            )
        return EventResponse.model_validate(event)

    def get_all_events(self) -> List[EventResponse]:
        events = self.repository.get_all()
        return [EventResponse.model_validate(event) for event in events]

    def update_event(self, event_id: int, event_data: EventUpdate) -> EventResponse:
        event = self.repository.get_by_id(event_id)
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with id {event_id} not found"
            )

        # Update fields if provided
        if event_data.name is not None:
            event.name = event_data.name
        if event_data.description is not None:
            event.description = event_data.description
        if event_data.start_date is not None:
            event.start_date = event_data.start_date
        if event_data.end_date is not None:
            event.end_date = event_data.end_date

        # Validate dates
        if event.start_date >= event.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End date must be after start date"
            )

        event.updated_at = datetime.utcnow()
        updated_event = self.repository.update(event)
        return EventResponse.model_validate(updated_event)

    def delete_event(self, event_id: int) -> None:
        event = self.repository.get_by_id(event_id)
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with id {event_id} not found"
            )
        self.repository.delete(event)

