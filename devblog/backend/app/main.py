import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, posts, comments, authors
from app.seed import seed_db

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed sample data on startup
try:
    seed_db()
except Exception as e:
    print(f"Seed note: {e}")

app = FastAPI(
    title="DevBlog API",
    description="Full-Stack Developer Blog Platform REST API for Thiranex Internship Task 4",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(authors.router)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "online",
        "app": "DevBlog API",
        "version": "1.0.0",
        "docs": "/docs"
    }
