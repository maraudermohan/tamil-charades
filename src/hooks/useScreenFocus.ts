import { useEffect, type RefObject } from "react";

/**
 * Focuses a game screen when it replaces the screen that held focus (Play, End Game), so
 * keyboard and screen-reader users carry on from the new screen instead of the top of the page.
 * The element needs `tabIndex={-1}`.
 */
export function useScreenFocus(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const active = document.activeElement;
    if (active == null || active === document.body) {
      ref.current?.focus({ preventScroll: true });
    }
  }, [ref]);
}
