/**
 * Lazy loader for pdfjs-dist (~800 KB). Keeps PDF parsing out of the initial
 * bundle: the library is only downloaded the first time a PDF is processed.
 */

/**
 * @param {string} version pdfjs-dist version
 * @returns {string} CDN URL of the matching worker script
 */
export function buildPdfWorkerSrc(version) {
  if (typeof version !== "string" || !version.trim()) {
    throw new TypeError("pdfjs version must be a non-empty string");
  }
  return `https://unpkg.com/pdfjs-dist@${version.trim()}/build/pdf.worker.min.mjs`;
}

/**
 * Sets the worker URL on a pdfjs module if none is configured yet.
 * @param {object} lib pdfjs module namespace
 * @returns {object} the same module
 */
export function configurePdfWorker(lib) {
  if (!lib || typeof lib !== "object" || !lib.GlobalWorkerOptions) {
    throw new TypeError("Invalid pdfjs module: GlobalWorkerOptions missing");
  }
  if (!lib.GlobalWorkerOptions.workerSrc) {
    lib.GlobalWorkerOptions.workerSrc = buildPdfWorkerSrc(lib.version);
  }
  return lib;
}

/**
 * Creates a memoized pdfjs loader. Failed loads are retried on next call.
 * @param {() => Promise<object>} importer
 * @returns {() => Promise<object>}
 */
export function createPdfjsLoader(importer) {
  if (typeof importer !== "function") {
    throw new TypeError("importer must be a function returning a Promise");
  }
  let pending = null;
  return () => {
    if (!pending) {
      pending = Promise.resolve()
        .then(() => importer())
        .then((mod) => configurePdfWorker(mod && mod.GlobalWorkerOptions ? mod : mod?.default))
        .catch((err) => {
          pending = null;
          throw err;
        });
    }
    return pending;
  };
}

/** Shared app-wide loader. */
export const loadPdfjs = createPdfjsLoader(() => import("pdfjs-dist"));
