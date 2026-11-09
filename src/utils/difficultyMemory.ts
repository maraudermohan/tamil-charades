import { DEFAULT_DIFFICULTY, type DifficultyLevel, type GameSlug } from "@/constant/gameModes";

/**
 * The difficulty last played in each mode, kept in localStorage so the mode's picker starts
 * there next time.
 */
const KEY_PREFIX = "difficulty:";

export function getRememberedDifficulty(slug: GameSlug): DifficultyLevel {
  try {
    const stored = Number(localStorage.getItem(KEY_PREFIX + slug));
    return stored === 1 || stored === 2 || stored === 3 ? stored : DEFAULT_DIFFICULTY;
  } catch {
    return DEFAULT_DIFFICULTY;
  }
}

export function rememberDifficulty(slug: GameSlug, difficulty: DifficultyLevel): void {
  try {
    localStorage.setItem(KEY_PREFIX + slug, String(difficulty));
  } catch {
    // Storage unavailable: the picker starts at the default instead.
  }
}
