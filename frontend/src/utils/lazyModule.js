/**
 * Helpers for code-splitting: memoized dynamic-import loaders that can be
 * preloaded (hover / idle) and consumed by React.lazy.
 */

/**
 * Picks the first available export from a loaded module.
 * @param {object} mod Loaded ES module namespace
 * @param {string|string[]} exportNames Export name or ordered fallbacks
 * @returns {*} The resolved export, or undefined when none exists
 */
export function pickModuleExport(mod, exportNames) {
  if (!mod || (typeof mod !== "object" && typeof mod !== "function")) return undefined;
  const names = Array.isArray(exportNames) ? exportNames : [exportNames];
  for (const name of names) {
    if (typeof name !== "string" || !name) continue;
    const value = mod[name];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

/**
 * Creates a memoized loader around a dynamic import. The returned function
 * resolves to `{ default: Export }`, the shape React.lazy expects.
 * A failed load is NOT cached, so a later call can retry (flaky network,
 * redeploy with new chunk hashes).
 *
 * @param {() => Promise<object>} importer Function returning `import("...")`
 * @param {string|string[]} [exportNames="default"] Named export(s) to expose as default
 * @returns {(() => Promise<{default: *}>) & { isLoaded: () => boolean }}
 */
export function createModuleLoader(importer, exportNames = "default") {
  if (typeof importer !== "function") {
    throw new TypeError("importer must be a function returning a Promise");
  }
  const names = Array.isArray(exportNames) ? exportNames : [exportNames];
  if (names.length === 0 || names.some((n) => typeof n !== "string" || !n.trim())) {
    throw new TypeError("exportNames must be a non-empty string or array of non-empty strings");
  }

  let pending = null;
  let loaded = false;

  const load = () => {
    if (!pending) {
      pending = Promise.resolve()
        .then(() => importer())
        .then((mod) => {
          const resolved = pickModuleExport(mod, names);
          if (resolved === undefined) {
            throw new Error(`Export "${names.join(" | ")}" not found in lazily loaded module`);
          }
          loaded = true;
          return { default: resolved };
        })
        .catch((err) => {
          pending = null;
          throw err;
        });
    }
    return pending;
  };

  load.isLoaded = () => loaded;
  return load;
}

/**
 * Preloads the loader registered for `key`. Never rejects: preloading is a
 * best-effort optimisation and must not surface errors to the UI.
 * @param {Record<string, Function>} registry Map of key -> loader
 * @param {string} key Registry key (e.g. a tab id)
 * @returns {Promise<boolean>} true when a loader ran and succeeded
 */
export function preloadFromRegistry(registry, key) {
  if (!registry || typeof registry !== "object" || typeof key !== "string") {
    return Promise.resolve(false);
  }
  const loader = Object.prototype.hasOwnProperty.call(registry, key) ? registry[key] : null;
  if (typeof loader !== "function") return Promise.resolve(false);
  try {
    return Promise.resolve(loader()).then(
      () => true,
      () => false
    );
  } catch {
    return Promise.resolve(false);
  }
}

/**
 * Runs `task` when the browser is idle (requestIdleCallback) or after a
 * timeout fallback. Returns a cancel function.
 * @param {Function} task Work to run once
 * @param {{ timeout?: number, scope?: object }} [options]
 * @returns {() => void} cancel
 */
export function scheduleIdleTask(task, { timeout = 2000, scope = globalThis } = {}) {
  if (typeof task !== "function") {
    throw new TypeError("task must be a function");
  }
  const safeTimeout = Number.isFinite(timeout) && timeout >= 0 ? timeout : 2000;
  const host = scope || {};

  if (typeof host.requestIdleCallback === "function") {
    const handle = host.requestIdleCallback(() => task(), { timeout: safeTimeout });
    return () => {
      if (typeof host.cancelIdleCallback === "function") host.cancelIdleCallback(handle);
    };
  }

  if (typeof host.setTimeout === "function") {
    const handle = host.setTimeout(() => task(), Math.min(safeTimeout, 1500));
    return () => {
      if (typeof host.clearTimeout === "function") host.clearTimeout(handle);
    };
  }

  task();
  return () => {};
}

const CHUNK_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i,
  /loading (css )?chunk [\w-]+ failed/i,
  /unable to preload css/i,
];

/**
 * Detects errors caused by a code-split chunk failing to download
 * (offline, or the app was redeployed and old chunk hashes are gone).
 * @param {*} error
 * @returns {boolean}
 */
export function isChunkLoadError(error) {
  if (!error) return false;
  if (typeof error === "object" && (error.name === "ChunkLoadError" || error.code === "CSS_CHUNK_LOAD_FAILED")) {
    return true;
  }
  const message = typeof error === "string" ? error : error?.message;
  if (typeof message !== "string" || !message) return false;
  return CHUNK_ERROR_PATTERNS.some((re) => re.test(message));
}

/**
 * Latch used by deferred-mount components: once something has been opened
 * it stays mounted (keeps internal state, avoids re-downloading/re-mounting).
 * @param {boolean} wasOpened Previous latch state
 * @param {*} isOpen Current open flag
 * @returns {boolean}
 */
export function latchOpened(wasOpened, isOpen) {
  return Boolean(wasOpened) || Boolean(isOpen);
}
