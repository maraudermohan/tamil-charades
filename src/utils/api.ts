import type { DifficultyLevel, GameModeType } from "@/constant/gameModes";
import { TrackEvents } from "@/constant/metricsData";
import type { MoviesListType } from "@/constant/movieData";
import { track } from "@/utils/trackMetrics";

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "string";
}

function toTitleEntry(value: unknown): MoviesListType | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const { english, tamil, movie } = value as Record<string, unknown>;
  if (typeof english !== "string" || english.trim() === "") {
    return null;
  }
  if (!isOptionalString(tamil) || !isOptionalString(movie)) {
    return null;
  }
  return {
    english,
    ...(typeof tamil === "string" && tamil !== "" ? { tamil } : {}),
    ...(typeof movie === "string" && movie !== "" ? { movie } : {}),
  };
}

function getTitlesUrl(mode: GameModeType, difficulty: DifficultyLevel): string {
  return mode.hasDifficulty ? `${mode.endpoint}${difficulty}` : mode.endpoint;
}

function reportFetchError(path: string, code: string, status?: number): void {
  track(
    TrackEvents.GAME_ERROR,
    { category: "fetch-data", code, status, path },
    {},
  );
}

/** A stalled request would otherwise leave the countdown, or a refill, waiting forever. */
const FETCH_TIMEOUT_MS = 10_000;

/**
 * Fetches a batch of titles for a mode; an empty list means the backend has none to give, which
 * isn't a failure. Returns `null` on any failure, including a timeout
 * (already tracked), except aborts via `signal`, which are silent so unmounting mid-request
 * does not report an error.
 */
export async function fetchTitles(
  mode: GameModeType,
  difficulty: DifficultyLevel,
  signal?: AbortSignal,
): Promise<MoviesListType[] | null> {
  const url = getTitlesUrl(mode, difficulty);
  if (signal?.aborted) {
    return null;
  }
  const request = new AbortController();
  const abortRequest = () => request.abort();
  const timeoutId = setTimeout(abortRequest, FETCH_TIMEOUT_MS);
  signal?.addEventListener("abort", abortRequest);
  try {
    const response = await fetch(url, { cache: "no-store", signal: request.signal });
    if (!response.ok) {
      reportFetchError(url, `http-${response.status}`, response.status);
      return null;
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      reportFetchError(url, "invalid-response", response.status);
      return null;
    }
    if (data.length === 0) {
      reportFetchError(url, "empty-list", response.status);
      return [];
    }
    const titles = data
      .map(toTitleEntry)
      .filter((entry): entry is MoviesListType => entry != null);
    if (titles.length === 0) {
      reportFetchError(url, "invalid-response", response.status);
      return null;
    }
    return titles;
  } catch (error) {
    if (signal?.aborted) {
      return null;
    }
    console.error("Unable to fetch the data: ", error);
    reportFetchError(
      url,
      request.signal.aborted ? "timeout" : error instanceof SyntaxError ? "invalid-json" : "network-error",
    );
    return null;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortRequest);
  }
}
