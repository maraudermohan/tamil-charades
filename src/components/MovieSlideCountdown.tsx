"use client";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { anek, rubik } from "@/app/fonts";
import type { RulesLanguage } from "@/hooks/useRulesLanguage";
import { useScreenFocus } from "@/hooks/useScreenFocus";
import styles from "./MovieSlideCountdown.module.css";

/** The instruction card shows on its own this long before the countdown starts. */
const INSTRUCTION_MS = 2000;
const COUNTDOWN_START = 3;
const COUNTDOWN_STEP_MS = 1000;

type MovieSlideCountdownProps = {
  /** The mode's rule, shown on the instruction card. */
  instruction: string;
  language: RulesLanguage;
  /** Called once, one step after "1" appears. */
  onComplete: () => void;
};

/** Pre-game screen: the instruction card on its own, then 3… 2… 1… under it. */
function MovieSlideCountdown({ instruction, language, onComplete }: MovieSlideCountdownProps) {
  /** `null` while only the instruction card shows. */
  const [count, setCount] = useState<number | null>(null);
  const complete = useEffectEvent(onComplete);
  const boxRef = useRef<HTMLDivElement>(null);

  useScreenFocus(boxRef);

  // Loaded during the countdown so the game screen is ready when it ends, and the results
  // screen too, so a connection that drops mid-game can still show the score.
  useEffect(() => {
    import("@/components/MovieSlide").catch(() => {});
    import("@/components/ResultsSlide").catch(() => {});
  }, []);

  useEffect(() => {
    const stepId = setTimeout(
      () => {
        if (count == null) {
          setCount(COUNTDOWN_START);
        } else if (count > 1) {
          setCount(count - 1);
        } else {
          complete();
        }
      },
      count == null ? INSTRUCTION_MS : COUNTDOWN_STEP_MS,
    );
    return () => clearTimeout(stepId);
  }, [count]);

  return (
    <div ref={boxRef} tabIndex={-1} className={`${styles.countdownBox} ${rubik.className}`}>
      <p
        lang={language}
        className={
          language === "ta"
            ? `${styles.instructionCard} ${styles.tamil} ${anek.className}`
            : styles.instructionCard
        }
      >
        {instruction}
      </p>
      <div className={styles.stage} role="timer" aria-live="assertive" aria-atomic="true">
        {/* Keyed so each number remounts and replays the zoom in step with the timer. */}
        {count != null && (
          <span key={count} className={styles.count}>
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

export default MovieSlideCountdown;
