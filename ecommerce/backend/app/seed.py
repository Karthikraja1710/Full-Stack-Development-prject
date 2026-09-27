from sqlalchemy.orm import Session
from app.models.user import User
from app.models.product import Product
from app.services.auth import get_password_hash


def seed_database(db: Session):
    # 1. Seed Admin User
    admin = db.query(User).filter(User.email == "admin@shopsphere.com").first()
    if not admin:
        admin = User(
            name="Admin User",
            email="admin@shopsphere.com",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin)

    # 2. Seed Regular User
    regular_user = db.query(User).filter(User.email == "user@shopsphere.com").first()
    if not regular_user:
        regular_user = User(
            name="John Shopper",
            email="user@shopsphere.com",
            password_hash=get_password_hash("user123"),
            role="user"
        )
        db.add(regular_user)

    db.commit()

    # 3. Seed Sample Products if product table is empty
    if db.query(Product).count() == 0:
        sample_products = [
            {
                "name": "Wireless Noise-Canceling Headphones",
                "description": "High-fidelity audio with active noise cancellation, 30-hour battery life, and ergonomic memory foam earcups.",
                "price": 199.99,
                "category": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                "stock_quantity": 25,
            },
            {
                "name": "Smart Fitness Watch Ultra",
                "description": "Track your heart rate, sleep metrics, GPS activities, and notifications with a crystal-clear AMOLED retina display.",
                "price": 149.50,
                "category": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
                "stock_quantity": 40,
            },
            {
                "name": "Minimalist Leather Backpack",
                "description": "Crafted from genuine full-grain leather with dedicated 15-inch laptop sleeve and water-resistant lining.",
                "price": 89.95,
                "category": "Fashion",
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
                "stock_quantity": 18,
            },
            {
                "name": "Ergonomic Mechanical Keyboard",
                "description": "RGB backlit mechanical keyboard with hot-swappable tactile switches and wireless bluetooth multi-device pairing.",
                "price": 129.00,
                "category": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                "stock_quantity": 30,
            },
            {
                "name": "Aromatic Pour-Over Coffee Maker",
                "description": "Premium borosilicate glass carafe with reusable stainless steel mesh filter for rich, smooth artisanal coffee brewing.",
                "price": 45.00,
                "category": "Home & Kitchen",
                "image_url": "https://images.unsplash.com/photo-1517668808822-9ebe02f2a698?auto=format&fit=crop&w=800&q=80",
                "stock_quantity": 50,
            },
            {
                "name": "Ultra-light Performance Running Shoes",
                "description": "Breathable mesh upper with responsive foam cushioning designed for marathon comfort and long-distance durability.",
                "price": 110.00,
                "category": "Fashion",
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
                "stock_quantity": 22,
            },
            {
                "name": "4K Ultra HD Action Camera",
                "description": "Waterproof up to 30m with dual screen preview, electronic image stabilization, and 170-degree wide angle lens.",
                "price": 159.99,
                "category": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
                "stock_quantity": 15,
            },
            {
                "name": "Stainless Steel Thermal Water Bottle",
                "description": "Double-wall vacuum insulated flask keeping beverages ice cold for 24 hours or piping hot for 12 hours.",
                "price": 24.99,
                "category": "Home & Kitchen",
                "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
                "stock_quantity": 60,
            }
        ]

        for p_data in sample_products:
            product = Product(**p_data)
            db.add(product)
        db.commit()
