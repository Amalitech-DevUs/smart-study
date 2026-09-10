import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pydantic import ValidationError
from sqlalchemy import select

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.question import Question
from app.schemas.question import QuestionBase

Base.metadata.create_all(bind=engine)

seed_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "questions.json")
with open(seed_file, "r", encoding="utf-8") as file:
    questions_data = json.load(file)

db = SessionLocal()

for question_data in questions_data:
    try:
        validated = QuestionBase(**question_data)
    except ValidationError as e:
        print(
            f"Rejected invalid question: "
            f"{question_data.get('subject')} {question_data.get('year')} "
            f"Paper {question_data.get('paper')} "
            f"Question {question_data.get('question_number')} -> {e}"
        )
        continue

    existing_question = db.scalar(
        select(Question).where(
            Question.subject == validated.subject,
            Question.year == validated.year,
            Question.paper == validated.paper,
            Question.question_number == validated.question_number,
        )
    )
    if existing_question:
        print(
            f"Skipping duplicate: "
            f"{validated.subject} {validated.year} "
            f"Paper {validated.paper} "
            f"Question {validated.question_number}"
        )
        continue

    question = Question(**validated.model_dump())
    db.add(question)

db.commit()
db.close()
