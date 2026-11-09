import type { GameDifficulty, GameSlug } from "./gameModes";

export const TrackEvents = {
  SESSION_STARTED: "session.started",
  SESSION_ENDED: "session.ended",
  MODE_SELECTED: "mode.selected",
  GAME_STARTED: "game.started",
  GAME_ENDED: "game.ended",
  GAME_ERROR: "game.error",
  GAME_LIST_EXHAUSTED: "game.list_exhausted",
  DONATE_CLICKED: "donate.clicked",
  SHARE_CLICKED: "share.clicked",
  SHARE_COMPLETED: "share.completed",
  SHARE_CANCELLED: "share.cancelled",
  SESSION_WEB_VITALS: "session.web_vitals",
} as const;

export type TrackEventName = (typeof TrackEvents)[keyof typeof TrackEvents];

/** Shared fields sent with every event; `track()` fills in ids and timestamp. */
export type TrackContext = Omit<
  TrackApiRequest,
  "event" | "payload" | "session_id" | "user_id" | "created"
>;

/**
 * Full JSON body sent to track-metrics.php. `created` is set in `track()`.
 */
export interface TrackApiRequest {
  user_id: string;
  session_id: string;
  event: TrackEventName;
  payload?: unknown | null;
  device?: "mobile" | "tablet" | "desktop" | null;
  browser?: "chrome" | "safari" | "firefox" | "edge" | "other" | null;
  mode?: GameSlug | null;
  difficulty?: (typeof GameDifficulty)[number] | null;
  created?: string;
}

export interface SessionStartedPayload {
  entry: "direct" | "referral";
  path: string;
  isFirstVisit?: boolean;
  // device: "mobile" | "tablet" | "desktop";
  viewportWidth: number;
  viewportHeight: number;
  // browser: "chrome" | "safari" | "firefox" | "edge" | "other";
}

export interface SessionEndedPayload {
  type: "visibilitychange" | "pagehide";
}

export type WebVitalRating = "good" | "needs-improvement" | "poor";

/** One observation from the web-vitals library (may repeat per metric, e.g. CLS). */
export type WebVitalSample = [number, WebVitalRating, string | undefined];

export interface GameStartedPayload {
  roundsCount: number;
}

export interface GameEndedPayload {
  // mode: "Classic" | "Story" | "Song" | "Hollywood" | "Kids";
  // difficulty: "easy" | "medium" | "hard";
  correctCount: number;
  totalCount: number;
  /** Seconds of play time, excluding pauses. */
  totalTime: number;
  /** Seconds per title. */
  avgTime: number;
}

export interface GameErrorPayload {
  category: string;
  code: string;
  status?: number;
  path?: string;
}

export interface TotalTimeCountPayload {
  totalCount: number;
  /** Seconds of play time, excluding pauses. */
  totalTime: number;
}

export interface ShareCompletedPayload {
  method: string;
}

export interface ShareCancelledPayload {
  method: string;
  reason: "dismissed" | "error";
}

/**
 * Maps each track event name to its optional-context payload type.
 */
export interface TrackEventPayloadByName {
  "session.started": SessionStartedPayload;
  "session.ended": SessionEndedPayload;
  "session.web_vitals": Record<string, WebVitalSample>;
  "mode.selected": null;
  "game.started": GameStartedPayload;
  "game.ended": GameEndedPayload;
  "game.error": GameErrorPayload;
  "game.list_exhausted": TotalTimeCountPayload;
  "donate.clicked": TotalTimeCountPayload;
  "share.clicked": GameEndedPayload;
  "share.completed": ShareCompletedPayload;
  "share.cancelled": ShareCancelledPayload;
}
