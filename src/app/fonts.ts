import {
  Alegreya,
  Anek_Tamil,
  Rubik,
  Poppins,
  Lora,
} from "next/font/google";

/**
 * Variable font: one network file covers 400-700.
 * display:optional caps the swap window at ~100ms so a slow font load
 * cannot delay LCP — the subtitle (which is the LCP element) paints
 * immediately with the size-adjusted fallback and never triggers a late repaint.
 */
export const lora = Lora({
  subsets: ["latin"],
  display: "optional",
});

/** Variable font: one file covers weights used across cards and game UI. */
export const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
});

/**
 * Variable font; preload off so above-the-fold Lora/Rubik win the connection first.
 * Footer text still uses font-display swap and loads when parsed.
 */
export const alegreya = Alegreya({
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/**
 * Static weights only (no variable axis in next/font for Poppins).
 * Used only in the Footer (below fold) — skip the preload so it doesn't
 * compete with LCP image bandwidth on the critical path.
 */
export const poppins = Poppins({
  weight: ["400", "500", "600"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/**
 * Variable font; latin + tamil for movie titles in game pages.
 * Not used on the homepage — skip preload so these 2 files don't
 * consume homepage bandwidth on the critical path.
 */
export const anek = Anek_Tamil({
  subsets: ["latin", "tamil"],
  display: "swap",
  preload: false,
});
