import os
import json
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
import chromadb
from chromadb.config import Settings

load_dotenv()

app = FastAPI(title="Smart Study AI - BECE Tutor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = os.getenv("OPENROUTER_MODEL", "inclusionai/ling-3.0-flash-vl:free")

SYSTEM_PROMPT = """You are Smart Study AI, a friendly, warm, and expert BECE study tutor for Ghanaian JHS students.
Answer questions accurately and helpfully on BECE subjects (Mathematics, Integrated Science, English Language, Social Studies).
Formatting and Tone Rules:
- Speak naturally and conversationally, like a supportive teacher in the classroom.
- Avoid cluttered markdown syntax: do NOT use horizontal divider lines (---) or excessive hashtags (###).
- Organize your answers with clean bold topic headings and easy-to-read paragraphs or bullet points.
- Give simple, easy-to-understand explanations with relatable Ghanaian examples where helpful.
- Never output internal thinking notes; speak directly and kindly to the student."""

# Initialize ChromaDB persistent client for Layer 2 RAG
CHROMA_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
chroma_client = None
questions_collection = None

try:
    if os.path.exists(CHROMA_DIR):
        chroma_client = chromadb.PersistentClient(path=CHROMA_DIR, settings=Settings(anonymized_telemetry=False))
        questions_collection = chroma_client.get_collection(name="bece_questions")
        print(f"ChromaDB initialized. 'bece_questions' collection has {questions_collection.count()} items.")
except Exception as e:
    print(f"Notice: ChromaDB not loaded at startup ({e}). Will attempt lazy connection on request.")


def retrieve_relevant_bece_context(query: str, n_results: int = 3) -> tuple[str, list]:
    """Retrieve top relevant BECE past questions from ChromaDB for Layer 2 RAG."""
    global chroma_client, questions_collection

    if questions_collection is None:
        try:
            if os.path.exists(CHROMA_DIR):
                chroma_client = chromadb.PersistentClient(path=CHROMA_DIR, settings=Settings(anonymized_telemetry=False))
                questions_collection = chroma_client.get_collection(name="bece_questions")
        except Exception as e:
            print(f"ChromaDB connection error: {e}")
            return "", []

    if questions_collection is None:
        return "", []

    try:
        results = questions_collection.query(
            query_texts=[query],
            n_results=n_results
        )
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]

        if not documents:
            return "", []

        context_blocks = []
        for i, doc in enumerate(documents):
            context_blocks.append(f"[BECE Past Question Reference {i+1}]:\n{doc}")

        return "\n\n".join(context_blocks), metadatas
    except Exception as e:
        print(f"RAG retrieval failed, falling back to Layer 1 prompt: {e}")
        return "", []


class ChatRequest(BaseModel):
    message: str


async def stream_openrouter_response(message: str):
    """Stream response from OpenRouter API with Layer 2 RAG context injection."""
    if not OPENROUTER_API_KEY:
        yield json.dumps({"reply": "The study assistant is temporarily unavailable. Please try again shortly.", "source": "fallback"})
        return

    # Layer 2: Retrieve relevant BECE past questions from ChromaDB
    context_text, _ = retrieve_relevant_bece_context(message, n_results=3)

    if context_text:
        augmented_prompt = (
            f"{SYSTEM_PROMPT}\n\n"
            "Below is relevant reference material from the official BECE past question bank:\n"
            "==============================\n"
            f"{context_text}\n"
            "==============================\n\n"
            "Teaching Guidelines:\n"
            "- Use the reference questions above to ground your explanation in the actual BECE syllabus.\n"
            "- Explain concepts simply so the student grasps the underlying principle.\n"
            "- If the student is asking about a specific past question, guide them step-by-step with clear reasoning."
        )
        source_tag = "rag-layer2"
    else:
        augmented_prompt = SYSTEM_PROMPT
        source_tag = "prompt-layer1"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://smart-study.local",
        "X-Title": "Smart Study AI",
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": augmented_prompt},
            {"role": "user", "content": message},
        ],
        "stream": True,
        "temperature": 0.4,
        "max_tokens": 600,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", OPENROUTER_URL, headers=headers, json=payload) as response:
                if response.status_code != 200:
                    yield json.dumps({"reply": "The study assistant is temporarily unavailable. Please try again shortly.", "source": "fallback"})
                    return

                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:].strip()
                        if data == "[DONE]":
                            break
                        try:
                            chunk = json.loads(data)
                            if chunk.get("choices"):
                                delta = chunk["choices"][0].get("delta", {})
                                content = delta.get("content", "")
                                if content:
                                    yield json.dumps({"reply": content, "source": source_tag})
                        except json.JSONDecodeError:
                            continue
    except Exception:
        yield json.dumps({"reply": "The study assistant is temporarily unavailable. Please try again shortly.", "source": "fallback"})


@app.post("/chat")
async def chat(request: ChatRequest):
    """Chat endpoint returning SSE stream."""
    if not request.message or not isinstance(request.message, str) or not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail={"error": "message is required", "code": "INVALID_INPUT"}
        )

    return EventSourceResponse(stream_openrouter_response(request.message.strip()))


@app.get("/health")
async def health():
    count = 0
    if questions_collection:
        try:
            count = questions_collection.count()
        except Exception:
            count = 0
    return {
        "status": "ok",
        "rag_enabled": questions_collection is not None and count > 0,
        "questions_indexed": count,
        "model": MODEL,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)