from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse, CartSummary
from app.services.cart import (
    get_user_cart,
    add_to_cart,
    update_cart_item,
    remove_from_cart,
)
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])


@router.get("", response_model=CartSummary)
def read_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_cart(db, user_id=current_user.id)


@router.post("", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_item_to_cart(
    item_in: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = add_to_cart(db, user_id=current_user.id, item_in=item_in)
    return CartItemResponse.model_validate(item)


@router.put("/{item_id}", response_model=CartItemResponse)
def update_item_quantity(
    item_id: int,
    item_in: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = update_cart_item(db, user_id=current_user.id, item_id=item_id, item_in=item_in)
    return CartItemResponse.model_validate(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    remove_from_cart(db, user_id=current_user.id, item_id=item_id)
    return None
