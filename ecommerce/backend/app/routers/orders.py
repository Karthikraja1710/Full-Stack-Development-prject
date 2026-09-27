from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order import (
    create_order_from_cart,
    get_user_orders,
    get_order_by_id,
)
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = create_order_from_cart(db, user_id=current_user.id, order_in=order_in)
    return OrderResponse.model_validate(order)


@router.get("", response_model=List[OrderResponse])
def read_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = get_user_orders(db, user_id=current_user.id)
    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def read_single_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = get_order_by_id(db, order_id=order_id, user_id=current_user.id, is_admin=(current_user.role == "admin"))
    return OrderResponse.model_validate(order)
