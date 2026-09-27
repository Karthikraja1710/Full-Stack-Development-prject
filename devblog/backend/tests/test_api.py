import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def _get_test_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_user_registration_and_login(client):
    # 1. Register User A
    reg_res = client.post("/api/auth/register", json={
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "password": "password123"
    })
    assert reg_res.status_code == 201
    user_a = reg_res.json()
    assert user_a["name"] == "Alice Johnson"
    assert user_a["email"] == "alice@example.com"

    # 2. Duplicate registration attempt should fail
    dup_res = client.post("/api/auth/register", json={
        "name": "Alice Dup",
        "email": "alice@example.com",
        "password": "password123"
    })
    assert dup_res.status_code == 400

    # 3. Login User A
    login_res = client.post("/api/auth/login", json={
        "email": "alice@example.com",
        "password": "password123"
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # 4. Get Current User /me
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "alice@example.com"

def test_post_crud_and_ownership_security(client):
    # Register User A & User B
    reg_a = client.post("/api/auth/register", json={"name": "User A", "email": "a@test.com", "password": "pass123"})
    assert reg_a.status_code == 201

    reg_b = client.post("/api/auth/register", json={"name": "User B", "email": "b@test.com", "password": "pass123"})
    assert reg_b.status_code == 201

    token_a = client.post("/api/auth/login", json={"email": "a@test.com", "password": "pass123"}).json()["access_token"]
    token_b = client.post("/api/auth/login", json={"email": "b@test.com", "password": "pass123"}).json()["access_token"]

    # User A creates a post
    post_res = client.post("/api/posts", headers={"Authorization": f"Bearer {token_a}"}, json={
        "title": "FastAPI Microservices Architecture",
        "content": "# Intro\nFastAPI is high performance software.",
        "excerpt": "Learn FastAPI architecture",
        "cover_image": "https://example.com/cover.png"
    })
    assert post_res.status_code == 201
    post_a = post_res.json()
    post_id = post_a["id"]
    assert post_a["title"] == "FastAPI Microservices Architecture"

    # Search posts
    search_res = client.get("/api/posts?search=FastAPI")
    assert search_res.status_code == 200
    assert len(search_res.json()) >= 1

    # User B attempts to edit User A's post -> 403 Forbidden
    edit_b_res = client.put(f"/api/posts/{post_id}", headers={"Authorization": f"Bearer {token_b}"}, json={
        "title": "Hacked Title"
    })
    assert edit_b_res.status_code == 403

    # User A edits own post -> 200 OK
    edit_a_res = client.put(f"/api/posts/{post_id}", headers={"Authorization": f"Bearer {token_a}"}, json={
        "title": "FastAPI Microservices Architecture Updated"
    })
    assert edit_a_res.status_code == 200
    assert edit_a_res.json()["title"] == "FastAPI Microservices Architecture Updated"

    # User B attempts to delete User A's post -> 403 Forbidden
    del_b_res = client.delete(f"/api/posts/{post_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert del_b_res.status_code == 403

    # User A deletes own post -> 204 No Content
    del_a_res = client.delete(f"/api/posts/{post_id}", headers={"Authorization": f"Bearer {token_a}"})
    assert del_a_res.status_code == 204

def test_comment_crud_and_ownership(client):
    # Setup User A and User B
    client.post("/api/auth/register", json={"name": "Author A", "email": "author@test.com", "password": "pass123"})
    client.post("/api/auth/register", json={"name": "Commenter B", "email": "commenter@test.com", "password": "pass123"})

    token_a = client.post("/api/auth/login", json={"email": "author@test.com", "password": "pass123"}).json()["access_token"]
    token_b = client.post("/api/auth/login", json={"email": "commenter@test.com", "password": "pass123"}).json()["access_token"]

    # Author A creates post
    post_res = client.post("/api/posts", headers={"Authorization": f"Bearer {token_a}"}, json={
        "title": "Post for Comments Test",
        "content": "Sample detailed article content for testing."
    })
    assert post_res.status_code == 201
    post = post_res.json()

    # Commenter B adds comment
    comment_res = client.post(f"/api/posts/{post['id']}/comments", headers={"Authorization": f"Bearer {token_b}"}, json={
        "content": "Great article!"
    })
    assert comment_res.status_code == 201
    comment = comment_res.json()
    comment_id = comment["id"]
    assert comment["content"] == "Great article!"

    # Author A attempts to edit Commenter B's comment -> 403 Forbidden
    edit_a_comment = client.put(f"/api/comments/{comment_id}", headers={"Authorization": f"Bearer {token_a}"}, json={
        "content": "Unauthorized edit"
    })
    assert edit_a_comment.status_code == 403

    # Commenter B edits own comment -> 200 OK
    edit_b_comment = client.put(f"/api/comments/{comment_id}", headers={"Authorization": f"Bearer {token_b}"}, json={
        "content": "Great article! Updated."
    })
    assert edit_b_comment.status_code == 200
    assert edit_b_comment.json()["content"] == "Great article! Updated."

def test_author_profile_endpoint(client):
    # Register Author
    user_res = client.post("/api/auth/register", json={"name": "Prof Alex", "email": "prof@test.com", "password": "pass123"})
    assert user_res.status_code == 201
    user = user_res.json()
    token = client.post("/api/auth/login", json={"email": "prof@test.com", "password": "pass123"}).json()["access_token"]

    # Create 2 posts with valid content length (>10 chars)
    p1 = client.post("/api/posts", headers={"Authorization": f"Bearer {token}"}, json={"title": "P1 Article Title", "content": "Detailed technical content 1"})
    assert p1.status_code == 201

    p2 = client.post("/api/posts", headers={"Authorization": f"Bearer {token}"}, json={"title": "P2 Article Title", "content": "Detailed technical content 2"})
    assert p2.status_code == 201

    # Fetch author profile
    author_res = client.get(f"/api/authors/{user['id']}")
    assert author_res.status_code == 200
    profile = author_res.json()
    assert profile["name"] == "Prof Alex"
    assert profile["posts_count"] == 2

    # Fetch author posts
    posts_res = client.get(f"/api/authors/{user['id']}/posts")
    assert posts_res.status_code == 200
    assert len(posts_res.json()) == 2
