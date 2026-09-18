import os
import json
import sys
import requests
import chromadb
from chromadb.config import Settings

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000/questions/")
LOCAL_DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "data", "questions.json"))


def fetch_questions():
    """Fetch questions from backend API, with fallback to local JSON file."""
    try:
        response = requests.get(BACKEND_URL, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "data" in data and len(data["data"]) > 0:
                print(f"Fetched {len(data['data'])} questions from backend API ({data.get('meta', {}).get('source', 'API')}).")
                return data["data"]
    except Exception as e:
        print(f"Notice: Backend API unavailable ({e}). Falling back to local data file.")

    if os.path.exists(LOCAL_DATA_PATH):
        print(f"Loading questions from local data file: {LOCAL_DATA_PATH}")
        with open(LOCAL_DATA_PATH, "r", encoding="utf-8") as f:
            questions = json.load(f)
            print(f"Loaded {len(questions)} questions from local data file.")
            return questions

    print("Error: Could not fetch questions from API or local file.")
    sys.exit(1)


def build_chunk(question, index=0):
    """Format question into a structured chunk for embedding."""
    options = question.get("options", [])
    if isinstance(options, list):
        options_text = ", ".join(str(opt) for opt in options)
    else:
        options_text = str(options)

    correct_ans = question.get("correct_answer") or question.get("correctAnswer", "")
    ans_text = str(correct_ans)
    mapping = {"A": 0, "B": 1, "C": 2, "D": 3}
    if str(correct_ans).upper() in mapping and isinstance(options, list):
        idx = mapping[str(correct_ans).upper()]
        if idx < len(options):
            ans_text = f"{correct_ans} ({options[idx]})"

    subject = question.get("subject", "General")
    topic = question.get("topic", "General")
    year = question.get("year", "")
    prompt = question.get("prompt", "")

    return (
        f"Subject: {subject}\n"
        f"Topic: {topic}\n"
        f"Year: {year}\n"
        f"Prompt: {prompt}\n"
        f"Options: {options_text}\n"
        f"Correct Answer: {ans_text}"
    )


def get_chroma_client():
    db_path = os.path.join(os.path.dirname(__file__), "chroma_db")
    return chromadb.PersistentClient(path=db_path, settings=Settings(anonymized_telemetry=False))


def main():
    questions = fetch_questions()
    if not questions:
        print("No questions found.")
        return

    chunks = [build_chunk(q, i) for i, q in enumerate(questions)]
    print(f"Total questions to index: {len(chunks)}")
    print("\n--- Sample chunk ---\n")
    print(chunks[0])
    print()

    client = get_chroma_client()
    collection = client.get_or_create_collection(name="bece_questions")

    ids = []
    documents = chunks
    metadatas = []

    for i, q in enumerate(questions):
        qid = q.get("id") or f"{str(q.get('subject', 'sub')).lower().replace(' ', '-')}-{q.get('year', 2020)}-q{i+1}"
        ids.append(qid)
        metadatas.append({
            "subject": str(q.get("subject", "")),
            "year": int(q.get("year", 0)) if str(q.get("year", "")).isdigit() else 0,
            "topic": str(q.get("topic", "")),
        })

    # Upsert in batches to avoid any batch size limitations
    batch_size = 200
    for i in range(0, len(ids), batch_size):
        batch_ids = ids[i:i + batch_size]
        batch_docs = documents[i:i + batch_size]
        batch_meta = metadatas[i:i + batch_size]
        collection.upsert(
            ids=batch_ids,
            documents=batch_docs,
            metadatas=batch_meta
        )
        print(f"Indexed batch {i // batch_size + 1}: {len(batch_ids)} questions...")

    print(f"\nAll {len(ids)} questions successfully indexed in ChromaDB collection 'bece_questions'!")
    print(f"Verified collection count: {collection.count()}")


if __name__ == "__main__":
    main()