from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..services.task_service import TaskService
from ..schemas.task import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    service = TaskService(db)
    return service.create_task(task)


@router.get("", response_model=List[TaskResponse])
def get_all_tasks(
    event_id: Optional[int] = Query(None, description="Filter tasks by event ID"),
    db: Session = Depends(get_db)
):
    service = TaskService(db)
    return service.get_all_tasks(event_id)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    service = TaskService(db)
    return service.get_task(task_id)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    service = TaskService(db)
    return service.update_task(task_id, task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    service = TaskService(db)
    service.delete_task(task_id)
    return None

