import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  pickModuleExport,
  createModuleLoader,
  preloadFromRegistry,
  scheduleIdleTask,
  latchOpened,
  isChunkLoadError,
} from "../src/utils/lazyModule.js";

describe("pickModuleExport", () => {
  test("returns named export (happy path)", () => {
    const Comp = () => null;
    assert.equal(pickModuleExport({ Comp }, "Comp"), Comp);
  });

  test("falls back through ordered names", () => {
    const Def = () => null;
    assert.equal(pickModuleExport({ default: Def }, ["Missing", "default"]), Def);
  });

  test("skips null/undefined exports and invalid names", () => {
    const B = () => null;
    assert.equal(pickModuleExport({ A: null, B }, ["", 5, "A", "B"]), B);
  });

  test("returns undefined for missing export or bad module", () => {
    assert.equal(pickModuleExport({}, "X"), undefined);
    assert.equal(pickModuleExport(null, "X"), undefined);
    assert.equal(pickModuleExport("str", "X"), undefined);
    assert.equal(pickModuleExport(42, "X"), undefined);
  });

  test("accepts function namespaces", () => {
    const fn = () => null;
    fn.Named = "ok";
    assert.equal(pickModuleExport(fn, "Named"), "ok");
  });
});

describe("createModuleLoader", () => {
  test("resolves to { default } shape expected by React.lazy", async () => {
    const Page = () => null;
    const load = createModuleLoader(async () => ({ Page }), "Page");
    const result = await load();
    assert.deepEqual(Object.keys(result), ["default"]);
    assert.equal(result.default, Page);
  });

  test("defaults to the default export", async () => {
    const Def = () => null;
    const load = createModuleLoader(async () => ({ default: Def }));
    assert.equal((await load()).default, Def);
  });

  test("memoizes: importer runs once for concurrent and later calls", async () => {
    let calls = 0;
    const load = createModuleLoader(async () => {
      calls += 1;
      return { default: 1 };
    });
    const [a, b] = await Promise.all([load(), load()]);
    await load();
    assert.equal(calls, 1);
    assert.equal(a, b);
  });

  test("isLoaded flips to true only after success", async () => {
    const load = createModuleLoader(async () => ({ default: 1 }));
    assert.equal(load.isLoaded(), false);
    await load();
    assert.equal(load.isLoaded(), true);
  });

  test("does not cache failures, so a retry can succeed", async () => {
    let attempt = 0;
    const load = createModuleLoader(async () => {
      attempt += 1;
      if (attempt === 1) throw new Error("Failed to fetch dynamically imported module");
      return { default: "ok" };
    });
    await assert.rejects(load(), /Failed to fetch/);
    assert.equal(load.isLoaded(), false);
    assert.equal((await load()).default, "ok");
    assert.equal(attempt, 2);
  });

  test("synchronous importer throw becomes a rejection", async () => {
    const load = createModuleLoader(() => {
      throw new Error("boom");
    });
    await assert.rejects(load(), /boom/);
  });

  test("rejects with clear error when export is missing", async () => {
    const load = createModuleLoader(async () => ({ Other: 1 }), "Wanted");
    await assert.rejects(load(), /Export "Wanted" not found/);
  });

  test("lists all fallback names in missing-export error", async () => {
    const load = createModuleLoader(async () => ({}), ["A", "default"]);
    await assert.rejects(load(), /A \| default/);
  });

  test("throws TypeError for invalid arguments", () => {
    assert.throws(() => createModuleLoader(null), TypeError);
    assert.throws(() => createModuleLoader("import"), TypeError);
    assert.throws(() => createModuleLoader(async () => ({}), ""), TypeError);
    assert.throws(() => createModuleLoader(async () => ({}), "   "), TypeError);
    assert.throws(() => createModuleLoader(async () => ({}), []), TypeError);
    assert.throws(() => createModuleLoader(async () => ({}), ["ok", 1]), TypeError);
  });
});

describe("preloadFromRegistry", () => {
  test("runs the registered loader and resolves true", async () => {
    let ran = false;
    const registry = { "tab-a": async () => { ran = true; } };
    assert.equal(await preloadFromRegistry(registry, "tab-a"), true);
    assert.equal(ran, true);
  });

  test("resolves false (never rejects) when loader fails", async () => {
    const registry = { bad: async () => { throw new Error("offline"); } };
    assert.equal(await preloadFromRegistry(registry, "bad"), false);
  });

  test("resolves false when loader throws synchronously", async () => {
    const registry = { bad: () => { throw new Error("sync"); } };
    assert.equal(await preloadFromRegistry(registry, "bad"), false);
  });

  test("resolves false for unknown key, inherited keys, or non-function entries", async () => {
    const registry = { notFn: 123 };
    assert.equal(await preloadFromRegistry(registry, "missing"), false);
    assert.equal(await preloadFromRegistry(registry, "toString"), false);
    assert.equal(await preloadFromRegistry(registry, "notFn"), false);
  });

  test("resolves false for invalid registry or key", async () => {
    assert.equal(await preloadFromRegistry(null, "a"), false);
    assert.equal(await preloadFromRegistry({ a: () => 1 }, 7), false);
    assert.equal(await preloadFromRegistry(undefined, undefined), false);
  });

  test("works with synchronous (non-promise) loaders", async () => {
    assert.equal(await preloadFromRegistry({ a: () => 1 }, "a"), true);
  });
});

