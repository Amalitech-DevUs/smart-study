import json
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pydantic import ValidationError
from sqlalchemy import select

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.article import Article
from app.schemas.article import ArticleBase

Base.metadata.create_all(bind=engine)

seed_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "articles.json")
with open(seed_file, "r", encoding="utf-8") as file:
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
