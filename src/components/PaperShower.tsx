import type { CSSProperties } from "react";
import styles from "./PaperShower.module.css";

const COLORS = ["highlight", "highlight-playful", "secondary-text", "accent-text"] as const;

/**
 * Fixed values rather than Math.random() so the server and client render the same markup.
 * x is a viewport percentage, times are seconds and sizes pixels. Negative delays start each
 * piece partway through its fall, so the shower is already under way on load. Phones show
 * only the first ten.
 */
const PIECES = [
  { x: 97.4, fall: 11, delay: -3.2, flutter: 1.7, sway: 22, width: 10, height: 6 },
  { x: 77.7, fall: 17, delay: -9.2, flutter: 2.2, sway: 20, width: 11, height: 6 },
  { x: 16.5, fall: 14, delay: -9.8, flutter: 1.5, sway: 21, width: 9, height: 8 },
  { x: 46.3, fall: 17.5, delay: -9, flutter: 2.5, sway: 21, width: 10, height: 7 },
  { x: 29.9, fall: 18.3, delay: -6.8, flutter: 1.8, sway: 23, width: 9, height: 5 },
  { x: 61.2, fall: 13.4, delay: -4, flutter: 2.5, sway: 19, width: 11, height: 8 },
  { x: 39.6, fall: 11.5, delay: -6.4, flutter: 2, sway: 17, width: 8, height: 8 },
  { x: 66.5, fall: 11.4, delay: -3.9, flutter: 2.2, sway: 25, width: 10, height: 5 },
  { x: 52.2, fall: 14.2, delay: -5.2, flutter: 1.9, sway: 15, width: 10, height: 7 },
  { x: 5, fall: 12.9, delay: -5.9, flutter: 2.4, sway: 20, width: 10, height: 7 },
  { x: 84.2, fall: 15, delay: -14.1, flutter: 1.9, sway: 21, width: 8, height: 7 },
  { x: 10.5, fall: 13.8, delay: -5.4, flutter: 2.4, sway: 24, width: 8, height: 7 },
  { x: 71.1, fall: 11.6, delay: -1.8, flutter: 1.5, sway: 26, width: 8, height: 7 },
  { x: 34.1, fall: 12.2, delay: -7.2, flutter: 1.6, sway: 25, width: 11, height: 8 },
  { x: 20.2, fall: 18.1, delay: -13.8, flutter: 1.7, sway: 10, width: 8, height: 5 },
  { x: 92.4, fall: 11, delay: -2.5, flutter: 2.3, sway: 18, width: 10, height: 6 },
];

/**
 * Paper bits drifting down the homepage, like the paper fans throw at the screen in Tamil
 * theatres. CSS-only: each piece falls (outer span) while it sways and flips (inner span).
 */
function PaperShower() {
  return (
    <div className={styles.shower} aria-hidden>
      {PIECES.map((piece, index) => (
        <span
          key={index}
          className={styles.fall}
          style={
            {
              "--x": `${piece.x}%`,
              "--fall": `${piece.fall}s`,
              "--delay": `${piece.delay}s`,
              "--flutter": `${piece.flutter}s`,
              "--sway": `${piece.sway}px`,
              "--width": `${piece.width}px`,
              "--height": `${piece.height}px`,
              "--color": `var(--color-${COLORS[index % COLORS.length]})`,
            } as CSSProperties
          }
        >
          <span className={styles.paper} />
        </span>
      ))}
    </div>
  );
}

export default PaperShower;
