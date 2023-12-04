"use client";
import { RefObject, memo, useContext, useEffect, useRef } from "react";
import { poppins, rubik, lora } from "app/fonts";
import styles from "./ResultsSlide.module.css";
import { GameStoreContext } from "hooks";

interface ResultsSlideType {
  elementRef: RefObject<HTMLDivElement>;
  resultsText: string[];
}

function ResultsSlide({ elementRef, resultsText }: ResultsSlideType) {
  const { currentIndex, currentMode, starsCount, gameStoreMethods } =
    useContext(GameStoreContext)!;
  const leftStarRef = useRef<HTMLImageElement>(null);
  const midStarRef = useRef<HTMLImageElement>(null);
  const rightStarRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (resultsText[0] && resultsText[1]) {
      if (starsCount! > 0) {
        setTimeout(() => {
          leftStarRef.current!.style.opacity = "1";
          leftStarRef.current!.style.width = "55px";
          leftStarRef.current!.style.height = "55px";
        }, 750);
        if (starsCount! / currentIndex! > 0.4) {
          setTimeout(() => {
            midStarRef.current!.style.opacity = "1";
            midStarRef.current!.style.width = "65px";
            midStarRef.current!.style.height = "65px";
          }, 1500);
        }
        if (starsCount! / currentIndex! > 0.8) {
          setTimeout(() => {
            rightStarRef.current!.style.opacity = "1";
            rightStarRef.current!.style.width = "55px";
            rightStarRef.current!.style.height = "55px";
          }, 2000);
        }
      }
    }
  }, [resultsText]);

  return (
    <div ref={elementRef} className={styles.resultsSlideBox}>
      <div className={styles.scoreboard}>
        <div ref={leftStarRef} className={styles.starIconLeft} />
        <div ref={midStarRef} className={styles.starIconMid} />
        <div ref={rightStarRef} className={styles.starIconRight} />
        <h4
          className={styles.starsCount}
          style={{ fontFamily: lora.style.fontFamily }}
        >
          {starsCount}
        </h4>
        <p
          className={styles.totalCount}
          style={{ fontFamily: poppins.style.fontFamily }}
        >{`/ ${currentIndex!}`}</p>
      </div>
      <div className={styles.timeBoard}>
        <p
          className={styles.totalKey}
          style={{ fontFamily: rubik.style.fontFamily }}
        >
          Total time :
        </p>
        <p
          className={styles.totalValue}
          style={{ fontFamily: poppins.style.fontFamily }}
        >
          {resultsText[0] || ""}
        </p>
        <p
          className={styles.AverageKey}
          style={{ fontFamily: rubik.style.fontFamily }}
        >
          Average time per{" "}
          {currentMode?.title === "Song Mode" ? "song :" : "movie :"}
        </p>
        <p
          className={styles.AverageValue}
          style={{ fontFamily: poppins.style.fontFamily }}
        >
          {resultsText[1] || ""}
        </p>
      </div>
      <button
        className={styles.continueButton}
        onClick={() => gameStoreMethods.resetStore()}
        style={{ fontFamily: poppins.style.fontFamily }}
      >
        CONTINUE
      </button>
      <div className={styles.orangeBg} />
      <div className={styles.patternBg} />
    </div>
  );
}

export default memo(ResultsSlide);
