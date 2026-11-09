"use client";
import {
  createContext,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { ErrorStates, type ErrorState } from "@/constant/ErrorStates";
import {
  DEFAULT_DIFFICULTY,
  GameDifficulty,
  type DifficultyLevel,
  type GameModeType,
} from "@/constant/gameModes";
import type { ConfirmDialogVariant } from "@/constant/confirmDialog";
import { TrackEvents, type TrackContext } from "@/constant/metricsData";
import type { MoviesListType } from "@/constant/movieData";
import { fetchTitles } from "@/utils/api";
import { getRoundsCount } from "@/utils/gameMetrics";
import { hasSeenTitle, markTitleSeen } from "@/utils/seenTitles";
import { track } from "@/utils/trackMetrics";

/** Fetch the next batch once fewer than this many titles remain ahead of the current one. */
const REFILL_THRESHOLD = 10;

/** Mashing a dialog's buttons keeps tapping after it closes, onto the game's buttons underneath. */
const TAPS_IGNORED_AFTER_DIALOG_MS = 400;

export interface GameState {
  mode: GameModeType;
  difficulty: DifficultyLevel;
  titles: MoviesListType[];
  /** `null` until the game starts (details sheet and countdown). */
  currentIndex: number | null;
  starsCount: number;
  startTime: number | null;
  /** The open confirmation dialog. The game (clock and round timer) is paused while one is open. */
  dialog: ConfirmDialogVariant | null;
  stats: GameStats;
  clock: GameClock;
  /** The player ended the game, or answered the last title; the results screen shows. */
  gameOver: boolean;
  /**
   * Why the game ended on its own after the last fetched title: the API had nothing new
   * (`exhausted`), or more titles couldn't be loaded in time (`unavailable`).
   */
  ranOutOfTitles: "exhausted" | "unavailable" | null;
  /** The latest batch had no titles the player hasn't seen. */
  noNewTitles: boolean;
  error: ErrorState | null;
}

/** Answer history and running records, updated as each answer comes in. */
export interface GameStats {
  /** One entry per answered title, in order: `true` when correct. */
  answers: boolean[];
  streak: number;
  bestStreak: number;
  /** The quickest correct answer. */
  fastest: { index: number; ms: number } | null;
}

/** Play time, which stops while the game is paused. */
export interface GameClock {
  /** Play time banked before `runningSince`. */
  playedMs: number;
  /** When the clock last started; `null` while paused, before the game and after it ends. */
  runningSince: number | null;
  /** Play time when the current title appeared. */
  roundStartMs: number;
}

export type GameAction =
  | { type: "difficultyChanged"; difficulty: DifficultyLevel }
  | { type: "titlesReceived"; titles: MoviesListType[] }
  | { type: "gameStarted"; now: number }
  | { type: "answered"; correct: boolean; at: number }
  | { type: "dialogChanged"; dialog: ConfirmDialogVariant | null; now: number }
  | { type: "gameEnded"; now: number }
  | { type: "failed"; error: ErrorState };

const EMPTY_STATS: GameStats = { answers: [], streak: 0, bestStreak: 0, fastest: null };
const STOPPED_CLOCK: GameClock = { playedMs: 0, runningSince: null, roundStartMs: 0 };

/** Play time up to `now`, not counting pauses. */
export function getPlayTimeMs(clock: GameClock, now: number): number {
  return (
    clock.playedMs + (clock.runningSince == null ? 0 : Math.max(0, now - clock.runningSince))
  );
}

function recordAnswer(stats: GameStats, index: number, correct: boolean, ms: number): GameStats {
  const streak = correct ? stats.streak + 1 : 0;
  const fastest =
    correct && (stats.fastest == null || ms < stats.fastest.ms) ? { index, ms } : stats.fastest;
  return {
    answers: [...stats.answers, correct],
    streak,
    bestStreak: Math.max(stats.bestStreak, streak),
    fastest,
  };
}

export function createInitialState(mode: GameModeType): GameState {
  return {
    mode,
    difficulty: DEFAULT_DIFFICULTY,
    titles: [],
    currentIndex: null,
    starsCount: 0,
    startTime: null,
    dialog: null,
    stats: EMPTY_STATS,
    clock: STOPPED_CLOCK,
    gameOver: false,
    ranOutOfTitles: null,
    noNewTitles: false,
    error: null,
  };
}

/** Answering the current title ends the game. */
export function isOnLastTitle(state: GameState): boolean {
  return state.currentIndex != null && state.currentIndex + 1 >= state.titles.length;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "difficultyChanged":
      return { ...state, difficulty: action.difficulty };
    case "titlesReceived": {
      const known = new Set(state.titles.map((title) => title.english));
      const fresh: MoviesListType[] = [];
      for (const title of action.titles) {
        if (!known.has(title.english)) {
          known.add(title.english);
          fresh.push(title);
        }
      }
      if (fresh.length === 0) {
        return state.noNewTitles ? state : { ...state, noNewTitles: true };
      }
      return { ...state, titles: [...state.titles, ...fresh], noNewTitles: false };
    }
    case "gameStarted":
      if (state.titles.length === 0) {
        return { ...state, startTime: action.now, error: ErrorStates.END_OF_LIST };
      }
      return {
        ...state,
        currentIndex: 0,
        starsCount: 0,
        startTime: action.now,
        dialog: null,
        stats: EMPTY_STATS,
        clock: { playedMs: 0, runningSince: action.now, roundStartMs: 0 },
        gameOver: false,
        ranOutOfTitles: null,
      };
    case "answered": {
      if (state.currentIndex == null || state.gameOver) {
        return state;
      }
      const playedMs = getPlayTimeMs(state.clock, action.at);
      const answered = {
        ...state,
        starsCount: state.starsCount + (action.correct ? 1 : 0),
        stats: recordAnswer(
          state.stats,
          state.currentIndex,
          action.correct,
          Math.max(0, playedMs - state.clock.roundStartMs),
        ),
      };
      if (isOnLastTitle(state)) {
        return {
          ...answered,
          gameOver: true,
          ranOutOfTitles: state.noNewTitles ? "exhausted" : "unavailable",
          clock: { ...state.clock, playedMs, runningSince: null },
        };
      }
      return {
        ...answered,
        currentIndex: state.currentIndex + 1,
        clock: { ...state.clock, roundStartMs: playedMs },
      };
    }
    case "dialogChanged": {
      const { clock } = state;
      const paused = action.dialog != null;
      const inGame = state.currentIndex != null && !state.gameOver;
      const running = clock.runningSince != null;
      if (!inGame || paused !== running) {
        return { ...state, dialog: action.dialog };
      }
      return {
        ...state,
        dialog: action.dialog,
        clock: paused
          ? { ...clock, playedMs: getPlayTimeMs(clock, action.now), runningSince: null }
          : { ...clock, runningSince: action.now },
      };
    }
    case "gameEnded":
      return {
        ...state,
        dialog: null,
        gameOver: true,
        clock: {
          ...state.clock,
          playedMs: getPlayTimeMs(state.clock, action.now),
          runningSince: null,
        },
      };
    case "failed":
      return { ...state, error: action.error, dialog: null };
  }
}

