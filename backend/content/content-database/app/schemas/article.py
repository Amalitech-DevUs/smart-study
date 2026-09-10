from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ArticleBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    slug: str = Field(min_length=1)
    title: str = Field(min_length=1)
    body: str = Field(min_length=1)
    category: str = Field(min_length=1)
    subject: str | None = None
    published_at: datetime = Field(alias="publishedAt")


class ArticleResponse(ArticleBase):
    id: int
