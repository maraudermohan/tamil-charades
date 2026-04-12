import {
  TrackEvents,
  type TrackApiRequest,
  type TrackEventName,
  type TrackEventPayloadByName,
} from "constant";
import { getUniqueSessionId, getUniqueUserId } from "./sessionMetrics";

const DEFAULT_METRICS_PATH = "/track-metrics.php";

function getMetricsEndpoint(): string {
  if (
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_TRACK_METRICS_URL != null &&
    String(process.env.NEXT_PUBLIC_TRACK_METRICS_URL).trim() !== ""
  ) {
    return String(process.env.NEXT_PUBLIC_TRACK_METRICS_URL).trim();
  }
  return DEFAULT_METRICS_PATH;
}

/** Absolute URL for Beacon/fetch (relative paths are unreliable for sendBeacon on unload in some browsers). */
function resolveMetricsUrl(): string {
  const path = getMetricsEndpoint();
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (typeof window === "undefined") {
    return path;
  }
  return new URL(path, window.location.origin).href;
}

/**
 * POST JSON body to the metrics endpoint (use for most events).
 */
export function postMetricsFetch(request: TrackApiRequest): Promise<Response> {
  return fetch(resolveMetricsUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    cache: "no-store",
  });
}

/**
 * POST that may outlive the page (tab close). Use when Beacon is unavailable or returns false.
 */
function postMetricsFetchKeepalive(request: TrackApiRequest): Promise<Response> {
  return fetch(resolveMetricsUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    cache: "no-store",
    keepalive: true,
  });
}

/**
 * POST via sendBeacon (reliable on page hide / unload).
 * Prefer for session.ended and session.web_vitals. Returns false if Beacon is unavailable or queued failed.
 */
export function postMetricsBeacon(request: TrackApiRequest): boolean {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) {
    return false;
  }
  const body = JSON.stringify(request);
  const blob = new Blob([body], { type: "application/json" });
  return navigator.sendBeacon(resolveMetricsUrl(), blob);
}

function shouldUseBeaconForEvent(event: TrackEventName): boolean {
  return (
    event === TrackEvents.SESSION_ENDED ||
    event === TrackEvents.SESSION_WEB_VITALS
  );
}

/**
 * Sends a metrics event with a payload type-checked against `event`.
 * session.ended and session.web_vitals use sendBeacon (with fetch fallback if Beacon returns false).
 * Other events use fetch. Empty-payload events omit `payload` in the JSON body.
 */
export function track<E extends TrackEventName>(
  event: E,
  payload: TrackEventPayloadByName[E],
  context: Omit<TrackApiRequest, "event" | "payload" | "session_id" | "user_id" | "created">,
): void {
  if (typeof window === "undefined") {
    return;
  }
  const request: TrackApiRequest = {
    ...context,
    session_id: getUniqueSessionId(),
    user_id: getUniqueUserId().uniqueUserId,
    created: new Date().toISOString(),
    event,
    payload,
  };
  if (shouldUseBeaconForEvent(event)) {
    if (!postMetricsBeacon(request)) {
      void postMetricsFetchKeepalive(request).catch(() => {});
    }
  } else {
    void postMetricsFetch(request).catch(() => {});
  }
}
