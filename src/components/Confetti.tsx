"use client";
import { useEffect, useState, type CSSProperties } from "react";
import styles from "./Confetti.module.css";

const PIECE_COUNT = 80;
/** Longest piece (delay + duration) is under this, so nothing is cut off mid-flight. */
const LIFETIME_MS = 4000;
const COLORS = ["highlight", "success", "danger", "accent", "surface"] as const;
const SHAPES = ["rect", "dot", "streamer"] as const;

type Piece = {
  id: number;
  shape: (typeof SHAPES)[number];
  style: CSSProperties;
};

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Half the pieces fire from the bottom-left corner, half from the bottom-right, aimed inward. */
function makePieces(): Piece[] {
  return Array.from({ length: PIECE_COUNT }, (_, id) => {
    const fromLeft = id % 2 === 0;
    const peak = random(45, 85);
    return {
      id,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      style: {
        [fromLeft ? "left" : "right"]: 0,
        "--dx": `${(fromLeft ? 1 : -1) * random(10, 70)}vw`,
        "--peak": `${-peak}dvh`,
        "--fall": `${-peak + random(35, 60)}dvh`,
        "--spin": `${(Math.random() < 0.5 ? -1 : 1) * random(360, 1080)}deg`,
        "--flutter": `${random(0.4, 0.9)}s`,
        "--duration": `${random(2.4, 3.4)}s`,
        // Starts once the results screen's view transition (0.3s) has slid it in.
        "--delay": `${random(0.3, 0.6)}s`,
        "--color": `var(--color-${COLORS[Math.floor(Math.random() * COLORS.length)]})`,
      } as CSSProperties,
    };
  });
}

/** One-off burst of confetti and streamers. Mount it to fire; it removes itself when done. */
function Confetti() {
  const [pieces] = useState(makePieces);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const doneId = setTimeout(() => setDone(true), LIFETIME_MS);
    return () => clearTimeout(doneId);
  }, []);

  if (done) {
    return null;
  }

  return (
    <div className={styles.confetti} aria-hidden>
      {pieces.map(({ id, shape, style }) => (
        <span key={id} className={styles.drift} style={style}>
          <span className={styles.rise}>
            <span className={`${styles.piece} ${styles[shape]}`} />
          </span>
        </span>
      ))}
    </div>
  );
}

export default Confetti;
