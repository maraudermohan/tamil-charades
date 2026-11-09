"use client";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { FaFlagCheckered } from "react-icons/fa";
import { ImCheckmark, ImCross } from "react-icons/im";
import { LuTimer } from "react-icons/lu";
import { poppins } from "@/app/fonts";
import ConfirmDialog from "@/components/ConfirmDialog";
import TitleSlide from "@/components/TitleSlide";
import { TrackEvents } from "@/constant/metricsData";
import {
  getMetricsContext,
  getPlayTimeMs,
  isOnLastTitle,
  useGameStore,
} from "@/hooks/useGameStore";
import { useRoundTimer } from "@/hooks/useRoundTimer";
import { useScreenFocus } from "@/hooks/useScreenFocus";
import { BACK_GUARD_KEY, historyGuardToken } from "@/utils/gameHistory";
import { changeStage } from "@/utils/stageTransition";
import { track } from "@/utils/trackMetrics";
import styles from "./MovieSlide.module.css";

/** Slide-out animation length before the next title is committed. */
const ANSWER_DELAY_MS = 300;
/** Controls stay hidden while the next title slides in. */
const CONTROLS_DELAY_MS = 1000;

/** The timer turns red and blinks at this many seconds or fewer. */
const URGENT_SECONDS = 10;

/** Back from a tab's first page goes nowhere, so leaving falls back to the homepage after this. */
const BACK_FALLBACK_MS = 500;

