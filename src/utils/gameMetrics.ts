import { TrackApiRequest, TrackEvents } from "constant";
import { track } from "utils";

export function getRoundsCount(): number {
  if (typeof window === "undefined") {
    return 0;
  }
  try {
    const existing = sessionStorage.getItem("roundsCount");
    let newCount = 1;
    if (existing != null) {
      newCount = parseInt(existing, 10) + 1;
    }
    sessionStorage.setItem("roundsCount", newCount.toString());
    return newCount;
  } catch {
    return 0;
  }
}

export async function trackShareNativeResult(
  sharePromise: Promise<void>,
  metricsCtx: Omit<TrackApiRequest, "event" | "payload" | "session_id" | "user_id" | "created">,
): Promise<void> {
  try {
    await sharePromise;
    track(TrackEvents.SHARE_COMPLETED, { method: "native" }, metricsCtx);
  } catch (e) {
    const name =
      e instanceof Error
        ? e.name
        : typeof e === "object" && e !== null && "name" in e
          ? String((e as { name: unknown }).name)
          : "";
    if (name === "AbortError") {
      track(
        TrackEvents.SHARE_CANCELLED,
        { method: "native", reason: "dismissed" },
        metricsCtx,
      );
    } else {
      track(
        TrackEvents.SHARE_CANCELLED,
        { method: "native", reason: "error" },
        metricsCtx,
      );
    }
  }
}
