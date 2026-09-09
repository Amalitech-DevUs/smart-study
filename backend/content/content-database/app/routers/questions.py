from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.question import Question
from app.schemas.question import QuestionResponse

router = APIRouter(
    prefix="/questions",
    tags=["Questions"],
)


from sqlalchemy import func

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
        subj_clean = subject.strip().lower().replace("-", " ")
        if "science" in subj_clean:
            query = query.filter(func.lower(Question.subject).contains("science"))
        elif "english" in subj_clean:
            query = query.filter(func.lower(Question.subject).contains("english"))
        elif "social" in subj_clean:
            query = query.filter(func.lower(Question.subject).contains("social"))
        elif "math" in subj_clean:
            query = query.filter(func.lower(Question.subject).contains("math"))
        else:
            query = query.filter(func.lower(Question.subject).contains(subj_clean))

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