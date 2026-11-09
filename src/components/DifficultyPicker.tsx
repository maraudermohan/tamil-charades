"use client";
import { useId } from "react";
import DifficultyIcon from "@/components/DifficultyIcon";
import type { DifficultyLevel } from "@/constant/gameModes";
import styles from "./DifficultyPicker.module.css";

const LEVELS = [
  { value: 1, label: "Easy" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Hard" },
] as const;

type DifficultyPickerProps = {
  value: DifficultyLevel;
  onChange: (value: DifficultyLevel) => void;
  className?: string;
};

/** Three attached icon buttons; radio inputs underneath, so arrow keys and screen readers work. */
function DifficultyPicker({ value, onChange, className }: DifficultyPickerProps) {
  const difficultyLabel = LEVELS.find((level) => level.value === value)?.label;
  const name = useId();

  return (
    <fieldset className={className ? `${styles.picker} ${className}` : styles.picker}>
      <legend className={styles.label}>Difficulty <span>- {difficultyLabel}</span></legend>
      <div className={styles.options}>
        {LEVELS.map((level) => (
          <label key={level.value} className={styles.option} title={level.label}>
            <input
              type="radio"
              name={name}
              value={level.value}
              checked={value === level.value}
              onChange={() => onChange(level.value)}
              className={`visually-hidden ${styles.input}`}
            />
            <span className={styles.face}>
              <DifficultyIcon level={level.value} className={styles.icon} />
              <span className="visually-hidden">{level.label}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default DifficultyPicker;
