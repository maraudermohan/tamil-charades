/* Keep in sync with src/utils/iosSafariZoomClass.ts (applyIosSafariZoomClass). */
(function () {
  var CLASS = "ios-safari-zoomed";
  var ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  var isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (typeof navigator !== "undefined" &&
      navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1);
  var isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  if (!isIOS || !isSafari) {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove(CLASS);
    }
    return;
  }
  var vv = typeof window !== "undefined" ? window.visualViewport : null;
  var layoutW =
    typeof document !== "undefined"
      ? document.documentElement.clientWidth || window.innerWidth
      : 0;
  var zoomed = 0;
  if (vv != null && layoutW > 0 && vv.width > 0) {
    if (vv.scale > 2.4 || layoutW / vv.width > 2.4) {
      zoomed = 3;
    } else if (vv.scale > 1.7 || layoutW / vv.width > 1.7) {
      zoomed = 2;
    } else if (vv.scale > 1.2 || layoutW / vv.width > 1.2) {
      zoomed = 1;
    }
  }
  if (zoomed === 0 && typeof window !== "undefined" && window.innerWidth > 0) {
    if (screen.width / window.innerWidth > 2.) {
      zoomed = 3;
    } else if (screen.width / window.innerWidth > 1.7) {
      zoomed = 2;
    } else if (screen.width / window.innerWidth > 1.2) {
      zoomed = 1;
    }
  }

  if (typeof document !== "undefined") {
    if (zoomed > 0) {
      document.documentElement.classList.add("ios-safari-zoomed", "zoom-" + zoomed);
    } else {
      document.documentElement.classList.remove("ios-safari-zoomed", "zoom-" + zoomed);
    }
  }
})();
