"""FastAPI Server Entrypoint for YouTube Dictation Application."""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

from app.presentation.api import api_router

app = FastAPI(
    title="YouTube Dictation Studio (DailyDictation Clone)",
    description="Học tiếng Anh qua chép chính tả video YouTube theo từng câu chuẩn thể thức DailyDictation.",
    version="1.0.0",
)

# Enable CORS for local development and iframe interactions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include clean architecture API router
app.include_router(api_router)

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
def read_root():
    """Serve the single-page application entrypoint."""
    index_file = os.path.join(static_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "YouTube Dictation API is running. UI index.html will be loaded here."}


if __name__ == "__main__":
    print("Starting YouTube Dictation Server at http://127.0.0.1:8000")
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
