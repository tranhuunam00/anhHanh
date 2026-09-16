"""Development Runner Script to start both FastAPI Backend and Vite React Frontend concurrently."""
import os
import sys
import subprocess
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("=========================================================")
    print("Starting DailyDictation Studio (Backend + Frontend)...")
    print("  - Backend:  http://127.0.0.1:8000")
    print("  - Frontend: http://localhost:5173")
    print("=========================================================\n")

    # Start FastAPI Backend
    be_cmd = [sys.executable, "server.py"]
    be_proc = subprocess.Popen(be_cmd, cwd=root_dir)

    # Start Vite React Frontend
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    fe_cmd = [npm_cmd, "run", "dev"]
    fe_proc = subprocess.Popen(fe_cmd, cwd=frontend_dir, shell=(os.name == "nt"))

    try:
        while True:
            time.sleep(1)
            if be_proc.poll() is not None or fe_proc.poll() is not None:
                break
    except KeyboardInterrupt:
        print("\nShutting down servers...")
    finally:
        if be_proc.poll() is None:
            be_proc.terminate()
        if fe_proc.poll() is None:
            fe_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    main()
