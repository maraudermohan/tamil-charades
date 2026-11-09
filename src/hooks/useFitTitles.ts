import { type RefObject, useLayoutEffect } from "react";

/**
 * Page zoom (Safari's aA menu, Chrome's zoom setting) narrows the page but not the screen. Below
 * this screen-to-page width ratio the page is at its normal size and the titles are left alone.
 */
const ZOOMED_RATIO = 1.05;
/** The smallest the titles shrink to; past this they wrap as they would unfitted. */
const MIN_SCALE = 0.5;
const FIT_STEPS = 6;

function isPageZoomed(): boolean {
  const { width, height } = window.screen;
  // iOS reports the portrait size in both orientations.
  const landscape = window.matchMedia("(orientation: landscape)").matches;
  const screenWidth = landscape ? Math.max(width, height) : Math.min(width, height);
  return screenWidth / document.documentElement.clientWidth > ZOOMED_RATIO;
}

const intersects = (a: DOMRect, b: DOMRect) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

/** Text outside the card's border, titles overlapping, or a word wider than its line. */
function overflows(card: HTMLElement, parts: HTMLElement[]): boolean {
  const box = card.getBoundingClientRect();
  const top = box.top + card.clientTop - 0.5;
  const left = box.left + card.clientLeft - 0.5;
  const bottom = top + card.clientHeight + 1;
  const right = left + card.clientWidth + 1;
  const rects = parts.map((part) => part.getBoundingClientRect());
  return rects.some(
    (rect, index) =>
      rect.top < top ||
      rect.left < left ||
      rect.bottom > bottom ||
      rect.right > right ||
      parts[index].scrollWidth > parts[index].clientWidth + 1 ||
      rects.slice(index + 1).some((other) => intersects(rect, other)),
  );
}

function fitTitles(card: HTMLElement) {
  const parts = Array.from(card.querySelectorAll<HTMLElement>("h3, h4"));
  for (const part of parts) {
    part.style.fontSize = "";
    part.style.lineHeight = "";
  }
  if (parts.length === 0 || !isPageZoomed()) {
    return;
  }
  // Measured without mid-word breaks, so a word that only fits broken counts as overflowing.
  card.style.overflowWrap = "normal";
  const base = parts.map((part) => {
    const style = getComputedStyle(part);
    return { size: parseFloat(style.fontSize), line: parseFloat(style.lineHeight) };
  });
  const scaleTo = (scale: number) => {
    parts.forEach((part, index) => {
      part.style.fontSize = `${base[index].size * scale}px`;
      // NaN for `line-height: normal`, which scales with the font by itself.
      if (!Number.isNaN(base[index].line)) {
        part.style.lineHeight = `${base[index].line * scale}px`;
      }
    });
  };
  if (overflows(card, parts)) {
    let fits = MIN_SCALE;
    let tooBig = 1;
    for (let step = 0; step < FIT_STEPS; step++) {
      const scale = (fits + tooBig) / 2;
      scaleTo(scale);
      if (overflows(card, parts)) {
        tooBig = scale;
      } else {
        fits = scale;
      }
    }
    scaleTo(fits);
  }
  card.style.overflowWrap = "";
}

/**
 * Zoomed in, shrinks a title card's text (its h3 and h4) just enough to fit the card when it
 * would overflow it; at the normal zoom the CSS sizes stay as they are. Refits when `text` or the
 * card's size changes, and when a font finishes loading.
 */
export function useFitTitles(cardRef: RefObject<HTMLElement | null>, text: string) {
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (card == null) {
      return;
    }
    const fit = () => fitTitles(card);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(card);
    document.fonts.addEventListener("loadingdone", fit);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", fit);
    };
  }, [cardRef, text]);
}
