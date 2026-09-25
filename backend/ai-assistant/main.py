import os
import sys
import json
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sse_starlette.sse import EventSourceResponse
try:
    import chromadb
    from chromadb.config import Settings
except ImportError:
    chromadb = None
    Settings = None

load_dotenv()

# ── Dynamic Provider Configuration (Groq or OpenRouter) ─────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if GROQ_API_KEY:
    PROVIDER_NAME = "Groq"
    BASE_URL = "https://api.groq.com/openai/v1"
    API_KEY = GROQ_API_KEY
    MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    OPENROUTER_FREE_MODELS = []
elif OPENROUTER_API_KEY:
    PROVIDER_NAME = "OpenRouter"
    BASE_URL = "https://openrouter.ai/api/v1"
    API_KEY = OPENROUTER_API_KEY
    # Verified prioritized pool of free models on OpenRouter
    OPENROUTER_FREE_MODELS = [
        os.getenv("OPENROUTER_MODEL", "liquid/lfm-2.5-2.6b:free"),
        "liquid/lfm-2.5-2.6b:free",
        "nvidia/nemotron-3.5-lightning:free",
        "z-ai/glm-5.2:free",
        "inclusionai/ling-3.0-flash-vl:free",
        "nex-agi/nex-n2.5-mini:free",
        "nex-agi/nex-n2.5-pro:free",
        "google/gemma-4-26b-a4b-it:free",
        "thinkingmachines/inkling-small:free",
        "poolside/laguna-s-2.1:free",
        "cohere/north-mini-code:free",
        "openrouter/auto",
    ]
    # Deduplicate while preserving order
    OPENROUTER_FREE_MODELS = list(dict.fromkeys(OPENROUTER_FREE_MODELS))
    MODEL = OPENROUTER_FREE_MODELS[0]
else:
    PROVIDER_NAME = "None"
    BASE_URL = "https://openrouter.ai/api/v1"
    API_KEY = None
    MODEL = "liquid/lfm-2.5-2.6b:free"
    OPENROUTER_FREE_MODELS = []

SYSTEM_PROMPT = """You are Smart Study AI, a friendly, warm, and expert BECE study tutor specifically built for Ghanaian Junior High School (JHS 1, JHS 2, JHS 3) students preparing for their Basic Education Certificate Examination (BECE).

CRITICAL SYLLABUS BOUNDARY & SCOPE RULES:
1. STRICT BECE CURRICULUM FOCUS:
   - You ONLY assist with subjects and topics covered under the Ghanaian Ministry of Education / NaCCA / WAEC BECE syllabus:
     • Mathematics (JHS level: Sets, Numbers & Operations, Fractions, Decimals, Percentages, Ratio & Proportion, Basic Algebra & Linear Equations, Plane Geometry, Angles, Perimeter & Area of 2D figures, Surface Area & Volume of Prisms/Cylinders, Statistics & Probability basics, Vectors & Transformations basics).
     • Integrated Science (JHS level: Diversity of Matter, Living Cells, Life Processes, Photosynthesis, Energy, Electricity basics, Force & Pressure, Farming/Agriculture basics, Environmental Science).
     • English Language (Grammar, Comprehension, Essay/Letter writing, Vocabulary, Idioms).
     • Social Studies (Ghanaian history, Citizenship, Environment, Governance, Culture).
     • French (JHS vocabulary, Basic grammar, Reading comprehension, Dialogue).
     • Computing / ICT and Religious & Moral Education (RME).

2. STRICT REFUSAL OF OUT-OF-SYLLABUS TOPICS (CALCULUS, SHS ELECTIVES, TERTIARY/UNIVERSITY MATH & SCIENCE):
   - Calculus (differentiation, integration, limits, derivatives, differential equations) is NOT part of the Ghanaian BECE / JHS syllabus! It belongs to Senior High School (Elective Mathematics) and university.
   - If a student asks about Calculus, Advanced Trigonometry, Complex Numbers, Matrices, or any college/university-level topic:
     • You MUST politely decline to solve it.
     • Warmly explain that this topic is not in the BECE / JHS syllabus and is studied later in SHS (Elective Mathematics) or university.
     • Encourage the student and guide them back to relevant BECE topics like Algebra, Linear Equations, Percentages, Plane Geometry, or Statistics.

3. FORMATTING AND PEDAGOGICAL TONE:
   - Speak naturally and encouragingly, like a supportive Ghanaian classroom teacher.
   - Break down solutions step-by-step with clear, relatable Ghanaian examples where helpful (e.g., Ghana Cedis, local names like Kwame, Ama, Kofi).
   - Avoid cluttered markdown: do NOT use horizontal divider lines (---) or excessive hashtags (###).
   - Never output internal thinking tags; speak directly and kindly to the student."""

