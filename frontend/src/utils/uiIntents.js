/**
 * "Sticky" UI intents: lets one part of the app ask a lazily-mounted
 * component to do something (e.g. open a modal) even if that component has
 * not mounted yet. The component consumes the intent when it mounts.
 */

const DEFAULT_TTL_MS = 10000;

/**
 * Creates an isolated intent store (exported for tests).
 * @returns {{ queue: Function, consume: Function, clear: Function, size: Function }}
 */
export function createUiIntentStore() {
  const pending = new Map();

  const validateName = (name) => {
    if (typeof name !== "string" || !name.trim()) {
      throw new TypeError("intent name must be a non-empty string");
    }
    return name.trim();
  };

  return {
    /**
     * @param {string} name
     * @param {{ ttlMs?: number, now?: number }} [options]
     */
    queue(name, { ttlMs = DEFAULT_TTL_MS, now = Date.now() } = {}) {
      const key = validateName(name);
      const ttl = Number.isFinite(ttlMs) && ttlMs > 0 ? ttlMs : DEFAULT_TTL_MS;
      pending.set(key, now + ttl);
    },
    /**
     * @param {string} name
     * @param {{ now?: number }} [options]
     * @returns {boolean} true when a non-expired intent was pending
     */
    consume(name, { now = Date.now() } = {}) {
      const key = validateName(name);
      if (!pending.has(key)) return false;
      const expiresAt = pending.get(key);
      pending.delete(key);
      return now <= expiresAt;
    },
    clear() {
      pending.clear();
    },
    size() {
      return pending.size;
    },
  };
}

const sharedStore = createUiIntentStore();

export const queueUiIntent = (name, options) => sharedStore.queue(name, options);
export const consumeUiIntent = (name, options) => sharedStore.consume(name, options);
export const clearUiIntents = () => sharedStore.clear();

export const UI_INTENTS = Object.freeze({
  OPEN_EXERCISE_HUB: "open-exercise-hub-modal",
});
