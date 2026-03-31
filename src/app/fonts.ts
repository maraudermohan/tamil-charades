import {
  Alegreya,
  Anek_Tamil,
  Rubik,
  Poppins,
  Lora,
} from "next/font/google";

/** Variable font: one network file covers 400-700 (header, body, headings). */
export const lora = Lora({
  subsets: ["latin"],
  display: "swap",
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

/** Static weights only (no variable axis in next/font for Poppins). */
export const poppins = Poppins({
  weight: ["400", "500", "600"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

/** Variable font; latin + tamil for movie titles. */
export const anek = Anek_Tamil({
  subsets: ["latin", "tamil"],
  display: "swap",
});
