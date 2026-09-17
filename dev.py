import os
import sys
import subprocess
import time

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

def kill_proc_tree(pid):
    """Cleanly terminate a process and all its child workers."""
    if not pid:
        return
    try:
        if os.name == "nt":
            subprocess.run(["taskkill", "/F", "/T", "/PID", str(pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            os.kill(pid, 9)
    except Exception:
        pass

def free_port(port):
    """Ensure port is not occupied by orphaned processes before launching."""
    if os.name == "nt":
        try:
            out = subprocess.check_output(f"netstat -ano | findstr :{port}", shell=True).decode()
            for line in out.splitlines():
                if "LISTENING" in line:
                    parts = line.strip().split()
                    pid = parts[-1]
                    if pid.isdigit() and int(pid) != os.getpid():
                        subprocess.run(["taskkill", "/F", "/PID", pid], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    port = os.getenv("PORT", "5100")
    print("=========================================================")
    print("Starting DailyDictation Studio (Backend + Frontend)...")
    print(f"  - Backend & API:     http://127.0.0.1:{port}")
    print("  - React Frontend:    http://localhost:5101")
    print("=========================================================\n")

    # Free ports from any lingering zombie processes
    free_port(port)
    free_port("5101")
    time.sleep(0.5)

    # Start FastAPI Backend
    be_cmd = [sys.executable, "server.py"]
    be_env = os.environ.copy()
    be_env["PORT"] = str(port)
    be_proc = subprocess.Popen(be_cmd, cwd=root_dir, env=be_env)

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
        if be_proc and be_proc.poll() is None:
            kill_proc_tree(be_proc.pid)
        if fe_proc and fe_proc.poll() is None:
            kill_proc_tree(fe_proc.pid)
        print("Done.")

if __name__ == "__main__":
    main()
