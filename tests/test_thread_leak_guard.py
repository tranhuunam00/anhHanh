"""Unit tests for the pytest exit watchdog in tests/thread_leak_guard.py."""
import io
import threading

import pytest

from thread_leak_guard import (
    describe_threads,
    find_leaked_threads,
    force_exit_if_leaked,
    wait_for_threads,
)


class FakeThread:
    def __init__(self, name, daemon=False, alive=True, target=None):
        self.name, self.daemon, self._alive, self._target = name, daemon, alive, target
        self.joined_with = None

    def is_alive(self):
        return self._alive

    def join(self, timeout=None):
        self.joined_with = timeout


def worker_loop():
    pass


@pytest.fixture
def blocked_thread():
    """A real non-daemon thread parked on an event; always released after the test."""
    release = threading.Event()
    t = threading.Thread(target=release.wait, name="blocked-worker", daemon=False)
    t.start()
    yield t
    release.set()
    t.join(2)


# ---------------------------------------------------------------- find_leaked_threads
class TestFindLeakedThreads:
    def test_returns_only_live_non_daemon_threads(self):
        main = FakeThread("MainThread")
        leak = FakeThread("Thread-2 (_connection_worker_thread)")
        threads = [main, leak, FakeThread("bg", daemon=True), FakeThread("done", alive=False)]
        assert find_leaked_threads(threads, main) == [leak]

    def test_ignores_self_cleaning_executor_workers(self):
        main = FakeThread("MainThread")
        assert find_leaked_threads([main, FakeThread("ThreadPoolExecutor-0_0")], main) == []

    def test_empty_and_main_only_inputs(self):
        main = FakeThread("MainThread")
        assert find_leaked_threads([], main) == []
        assert find_leaked_threads([main], main) == []

    def test_accepts_any_iterable_and_non_string_names(self):
        main = FakeThread("MainThread")
        odd = FakeThread(123)
        assert find_leaked_threads(iter([main, odd]), main) == [odd]

    def test_defaults_to_the_real_process_threads(self, blocked_thread):
        leaked = find_leaked_threads()
        assert blocked_thread in leaked
        assert threading.main_thread() not in leaked


# ---------------------------------------------------------------- wait_for_threads
class TestWaitForThreads:
    def test_finished_threads_are_not_returned(self):
        t = threading.Thread(target=lambda: None)
        t.start()
        assert wait_for_threads([t], 1.0) == []

    def test_blocked_thread_is_returned_after_timeout(self, blocked_thread):
        assert wait_for_threads([blocked_thread], 0.05) == [blocked_thread]

    def test_shares_one_deadline_and_never_passes_negative_timeouts(self):
        a, b = FakeThread("a"), FakeThread("b")
        wait_for_threads([a, b], 0.0)
        assert a.joined_with == 0.0 and b.joined_with == 0.0

    def test_empty_list(self):
        assert wait_for_threads([], 0.0) == []

    @pytest.mark.parametrize("bad", [-1, -0.001, None])
    def test_rejects_negative_or_missing_timeout(self, bad):
        with pytest.raises(ValueError):
            wait_for_threads([], bad)


# ---------------------------------------------------------------- describe_threads
class TestDescribeThreads:
    def test_names_thread_and_target_function(self):
        assert describe_threads([FakeThread("w1", target=worker_loop)]) == "w1 (worker_loop)"

    def test_thread_without_target_shows_name_only(self):
        assert describe_threads([FakeThread("w1"), FakeThread("w2")]) == "w1, w2"

    def test_empty_list_gives_empty_string(self):
        assert describe_threads([]) == ""


# ---------------------------------------------------------------- force_exit_if_leaked
class TestForceExitIfLeaked:
    def run(self, threads, status=0):
        calls, out = [], io.StringIO()
        result = force_exit_if_leaked(status, timeout=0.0, stream=out, exit_fn=calls.append, threads=threads)
        return result, calls, out.getvalue()

    def test_no_leak_lets_the_process_exit_normally(self):
        result, calls, out = self.run([FakeThread("MainThread", daemon=True)])
        assert result is False and calls == [] and out == ""

    def test_leak_after_passing_run_exits_with_1_and_names_the_thread(self):
        leak = FakeThread("Thread-2", target=worker_loop)
        result, calls, out = self.run([leak], status=0)
        assert result is True
        assert calls == [1]
        assert "[thread-leak-guard] 1 non-daemon thread(s)" in out
        assert "Thread-2 (worker_loop)" in out

    def test_leak_keeps_a_failing_run_status(self):
        _, calls, _ = self.run([FakeThread("x")], status=2)
        assert calls == [2]

    def test_real_blocked_thread_is_caught(self, blocked_thread):
        calls, out = [], io.StringIO()
        assert force_exit_if_leaked(0, timeout=0.05, stream=out, exit_fn=calls.append) is True
        assert calls == [1] and "blocked-worker" in out.getvalue()

    def test_negative_timeout_is_rejected(self):
        with pytest.raises(ValueError):
            force_exit_if_leaked(0, timeout=-1, exit_fn=lambda s: None, threads=[])
