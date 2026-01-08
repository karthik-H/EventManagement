from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from ..models.event import Event


class EventRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, event: Event) -> Event:
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def get_by_id(self, event_id: int) -> Optional[Event]:
        return self.db.query(Event).options(joinedload(Event.tasks)).filter(Event.id == event_id).first()

    def get_all(self) -> List[Event]:
        return self.db.query(Event).options(joinedload(Event.tasks)).all()

    def update(self, event: Event) -> Event:
        self.db.commit()
        self.db.refresh(event)
        return event

    def delete(self, event: Event) -> None:
        self.db.delete(event)
        self.db.commit()

