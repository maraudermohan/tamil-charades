/**
 * Titles shown in this tab are remembered in sessionStorage (keyed by the English title)
 * so replaying a mode in the same session does not repeat them.
 */

/** Keeps title keys apart from the app's other sessionStorage keys (e.g. `roundsCount`). */
const KEY_PREFIX = "seen:";

export function hasSeenTitle(english: string): boolean {
  try {
    return sessionStorage.getItem(KEY_PREFIX + english) != null;
  } catch {
    return false;
  }
}

export function markTitleSeen(english: string): void {
  try {
    sessionStorage.setItem(KEY_PREFIX + english, "true");
  } catch {
    // Storage unavailable (private mode quota, disabled storage): repeats are acceptable.
  }
}
