import os
import sys
import json
from dotenv import load_dotenv
from openai import OpenAI, AsyncOpenAI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union
from sse_starlette.sse import EventSourceResponse

load_dotenv()

# ── Dynamic Provider Configuration (Groq or OpenRouter) ─────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if GROQ_API_KEY:
    PROVIDER_NAME = "Groq"
    BASE_URL = "https://api.groq.com/openai/v1"
    API_KEY = GROQ_API_KEY
    MODEL = os.getenv("GROQ_MODEL", "groq/compound-mini")
elif OPENROUTER_API_KEY:
    PROVIDER_NAME = "OpenRouter"
    BASE_URL = "https://openrouter.ai/api/v1"
    API_KEY = OPENROUTER_API_KEY
    MODEL = os.getenv("OPENROUTER_MODEL", "nvidia/nemotron-3.5-lightning:free")
else:
    PROVIDER_NAME = "None"
    BASE_URL = "https://openrouter.ai/api/v1"
    API_KEY = None
    MODEL = "meta-llama/llama-3.2-3b-instruct:free"

# Sync client — used by the CLI chat loop
sync_client = OpenAI(
    base_url=BASE_URL,
    api_key=API_KEY or "dummy_key",
)

# Async client — used by the FastAPI web endpoints
async_client = AsyncOpenAI(
    base_url=BASE_URL,
    api_key=API_KEY or "dummy_key",
)

SYSTEM_PROMPT = """You are Smart Study AI, a friendly BECE tutor for Ghanaian JHS students.
Scope: only answer questions related to BECE subjects (Mathematics, Integrated Science, English Language, Social Studies, and other core JHS subjects).
Rules:
- Explain simply, at a JHS student's level, with examples where useful.
- If a question is unrelated to BECE study, politely decline and redirect the student.
- Never provide direct answers to what looks like a live exam in progress — teach the concept instead.
- Keep answers clear and not overly long."""


# ── FastAPI Web Server ───────────────────────────────────────────────────────

app = FastAPI(title="Smart Study AI - BECE Tutor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    # Supports both {"message": "..."} and {"messages": [...]}
    message: Optional[str] = None
    messages: Optional[List[ChatMessage]] = None


async def stream_response(messages: list):
    """Stream tokens using the openai SDK."""
    try:
        response = await async_client.chat.completions.create(
            model=MODEL,
            messages=messages,
            stream=True,
            max_tokens=500,
            temperature=0.7,
        )
        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                yield json.dumps({"reply": content, "source": PROVIDER_NAME.lower()})
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg:
            yield json.dumps({"reply": "Rate limit reached for the daily free tier. Please add GROQ_API_KEY in .env for unlimited free usage.", "source": "error"})
        else:
            yield json.dumps({"reply": "The study assistant is temporarily unavailable. Please try again shortly.", "source": "fallback"})


@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Streaming chat endpoint.
    Accepts either:
    1. {"message": "Simplify: 3(2x + 5) - 4x"}
    2. {"messages": [{"role": "user", "content": "..."}]}
    Returns: SSE stream of {"reply": "...", "source": "groq"|"openrouter"}
    """
    formatted_messages = []

    if request.message is not None:
        if not isinstance(request.message, str) or not request.message.strip():
            raise HTTPException(status_code=400, detail={"error": "message must be a non-empty string", "code": "INVALID_INPUT"})
        formatted_messages = [{"role": "user", "content": request.message.strip()}]
    elif request.messages is not None:
        if not request.messages:
            raise HTTPException(status_code=400, detail={"error": "messages array cannot be empty", "code": "INVALID_INPUT"})
        formatted_messages = [{"role": m.role, "content": m.content} for m in request.messages]
    else:
        raise HTTPException(status_code=400, detail={"error": "Either 'message' or 'messages' payload is required", "code": "INVALID_INPUT"})

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(formatted_messages)

    return EventSourceResponse(stream_response(messages))


@app.get("/health")
async def health():
    return {"status": "ok", "provider": PROVIDER_NAME, "model": MODEL}


# ── CLI Terminal Chatbot ─────────────────────────────────────────────────────

def main():
    """Run Smart Study AI as an interactive terminal chatbot with memory."""
    if not API_KEY:
        print("Error: Neither GROQ_API_KEY nor OPENROUTER_API_KEY is set in .env", file=sys.stderr)
        sys.exit(1)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    print(f"\n📚 Welcome to Smart Study AI — Your BECE Tutor! (Powered by {PROVIDER_NAME}: {MODEL})")
    print("Ask me anything about Mathematics, Science, English, Social Studies, and other BECE subjects.")
    print("Type 'exit' or 'quit' to end the session.\n")

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n\nGoodbye! Keep studying hard. You've got this! 💪")
            break

        if not user_input:
            continue
        if user_input.lower() in ("exit", "quit"):
            print("\nSmart Study AI: Goodbye! Keep studying hard. You've got this! 💪")
            break

        messages.append({"role": "user", "content": user_input})

        print("\nSmart Study AI: ", end="", flush=True)
        try:
            response = sync_client.chat.completions.create(
                model=MODEL,
                messages=messages,
                stream=True,
                max_tokens=500,
                temperature=0.7,
            )
            reply = ""
            for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    print(content, end="", flush=True)
                    reply += content
            print("\n")

            messages.append({"role": "assistant", "content": reply})

        except Exception as e:
            err_str = str(e)
            if "429" in err_str and PROVIDER_NAME == "OpenRouter":
                print("\n\n⚠️ OpenRouter daily free limit (50 requests) reached!")
                print("To fix this and get 14,400 free requests/day:")
                print("1. Get a free API key at: https://console.groq.com/keys")
                print("2. Add `GROQ_API_KEY=gsk_...` to your backend/ai-assistant/.env file")
            else:
                print(f"\n[Error: {e}]\n")
            messages.pop()


if __name__ == "__main__":
    if "--server" in sys.argv:
        import uvicorn
        print(f"Starting Smart Study AI API server on http://127.0.0.1:8000 (Provider: {PROVIDER_NAME}, Model: {MODEL})")
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    else:
        main()