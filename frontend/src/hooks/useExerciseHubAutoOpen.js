import { useEffect, useRef } from "react";
import { consumeUiIntent, UI_INTENTS } from "../utils/uiIntents.js";
import { loadFlipSession, shouldAutoOpenExerciseHub } from "../utils/vocabFlipSessionStore.js";

/**
 * Opens the vocab practice hub when asked from elsewhere (daily reminder, header),
 * via the ?openExercise=true link, or after a reload interrupted a flip-card session.
 */
export function useExerciseHubAutoOpen(onOpen, userId) {
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    const handleOpenHub = () => {
      consumeUiIntent(UI_INTENTS.OPEN_EXERCISE_HUB);
      onOpenRef.current();
    };
    window.addEventListener(UI_INTENTS.OPEN_EXERCISE_HUB, handleOpenHub);

    // Intent queued before this lazily-loaded tab mounted (e.g. daily reminder click)
    const shouldOpen = shouldAutoOpenExerciseHub({
      queuedIntent: consumeUiIntent(UI_INTENTS.OPEN_EXERCISE_HUB),
      search: window.location.search,
      hasResumableSession: Boolean(loadFlipSession(userId)),
    });
    if (shouldOpen) onOpenRef.current();

    return () => {
      window.removeEventListener(UI_INTENTS.OPEN_EXERCISE_HUB, handleOpenHub);
    };
    // Mount-only, like the original effect: a later user change must not reopen the hub.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
