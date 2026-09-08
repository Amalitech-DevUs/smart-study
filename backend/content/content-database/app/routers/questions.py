from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.question import Question
from app.schemas.question import QuestionResponse

router = APIRouter(
    prefix="/questions",
    tags=["Questions"],
)


@router.get("/", response_model=list[QuestionResponse])
def get_questions(
    subject: str | None = None,
    year: int | None = None,
    paper: int | None = None,
    topic: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Question)

    if subject:
        query = query.filter(Question.subject == subject)

    if year:
        query = query.filter(Question.year == year)

    if paper:
        query = query.filter(Question.paper == paper)

    if topic:
        query = query.filter(Question.topic == topic)

    query = query.order_by(
        Question.year,
        Question.paper,
        Question.question_number,
    )

    questions = query.all()

    return questions


@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
):
    question = db.query(Question).filter(Question.id == question_id).first()

    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    return question