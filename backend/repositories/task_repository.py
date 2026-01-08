from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.task import Task


class TaskRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, task: Task) -> Task:
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def get_by_id(self, task_id: int) -> Optional[Task]:
        return self.db.query(Task).filter(Task.id == task_id).first()

    def get_all(self, event_id: Optional[int] = None) -> List[Task]:
        query = self.db.query(Task)
        if event_id is not None:
            query = query.filter(Task.event_id == event_id)
        return query.all()

    def update(self, task: Task) -> Task:
        self.db.commit()
        self.db.refresh(task)
        return task

    def delete(self, task: Task) -> None:
        self.db.delete(task)
        self.db.commit()

