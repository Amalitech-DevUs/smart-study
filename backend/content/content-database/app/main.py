from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.questions import router as questions_router

app = FastAPI(title="Content Database Service API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "content-database"}


app.include_router(questions_router)