# Content Database Service

The Content Database service for the Smart-Study capstone project. Owns BECE past
questions, database schema/migrations, and the REST/JSON API that the Node.js/Express
backend reads content from.

**Stack:** Python + FastAPI + PostgreSQL + SQLAlchemy + Alembic

## Setup

This project uses an existing virtual environment at `backend/content/.venv`
(one level up from this folder). Do not recreate it.

From `backend/content/content-database/`:

```powershell
..\.venv\Scripts\Activate.ps1
```

Dependencies are already installed in that environment: fastapi, sqlalchemy,
alembic, psycopg2-binary, pydantic, python-dotenv, uvicorn.

A `.env` file must exist in this folder with:
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>


## Running migrations

The schema is already defined via Alembic migrations in `alembic/versions/`.
To bring a fresh database up to date:

```powershell
alembic upgrade head
```

To check the current migration state:

```powershell
alembic current
alembic heads
```

If these two commands print the same revision ID, your database schema matches
the code.

## Importing question data

Question data lives in `seed/questions.json`, one JSON object per question,
matching the `Question` model's fields (see Schema below). To load it into
the database:

```powershell
python -m seed.import_questions
```

This is safe to re-run — it skips any question that already exists (matched
by subject + year + paper + question_number) rather than creating duplicates.

To add more content later: append new question objects to `seed/questions.json`
in the same shape, then re-run the import command above.

## Running the API

```powershell
uvicorn app.main:app --reload --port 5002
```

The API will be available at `http://127.0.0.1:5002` (port 5002 is the port assigned to this service per the team's architecture doc). Interactive docs (Swagger UI) are auto-generated at `http://127.0.0.1:5002/docs`.

## Schema

Question
id int, primary key
subject str e.g. "Mathematics", "English Language",
"Integrated Science", "Social Studies"
year int e.g. 2020, 2026
paper int e.g. 1
section str e.g. "Objective Test", "Lexis and Structure"
question_number int
question_type str currently only "mcq"
topic str
prompt str the question text
options list[str] the 4 answer choices, in order
correct_answer str single letter: "A", "B", "C", or "D"


Unique constraint on (subject, year, paper, question_number) — prevents
duplicate imports of the same question.

## Validation

`app/schemas/question.py` enforces, both on API responses and at import time:

- `correct_answer` must be exactly one of `"A"`, `"B"`, `"C"`, `"D"`
- `options` must be exactly 4 non-empty strings
- `question_type` must currently be `"mcq"` (the only type this MVP supports)
- `paper` must be 1 or 2
- `year` must be between 2000 and 2035
- `prompt` must not be empty

`seed/import_questions.py` validates every record against this schema before
inserting it. Invalid records are printed with a clear rejection reason and
skipped, rather than silently entering the database.

## API endpoints (contract for the Node.js/Express backend)

### `GET /questions/`

Returns a list of questions. All query parameters are optional and combine
with AND logic.

| Param | Type | Example |
|---|---|---|
| `subject` | string | `?subject=Mathematics` |
| `year` | int | `?year=2020` |
| `paper` | int | `?paper=1` |
| `topic` | string | `?topic=Objective%20Test` |

Example:

GET /questions/?subject=Integrated%20Science&year=2026


Response: `200 OK`, JSON array of question objects, ordered by year, paper,
then question number. Field names are camelCase to match the team's agreed
contract (Python/DB layer stays snake_case internally):

```json
[
  {
    "subject": "English Language",
    "year": 2020,
    "paper": 1,
    "section": "Lexis and Structure",
    "questionNumber": 1,
    "questionType": "mcq",
    "topic": "Lexis and Structure",
    "prompt": "Seth has bought and ........ a loaf of bread.",
    "options": ["ate", "eats", "eaten", "eating"],
    "correctAnswer": "C",
    "id": 6
  }
]
```

### `GET /questions/{question_id}`

Returns a single question by its database ID.

Response: `200 OK` with the question object, or `404 Not Found` with
`{"detail": "Question not found"}` if the ID doesn't exist.

## Current content (as of this MVP)

| Subject | Year | Paper | Questions | Type |
|---|---|---|---|---|
| English Language | 2020 | 1 | 30 | MCQ |
| Mathematics | 2020 | 1 | 34 | MCQ |
| Integrated Science | 2026 | 1 | 40 | MCQ |
| Social Studies | 2020 | 1 | 40 | MCQ |

**Total: 144 questions.**

### Known gaps

- **6 Mathematics questions were intentionally excluded** (Q1, 16, 29, 30, 35, 37
  from the 2020 Paper 1 source PDF). The PDF's text extraction scrambled the
  fractions/exponents in these specific questions badly enough that the correct
  options couldn't be reconstructed with confidence. Rather than guess at math
  content (which would risk teaching students wrong answers), these were left
  out. They can be added later by transcribing directly from the source PDF.
- **Only Paper 1 (multiple-choice/objective) content is loaded.** Paper 2
  content (essays, comprehension passages, literature questions) exists in the
  source PDFs but was scoped out of this MVP — the current schema is MCQ-only,
  matching the team's published Content Database schema and the frontend's
  existing flashcard component (which only renders MCQs).
- Only one year of content exists per subject so far (2020 for English/Math/
  Social Studies, 2026 for Science, since that's what source material was
  available for). More years can be added the same way: extract from PDF,
  append to `seed/questions.json`, re-run the import.

## Notes on adding content going forward

Adding new questions is manual (PDF → verified JSON → import) rather than a
fully automated PDF parser. This was a deliberate choice for the MVP: BECE
past papers vary in layout year to year, mix question types inconsistently,
and math notation is prone to extraction errors (see the known gaps above) —
a script with no verification step risks silently importing wrong answers
into an app students use to study. A reasonable future improvement would be
a script that does the mechanical splitting (detecting question/option
boundaries by pattern) but still requires a verification step before data
reaches the database.