export function getMetricsContext(state: GameState): TrackContext {
  return {
    mode: state.mode.mode,
    difficulty: state.mode.hasDifficulty ? GameDifficulty[state.difficulty - 1] : null,
  };
}

export interface GameActions {
  setDifficulty: (difficulty: DifficultyLevel) => void;
  /**
   * Fetches and appends the first batch of unseen titles. Resolves `false` on failure (error
   * state is set) or abort.
   */
  loadTitles: (difficulty: DifficultyLevel) => Promise<boolean>;
  startGame: () => void;
  /** `at` is when the player answered (the store applies it after the slide-out animation). */
  answer: (correct: boolean, at: number) => void;
  /** Opens a confirmation dialog, pausing the game until `closeDialog`. */
  openDialog: (dialog: ConfirmDialogVariant) => void;
  closeDialog: () => void;
  /** True just after `closeDialog`; the game's buttons ignore taps then. */
  ignoresTaps: () => boolean;
  /** The player ended the game (results screen). */
  endGame: () => void;
}

interface GameStoreValue {
  state: GameState;
  actions: GameActions;
}

const GameStoreContext = createContext<GameStoreValue | null>(null);

export function GameStoreProvider({
  mode,
  children,
}: {
  mode: GameModeType;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(gameReducer, mode, createInitialState);
  const abortRef = useRef<AbortController | null>(null);
  const refillPendingRef = useRef(false);
  const dialogClosedAtRef = useRef(-Infinity);

  // Created on first use rather than here: children's effects (the first title load) run before
  // this one, and a Strict Mode remount needs a fresh controller after the abort.
  useEffect(
    () => () => {
      abortRef.current?.abort();
      abortRef.current = null;
    },
    [],
  );

  /** Appends unseen titles. Resolves `null` on abort and `false` on failure, without setting an error. */
  const fetchMore = useMemo(
    () =>
      async (difficulty: DifficultyLevel): Promise<boolean | null> => {
        abortRef.current ??= new AbortController();
        const { signal } = abortRef.current;
        const titles = await fetchTitles(mode, difficulty, signal);
        if (signal.aborted) {
          return null;
        }
        if (titles == null) {
          return false;
        }
        dispatch({
          type: "titlesReceived",
          titles: titles.filter((title) => !hasSeenTitle(title.english)),
        });
        return true;
      },
    [mode],
  );

  const actions = useMemo<GameActions>(() => {
    const loadTitles = async (difficulty: DifficultyLevel) => {
      const loaded = await fetchMore(difficulty);
      if (loaded === false) {
        dispatch({ type: "failed", error: ErrorStates.BACKEND_FAIL });
      }
      return loaded === true;
    };
    return {
      setDifficulty: (difficulty) => dispatch({ type: "difficultyChanged", difficulty }),
      loadTitles,
      startGame: () => dispatch({ type: "gameStarted", now: Date.now() }),
      answer: (correct, at) => dispatch({ type: "answered", correct, at }),
      openDialog: (dialog) => dispatch({ type: "dialogChanged", dialog, now: Date.now() }),
      closeDialog: () => {
        dialogClosedAtRef.current = performance.now();
        dispatch({ type: "dialogChanged", dialog: null, now: Date.now() });
      },
      ignoresTaps: () =>
        performance.now() - dialogClosedAtRef.current < TAPS_IGNORED_AFTER_DIALOG_MS,
      endGame: () => dispatch({ type: "gameEnded", now: Date.now() }),
    };
  }, [fetchMore]);

  const currentTitle =
    state.currentIndex == null ? undefined : state.titles[state.currentIndex]?.english;

  useEffect(() => {
    if (currentTitle != null) {
      markTitleSeen(currentTitle);
    }
  }, [currentTitle]);

  const reportGameStarted = useEffectEvent(() => {
    track(
      TrackEvents.GAME_STARTED,
      { roundsCount: getRoundsCount() },
      getMetricsContext(state),
    );
  });

  // Declared before the exhaustion effect so `game.started` is sent first when the list is empty.
  useEffect(() => {
    if (state.startTime != null) {
      reportGameStarted();
    }
  }, [state.startTime]);

  const reportListExhausted = useEffectEvent(() => {
    track(
      TrackEvents.GAME_LIST_EXHAUSTED,
      {
        // answered + 1, like game.ended; 0 when there was nothing to play.
        totalCount: state.titles.length === 0 ? 0 : state.stats.answers.length + 1,
        totalTime: Math.round(getPlayTimeMs(state.clock, Date.now()) / 1000),
      },
      getMetricsContext(state),
    );
  });

  const listExhausted =
    state.ranOutOfTitles === "exhausted" || state.error === ErrorStates.END_OF_LIST;

  useEffect(() => {
    if (listExhausted) {
      reportListExhausted();
    }
  }, [listExhausted]);

  // A failed refill doesn't interrupt the game; the next answer tries again.
  const refillIfLow = useEffectEvent(() => {
    const { currentIndex, titles, difficulty, error, gameOver } = state;
    if (
      currentIndex == null ||
      gameOver ||
      error != null ||
      refillPendingRef.current ||
      titles.length - currentIndex >= REFILL_THRESHOLD
    ) {
      return;
    }
    refillPendingRef.current = true;
    void fetchMore(difficulty).finally(() => {
      refillPendingRef.current = false;
    });
  });

  useEffect(() => {
    refillIfLow();
  }, [state.currentIndex]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <GameStoreContext value={value}>{children}</GameStoreContext>;
}

export function useGameStore(): GameStoreValue {
  const value = use(GameStoreContext);
  if (value == null) {
    throw new Error("useGameStore must be used inside <GameStoreProvider>");
  }
  return value;
}
