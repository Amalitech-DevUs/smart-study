from fastapi import FastAPI

from app.routers.questions import router as questions_router

app = FastAPI()

app.include_router(questions_router)