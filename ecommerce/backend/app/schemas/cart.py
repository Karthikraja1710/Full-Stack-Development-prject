from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.product import ProductResponse


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(1, ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)


class CartItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    product_id: int
    quantity: int
    created_at: datetime
    product: ProductResponse


class CartSummary(BaseModel):
    items: list[CartItemResponse]
    total_quantity: int
    subtotal: float
