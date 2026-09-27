from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import or_, asc, desc
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskStats


def get_tasks_for_user(
    db: Session,
    user_id: int,
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    search_query: Optional[str] = None,
    sort_by: Optional[str] = "due_date",
    order: Optional[str] = "asc"
) -> List[Task]:
    query = db.query(Task).filter(Task.user_id == user_id)

    if status_filter:
        query = query.filter(Task.status == status_filter)

    if priority_filter:
        query = query.filter(Task.priority == priority_filter)

    if search_query:
        pattern = f"%{search_query}%"
        query = query.filter(
            or_(
                Task.title.ilike(pattern),
                Task.description.ilike(pattern)
            )
        )

    # Sorting logic
    sort_column = getattr(Task, sort_by, Task.due_date)
    if order == "desc":
        query = query.order_by(desc(sort_column).nulls_last())
    else:
        query = query.order_by(asc(sort_column).nulls_last())

    return query.all()


def get_task_by_id(db: Session, task_id: int, user_id: int) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    # STRICT SECURITY CHECK: User ownership check
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You do not own this task."
        )
    return task


def create_task_for_user(db: Session, task_in: TaskCreate, user_id: int) -> Task:
    db_task = Task(
        user_id=user_id,
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority.value if hasattr(task_in.priority, 'value') else task_in.priority,
        status=task_in.status.value if hasattr(task_in.status, 'value') else task_in.status,
        due_date=task_in.due_date,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task_for_user(db: Session, task_id: int, user_id: int, task_in: TaskUpdate) -> Task:
    task = get_task_by_id(db, task_id=task_id, user_id=user_id)

    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            if hasattr(value, 'value'):
                value = value.value
            setattr(task, field, value)
    
    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return task


def delete_task_for_user(db: Session, task_id: int, user_id: int) -> bool:
    task = get_task_by_id(db, task_id=task_id, user_id=user_id)
    db.delete(task)
    db.commit()
    return True


def get_user_task_stats(db: Session, user_id: int) -> TaskStats:
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    now = datetime.now(timezone.utc)

    total = len(tasks)
    pending = sum(1 for t in tasks if t.status == "Todo")
    in_progress = sum(1 for t in tasks if t.status == "In Progress")
    completed = sum(1 for t in tasks if t.status == "Completed")
    
    overdue = 0
    for t in tasks:
        if t.status != "Completed" and t.due_date:
            due = t.due_date
            if due.tzinfo is None:
                due = due.replace(tzinfo=timezone.utc)
            if due < now:
                overdue += 1

    return TaskStats(
        total=total,
        pending=pending,
        in_progress=in_progress,
        completed=completed,
        overdue=overdue
    )
