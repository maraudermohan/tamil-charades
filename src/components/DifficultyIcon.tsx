import type { DifficultyLevel } from "@/constant/gameModes";
import styles from "./DifficultyIcon.module.css";

/* A half-dial split into three sections (left to right), filled up to the level. */
const CX = 24;
const CY = 24;
const R_OUTER = 21;
const R_INNER = 13;

/** Rounded so the server-rendered markup matches the client's exactly. */
function point(radius: number, degrees: number): string {
  const radians = (degrees * Math.PI) / 180;
  const x = CX + radius * Math.cos(radians);
  const y = CY - radius * Math.sin(radians);
  return `${x.toFixed(2)} ${y.toFixed(2)}`;
}

/** An annular sector from `from` down to `to` degrees (0 is the right end, 180 the left). */
function sectorPath(from: number, to: number): string {
  return [
    `M${point(R_OUTER, from)}`,
    `A${R_OUTER} ${R_OUTER} 0 0 1 ${point(R_OUTER, to)}`,
    `L${point(R_INNER, to)}`,
    `A${R_INNER} ${R_INNER} 0 0 0 ${point(R_INNER, from)}`,
    "Z",
  ].join(" ");
}

const SECTIONS = [sectorPath(180, 120), sectorPath(120, 60), sectorPath(60, 0)];

const FILLS: Record<DifficultyLevel, string> = {
  1: styles.easy,
  2: styles.medium,
  3: styles.hard,
};

type DifficultyIconProps = {
  level: DifficultyLevel;
  className?: string;
};

function DifficultyIcon({ level, className }: DifficultyIconProps) {
  return (
    <svg
      viewBox="2 2 44 23"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      aria-hidden
    >
      {SECTIONS.map((path, index) => (
        <path
          key={path}
          d={path}
          strokeWidth={1.75}
          vectorEffect="non-scaling-stroke"
          className={index < level ? FILLS[level] : undefined}
        />
      ))}
    </svg>
  );
}

export default DifficultyIcon;
