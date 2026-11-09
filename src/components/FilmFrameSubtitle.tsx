"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import HowToPlayDialog from "@/components/HowToPlayDialog";
import styles from "./FilmFrameSubtitle.module.css";

const PHRASES = ["How to play Charades?", "Vanakkam, movie lovers!"] as const;
/** How long each phrase stays up, by index in PHRASES. */
const HOLD_MS = [6000, 3500];
/** The subtitle is the LCP element, so it paints as plain text and the first swap waits. */
const FIRST_SWAP_MS = 4000;
/** Keep in sync with the advance animation in FilmFrameSubtitle.module.css. */
const ADVANCE_MS = 520;

/**
 * Swaps the first phrase with a greeting like a projector pulling the next frame of film through
 * the gate, with a short flicker. Screen readers only get the first phrase. The whole subtitle,
 * info icon included, opens the game's instructions.
 */
function FilmFrameSubtitle({ className, style }: { className: string; style: CSSProperties }) {
  const [phrase, setPhrase] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const [showingRules, setShowingRules] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let index = 0;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let pendingStep: () => void;

    const later = (step: () => void, ms: number) => {
      pendingStep = step;
      timerId = setTimeout(step, ms);
    };

    const advance = () => {
      index = (index + 1) % PHRASES.length;
      setPhrase(index);
      setAdvancing(true);
      later(settle, ADVANCE_MS);
    };

    const settle = () => {
      setAdvancing(false);
      later(advance, HOLD_MS[index]);
    };

    // Paused while hidden. An advance cut off midway finishes right away.
    const onVisibilityChange = () => {
      clearTimeout(timerId);
      if (!document.hidden) {
        later(pendingStep, pendingStep === advance ? HOLD_MS[index] : 0);
      }
    };

    later(advance, FIRST_SWAP_MS);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearTimeout(timerId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const previous = (phrase + PHRASES.length - 1) % PHRASES.length;

  return (
    <>
      <button
        type="button"
        className={`${className} ${styles.trigger}`}
        style={style}
        aria-haspopup="dialog"
        onClick={() => setShowingRules(true)}
      >
        <span className="visually-hidden">{PHRASES[0]}</span>
        <span className={styles.label} aria-hidden>
          <span className={styles.text}>
            {PHRASES.map((text) => (
              <span key={text} className={styles.sizer}>
                {text}
              </span>
            ))}
            {advancing ? (
              <span className={styles.gate}>
                <span className={styles.strip}>
                  <span className={styles.frame}>{PHRASES[previous]}</span>
                  <span className={`${styles.frame} ${styles.next}`}>{PHRASES[phrase]}</span>
                </span>
              </span>
            ) : (
              <span>{PHRASES[phrase]}</span>
            )}
          </span>
          <IoInformationCircleOutline className={styles.infoIcon} />
        </span>
      </button>
      {showingRules && <HowToPlayDialog onClose={() => setShowingRules(false)} />}
    </>
  );
}

export default FilmFrameSubtitle;
