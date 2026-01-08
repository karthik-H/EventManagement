from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..models.task import Task, TaskStatus as ModelTaskStatus
from ..repositories.task_repository import TaskRepository
from ..repositories.event_repository import EventRepository
from ..schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskStatus
from fastapi import HTTPException, status


class TaskService:
    def __init__(self, db: Session):
        self.repository = TaskRepository(db)
        self.event_repository = EventRepository(db)
        self.db = db

    def create_task(self, task_data: TaskCreate) -> TaskResponse:
        # Validate that event exists
        event = self.event_repository.get_by_id(task_data.event_id)
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with id {task_data.event_id} not found"
            )

        # Convert Pydantic enum to SQLAlchemy enum
        status_enum = ModelTaskStatus[task_data.status.name]

        task = Task(
            title=task_data.title,
            description=task_data.description,
            status=status_enum,
            event_id=task_data.event_id
        )
        created_task = self.repository.create(task)
        return TaskResponse.model_validate(created_task)

    def get_task(self, task_id: int) -> TaskResponse:
        task = self.repository.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with id {task_id} not found"
            )
        return TaskResponse.model_validate(task)

    def get_all_tasks(self, event_id: Optional[int] = None) -> List[TaskResponse]:
        tasks = self.repository.get_all(event_id)
        return [TaskResponse.model_validate(task) for task in tasks]

    def update_task(self, task_id: int, task_data: TaskUpdate) -> TaskResponse:
        task = self.repository.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with id {task_id} not found"
            )

        # Update fields if provided
        if task_data.title is not None:
            task.title = task_data.title
        if task_data.description is not None:
            task.description = task_data.description
        if task_data.status is not None:
            task.status = ModelTaskStatus[task_data.status.name]
        if task_data.event_id is not None:
            # Validate that new event exists
            event = self.event_repository.get_by_id(task_data.event_id)
            if not event:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Event with id {task_data.event_id} not found"
                )
            task.event_id = task_data.event_id

        task.updated_at = datetime.utcnow()
        updated_task = self.repository.update(task)
        return TaskResponse.model_validate(updated_task)

    def delete_task(self, task_id: int) -> None:
        task = self.repository.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with id {task_id} not found"
            )
        self.repository.delete(task)

