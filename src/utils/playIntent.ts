import type { DifficultyLevel, GameSlug } from "@/constant/gameModes";

export type PlayIntent = {
  slug: GameSlug;
  difficulty: DifficultyLevel;
};

/**
 * Set when Play is pressed in the homepage's mode dialog, so the game page can skip its details
 * sheet and go straight to the countdown at the chosen difficulty. Module state, so it only
 * survives client-side navigation: a direct visit or a reload never sees it.
 */
let pending: PlayIntent | null = null;

export function markPlayIntent(intent: PlayIntent): void {
  pending = intent;
}

export function getPlayIntent(slug: GameSlug): PlayIntent | null {
  return pending?.slug === slug ? pending : null;
}

export function clearPlayIntent(): void {
  pending = null;
}
