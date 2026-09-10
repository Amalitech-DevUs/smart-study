from fastapi import FastAPI

from app.routers.questions import router as questions_router
from app.routers.articles import router as articles_router

app = FastAPI()

app.include_router(questions_router)
app.include_router(articles_router)
