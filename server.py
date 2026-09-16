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

# Mount static files & frontend build
base_dir = os.path.dirname(__file__)
react_dist_dir = os.path.join(base_dir, "frontend", "dist")
legacy_static_dir = os.path.join(base_dir, "static")

if os.path.exists(react_dist_dir):
    assets_dir = os.path.join(react_dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

app.mount("/static", StaticFiles(directory=legacy_static_dir), name="static")


@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    """Serve React SPA index.html or fallback to legacy static/index.html."""
    if full_path.startswith("api/"):
        return {"detail": "Not Found"}

    # 1. Prefer React Dist build if available
    react_index = os.path.join(react_dist_dir, "index.html")
    if os.path.exists(react_index):
        return FileResponse(react_index)

    # 2. Fall back to legacy static/index.html
    legacy_index = os.path.join(legacy_static_dir, "index.html")
    if os.path.exists(legacy_index):
        return FileResponse(legacy_index)

    return {"message": "YouTube Dictation API is running."}


if __name__ == "__main__":
    print("Starting YouTube Dictation Server at http://127.0.0.1:8000")
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
