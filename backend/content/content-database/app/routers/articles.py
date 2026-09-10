from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.article import Article
from app.schemas.article import ArticleResponse

router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
)


@router.get("/", response_model=list[ArticleResponse])
def get_articles(
    category: str | None = None,
    subject: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Article)

    if category:
        query = query.filter(Article.category == category)

    if subject:
        query = query.filter(Article.subject == subject)

    query = query.order_by(Article.published_at.desc())

    articles = query.all()

    return articles


@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(
    article_id: int,
    db: Session = Depends(get_db),
):
    article = db.query(Article).filter(Article.id == article_id).first()

    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")

    return article
