from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.questions import router as questions_router
from app.routers.articles import router as articles_router

app = FastAPI(title="Content Database Service API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "service": "Content Database Service API",
        "status": "online",
        "docs": "/docs",
        "health": "/health",
        "endpoints": ["/questions", "/questions/{id}", "/articles", "/articles/{id}"]
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "content-database"}


app.include_router(questions_router)
app.include_router(articles_router)
