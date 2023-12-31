"use client";
import { MouseEvent, TouchEvent, memo, useCallback } from "react";
import { poppins } from "app/fonts";
import styles from "./DifficultySlider.module.css";

interface DifficultySliderType {
  difficulty: number;
  setDifficulty: (argo0: number) => void;
}

function DifficultySlider({ difficulty, setDifficulty }: DifficultySliderType) {
  const styleValue = [
    {
      background: "rgb(255,194,173)",
      left: "0%",
    },
    {
      background: "rgb(255,148,112)",
      left: "50%",
      transform: "translateX(-50%)",
    },
    {
      background: "rgb(255,102,51)",
      left: "100%",
      transform: "translateX(-100%)",
    },
  ] as const;

  const toggleDifficulty = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const newValue = (event.target as HTMLElement).dataset["value"];
      if (!Number.isNaN(+newValue!) && +newValue! !== difficulty) {
        setDifficulty(+newValue!);
      }
    },
    [difficulty]
  );

  return (
    <div className={styles.difficultySliderBox}>
      <button
        className={`${styles.difficultyLabel} ${styles.difficultyLabelFirst}`}
        style={{ fontFamily: poppins.style.fontFamily }}
        data-value={1}
        onClick={toggleDifficulty}
      >
        EASY
      </button>
      <div className={styles.sliderInput} onClick={toggleDifficulty}>
        <span className={styles.sliderBg} />
        <span
          className={styles.sliderInputControl}
          style={styleValue[difficulty - 1]}
        />
        <span className={styles.sliderValue1} data-value={1} />
        <span
          className={`${styles.sliderCircle} ${styles.sliderCircle1} sliderCircle1`}
        />
        <span className={styles.sliderValue2} data-value={2} />
        <span
          className={`${styles.sliderCircle} ${styles.sliderCircle2} sliderCircle2`}
        />
        <span className={styles.sliderValue3} data-value={3} />
        <span
          className={`${styles.sliderCircle} ${styles.sliderCircle3} sliderCircle3`}
        />
      </div>
      <button
        className={`${styles.difficultyLabel} ${styles.difficultyLabelLast}`}
        style={{ fontFamily: poppins.style.fontFamily }}
        data-value={3}
        onClick={toggleDifficulty}
      >
        HARD
      </button>
    </div>
  );
}

export default memo(DifficultySlider);