# ── FastAPI Web Server ───────────────────────────────────────────────────────
app = FastAPI(title="Smart Study AI - BECE Tutor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── ChromaDB Persistent Client for Layer 2 RAG ──────────────────────────────
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


def retrieve_relevant_bece_context(query: str, n_results: int = 3) -> tuple:
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


class ChatMessageModel(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: Optional[str] = None
    messages: Optional[List[ChatMessageModel]] = None


async def stream_response(messages: list, source_tag: str):
    """Stream response using httpx directly to the LLM API with automatic model inter-switching."""
    global MODEL

    if not API_KEY:
        yield json.dumps({
            "reply": "To enable live AI answers, please add your GROQ_API_KEY (from https://console.groq.com/keys) or OPENROUTER_API_KEY in backend/ai-assistant/.env.",
            "source": "system"
        })
        return

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    if PROVIDER_NAME == "OpenRouter":
        headers["HTTP-Referer"] = "https://smart-study.local"
        headers["X-Title"] = "Smart Study AI"
        # Prioritize currently working MODEL, then fallback through all candidate free models
        candidate_models = [MODEL] + [m for m in OPENROUTER_FREE_MODELS if m != MODEL]
    else:
        candidate_models = [MODEL]

    streamed_any = False
    last_error_code = None

    for candidate in candidate_models:
        payload = {
            "model": candidate,
            "messages": messages,
            "stream": True,
            "max_tokens": 600,
            "temperature": 0.4,
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                async with client.stream("POST", f"{BASE_URL}/chat/completions", headers=headers, json=payload) as response:
                    if response.status_code != 200:
                        last_error_code = response.status_code
                        raw_body = await response.aread()
                        err_text = raw_body.decode("utf-8", errors="replace")[:300]
                        print(f"[AI AUTO-SWITCH] Model '{candidate}' returned {response.status_code}: {err_text}. Automatically inter-switching to next free model...", flush=True)
                        continue  # Try next free model!

                    # 200 OK: Model responded successfully!
                    if candidate != MODEL:
                        print(f"[AI MODEL UPDATED] Set active working model to '{candidate}'.", flush=True)
                        MODEL = candidate

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
                                        streamed_any = True
                                        yield json.dumps({"reply": content, "source": source_tag})
                            except json.JSONDecodeError:
                                continue

                    if streamed_any:
                        return

        except Exception as e:
            print(f"[AI AUTO-SWITCH] Exception with model '{candidate}': {e}. Trying next free model...", flush=True)
            continue

    if not streamed_any:
        if last_error_code == 429:
            yield json.dumps({"reply": "Free study AI channels are experiencing peak demand. Please try asking again in a few seconds.", "source": "error"})
        else:
            yield json.dumps({"reply": "The study assistant is temporarily refreshing its AI model channels. Please try asking again in a moment.", "source": "fallback"})


import re

# ── BECE Syllabus Scope Guard ───────────────────────────────────────────────
CALCULUS_REGEX = re.compile(
    r"\b(calculus|derivatives?|differentiat(?:e|ion|ing)|integrat(?:e|ion|ing)|integrals?|antiderivatives?|differential\s+equations?|partial\s+derivatives?)\b|dy/dx|dx/dy|d/dx|\blim(?:it)?\s+as\s+\w+\s*(?:->|approaches)\b",
    re.IGNORECASE
)

def check_bece_syllabus_out_of_scope(query: str) -> Optional[str]:
    """Check if the user is asking about advanced topics (like Calculus) that are outside the Ghanaian BECE syllabus."""
    if not query:
        return None

    if CALCULUS_REGEX.search(query):
        return (
            "📚 **Topic Outside BECE Syllabus**\n\n"
            "Hello! I am your **BECE Study Tutor**, and **Calculus** (differentiation, integration, and limits) "
            "is **not part of the Ghanaian JHS / BECE syllabus**! It is studied later in Senior High School (SHS Elective Mathematics) and university.\n\n"
            "For **BECE Mathematics**, we cover:\n"
            "• **Algebra & Linear Equations** (e.g. simplifying expressions, solving equations)\n"
            "• **Numbers, Fractions, Percentages & Ratios**\n"
            "• **Plane Geometry, Angles & Circles**\n"
            "• **Perimeter, Area & Volume of solids**\n"
            "• **Sets, Vectors & Basic Probability/Statistics**\n\n"
            "Please ask any question from the JHS 1–3 curriculum or an official BECE past paper, and I'll be very happy to help you solve it step-by-step!"
        )
    return None


async def stream_static_reply(text: str, source: str = "bece-scope-guard"):
    """Yields a single structured SSE reply event for immediate scope refusal."""
    yield json.dumps({"reply": text, "source": source})


@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Streaming chat endpoint with Layer 2 RAG.
    Accepts either:
    1. {"message": "Simplify: 3(2x + 5) - 4x"}
    2. {"messages": [{"role": "user", "content": "..."}]}
    Returns: SSE stream of {"reply": "...", "source": "rag-layer2"|"prompt-layer1"|...}
    """
    formatted_messages = []
    user_query = ""

    if request.message is not None:
        if not isinstance(request.message, str) or not request.message.strip():
            raise HTTPException(status_code=400, detail={"error": "message must be a non-empty string", "code": "INVALID_INPUT"})
        user_query = request.message.strip()
        formatted_messages = [{"role": "user", "content": user_query}]
    elif request.messages is not None:
        if not request.messages:
            raise HTTPException(status_code=400, detail={"error": "messages array cannot be empty", "code": "INVALID_INPUT"})
        formatted_messages = [{"role": m.role, "content": m.content} for m in request.messages]
        user_query = next((m.content for m in reversed(request.messages) if m.role == "user"), "")
    else:
        raise HTTPException(status_code=400, detail={"error": "Either 'message' or 'messages' payload is required", "code": "INVALID_INPUT"})

    # Guard: Strictly reject out-of-scope topics like Calculus immediately
    out_of_scope_message = check_bece_syllabus_out_of_scope(user_query)
    if out_of_scope_message:
        return EventSourceResponse(stream_static_reply(out_of_scope_message))

    # Layer 2: Retrieve relevant BECE past questions from ChromaDB
    context_text, _ = retrieve_relevant_bece_context(user_query, n_results=3)

    if context_text:
        augmented_system = (
            f"{SYSTEM_PROMPT}\n\n"
            "Below is relevant reference material from the official BECE past question bank:\n"
            "==============================\n"
            f"{context_text}\n"
            "==============================\n\n"
            "Use these references to ground your explanation in the actual BECE syllabus."
        )
        source_tag = "rag-layer2"
    else:
        augmented_system = SYSTEM_PROMPT
        source_tag = f"prompt-layer1-{PROVIDER_NAME.lower()}"

    messages = [{"role": "system", "content": augmented_system}]
    messages.extend(formatted_messages)

    return EventSourceResponse(stream_response(messages, source_tag))


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
        "provider": PROVIDER_NAME,
        "model": MODEL,
        "rag_enabled": questions_collection is not None and count > 0,
        "questions_indexed": count,
    }


# ── CLI Terminal Chatbot ─────────────────────────────────────────────────────
def main():
    """Run Smart Study AI as an interactive terminal chatbot."""
    if not API_KEY:
        print("Error: Neither GROQ_API_KEY nor OPENROUTER_API_KEY is set in .env", file=sys.stderr)
        sys.exit(1)
    print(f"\n📚 Welcome to Smart Study AI — Your BECE Tutor! (Provider: {PROVIDER_NAME}, Model: {MODEL})")
    print("Type 'exit' or 'quit' to end the session.\n")


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5003))
    import uvicorn
    print(f"Starting Smart Study AI API server on http://127.0.0.1:{port} (Provider: {PROVIDER_NAME}, Model: {MODEL})")
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True)
