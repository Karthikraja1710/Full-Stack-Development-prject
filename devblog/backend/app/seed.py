import logging
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.services.auth import get_password_hash
from app.services.post import generate_slug

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if users already exist
        if db.query(User).first():
            logger.info("Database already seeded. Skipping initial seed.")
            return

        logger.info("Seeding database with sample users, posts, and comments...")

        # 1. Create Users
        password_hash = get_password_hash("password123")
        alex = User(
            name="Alex Chen",
            email="alex@devblog.com",
            password_hash=password_hash
        )
        sarah = User(
            name="Sarah Jenkins",
            email="sarah@devblog.com",
            password_hash=password_hash
        )

        db.add_all([alex, sarah])
        db.commit()
        db.refresh(alex)
        db.refresh(sarah)

        # 2. Create Blog Posts
        posts_data = [
            {
                "author_id": alex.id,
                "title": "Mastering FastAPI & React: Building Modern Full-Stack Applications",
                "content": """# Building High-Performance Applications with FastAPI and React

Modern web applications require high speed, type safety, and real-time capabilities. Combining **FastAPI** on the backend with **React and TypeScript** on the frontend provides a best-in-class developer experience.

## Why FastAPI?

FastAPI is built on top of Starlette and Pydantic, offering:
- **Automatic OpenAPI docs**: Instant Swagger UI at `/docs`.
- **Async support**: Built-in `asyncio` for non-blocking IO.
- **Python type hints**: Catch errors at development time.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to DevBlog API!"}
```

## Integrating React with TypeScript

React 19 with Vite provides lightning-fast HMR (Hot Module Replacement) and efficient bundle sizing.

Key benefits of using TypeScript with React:
1. **Type-safe props and state**
2. **Auto-completion in IDEs**
3. **Fewer runtime errors**

### Final Thoughts
Using this stack allows developers to build production-grade web applications faster than ever before.
""",
                "excerpt": "Discover how combining FastAPI's async backend capabilities with React's modern component model results in performant, type-safe full-stack apps.",
                "cover_image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
            },
            {
                "author_id": sarah.id,
                "title": "Architecting PostgreSQL for Scale: Indexing and Performance Tuning",
                "content": """# PostgreSQL Performance Optimization Guide

PostgreSQL is one of the most reliable and feature-rich relational databases available. However, as dataset size grows, database queries can become performance bottlenecks without proper indexing and connection pooling.

## Key Strategies for Query Optimization

### 1. B-Tree & GIN Indexes
Indexes allow PostgreSQL to locate specific rows quickly without scanning the entire table.

```sql
CREATE INDEX idx_posts_author_created ON posts (author_id, created_at DESC);
```

### 2. EXPLAIN ANALYZE
Always run `EXPLAIN ANALYZE` on heavy queries to understand the query execution plan:

- Check for **Seq Scan** on large tables.
- Look out for high **Buffer Shared Hits**.

## Best Practices Checklist
- [x] Use connection pools (e.g., PgBouncer or SQLAlchemy engine pools)
- [x] Avoid `SELECT *` when fetching millions of records
- [x] Enable Foreign Key indexing to prevent full table locks during cascades

Proper indexing strategy can improve query speed by **10x to 100x**!
""",
                "excerpt": "Learn essential PostgreSQL indexing strategies, EXPLAIN ANALYZE debugging techniques, and schema design patterns to keep database queries under 10ms.",
                "cover_image": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80"
            },
            {
                "author_id": alex.id,
                "title": "Clean Code & Design Patterns in Modern TypeScript Apps",
                "content": """# Writing Maintainable TypeScript Code

Clean code is essential when working in larger teams or growing codebases. TypeScript provides powerful abstractions like generics, utility types, and strict mode.

## 1. Modular Context Providers
Instead of monolithic state, split context into logical domains:

```typescript
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
```

## 2. API Service Layer
Keep component code decoupled from direct HTTP calls by centralizing Axios calls in dedicated service modules.

> "Code is read much more often than it is written." – Guido van Rossum

Summary: Keep functions small, strictly typed, and self-documenting.
""",
                "excerpt": "A deep dive into writing clean, maintainable, and scalable TypeScript code using modular domain contexts and centralized API abstraction layers.",
                "cover_image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"
            }
        ]

        created_posts = []
        for pdata in posts_data:
            slug = generate_slug(pdata["title"], db)
            post = Post(
                author_id=pdata["author_id"],
                title=pdata["title"],
                slug=slug,
                content=pdata["content"],
                excerpt=pdata["excerpt"],
                cover_image=pdata["cover_image"]
            )
            db.add(post)
            created_posts.append(post)

        db.commit()
        for p in created_posts:
            db.refresh(p)

        # 3. Add Comments
        comments_data = [
            {
                "post_id": created_posts[0].id,
                "user_id": sarah.id,
                "content": "Awesome article Alex! FastAPI's auto-generated Swagger documentation is a total game changer for frontend integration."
            },
            {
                "post_id": created_posts[0].id,
                "user_id": alex.id,
                "content": "Thanks Sarah! Absolutely agree. Pydantic validation handles all the payload checks automatically."
            },
            {
                "post_id": created_posts[1].id,
                "user_id": alex.id,
                "content": "Great insights on PostgreSQL indexing. EXPLAIN ANALYZE helped us cut down API response times significantly last week!"
            }
        ]

        for cdata in comments_data:
            comment = Comment(**cdata)
            db.add(comment)

        db.commit()
        logger.info("Successfully seeded database!")

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
