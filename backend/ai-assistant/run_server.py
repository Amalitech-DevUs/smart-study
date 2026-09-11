import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(current_dir)

from dotenv import load_dotenv
load_dotenv()

port = int(os.getenv("PORT", 5003))
print("CWD:", os.getcwd())
has_key = bool(os.getenv("GROQ_API_KEY") or os.getenv("OPENROUTER_API_KEY"))
print("API Key configured:", "YES" if has_key else "NO")

import uvicorn
uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)