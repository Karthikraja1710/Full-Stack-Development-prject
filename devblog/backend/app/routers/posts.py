from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostDetailResponse
from app.services import post as post_service
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/posts", tags=["Posts"])

@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post_in: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return post_service.create_post(db, post_in, author_id=current_user.id)

@router.get("", response_model=List[PostResponse])
def get_posts(
    search: Optional[str] = Query(None, description="Search term for title, content, or author"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return post_service.get_posts(db, search=search, skip=skip, limit=limit)

@router.get("/my-posts", response_model=List[PostResponse])
def get_my_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return post_service.get_user_posts(db, author_id=current_user.id, skip=skip, limit=limit)

@router.get("/{id}", response_model=PostDetailResponse)
def get_post(id: str, db: Session = Depends(get_db)):
    # Can search by ID or Slug
    post = post_service.get_post_by_id(db, id)
    if not post:
        post = post_service.get_post_by_slug(db, id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    return post

@router.put("/{id}", response_model=PostResponse)
def update_post(
    id: str,
    post_in: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = post_service.get_post_by_id(db, id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    # Ownership verification
    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to edit this post"
        )
    return post_service.update_post(db, post, post_in)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = post_service.get_post_by_id(db, id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    # Ownership verification
    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this post"
        )
    post_service.delete_post(db, post)
    return None
