"""FastAPI Server Entrypoint for YouTube Dictation Application."""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

from app.presentation.api import api_router

app = FastAPI(
    title="ShotLang - Precision YouTube Dictation & Listening App",
    description="Ứng dụng ShotLang: Luyện nghe và chép chính tả YouTube thông minh, chuẩn xác.",
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
    """Serve React SPA index.html, static dist files, or fallback to legacy static/index.html."""
    if full_path.startswith("api/"):
        return {"detail": "Not Found"}

    # Check if a specific file exists in react_dist_dir (e.g. /linguagun_logo.jpg, favicon.ico)
    if full_path and os.path.exists(react_dist_dir):
        target_file = os.path.abspath(os.path.join(react_dist_dir, full_path))
        if target_file.startswith(os.path.abspath(react_dist_dir)) and os.path.exists(target_file) and os.path.isfile(target_file):
            return FileResponse(target_file)

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
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5100))
    print(f"Starting ShotLang Server at http://{host}:{port}")
    uvicorn.run("server:app", host=host, port=port, reload=True)
