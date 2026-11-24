import React, { Suspense, useState } from "react";
import { latchOpened } from "../../utils/lazyModule";

/**
 * Mounts lazily-loaded children only after `when` first becomes true, then
 * keeps them mounted so internal state survives close/re-open.
 * Used for modals that are closed on first paint.
 */
export function DeferredMount({ when, children, fallback = null }) {
  const [hasOpened, setHasOpened] = useState(() => latchOpened(false, when));
  const shouldMount = latchOpened(hasOpened, when);

  // Render-phase update of own state is allowed by React and avoids an extra commit.
  if (shouldMount !== hasOpened) setHasOpened(shouldMount);

  if (!shouldMount) return null;
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
