"use client";
import { useEffect, useRef, type RefObject } from "react";

/** Open modal dialogs; the page stays scroll-locked until the last one closes, in any order. */
let openCount = 0;
let overflowBeforeLock = "";

/**
 * Shows the dialog as a modal on mount: the page underneath is inert and scroll-locked, and
 * focus returns to the opener on unmount.
 */
export function useModalDialog(dialogRef: RefObject<HTMLDialogElement | null>) {
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog == null) {
      return;
    }
    const root = document.documentElement;
    if (openCount === 0) {
      overflowBeforeLock = root.style.overflow;
      root.style.overflow = "hidden";
    }
    openCount += 1;
    // Strict Mode re-runs this with focus already inside the open dialog; keep the real opener.
    if (!dialog.open) {
      openerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    }
    return () => {
      openCount -= 1;
      if (openCount === 0) {
        root.style.overflow = overflowBeforeLock;
      }
      openerRef.current?.focus();
    };
  }, [dialogRef]);
}
