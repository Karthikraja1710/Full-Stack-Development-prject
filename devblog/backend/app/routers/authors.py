from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import AuthorResponse
from app.schemas.post import PostResponse
from app.services import author as author_service
from app.services import post as post_service

router = APIRouter(prefix="/api/authors", tags=["Authors"])

@router.get("/{author_id}", response_model=AuthorResponse)
def get_author_profile(author_id: str, db: Session = Depends(get_db)):
    user = author_service.get_author_by_id(db, author_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Author not found"
        )
    posts_count = len(user.posts)
    return AuthorResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        created_at=user.created_at,
        posts_count=posts_count
    )

@router.get("/{author_id}/posts", response_model=List[PostResponse])
def get_author_posts(author_id: str, db: Session = Depends(get_db)):
    user = author_service.get_author_by_id(db, author_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Author not found"
        )
    return post_service.get_user_posts(db, author_id=author_id)
