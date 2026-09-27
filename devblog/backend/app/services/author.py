from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User

def get_author_by_id(db: Session, author_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == author_id).first()
