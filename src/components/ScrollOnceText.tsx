"use client";
import { useEffect, useRef } from "react";
import styles from "./ScrollOnceText.module.css";

/** How long it holds still at each end, so both can be read. */
const HOLD_MS = 1200;
/** Slow enough to read along. */
const SCROLL_PX_PER_SECOND = 40;

/**
 * A line of text cut with an ellipsis when it doesn't fit. The first time it's fully on screen,
 * a cut line scrolls to its end and back once, like an LED sign, then stays put. It doesn't
 * move with reduced motion.
 */
function ScrollOnceText({ text }: { text: string }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const line = textRef.current;
    if (box == null || line == null || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let animation: Animation | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }
        observer.disconnect();
        const distance = box.scrollWidth - box.clientWidth;
        if (distance <= 1) {
          return;
        }
        const scrollMs = (distance / SCROLL_PX_PER_SECOND) * 1000;
        const returnMs = scrollMs / 2;
        const total = HOLD_MS + scrollMs + HOLD_MS + returnMs;
        const end = `translateX(${-distance}px)`;
        box.classList.add(styles.scrolling);
        animation = line.animate(
          [
            { transform: "none", offset: 0 },
            { transform: "none", offset: HOLD_MS / total, easing: "ease-in-out" },
            { transform: end, offset: (HOLD_MS + scrollMs) / total },
            { transform: end, offset: (HOLD_MS + scrollMs + HOLD_MS) / total, easing: "ease-in-out" },
            { transform: "none", offset: 1 },
          ],
          { duration: total },
        );
        animation.finished.then(
          () => box.classList.remove(styles.scrolling),
          () => {},
        );
      },
      { threshold: 1 },
    );
    observer.observe(box);
    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, [text]);

  return (
    <span ref={boxRef} className={styles.box}>
      <span ref={textRef}>{text}</span>
    </span>
  );
}

export default ScrollOnceText;
