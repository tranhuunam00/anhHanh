"""Production Launcher for LinguaGUN App.
Builds React frontend into frontend/dist and serves single-port FastAPI app at http://localhost:8000.
"""
import os
import sys
import subprocess

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("=========================================================")
    print("🚀 Launching LinguaGUN Production Server...")
    print("=========================================================\n")

    # Step 1: Build React Frontend
    print("Step 1: Building React frontend bundle...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    build_proc = subprocess.run([npm_cmd, "run", "build"], cwd=frontend_dir, shell=(os.name == "nt"))

    if build_proc.returncode != 0:
        print("❌ Frontend build failed. Please check errors above.")
        sys.exit(1)

    port = int(os.getenv("PORT", 5100))
    print(f"\n✅ Frontend built successfully!")
    print(f"Step 2: Starting FastAPI Production Server at http://127.0.0.1:{port}")
    print("Press Ctrl+C to stop.\n")

    # Step 2: Run FastAPI Server
    import uvicorn
    from server import app
    uvicorn.run(app, host="127.0.0.1", port=port)

if __name__ == "__main__":
    main()
