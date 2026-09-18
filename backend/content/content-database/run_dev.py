import os
import sys
import uvicorn

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5002"))
    print(f"Starting FastAPI Content Database Service on port {port}...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=False)
