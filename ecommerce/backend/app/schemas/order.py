from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from app.schemas.product import ProductResponse


class OrderCreate(BaseModel):
    shipping_name: str = Field(..., min_length=2, max_length=100)
    shipping_email: EmailStr
    shipping_phone: str = Field(..., min_length=5, max_length=50)
    shipping_address: str = Field(..., min_length=5, max_length=500)


class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: int
    product_id: Optional[int] = None
    quantity: int
    unit_price: float
    product: Optional[ProductResponse] = None


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    total_amount: float
    status: str
    shipping_name: str
    shipping_email: str
    shipping_phone: str
    shipping_address: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []


class OrderStatusUpdate(BaseModel):
    status: str


class AdminStats(BaseModel):
    total_products: int
    total_orders: int
    pending_orders: int
    delivered_orders: int
    total_users: int
    total_revenue: float
