"""FastAPI Server Entrypoint for DailyDictation Studio Enterprise."""
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import uvicorn

from app.infrastructure.database.connection import init_db
from app.presentation.security_middleware import limiter, SecurityHeadersMiddleware
from app.presentation.api import api_router
from app.presentation.auth_api import router as auth_router
from app.presentation.lesson_api import router as lesson_router
from app.presentation.vocab_api import router as vocab_router
from app.presentation.streak_api import router as streak_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for database initialization and cleanup."""
    try:
        await init_db()
        logger.info("Application startup: Database initialized and Super Admin verified.")
    except Exception as e:
        logger.error(f"Error during startup init_db: {e}")
    yield
    logger.info("Application shutdown.")


app = FastAPI(
    title="DailyDictation Studio Enterprise",
    description="Nền tảng Luyện nghe và Chép chính tả YouTube thông minh với CSDL bền vững & Sổ từ vựng AI.",
    version="2.0.0",
    lifespan=lifespan
)

# 1. Rate Limiting setup (web-security-auditor)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau."}
    )

# 2. HTTP Security Headers Middleware (Helmet equivalent & 512KB payload protection)
app.add_middleware(SecurityHeadersMiddleware)

# 3. CORS Middleware
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*").strip()
if allowed_origins_env == "*":
    allow_origins = ["*"]
    allow_credentials = False
else:
    allow_origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()]
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include Clean Architecture API Routers
app.include_router(api_router)
app.include_router(auth_router)
app.include_router(lesson_router)
app.include_router(vocab_router)
app.include_router(streak_router)

# 5. Mount React frontend build
base_dir = os.path.dirname(__file__)
react_dist_dir = os.path.join(base_dir, "frontend", "dist")

if os.path.exists(react_dist_dir):
    assets_dir = os.path.join(react_dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


@app.get("/tai-lieu", include_in_schema=False)
@app.get("/tai-lieu/index.html", include_in_schema=False)
@app.get("/docs-brd", include_in_schema=False)
def serve_documentation():
    doc_path = os.path.join(base_dir, "tai_lieu", "index.html")
    if os.path.exists(doc_path):
        return FileResponse(doc_path)
    return {"detail": "Documentation not found"}


@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    """Serve React frontend SPA from frontend/dist."""
    if full_path.startswith("api/"):
        return {"detail": "Not Found"}

    # Check if specific static asset exists in dist (e.g. linguagun_logo.jpg, favicon.svg)
    if full_path:
        file_path = os.path.join(react_dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)

    # Primary: Serve React SPA index.html
    react_index = os.path.join(react_dist_dir, "index.html")
    if os.path.exists(react_index):
        return FileResponse(react_index)

    return {"message": "ShotLang API is running. Build frontend with 'npm run build' inside frontend/."}


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5100))
    print(f"Starting ShotLang Server at http://{host}:{port}")
    uvicorn.run("server:app", host=host, port=port, reload=True)
