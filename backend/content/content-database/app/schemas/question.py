from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class QuestionBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    subject: str
    year: int = Field(ge=2000, le=2035)
    paper: int = Field(ge=1, le=2)
    section: str
    question_number: int = Field(alias="questionNumber", ge=1)
    question_type: Literal["mcq"] = Field(alias="questionType")
    topic: str
    prompt: str = Field(min_length=1)
    options: list[str] = Field(min_length=4, max_length=4)
    correct_answer: Literal["A", "B", "C", "D"] = Field(alias="correctAnswer")

    @field_validator("options")
    @classmethod
    def options_not_empty(cls, v):
        if any(not opt.strip() for opt in v):
            raise ValueError("options must not contain empty strings")
        return v


class QuestionResponse(QuestionBase):
    id: int
