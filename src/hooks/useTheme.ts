"use client";
import { useSyncExternalStore } from "react";
import { isTheme, THEME_STORAGE_KEY, type Theme } from "@/utils/theme";

/*
 * The `data-theme` attribute on <html> is the single source of truth. It is set before
 * first paint by `themeBootScript`, and this store reads, writes and watches it.
 */

const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function hasSavedTheme(): boolean {
  try {
    return isTheme(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return false;
  }
}

function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or storage disabled: the theme still applies for this page view.
  }
}

let watchingThemeSources = false;

/**
 * Follows the system setting (until the player picks a theme) and other tabs' choices. Stays
 * attached for the page's lifetime, so screens without a theme switch (a game) keep up too.
 */
function watchThemeSources() {
  if (watchingThemeSources) {
    return;
  }
  watchingThemeSources = true;
  window.matchMedia(SYSTEM_DARK_QUERY).addEventListener("change", (event) => {
    if (!hasSavedTheme()) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });
  window.addEventListener("storage", (event) => {
    if (event.key === THEME_STORAGE_KEY && isTheme(event.newValue)) {
      applyTheme(event.newValue);
    }
  });
}

function subscribe(onChange: () => void) {
  watchThemeSources();
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/** The prerendered HTML has no theme yet; the real value is read right after hydration. */
function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);
  return {
    theme,
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
}
