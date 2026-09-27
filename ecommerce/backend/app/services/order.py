from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.order import Order, OrderItem, OrderStatus
from app.models.cart import CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate, AdminStats


def create_order_from_cart(db: Session, user_id: int, order_in: OrderCreate) -> Order:
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your cart is empty. Add products before checking out."
        )

    # 1. Validate stock availability for all cart items
    total_amount = 0.0
    for item in cart_items:
        if not item.product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One of the items in your cart is no longer available."
            )
        if item.quantity > item.product.stock_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{item.product.name}'. Available: {item.product.stock_quantity}, requested: {item.quantity}."
            )
        total_amount += item.quantity * item.product.price

    total_amount = round(total_amount, 2)

    # 2. Create Order
    order = Order(
        user_id=user_id,
        total_amount=total_amount,
        status=OrderStatus.PENDING.value,
        shipping_name=order_in.shipping_name,
        shipping_email=order_in.shipping_email,
        shipping_phone=order_in.shipping_phone,
        shipping_address=order_in.shipping_address,
    )
    db.add(order)
    db.flush()  # populate order.id

    # 3. Create OrderItems & Reduce Product Stock
    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.product.price
        )
        db.add(order_item)

        # ATOMIC STOCK REDUCTION
        item.product.stock_quantity -= item.quantity

    # 4. Clear User Cart
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()

    db.commit()
    db.refresh(order)
    return order


def get_user_orders(db: Session, user_id: int) -> List[Order]:
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()


def get_order_by_id(db: Session, order_id: int, user_id: int, is_admin: bool = False) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Ownership Security Check
    if not is_admin and order.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You do not own this order."
        )

    return order


def get_all_orders_admin(db: Session, status_filter: Optional[str] = None) -> List[Order]:
    query = db.query(Order)
    if status_filter:
        query = query.filter(Order.status == status_filter)
    return query.order_by(Order.created_at.desc()).all()


def update_order_status(db: Session, order_id: int, new_status: str) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    valid_statuses = [s.value for s in OrderStatus]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid order status '{new_status}'. Allowed: {', '.join(valid_statuses)}"
        )

    order.status = new_status
    db.commit()
    db.refresh(order)
    return order


def get_admin_dashboard_stats(db: Session) -> AdminStats:
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == OrderStatus.PENDING.value).count()
    delivered_orders = db.query(Order).filter(Order.status == OrderStatus.DELIVERED.value).count()
    total_users = db.query(User).filter(User.role == "user").count()
    
    orders = db.query(Order).all()
    total_revenue = round(sum(o.total_amount for o in orders if o.status != OrderStatus.CANCELLED.value), 2)

    return AdminStats(
        total_products=total_products,
        total_orders=total_orders,
        pending_orders=pending_orders,
        delivered_orders=delivered_orders,
        total_users=total_users,
        total_revenue=total_revenue
    )
