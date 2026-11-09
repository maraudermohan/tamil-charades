/** Marks the history entry a game adds on its own URL, so Back asks before leaving. */
export const BACK_GUARD_KEY = "gameInProgress";

/** The current history entry's game token, if it's one of those entries. */
export function historyGuardToken(): unknown {
  return (window.history.state as Record<string, unknown> | null)?.[BACK_GUARD_KEY];
}
