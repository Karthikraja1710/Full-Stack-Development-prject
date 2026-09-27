from typing import List, Optional
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.product import (
    get_all_products,
    get_product_by_id,
    create_product,
    update_product,
    delete_product,
)
from app.dependencies.auth import get_current_admin
from app.models.user import User

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=List[ProductResponse])
def list_products(
    category: Optional[str] = Query(None, description="Filter products by category"),
    search: Optional[str] = Query(None, description="Search term in name, description, or category"),
    sort_by: Optional[str] = Query("created_at", description="Field to sort by (price, name, created_at)"),
    order: Optional[str] = Query("desc", description="Sort order (asc or desc)"),
    db: Session = Depends(get_db)
):
    return get_all_products(
        db,
        category=category,
        search=search,
        sort_by=sort_by,
        order=order
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_single_product(product_id: int, db: Session = Depends(get_db)):
    return get_product_by_id(db, product_id=product_id)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def admin_create_product(
    product_in: ProductCreate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return create_product(db, product_in=product_in)


@router.put("/{product_id}", response_model=ProductResponse)
def admin_update_product(
    product_id: int,
    product_in: ProductUpdate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return update_product(db, product_id=product_id, product_in=product_in)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_product(
    product_id: int,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    delete_product(db, product_id=product_id)
    return None
