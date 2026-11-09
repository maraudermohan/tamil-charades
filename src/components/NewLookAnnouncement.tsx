"use client";
import { useEffect, useState, type ComponentType } from "react";

const loadDialog = () => import("@/components/NewLookDialog");

type DialogComponent = ComponentType<{ onClose: () => void }>;

const STORAGE_KEY = "seenAnnouncement";
/** Change this to show a new announcement to everyone once. */
const ANNOUNCEMENT_ID = "new-look-2026-11";
/** Lets the homepage paint and settle before the dialog covers it. */
const SHOW_AFTER_MS = 1200;

/**
 * Shows the redesign announcement once per browser. It's marked as seen when it opens, so a
 * reload doesn't bring it back; it isn't shown at all when storage is unavailable or the
 * dialog's code fails to load.
 */
function NewLookAnnouncement() {
  const [Dialog, setDialog] = useState<DialogComponent | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === ANNOUNCEMENT_ID) {
        return;
      }
    } catch {
      return;
    }
    let cancelled = false;
    const show = ({ default: LoadedDialog }: { default: DialogComponent }) => {
      // A mode's dialog can already be open (reopened from history); try again next visit.
      if (cancelled || document.querySelector("dialog[open]") != null) {
        return;
      }
      try {
        localStorage.setItem(STORAGE_KEY, ANNOUNCEMENT_ID);
      } catch {
        return;
      }
      // Rendered directly rather than through lazy(), whose Suspense retry would open it a few
      // hundred ms after the check above, on top of a mode dialog opened in between.
      setDialog(() => LoadedDialog);
    };
    // Loaded before opening, so a failed chunk skips the announcement instead of throwing.
    const timerId = setTimeout(() => loadDialog().then(show, () => {}), SHOW_AFTER_MS);
    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, []);

  return Dialog != null && <Dialog onClose={() => setDialog(null)} />;
}

export default NewLookAnnouncement;
