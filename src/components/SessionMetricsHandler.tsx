"use client";

import { useEffect } from "react";
import {
  TrackEvents,
  type SessionEndedPayload,
  type WebVitalSample,
} from "constant";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import { getDeviceContext, getUniqueUserId, track } from "utils";

/** Milliseconds after the last vital before sending one batched POST (between 5s and 10s). */
const WEB_VITALS_DEBOUNCE_MS = 8_000;

function sessionEntryType(): "direct" | "referral" {
  if (typeof window === "undefined") {
    return "direct";
  }
  try {
    const ref = new URLSearchParams(window.location.search).get("ref");
    return ref === "share" ? "referral" : "direct";
  } catch {
    return "direct";
  }
}

function SessionMetricsHandler() {
  useEffect(() => {
    const { isFirstVisit } = getUniqueUserId();
    const { device, viewportWidth, viewportHeight, browser } = getDeviceContext();

    track(
      TrackEvents.SESSION_STARTED,
      {
        entry: sessionEntryType(),
        path: window.location.pathname,
        isFirstVisit,
        viewportWidth,
        viewportHeight,
      },
      {
        device,
        browser,
      },
    );

    const buffer: Record<string, WebVitalSample> = {};
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let sessionEndedReported = false;

    function flushVitalsBatch(): void {
      const names = Object.keys(buffer);
      if (names.length === 0) {
        return;
      }
      const vitals: Record<string, WebVitalSample> = {};
      for (const name of names) {
        const sample = buffer[name];
        if (sample != null && sample.length > 0) {
          vitals[name] = [...sample];
        }
        delete buffer[name];
      }
      if (Object.keys(vitals).length === 0) {
        return;
      }
      track(
        TrackEvents.SESSION_WEB_VITALS,
        vitals,
        {
          device,
          browser,
        },
      );
    }

    function scheduleFlush(): void {
      if (debounceTimer != null) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        flushVitalsBatch();
      }, WEB_VITALS_DEBOUNCE_MS);
    }

    function enqueueWebVital(metric: Metric): void {
      const name = metric.name;
      buffer[name] = [
        metric.value,
        metric.rating,
        metric.navigationType,
      ];
      scheduleFlush();
    }

    function sendSessionEndedOnce(endType: SessionEndedPayload["type"]): void {
      if (sessionEndedReported) {
        return;
      }
      sessionEndedReported = true;
      track(
        TrackEvents.SESSION_ENDED,
        { type: endType },
        {
          device,
          browser,
        },
      );
    }

    /**
     * Flush pending web vitals, then record session end once (Beacon).
     * visibilitychange usually runs first when hiding the tab; pagehide when the page goes away.
     */
    function flushOnLeave(endType: SessionEndedPayload["type"]): void {
      if (debounceTimer != null) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      flushVitalsBatch();
      sendSessionEndedOnce(endType);
    }

    /** Often fires before unload when the tab is hidden or closed; pairs with pagehide. */
    function flushOnVisibilityHidden(): void {
      if (document.visibilityState === "hidden") {
        flushOnLeave("visibilitychange");
      }
    }

    onCLS(enqueueWebVital);
    onINP(enqueueWebVital);
    onLCP(enqueueWebVital);
    onFCP(enqueueWebVital);
    onTTFB(enqueueWebVital);

    function onPageHide(): void {
      flushOnLeave("pagehide");
    }

    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", flushOnVisibilityHidden);

    return () => {
      if (debounceTimer != null) {
        clearTimeout(debounceTimer);
      }
      flushVitalsBatch();
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", flushOnVisibilityHidden);
    };
  }, []);

  return null;
}

export default SessionMetricsHandler;
