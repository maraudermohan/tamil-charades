"use client";
import { useEffect, useEffectEvent, useRef, useState } from "react";

/** Pause between rounds where the timer is blank, so the reset is visible. */
const ROUND_GAP_MS = 250;
const TICK_MS = 1000;

type RoundTimerOptions = {
  /** Changing this starts a new round at `timeLimit`. */
  round: number;
  timeLimit: number;
  /** Freezes the countdown; it continues from the same second once `false` again. */
  paused: boolean;
  onTimeUp: () => void;
};

/**
 * Per-title countdown. Returns the seconds left, or `null` during the blank gap before a round
 * starts. The first round starts immediately.
 */
export function useRoundTimer({ round, timeLimit, paused, onTimeUp }: RoundTimerOptions) {
  const [timer, setTimer] = useState({ round, secondsLeft: timeLimit });
  const started = timer.round === round;
  const timedOut = started && timer.secondsLeft === 0;
  const timeUp = useEffectEvent(onTimeUp);
  /** How far into the current second a pause stopped, so resuming doesn't restart that second. */
  const elapsedInSecondRef = useRef(0);

  useEffect(() => {
    if (paused || timedOut) {
      return;
    }
    if (!started) {
      elapsedInSecondRef.current = 0;
      const gapId = setTimeout(() => setTimer({ round, secondsLeft: timeLimit }), ROUND_GAP_MS);
      return () => clearTimeout(gapId);
    }
    let secondStartedAt = Date.now() - elapsedInSecondRef.current;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      secondStartedAt = Date.now();
      setTimer((current) =>
        current.round === round && current.secondsLeft > 0
          ? { round, secondsLeft: current.secondsLeft - 1 }
          : current,
      );
    };
    const firstTickId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, TICK_MS);
    }, TICK_MS - elapsedInSecondRef.current);
    return () => {
      clearTimeout(firstTickId);
      clearInterval(intervalId);
      elapsedInSecondRef.current = Math.min(TICK_MS, Date.now() - secondStartedAt);
    };
  }, [round, timeLimit, paused, started, timedOut]);

  useEffect(() => {
    if (timedOut) {
      timeUp();
    }
  }, [timedOut]);

  return started ? timer.secondsLeft : null;
}
