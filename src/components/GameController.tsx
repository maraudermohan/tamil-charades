"use client";
import { lazy, Suspense, useEffect, useEffectEvent, useRef, useState, ViewTransition } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import GameHeader from "@/components/GameHeader";
import ModeDetailsSheet from "@/components/ModeDetailsSheet";
import MovieSlideCountdown from "@/components/MovieSlideCountdown";
import { GAME_MODES_DATA, type DifficultyLevel, type GameSlug } from "@/constant/gameModes";
import { TrackEvents } from "@/constant/metricsData";
import { GameStoreProvider, useGameStore } from "@/hooks/useGameStore";
import { useRulesLanguage } from "@/hooks/useRulesLanguage";
import { getRememberedDifficulty, rememberDifficulty } from "@/utils/difficultyMemory";
import { historyGuardToken } from "@/utils/gameHistory";
import { clearPlayIntent, getPlayIntent } from "@/utils/playIntent";
import { changeStage, STAGE_TRANSITION } from "@/utils/stageTransition";
import { track } from "@/utils/trackMetrics";

const MovieSlide = lazy(() => import("@/components/MovieSlide"));
const ResultsSlide = lazy(() => import("@/components/ResultsSlide"));

const STAGE_ENTER = { [STAGE_TRANSITION]: "stage-enter", default: "none" };
const STAGE_EXIT = { [STAGE_TRANSITION]: "stage-exit", default: "none" };

/**
 * The game page under its header. Opened directly, it starts on the details sheet; arriving from
 * Play in the homepage's mode dialog, it goes straight to the countdown at the difficulty picked
 * there. Titles load during the countdown.
 */
function GameScreens({ slug }: { slug: GameSlug }) {
  const { state, actions } = useGameStore();
  const { language } = useRulesLanguage();
  const [intent] = useState(() => getPlayIntent(slug));
  const [countingDown, setCountingDown] = useState(intent != null);
  const titlesLoadRef = useRef<Promise<boolean>>(Promise.resolve(false));
  // The countdown starts inside a view transition, so the intro takes clicks for a moment after Play.
  const playedRef = useRef(false);
  const steppedOffGuardRef = useRef(false);

  const loadTitles = (difficulty: DifficultyLevel) => {
    if (state.mode.hasDifficulty) {
      rememberDifficulty(slug, difficulty);
    }
    titlesLoadRef.current = actions.loadTitles(difficulty);
  };

  const arrive = useEffectEvent(() => {
    clearPlayIntent();
    if (intent != null) {
      // Stored too, so the mid-game refills fetch the same difficulty.
      actions.setDifficulty(intent.difficulty);
      loadTitles(intent.difficulty);
    } else if (state.mode.hasDifficulty) {
      // After hydration, since the prerendered sheet can only show the default.
      actions.setDifficulty(getRememberedDifficulty(slug));
    }
  });

  // A reload mid-game lands on that game's extra history entry; step back off it, so Back from
  // here leaves in one press instead of first landing on this same page.
  useEffect(() => {
    if (!steppedOffGuardRef.current && historyGuardToken() != null) {
      steppedOffGuardRef.current = true;
      window.history.back();
    }
  }, []);

  // Not guarded against Strict Mode's second run: the provider aborts the first load on the
  // simulated unmount, so the second run has to start it again.
  useEffect(() => {
    arrive();
  }, []);

  const handlePlay = () => {
    if (playedRef.current) {
      return;
    }
    playedRef.current = true;
    loadTitles(state.difficulty);
    changeStage(() => setCountingDown(true));
  };

  const handleCountdownComplete = () => {
    void titlesLoadRef.current.then((ok) => {
      if (ok) {
        changeStage(actions.startGame);
      }
    });
  };

  const stage =
    state.error != null
      ? "error"
      : state.currentIndex == null
        ? countingDown
          ? "countdown"
          : "intro"
        : state.gameOver
          ? "results"
          : "game";

  return (
    <>
      {stage !== "results" && <GameHeader stage={stage === "error" ? "intro" : stage} />}
      {stage === "error" ? (
        <ErrorBoundary />
      ) : (
        // Already showing when a lazy screen loads, so the transition keeps the old screen up
        // until the new one is ready instead of flashing an empty fallback.
        <Suspense fallback={null}>
          {/* Keyed by stage, so each screen fully unmounts while its snapshot animates out. */}
          <ViewTransition key={stage} enter={STAGE_ENTER} exit={STAGE_EXIT} default="none">
            {stage === "intro" && (
              <ModeDetailsSheet
                mode={state.mode}
                difficulty={state.difficulty}
                onDifficultyChange={actions.setDifficulty}
                onPlay={handlePlay}
              />
            )}
            {stage === "countdown" && (
              <MovieSlideCountdown
                instruction={
                  language === "ta" ? state.mode.instructionInTamil : state.mode.instruction
                }
                language={language}
                onComplete={handleCountdownComplete}
              />
            )}
            {stage === "game" && <MovieSlide />}
            {stage === "results" && <ResultsSlide />}
          </ViewTransition>
        </Suspense>
      )}
    </>
  );
}

function GameController({ slug }: { slug: GameSlug }) {
  useEffect(() => {
    track(TrackEvents.MODE_SELECTED, null, { mode: slug });
  }, [slug]);

  return (
    <GameStoreProvider key={slug} mode={GAME_MODES_DATA[slug]}>
      <GameScreens slug={slug} />
    </GameStoreProvider>
  );
}

export default GameController;
