import { TrackEvents, type TrackContext } from "@/constant/metricsData";
import { track } from "@/utils/trackMetrics";

export function getRoundsCount(): number {
  if (typeof window === "undefined") {
    return 0;
  }
  try {
    const previous = Number(sessionStorage.getItem("roundsCount"));
    const newCount = Number.isSafeInteger(previous) && previous > 0 ? previous + 1 : 1;
    sessionStorage.setItem("roundsCount", newCount.toString());
    return newCount;
  } catch {
    return 0;
  }
}

export async function trackShareNativeResult(
  sharePromise: Promise<void>,
  metricsCtx: TrackContext,
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
