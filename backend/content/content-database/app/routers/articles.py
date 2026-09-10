from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.article import Article
from app.schemas.article import ArticleResponse

router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
)


@router.get("", response_model=list[ArticleResponse])
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
        subj_clean = subject.strip().lower().replace("-", " ")
        if "science" in subj_clean:
            query = query.filter(func.lower(Article.subject).contains("science"))
        elif "english" in subj_clean:
            query = query.filter(func.lower(Article.subject).contains("english"))
        elif "social" in subj_clean:
            query = query.filter(func.lower(Article.subject).contains("social"))
        elif "math" in subj_clean:
            query = query.filter(func.lower(Article.subject).contains("math"))
        else:
            query = query.filter(func.lower(Article.subject).contains(subj_clean))

    query = query.order_by(Article.published_at.desc())

    articles = query.all()

    return articles


@router.get("/{identifier}", response_model=ArticleResponse)
def get_article(
    identifier: str,
    db: Session = Depends(get_db),
):
    if identifier.isdigit():
        article = db.query(Article).filter(Article.id == int(identifier)).first()
    else:
        article = db.query(Article).filter(Article.slug == identifier).first()

    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")

    return article

