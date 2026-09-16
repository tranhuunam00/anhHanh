"""Production Launcher for ShotLang App.
Builds React frontend into frontend/dist and serves single-port FastAPI app at http://localhost:5100.
"""
import os
import sys
import subprocess

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("=========================================================")
    print("🚀 Launching ShotLang Production Server...")
    print("=========================================================\n")

    node_modules_dir = os.path.join(frontend_dir, "node_modules")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"

    # Step 1: Auto install frontend dependencies if missing
    if not os.path.exists(node_modules_dir):
        print("📦 Installing frontend dependencies (npm install)...")
        install_proc = subprocess.run([npm_cmd, "install"], cwd=frontend_dir, shell=(os.name == "nt"))
        if install_proc.returncode != 0:
            print("⚠️ Warning: npm install failed. Make sure Node.js & npm are installed on your server.")

    # Step 2: Build React Frontend
    print("Building React frontend bundle (npm run build)...")
    build_proc = subprocess.run([npm_cmd, "run", "build"], cwd=frontend_dir, shell=(os.name == "nt"))

    dist_dir = os.path.join(frontend_dir, "dist")
    if build_proc.returncode != 0:
        if not os.path.exists(dist_dir):
            print("❌ Frontend build failed. Please run 'cd frontend && npm install && npm run build' manually.")
            sys.exit(1)
        else:
            print("⚠️ Warning: Build returned non-zero code, but dist folder exists. Continuing with existing dist...")

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5100))
    print(f"\n✅ Frontend ready!")
    print(f"Step 2: Starting FastAPI Production Server at http://{host}:{port}")
    print("Press Ctrl+C to stop.\n")

    # Step 3: Run FastAPI Server
    import uvicorn
    from server import app
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    main()
