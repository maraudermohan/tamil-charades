"use client";
import { useSyncExternalStore } from "react";

/** Language of the mode's rules (details cards and the instruction card). */
export type RulesLanguage = "en" | "ta";

const STORAGE_KEY = "rulesLanguage";

const listeners = new Set<() => void>();
/** Read from storage on first use; kept here so it still works when storage is unavailable. */
let current: RulesLanguage | null = null;

function parse(value: string | null): RulesLanguage {
  return value === "ta" ? "ta" : "en";
}

function getSnapshot(): RulesLanguage {
  if (current == null) {
    try {
      current = parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      current = "en";
    }
  }
  return current;
}

function getServerSnapshot(): RulesLanguage {
  return "en";
}

export function setRulesLanguage(language: RulesLanguage) {
  current = language;
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Private mode or storage disabled: the choice still holds for this page view.
  }
  listeners.forEach((listener) => listener());
}

let watchingOtherTabs = false;

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  // Stays attached for the page's lifetime so `current` never goes stale between dialogs.
  if (!watchingOtherTabs) {
    watchingOtherTabs = true;
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) {
        current = parse(event.newValue);
        listeners.forEach((listener) => listener());
      }
    });
  }

  return () => {
    listeners.delete(onChange);
  };
}

export function useRulesLanguage() {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    language,
    toggleLanguage: () => setRulesLanguage(language === "ta" ? "en" : "ta"),
  };
}
