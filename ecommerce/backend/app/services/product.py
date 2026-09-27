from typing import List, Optional
from sqlalchemy import or_, asc, desc
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def get_all_products(
    db: Session,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc"
) -> List[Product]:
    query = db.query(Product)

    if category:
        query = query.filter(Product.category.ilike(category))

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(pattern),
                Product.description.ilike(pattern),
                Product.category.ilike(pattern)
            )
        )

    sort_column = getattr(Product, sort_by, Product.created_at)
    if order == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    return query.all()


def get_product_by_id(db: Session, product_id: int) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


def create_product(db: Session, product_in: ProductCreate) -> Product:
    db_product = Product(
        name=product_in.name,
        description=product_in.description,
        price=product_in.price,
        category=product_in.category,
        image_url=product_in.image_url,
        stock_quantity=product_in.stock_quantity,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: int, product_in: ProductUpdate) -> Product:
    product = get_product_by_id(db, product_id=product_id)

    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> bool:
    product = get_product_by_id(db, product_id=product_id)
    db.delete(product)
    db.commit()
    return True