function formatMmSs(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

interface PendingAnswer {
  index: number;
  correct: boolean;
}

function MovieSlide() {
  const { state, actions } = useGameStore();
  const router = useRouter();
  const currentIndex = state.currentIndex ?? 0;
  const boxRef = useRef<HTMLDivElement>(null);
  const answerTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const backFallbackRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /** Set once the game is ending or being left, so nothing re-adds the history entry. */
  const leavingRef = useRef(false);
  const guardTokenRef = useRef<string | null>(null);
  /** Whether the entry this game added is the current one. */
  const onGuardEntryRef = useRef(false);
  /** The exit dialog is up because Back already left that entry. */
  const exitByBackRef = useRef(false);
  const [pendingAnswer, setPendingAnswer] = useState<PendingAnswer | null>(null);
  const [controlsReadyIndex, setControlsReadyIndex] = useState(currentIndex);

  // An answer only animates until the store moves on to the next title.
  const answering = pendingAnswer?.index === currentIndex ? pendingAnswer : null;
  const controlsVisible = answering == null && controlsReadyIndex === currentIndex;

  useScreenFocus(boxRef);

  useEffect(() => {
    return () => {
      clearTimeout(answerTimeoutRef.current);
      clearTimeout(backFallbackRef.current);
    };
  }, []);

  // Back asks before leaving, like Home: an extra entry on this URL takes the first Back, and is
  // added again when the player resumes.
  useEffect(() => {
    if (state.dialog == null && !onGuardEntryRef.current && !leavingRef.current) {
      const token = Math.random().toString(36).slice(2);
      window.history.pushState({ [BACK_GUARD_KEY]: token }, "");
      guardTokenRef.current = token;
      onGuardEntryRef.current = true;
      exitByBackRef.current = false;
    }
  }, [state.dialog]);

  const onHistoryChange = useEffectEvent(() => {
    const wasOnGuardEntry = onGuardEntryRef.current;
    onGuardEntryRef.current = historyGuardToken() === guardTokenRef.current;
    if (onGuardEntryRef.current) {
      // Forward onto it again with the exit dialog up.
      exitByBackRef.current = false;
    } else if (wasOnGuardEntry && !leavingRef.current) {
      exitByBackRef.current = true;
      actions.openDialog("exit");
    }
  });

  useEffect(() => {
    const onPopState = () => onHistoryChange();
    // A page restored from the back/forward cache mustn't then jump home.
    const onPageHide = () => clearTimeout(backFallbackRef.current);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  /** The game is over: drop its history entry so Back from the results leaves the page. */
  const releaseBackGuard = () => {
    leavingRef.current = true;
    if (onGuardEntryRef.current) {
      onGuardEntryRef.current = false;
      window.history.back();
    }
  };

  const pauseIfPlaying = useEffectEvent(() => {
    if (state.dialog == null && !state.gameOver) {
      actions.openDialog("pause");
    }
  });

  // Switching apps or locking the phone pauses the game, so the round and play time don't run on.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        pauseIfPlaying();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // Loaded during the game so End Game shows the results without waiting on the network.
  useEffect(() => {
    import("@/components/ResultsSlide").catch(() => {});
  }, []);

  useEffect(() => {
    const showControlsId = setTimeout(
      () => setControlsReadyIndex(currentIndex),
      CONTROLS_DELAY_MS,
    );
    return () => clearTimeout(showControlsId);
  }, [currentIndex]);

  const handleAnswer = (correct: boolean) => {
    if (!controlsVisible) {
      return;
    }
    const answeredAt = Date.now();
    const endsGame = isOnLastTitle(state);
    setPendingAnswer({ index: currentIndex, correct });
    clearTimeout(answerTimeoutRef.current);
    answerTimeoutRef.current = setTimeout(() => {
      const answer = () => actions.answer(correct, answeredAt);
      if (endsGame) {
        releaseBackGuard();
        changeStage(answer);
      } else {
        answer();
      }
    }, ANSWER_DELAY_MS);
  };

  const handleFailClick = () => {
    if (!actions.ignoresTaps()) {
      handleAnswer(false);
    }
  };
  const handlePassClick = () => {
    if (!actions.ignoresTaps()) {
      handleAnswer(true);
    }
  };

  const timeLimit = state.mode.timeLimit;
  const secondsLeft = useRoundTimer({
    round: currentIndex,
    timeLimit,
    paused: state.dialog != null,
    onTimeUp: () => handleAnswer(false),
  });
  const timeLeft = formatMmSs(secondsLeft ?? timeLimit);
  const timerUrgent = secondsLeft != null && secondsLeft > 0 && secondsLeft <= URGENT_SECONDS;

  const handleEndClick = () => {
    if (controlsVisible && !actions.ignoresTaps()) {
      actions.openDialog("end");
    }
  };

  const trackGameEnded = () => {
    const totalTime = Math.round(getPlayTimeMs(state.clock, Date.now()) / 1000);
    const totalCount = currentIndex + 1;
    track(
      TrackEvents.GAME_ENDED,
      {
        correctCount: state.starsCount,
        totalCount,
        totalTime,
        avgTime: Math.ceil(totalTime / totalCount),
      },
      getMetricsContext(state),
    );
  };

  const handleEndConfirm = () => {
    releaseBackGuard();
    trackGameEnded();
    // Closed outside the transition, so the dialog isn't in the snapshot that slides out.
    actions.closeDialog();
    changeStage(actions.endGame);
  };

  // The dialog stays open while the homepage loads, so Confirm can be tapped again.
  const handleExitConfirm = () => {
    if (leavingRef.current) {
      return;
    }
    leavingRef.current = true;
    trackGameEnded();
    if (exitByBackRef.current) {
      router.back();
      backFallbackRef.current = setTimeout(() => router.push("/"), BACK_FALLBACK_MS);
    } else if (onGuardEntryRef.current) {
      // Replaces the extra entry, so Back from the homepage returns to this page only once.
      router.replace("/");
    } else {
      router.push("/");
    }
  };

  const showLabels = currentIndex < 2;

  return (
    <div
      ref={boxRef}
      tabIndex={-1}
      className={styles.movieSlideBox}
      data-answer={answering == null ? undefined : answering.correct ? "right" : "wrong"}
    >
      <div className={styles.slideTop}>
        <p
          role="timer"
          className={`${styles.timer} ${poppins.className}`}
          data-urgent={timerUrgent || undefined}
        >
          <LuTimer className={styles.timerIcon} aria-hidden />
          <span className={secondsLeft == null ? styles.timerBlank : undefined}>{timeLeft}</span>
        </p>
      </div>
      <div className={styles.cardArea}>
        <TitleSlide movieIndex={currentIndex} hidden={answering != null} />
        <TitleSlide
          movieIndex={currentIndex}
          hidden={answering == null}
          offset={answering == null ? undefined : "left"}
        />
        <TitleSlide
          movieIndex={currentIndex + 1}
          hidden={answering == null}
          offset={answering == null ? "right" : undefined}
        />
      </div>
      <div
        className={`${styles.controlButtonsBox} ${poppins.className} ${
          controlsVisible ? "" : styles.controlsHidden
        }`}
      >
        <button
          type="button"
          className={`${styles.controlButton} ${styles.failButton}`}
          onClick={handleFailClick}
          aria-label="Miss"
        >
          <ImCross className={styles.failIcon} aria-hidden />
          {showLabels && <span className={styles.controlLabel}>MISS</span>}
        </button>
        <button
          type="button"
          className={`${styles.controlButton} ${styles.passButton}`}
          onClick={handlePassClick}
          aria-label="Right"
        >
          <ImCheckmark className={styles.passIcon} aria-hidden />
          {showLabels && <span className={styles.controlLabel}>RIGHT</span>}
        </button>
        <button
          type="button"
          className={`${styles.controlButton} ${styles.endButton}`}
          onClick={handleEndClick}
        >
          <FaFlagCheckered className={styles.endIcon} aria-hidden />
          <span className={styles.controlLabel}>End Game</span>
        </button>
      </div>
      {/* Opened from here (End Game) or from GameHeader (Pause, Home). Keyed for a fresh title each time. */}
      {state.dialog != null && (
        <ConfirmDialog
          key={state.dialog}
          variant={state.dialog}
          timeLeft={state.dialog === "pause" ? timeLeft : undefined}
          onCancel={actions.closeDialog}
          onConfirm={
            state.dialog === "end"
              ? handleEndConfirm
              : state.dialog === "exit"
                ? handleExitConfirm
                : undefined
          }
        />
      )}
    </div>
  );
}

export default MovieSlide;
