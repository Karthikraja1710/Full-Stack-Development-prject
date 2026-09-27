import re
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate

def generate_slug(title: str, db: Session) -> str:
    # Convert title to lower case and clean non-alphanumeric chars
    base_slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    if not base_slug:
        base_slug = "post"
    
    slug = base_slug
    counter = 1
    while db.query(Post).filter(Post.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug

def create_post(db: Session, post_in: PostCreate, author_id: str) -> Post:
    slug = generate_slug(post_in.title, db)
    # Auto-generate excerpt if not provided
    excerpt = post_in.excerpt
    if not excerpt:
        excerpt = post_in.content[:150] + "..." if len(post_in.content) > 150 else post_in.content

    db_post = Post(
        author_id=author_id,
        title=post_in.title,
        slug=slug,
        content=post_in.content,
        excerpt=excerpt,
        cover_image=post_in.cover_image
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def get_post_by_id(db: Session, post_id: str) -> Optional[Post]:
    return db.query(Post).filter(Post.id == post_id).first()

def get_post_by_slug(db: Session, slug: str) -> Optional[Post]:
    return db.query(Post).filter(Post.slug == slug).first()

def get_posts(db: Session, search: Optional[str] = None, skip: int = 0, limit: int = 50) -> List[Post]:
    query = db.query(Post)
    if search:
        search_pattern = f"%{search}%"
        # Search title, content, or author name
        query = query.join(User, Post.author_id == User.id).filter(
            or_(
                Post.title.ilike(search_pattern),
                Post.content.ilike(search_pattern),
                User.name.ilike(search_pattern)
            )
        )
    return query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

def get_user_posts(db: Session, author_id: str, skip: int = 0, limit: int = 50) -> List[Post]:
    return db.query(Post).filter(Post.author_id == author_id).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

def update_post(db: Session, db_post: Post, post_in: PostUpdate) -> Post:
    if post_in.title is not None:
        db_post.title = post_in.title
        # Re-generate slug if title changed
        db_post.slug = generate_slug(post_in.title, db)
    if post_in.content is not None:
        db_post.content = post_in.content
        if not post_in.excerpt:
            db_post.excerpt = post_in.content[:150] + "..." if len(post_in.content) > 150 else post_in.content
    if post_in.excerpt is not None:
        db_post.excerpt = post_in.excerpt
    if post_in.cover_image is not None:
        db_post.cover_image = post_in.cover_image

    db.commit()
    db.refresh(db_post)
    return db_post

def delete_post(db: Session, db_post: Post) -> None:
    db.delete(db_post)
    db.commit()
