from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user import UserResponse

class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)

class CommentUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)

class CommentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    post_id: str
    user_id: str
    content: str
    created_at: datetime
    updated_at: datetime
    user: UserResponse
