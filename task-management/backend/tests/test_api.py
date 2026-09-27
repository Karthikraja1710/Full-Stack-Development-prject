import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_and_teardown_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"


def test_auth_and_task_crud_flow():
    # 1. Register User A
    user_a_data = {
        "name": "User Alpha",
        "email": "alpha@example.com",
        "password": "password123"
    }
    reg_response = client.post("/api/auth/register", json=user_a_data)
    assert reg_response.status_code == 201
    user_a_token = reg_response.json()["access_token"]
    assert "access_token" in reg_response.json()
    headers_a = {"Authorization": f"Bearer {user_a_token}"}

    # 2. Get User A profile (/me)
    me_response = client.get("/api/auth/me", headers=headers_a)
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "alpha@example.com"

    # 3. Create Task 1 for User A
    task_data = {
        "title": "Complete Task Management System",
        "description": "Full-stack project for Thiranex Internship Task 2",
        "priority": "High",
        "status": "Todo",
        "due_date": "2026-10-01T12:00:00Z"
    }
    create_res = client.post("/api/tasks", json=task_data, headers=headers_a)
    assert create_res.status_code == 201
    task_id = create_res.json()["id"]
    assert create_res.json()["title"] == "Complete Task Management System"
    assert create_res.json()["priority"] == "High"

    # 4. View Task 1 by ID
    get_res = client.get(f"/api/tasks/{task_id}", headers=headers_a)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == task_id

    # 5. Update Task 1 (Change status to In Progress, Priority to Critical)
    update_data = {
        "status": "In Progress",
        "priority": "Critical"
    }
    put_res = client.put(f"/api/tasks/{task_id}", json=update_data, headers=headers_a)
    assert put_res.status_code == 200
    assert put_res.json()["status"] == "In Progress"
    assert put_res.json()["priority"] == "Critical"

    # 6. Check Task Stats for User A
    stats_res = client.get("/api/tasks/stats", headers=headers_a)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total"] == 1
    assert stats["in_progress"] == 1

    # 7. Register User B (Security test: Isolation check)
    user_b_data = {
        "name": "User Beta",
        "email": "beta@example.com",
        "password": "password456"
    }
    reg_b_res = client.post("/api/auth/register", json=user_b_data)
    assert reg_b_res.status_code == 201
    headers_b = {"Authorization": f"Bearer {reg_b_res.json()['access_token']}"}

    # 8. VERIFY SECURITY: User B MUST NOT be able to access or modify User A's task!
    b_get_res = client.get(f"/api/tasks/{task_id}", headers=headers_b)
    assert b_get_res.status_code in (403, 404)

    b_put_res = client.put(f"/api/tasks/{task_id}", json={"title": "Hacked Title"}, headers=headers_b)
    assert b_put_res.status_code in (403, 404)

    b_delete_res = client.delete(f"/api/tasks/{task_id}", headers=headers_b)
    assert b_delete_res.status_code in (403, 404)

    # 9. Delete Task 1 by User A
    del_res = client.delete(f"/api/tasks/{task_id}", headers=headers_a)
    assert del_res.status_code == 204

    # 10. Confirm Task 1 is deleted
    get_after_del = client.get(f"/api/tasks/{task_id}", headers=headers_a)
    assert get_after_del.status_code == 404
