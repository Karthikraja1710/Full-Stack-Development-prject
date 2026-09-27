from typing import List, Optional
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskStats
from app.services.task import (
    get_tasks_for_user,
    get_task_by_id,
    create_task_for_user,
    update_task_for_user,
    delete_task_for_user,
    get_user_task_stats,
)
from app.dependencies.auth import get_current_user
from app.services.websocket import manager

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("/stats", response_model=TaskStats)
def get_task_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_task_stats(db, user_id=current_user.id)


@router.get("", response_model=List[TaskResponse])
def read_tasks(
    status: Optional[str] = Query(None, description="Filter by status (Todo, In Progress, Completed)"),
    priority: Optional[str] = Query(None, description="Filter by priority (Low, Medium, High, Critical)"),
    q: Optional[str] = Query(None, description="Search term in title or description"),
    sort_by: Optional[str] = Query("due_date", description="Field to sort by (due_date, created_at, priority)"),
    order: Optional[str] = Query("asc", description="Sort order (asc or desc)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_tasks_for_user(
        db,
        user_id=current_user.id,
        status_filter=status,
        priority_filter=priority,
        search_query=q,
        sort_by=sort_by,
        order=order
    )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_new_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = create_task_for_user(db, task_in=task_in, user_id=current_user.id)
    # Broadcast event via WebSockets
    await manager.broadcast_to_user(
        current_user.id,
        {"type": "TASK_CREATED", "task_id": task.id, "title": task.title}
    )
    return task


@router.get("/{task_id}", response_model=TaskResponse)
def read_single_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_task_by_id(db, task_id=task_id, user_id=current_user.id)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_existing_task(
    task_id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = update_task_for_user(db, task_id=task_id, user_id=current_user.id, task_in=task_in)
    # Broadcast event via WebSockets
    await manager.broadcast_to_user(
        current_user.id,
        {"type": "TASK_UPDATED", "task_id": task.id, "title": task.title}
    )
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    delete_task_for_user(db, task_id=task_id, user_id=current_user.id)
    # Broadcast event via WebSockets
    await manager.broadcast_to_user(
        current_user.id,
        {"type": "TASK_DELETED", "task_id": task_id}
    )
    return None
