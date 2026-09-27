import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.seed import seed_database

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_and_teardown_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"
    assert response.json()["app"] == "ShopSphere API"


def test_product_catalog_browsing():
    response = client.get("/api/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) > 0

    product_id = products[0]["id"]
    single_res = client.get(f"/api/products/{product_id}")
    assert single_res.status_code == 200
    assert single_res.json()["name"] == products[0]["name"]


def test_user_flow_and_checkout():
    # 1. Register new user
    user_data = {
        "name": "Customer One",
        "email": "customer1@example.com",
        "password": "password123"
    }
    reg_res = client.post("/api/auth/register", json=user_data)
    assert reg_res.status_code == 201
    user_token = reg_res.json()["access_token"]
    user_headers = {"Authorization": f"Bearer {user_token}"}

    # 2. Get profile
    me_res = client.get("/api/auth/me", headers=user_headers)
    assert me_res.status_code == 200
    assert me_res.json()["role"] == "user"

    # 3. Get products to find an item
    prods_res = client.get("/api/products")
    product = prods_res.json()[0]
    initial_stock = product["stock_quantity"]

    # 4. Add product to cart
    cart_add_res = client.post(
        "/api/cart",
        json={"product_id": product["id"], "quantity": 2},
        headers=user_headers
    )
    assert cart_add_res.status_code == 201

    # 5. Read cart summary
    cart_res = client.get("/api/cart", headers=user_headers)
    assert cart_res.status_code == 200
    assert cart_res.json()["total_quantity"] == 2

    # 6. STOCK LIMIT SECURITY CHECK: Try adding 9999 items (exceeding stock)
    exceed_res = client.post(
        "/api/cart",
        json={"product_id": product["id"], "quantity": 9999},
        headers=user_headers
    )
    assert exceed_res.status_code == 400

    # 7. Place Order (Demo Checkout)
    checkout_data = {
        "shipping_name": "Customer One",
        "shipping_email": "customer1@example.com",
        "shipping_phone": "+1 (555) 123-4567",
        "shipping_address": "123 Main Street, New York, NY 10001"
    }
    order_res = client.post("/api/orders", json=checkout_data, headers=user_headers)
    assert order_res.status_code == 201
    order = order_res.json()
    assert order["status"] == "Pending"
    assert len(order["items"]) == 1

    # 8. Verify Cart is Cleared after Checkout
    cart_after_res = client.get("/api/cart", headers=user_headers)
    assert cart_after_res.json()["total_quantity"] == 0

    # 9. Verify Stock Reduction
    prod_after_res = client.get(f"/api/products/{product['id']}")
    assert prod_after_res.json()["stock_quantity"] == initial_stock - 2


def test_role_based_access_control_security():
    # 1. Login regular user
    login_user_res = client.post(
        "/api/auth/login",
        json={"email": "user@shopsphere.com", "password": "user123"}
    )
    assert login_user_res.status_code == 200
    user_headers = {"Authorization": f"Bearer {login_user_res.json()['access_token']}"}

    # 2. RBAC SECURITY CHECK: Regular User MUST NOT be allowed to invoke Admin APIs!
    new_prod_data = {
        "name": "Hacked Product",
        "description": "Unauthorized creation",
        "price": 9.99,
        "category": "Electronics",
        "stock_quantity": 10
    }
    unauth_create = client.post("/api/products", json=new_prod_data, headers=user_headers)
    assert unauth_create.status_code == 403

    unauth_stats = client.get("/api/admin/stats", headers=user_headers)
    assert unauth_stats.status_code == 403

    unauth_orders = client.get("/api/admin/orders", headers=user_headers)
    assert unauth_orders.status_code == 403


def test_admin_dashboard_and_management_flow():
    # 1. Login Admin user
    admin_login_res = client.post(
        "/api/auth/login",
        json={"email": "admin@shopsphere.com", "password": "admin123"}
    )
    assert admin_login_res.status_code == 200
    admin_token = admin_login_res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 2. Admin Create Product
    prod_payload = {
        "name": "Pro Gaming Laptop 16-inch",
        "description": "High performance gaming laptop with RTX graphics.",
        "price": 1499.99,
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
        "stock_quantity": 12
    }
    create_res = client.post("/api/products", json=prod_payload, headers=admin_headers)
    assert create_res.status_code == 201
    prod_id = create_res.json()["id"]

    # 3. Admin Update Product
    update_res = client.put(
        f"/api/products/{prod_id}",
        json={"price": 1399.99, "stock_quantity": 15},
        headers=admin_headers
    )
    assert update_res.status_code == 200
    assert update_res.json()["price"] == 1399.99
    assert update_res.json()["stock_quantity"] == 15

    # 4. Admin Fetch Stats
    stats_res = client.get("/api/admin/stats", headers=admin_headers)
    assert stats_res.status_code == 200
    assert stats_res.json()["total_products"] >= 1

    # 5. Admin Delete Product
    del_res = client.delete(f"/api/products/{prod_id}", headers=admin_headers)
    assert del_res.status_code == 204
