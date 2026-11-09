"use client";
import { useEffect } from "react";

const mark = (image: HTMLImageElement) => {
  image.dataset.broken = "";
};

const unmark = (image: HTMLImageElement) => {
  delete image.dataset.broken;
};

/**
 * Marks images that fail to load with `data-broken`, which globals.css hides, so the browser's
 * broken-image icon never shows (even with alt="", Chrome draws one for a sized image). Marked
 * after hydration, since an attribute the server didn't render would be a hydration mismatch.
 */
function BrokenImageGuard() {
  useEffect(() => {
    const onError = (event: Event) => {
      if (event.target instanceof HTMLImageElement) {
        mark(event.target);
      }
    };
    // A later load (back online, or another srcset candidate after a resize) shows it again.
    const onLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement) {
        unmark(event.target);
      }
    };
    // Image errors and loads don't bubble, so listen in the capture phase.
    document.addEventListener("error", onError, true);
    document.addEventListener("load", onLoad, true);
    for (const image of document.images) {
      if (image.complete && image.naturalWidth === 0 && image.currentSrc !== "") {
        mark(image);
      }
    }
    return () => {
      document.removeEventListener("error", onError, true);
      document.removeEventListener("load", onLoad, true);
    };
  }, []);

  return null;
}

export default BrokenImageGuard;
