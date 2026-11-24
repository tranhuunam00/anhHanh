import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildPdfWorkerSrc, configurePdfWorker, createPdfjsLoader, loadPdfjs } from "../src/utils/pdfjsLoader.js";

const makeLib = (overrides = {}) => ({
  version: "6.4.299",
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: () => ({}),
  ...overrides,
});

describe("buildPdfWorkerSrc", () => {
  test("builds versioned worker URL", () => {
    assert.equal(buildPdfWorkerSrc("6.4.299"), "https://unpkg.com/pdfjs-dist@6.4.299/build/pdf.worker.min.mjs");
  });

  test("trims version whitespace", () => {
    assert.equal(buildPdfWorkerSrc(" 1.0.0 "), "https://unpkg.com/pdfjs-dist@1.0.0/build/pdf.worker.min.mjs");
  });

  test("throws TypeError for empty or non-string version", () => {
    assert.throws(() => buildPdfWorkerSrc(""), TypeError);
    assert.throws(() => buildPdfWorkerSrc("  "), TypeError);
    assert.throws(() => buildPdfWorkerSrc(undefined), TypeError);
    assert.throws(() => buildPdfWorkerSrc(6), TypeError);
  });
});

describe("configurePdfWorker", () => {
  test("sets worker src when unset and returns same module", () => {
    const lib = makeLib();
    const out = configurePdfWorker(lib);
    assert.equal(out, lib);
    assert.match(lib.GlobalWorkerOptions.workerSrc, /pdfjs-dist@6\.4\.299\/build\/pdf\.worker\.min\.mjs$/);
  });

  test("does not override an existing worker src", () => {
    const lib = makeLib({ GlobalWorkerOptions: { workerSrc: "/custom-worker.js" } });
    configurePdfWorker(lib);
    assert.equal(lib.GlobalWorkerOptions.workerSrc, "/custom-worker.js");
  });

  test("throws TypeError for invalid module", () => {
    assert.throws(() => configurePdfWorker(null), TypeError);
    assert.throws(() => configurePdfWorker({}), TypeError);
    assert.throws(() => configurePdfWorker("pdfjs"), TypeError);
  });

  test("propagates version error when module has no version", () => {
    assert.throws(() => configurePdfWorker(makeLib({ version: undefined })), TypeError);
  });
});

describe("createPdfjsLoader", () => {
  test("loads, configures and memoizes the module", async () => {
    let calls = 0;
    const lib = makeLib();
    const load = createPdfjsLoader(async () => {
      calls += 1;
      return lib;
    });
    const [a, b] = await Promise.all([load(), load()]);
    assert.equal(a, lib);
    assert.equal(b, lib);
    assert.equal(calls, 1);
    assert.ok(lib.GlobalWorkerOptions.workerSrc);
  });

  test("unwraps a default-export shaped module", async () => {
    const lib = makeLib();
    const load = createPdfjsLoader(async () => ({ default: lib }));
    assert.equal(await load(), lib);
  });

  test("retries after a failed import", async () => {
    let attempt = 0;
    const lib = makeLib();
    const load = createPdfjsLoader(async () => {
      attempt += 1;
      if (attempt === 1) throw new Error("network");
      return lib;
    });
    await assert.rejects(load(), /network/);
    assert.equal(await load(), lib);
  });

  test("rejects when imported module is invalid", async () => {
    const load = createPdfjsLoader(async () => ({ nothing: true }));
    await assert.rejects(load(), TypeError);
  });

  test("throws TypeError for non-function importer", () => {
    assert.throws(() => createPdfjsLoader(null), TypeError);
    assert.throws(() => createPdfjsLoader({}), TypeError);
  });

  test("shared loadPdfjs is a function (not invoked: avoids loading pdfjs in tests)", () => {
    assert.equal(typeof loadPdfjs, "function");
  });
});
