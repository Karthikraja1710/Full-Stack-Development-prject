from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartSummary, CartItemResponse


def get_user_cart(db: Session, user_id: int) -> CartSummary:
    items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    total_quantity = sum(item.quantity for item in items)
    subtotal = sum(item.quantity * item.product.price for item in items if item.product)

    item_responses = [CartItemResponse.model_validate(item) for item in items]

    return CartSummary(
        items=item_responses,
        total_quantity=total_quantity,
        subtotal=round(subtotal, 2)
    )


def add_to_cart(db: Session, user_id: int, item_in: CartItemCreate) -> CartItem:
    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    if product.stock_quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product '{product.name}' is currently out of stock."
        )

    # Check if item already exists in cart
    cart_item = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == item_in.product_id
    ).first()

    requested_quantity = item_in.quantity
    if cart_item:
        requested_quantity += cart_item.quantity

    # STOCK CHECK SECURITY: Prevent adding more than available stock
    if requested_quantity > product.stock_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot add {item_in.quantity} more. Maximum available stock for '{product.name}' is {product.stock_quantity}."
        )

    if cart_item:
        cart_item.quantity = requested_quantity
    else:
        cart_item = CartItem(
            user_id=user_id,
            product_id=item_in.product_id,
            quantity=item_in.quantity
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)
    return cart_item


def update_cart_item(db: Session, user_id: int, item_id: int, item_in: CartItemUpdate) -> CartItem:
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == user_id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )

    # STOCK CHECK SECURITY
    if item_in.quantity > cart_item.product.stock_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot set quantity to {item_in.quantity}. Maximum available stock is {cart_item.product.stock_quantity}."
        )

    cart_item.quantity = item_in.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item


def remove_from_cart(db: Session, user_id: int, item_id: int) -> bool:
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == user_id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )

    db.delete(cart_item)
    db.commit()
    return True


def clear_user_cart(db: Session, user_id: int):
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()
