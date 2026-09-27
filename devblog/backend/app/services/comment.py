from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate

def create_comment(db: Session, post_id: str, user_id: str, comment_in: CommentCreate) -> Comment:
    db_comment = Comment(
        post_id=post_id,
        user_id=user_id,
        content=comment_in.content
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comment_by_id(db: Session, comment_id: str) -> Optional[Comment]:
    return db.query(Comment).filter(Comment.id == comment_id).first()

def get_comments_by_post(db: Session, post_id: str) -> List[Comment]:
    return db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.asc()).all()

def get_comments_by_user(db: Session, user_id: str, limit: int = 10) -> List[Comment]:
    return db.query(Comment).filter(Comment.user_id == user_id).order_by(Comment.created_at.desc()).limit(limit).all()

def update_comment(db: Session, db_comment: Comment, comment_in: CommentUpdate) -> Comment:
    db_comment.content = comment_in.content
    db.commit()
    db.refresh(db_comment)
    return db_comment

def delete_comment(db: Session, db_comment: Comment) -> None:
    db.delete(db_comment)
    db.commit()
