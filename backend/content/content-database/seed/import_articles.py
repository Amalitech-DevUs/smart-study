import json
from datetime import datetime

from pydantic import ValidationError
from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.article import Article
from app.schemas.article import ArticleBase

with open("seed/articles.json", "r", encoding="utf-8") as file:
    articles_data = json.load(file)

db = SessionLocal()

for article_data in articles_data:
    try:
        validated = ArticleBase(**article_data)
    except ValidationError as e:
        print(
            f"Rejected invalid article: "
            f"{article_data.get('slug')} -> {e}"
        )
        continue

    existing_article = db.scalar(
        select(Article).where(Article.slug == validated.slug)
    )
    if existing_article:
        print(f"Skipping duplicate: {validated.slug}")
        continue

    article = Article(**validated.model_dump())
    db.add(article)

db.commit()
db.close()
print("Done.")
