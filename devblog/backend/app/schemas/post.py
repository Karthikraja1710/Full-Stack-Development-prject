from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user import UserResponse
from app.schemas.comment import CommentResponse

class PostCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=250)
    excerpt: Optional[str] = Field(None, max_length=500)
    content: str = Field(..., min_length=10)
    cover_image: Optional[str] = None

class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=250)
    excerpt: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = Field(None, min_length=10)
    cover_image: Optional[str] = None

class PostResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    author_id: str
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    author: UserResponse

class PostDetailResponse(PostResponse):
    comments: List[CommentResponse] = []
