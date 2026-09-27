from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.order import OrderResponse, OrderStatusUpdate, AdminStats
from app.services.order import (
    get_all_orders_admin,
    update_order_status,
    get_admin_dashboard_stats,
)
from app.dependencies.auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/stats", response_model=AdminStats)
def get_stats(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return get_admin_dashboard_stats(db)


@router.get("/orders", response_model=List[OrderResponse])
def get_all_orders(
    status: Optional[str] = Query(None, description="Filter orders by status"),
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    orders = get_all_orders_admin(db, status_filter=status)
    return [OrderResponse.model_validate(o) for o in orders]


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_status(
    order_id: int,
    status_in: OrderStatusUpdate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = update_order_status(db, order_id=order_id, new_status=status_in.status)
    return OrderResponse.model_validate(order)
