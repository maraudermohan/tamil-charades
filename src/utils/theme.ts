export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/**
 * Inlined into <head> so `data-theme` is set before first paint (no flash of the wrong
 * theme). A saved choice wins; otherwise it follows the system setting.
 */
export const themeBootScript = `(function () {
  var root = document.documentElement;
  var saved = null;
  try {
    saved = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  } catch (e) {}
  root.dataset.theme =
    saved === "light" || saved === "dark"
      ? saved
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
})();`;
