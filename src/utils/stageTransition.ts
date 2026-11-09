import { addTransitionType, startTransition } from "react";

/** Transition type that animates the game screens (intro → game → results); see globals.css. */
export const STAGE_TRANSITION = "game-stage";

/**
 * Runs a store update that changes the game screen as an animated view transition. Page
 * navigations don't carry this type, so they keep switching instantly.
 */
export function changeStage(update: () => void): void {
  startTransition(() => {
    addTransitionType(STAGE_TRANSITION);
    update();
  });
}
