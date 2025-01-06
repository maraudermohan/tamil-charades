"use client";
import {
  RefObject,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { poppins, rubik, lora } from "app/fonts";
import styles from "./ResultsSlide.module.css";
import { GameStoreContext } from "hooks";
import { useRouter } from "next/navigation";

interface ResultsSlideType {
  elementRef: RefObject<HTMLDivElement | null>;
  resultsText: string[];
}

function ResultsSlide({ elementRef, resultsText }: ResultsSlideType) {
  const router = useRouter();
  const { currentIndex, currentMode, starsCount, gameStoreMethods } =
    useContext(GameStoreContext)!;
  const leftStarRef = useRef<HTMLImageElement>(null);
  const midStarRef = useRef<HTMLImageElement>(null);
  const rightStarRef = useRef<HTMLImageElement>(null);
  const timeoutIDs = useRef<ReturnType<typeof setTimeout>[] | null>(null);

  const handleGoHome = useCallback(() => {
    router.push("/");
  }, []);

  useEffect(() => {
    if (timeoutIDs.current == null) {
      timeoutIDs.current = [];
    }
    if (resultsText[0] && resultsText[1]) {
      if (starsCount! > 0) {
        let id = setTimeout(() => {
          leftStarRef.current!.style.opacity = "1";
          leftStarRef.current!.style.width = "55px";
          leftStarRef.current!.style.height = "55px";
        }, 750);
        timeoutIDs.current.push(id);
        if (starsCount! / currentIndex! > 0.4) {
          id = setTimeout(() => {
            midStarRef.current!.style.opacity = "1";
            midStarRef.current!.style.width = "65px";
            midStarRef.current!.style.height = "65px";
          }, 1500);
          timeoutIDs.current.push(id);
        }
        if (starsCount! / currentIndex! > 0.8) {
          id = setTimeout(() => {
            rightStarRef.current!.style.opacity = "1";
            rightStarRef.current!.style.width = "55px";
            rightStarRef.current!.style.height = "55px";
          }, 2000);
          timeoutIDs.current.push(id);
        }
      }
    }
  }, [resultsText]);

  useEffect(() => {
    return () => {
      timeoutIDs.current?.forEach((id) => clearTimeout(id));
    };
  }, []);

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
        onClick={handleGoHome}
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
