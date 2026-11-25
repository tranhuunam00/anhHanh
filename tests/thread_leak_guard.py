"""Watchdog that keeps a leaked non-daemon thread from hanging the pytest process at exit.

Python joins every non-daemon thread before the interpreter exits. A single stray one
(for example the worker thread of an aiosqlite connection that was never closed) makes
pytest print its summary and then never terminate, with no error and almost no CPU use.
"""
import os
import sys
import threading
import time

# concurrent.futures stops its own workers from an exit hook that runs before Python
# joins threads, so idle executor workers never cause a hang.
SELF_CLEANING_PREFIXES = ("ThreadPoolExecutor-",)


def find_leaked_threads(threads=None, main_thread=None):
    """Return the live non-daemon threads (other than the main one) that would block exit."""
    threads = threading.enumerate() if threads is None else list(threads)
    main_thread = threading.main_thread() if main_thread is None else main_thread
    return [
        t for t in threads
        if t is not main_thread
        and not t.daemon
        and t.is_alive()
        and not str(t.name).startswith(SELF_CLEANING_PREFIXES)
    ]


def wait_for_threads(threads, timeout):
    """Give the threads up to `timeout` seconds in total to finish; return those still alive."""
    if timeout is None or timeout < 0:
        raise ValueError("timeout must be a number >= 0")
    deadline = time.monotonic() + timeout
    for t in threads:
        t.join(max(0.0, deadline - time.monotonic()))
    return [t for t in threads if t.is_alive()]


def describe_threads(threads):
    """One readable line naming each thread and the function it runs."""
    parts = []
    for t in threads:
        target = getattr(t, "_target", None)
        where = getattr(target, "__qualname__", None) or getattr(target, "__name__", None)
        parts.append(f"{t.name} ({where})" if where else str(t.name))
    return ", ".join(parts)


def force_exit_if_leaked(exit_status, timeout=5.0, stream=None, exit_fn=os._exit, threads=None):
    """If non-daemon threads would hang the process, report them and exit anyway.

    Exits with the run's own status, or 1 when the tests passed, so the leak is noticed.
    Returns False when nothing leaked (the process can exit normally).
    """
    leaked = wait_for_threads(find_leaked_threads(threads), timeout)
    if not leaked:
        return False
    stream = stream or sys.stderr
    stream.write(
        f"\n[thread-leak-guard] {len(leaked)} non-daemon thread(s) still running after the test "
        f"session would keep this process alive forever: {describe_threads(leaked)}. "
        "Exiting anyway; close whatever started them (e.g. dispose the DB engine).\n"
    )
    stream.flush()
    sys.stdout.flush()
    exit_fn(exit_status or 1)
    return True