describe("scheduleIdleTask", () => {
  test("uses requestIdleCallback when available and passes timeout", () => {
    let captured = null;
    let cancelled = null;
    const scope = {
      requestIdleCallback: (cb, opts) => { captured = { cb, opts }; return 7; },
      cancelIdleCallback: (h) => { cancelled = h; },
    };
    let ran = 0;
    const cancel = scheduleIdleTask(() => { ran += 1; }, { timeout: 3000, scope });
    assert.equal(captured.opts.timeout, 3000);
    captured.cb();
    assert.equal(ran, 1);
    cancel();
    assert.equal(cancelled, 7);
  });

  test("falls back to setTimeout (capped at 1500ms)", () => {
    let delay = null;
    let cleared = null;
    const scope = {
      setTimeout: (cb, ms) => { delay = ms; cb(); return 3; },
      clearTimeout: (h) => { cleared = h; },
    };
    let ran = false;
    const cancel = scheduleIdleTask(() => { ran = true; }, { timeout: 9000, scope });
    assert.equal(ran, true);
    assert.equal(delay, 1500);
    cancel();
    assert.equal(cleared, 3);
  });

  test("invalid timeout falls back to default", () => {
    let opts = null;
    const scope = { requestIdleCallback: (_cb, o) => { opts = o; return 1; } };
    scheduleIdleTask(() => {}, { timeout: -5, scope });
    assert.equal(opts.timeout, 2000);
    scheduleIdleTask(() => {}, { timeout: Number.NaN, scope });
    assert.equal(opts.timeout, 2000);
  });

  test("runs immediately when no scheduler exists and returns no-op cancel", () => {
    let ran = false;
    const cancel = scheduleIdleTask(() => { ran = true; }, { scope: {} });
    assert.equal(ran, true);
    assert.doesNotThrow(() => cancel());
  });

  test("cancel is safe when cancelIdleCallback is missing", () => {
    const scope = { requestIdleCallback: () => 1 };
    const cancel = scheduleIdleTask(() => {}, { scope });
    assert.doesNotThrow(() => cancel());
  });

  test("throws TypeError when task is not a function", () => {
    assert.throws(() => scheduleIdleTask(null), TypeError);
    assert.throws(() => scheduleIdleTask("x"), TypeError);
  });
});

describe("latchOpened", () => {
  test("stays false until opened", () => {
    assert.equal(latchOpened(false, false), false);
    assert.equal(latchOpened(false, undefined), false);
  });

  test("latches to true once opened, even after close", () => {
    assert.equal(latchOpened(false, true), true);
    assert.equal(latchOpened(true, false), true);
    assert.equal(latchOpened(true, null), true);
  });

  test("coerces truthy values to boolean", () => {
    assert.equal(latchOpened(0, { error: "x" }), true);
    assert.equal(latchOpened("", 0), false);
  });
});

describe("isChunkLoadError", () => {
  test("detects browser chunk-load messages (Chrome, Firefox, Safari, Vite CSS)", () => {
    assert.equal(isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: /assets/a.js")), true);
    assert.equal(isChunkLoadError(new TypeError("error loading dynamically imported module")), true);
    assert.equal(isChunkLoadError(new TypeError("Importing a module script failed.")), true);
    assert.equal(isChunkLoadError(new Error("Unable to preload CSS for /assets/x.css")), true);
    assert.equal(isChunkLoadError(new Error("Loading chunk 42 failed.")), true);
    assert.equal(isChunkLoadError(new Error("Loading CSS chunk abc-1 failed")), true);
  });

  test("detects by error name/code and plain string", () => {
    assert.equal(isChunkLoadError({ name: "ChunkLoadError", message: "" }), true);
    assert.equal(isChunkLoadError({ code: "CSS_CHUNK_LOAD_FAILED" }), true);
    assert.equal(isChunkLoadError("Failed to fetch dynamically imported module"), true);
  });

  test("returns false for ordinary runtime errors and empty input", () => {
    assert.equal(isChunkLoadError(new TypeError("Cannot read properties of undefined")), false);
    assert.equal(isChunkLoadError(new Error("")), false);
    assert.equal(isChunkLoadError(null), false);
    assert.equal(isChunkLoadError(undefined), false);
    assert.equal(isChunkLoadError({}), false);
    assert.equal(isChunkLoadError(42), false);
  });
});
