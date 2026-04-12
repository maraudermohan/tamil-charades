import { type TrackApiRequest } from "constant";

const SIXTEEN_DIGITS = /^\d{16}$/;
const uniqueUserIdKey = "uniqueUserId";
const uniqueSessionIdKey = "uniqueSessionId";

export function getDeviceContext() {
  const vv = window.visualViewport;

  // Prefer Visual Viewport API (more accurate with zoom / mobile UI chrome)
  const viewportWidth = Math.round(
    vv?.width ?? window.innerWidth ?? document.documentElement.clientWidth ?? screen.width ?? 0
  );

  const viewportHeight = Math.round(
    vv?.height ?? window.innerHeight ?? document.documentElement.clientHeight ?? screen.height ?? 0
  );

  const ua = navigator.userAgent || "";
  const uaData = (
    navigator as Navigator & {
      userAgentData?: { mobile?: boolean };
    }
  ).userAgentData;
  const touchPoints = navigator.maxTouchPoints || 0;
  const platform = navigator.platform || "";

  const shortestSide = Math.min(viewportWidth, viewportHeight);

  // Modern signal first
  const isMobileUAData = uaData?.mobile === true;

  // iPadOS often reports as Mac
  const isIPad =
    /iPad/i.test(ua) ||
    (platform === "MacIntel" && touchPoints > 1);

  const isTabletUA =
    /Tablet|iPad/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua));

  const isMobileUA =
    /iPhone|iPod|Android|Windows Phone|Mobile/i.test(ua);

  let device: NonNullable<TrackApiRequest["device"]> = "desktop";

  if (isIPad) {
    device = "tablet";
  } else if (isMobileUAData) {
    // Use size to split phone vs tablet when UAData says mobile-ish device
    device = shortestSide >= 768 ? "tablet" : "mobile";
  } else if (isTabletUA) {
    device = "tablet";
  } else if (isMobileUA) {
    device = shortestSide >= 768 ? "tablet" : "mobile";
  } else if (touchPoints > 0 && shortestSide >= 768 && shortestSide <= 1366) {
    // Touch-first large device fallback (Surface / foldables / unknown tablets)
    device = "tablet";
  }
  
  let browser: TrackApiRequest["browser"] = "other";
  if (ua.includes("Edg/")) {
    browser = "edge";
  }
  if (ua.includes("Chrome") && !ua.includes("Edg/")) {
    browser = "chrome";
  }
  if (ua.includes("Firefox")) {
    browser = "firefox";
  }
  if (ua.includes("Safari") && !ua.includes("Chrome")) {
    browser = "safari";
  }

  return {
    device,
    viewportWidth,
    viewportHeight,
    browser,
  };
}

export function getUniqueSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    const existing = sessionStorage.getItem(uniqueSessionIdKey);
    if (isValidSixteenDigitId(existing)) {
      return existing;
    }
    const created = randomSixteenDigitId();
    sessionStorage.setItem(uniqueSessionIdKey, created);
    return created;
  } catch {
    return randomSixteenDigitId();
  }
}

function isValidSixteenDigitId(value: string | null): value is string {
  return value != null && SIXTEEN_DIGITS.test(value);
}

function randomSixteenDigitId(): string {
  return String(
    Math.floor(1000000000000000 + Math.random() * 9000000000000000)
  );
}

export function getUniqueUserId(): { uniqueUserId: string; isFirstVisit: boolean } {
  if (typeof window === "undefined") {
    return {
      uniqueUserId: "",
      isFirstVisit: true,
    };
  }
  try {
    const existing = localStorage.getItem(uniqueUserIdKey);
    if (isValidSixteenDigitId(existing)) {
      return {
        uniqueUserId: existing,
        isFirstVisit: false,
      };
    }
    const created = randomSixteenDigitId();
    localStorage.setItem(uniqueUserIdKey, created);
    return {
      uniqueUserId: created,
      isFirstVisit: true,
    };
  } catch {
    return {
      uniqueUserId: "",
      isFirstVisit: true,
    };
  }
}
