import os
os.chdir(r"C:\Users\phili\OneDrive\Desktop\amalitech-project\smart-study\backend\ai-assistant")
from dotenv import load_dotenv
load_dotenv()
print("CWD:", os.getcwd())
print("API Key:", os.getenv("OPENROUTER_API_KEY")[:20] + "..." if os.getenv("OPENROUTER_API_KEY") else "NOT SET")
import uvicorn
uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)