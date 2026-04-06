"use client";
import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { poppins } from "app/fonts";
import styles from "./MovieSlideHeader.module.css";
import { GameStoreContext } from "hooks";
import { useRouter } from "next/navigation";

function formatMmSs(totalSeconds: number): string {
  if (totalSeconds < 0) return "";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function MovieSlideHeader({ handleFailClick }: { handleFailClick: () => void }) {
  const router = useRouter();
  const { currentIndex, currentMode, starsCount, gameStoreMethods } =
    useContext(GameStoreContext)!;
  const timeLimit = currentMode?.timeLimit ?? 60;
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);

  const handleGoHome = useCallback(() => {
    router.push("/");
  }, []);

  useEffect(() => {
    gameStoreMethods.setStartTime(Date.now());
  }, []);

  useEffect(() => {
    let delayAfterBlankId: number | undefined;
    let intervalId: number | undefined;
    let s: number;

    const pump = () => {
      setSecondsLeft(s);
      if (s === 0) {
        handleFailClick();
        window.clearInterval(intervalId);
        return;
      }
      s -= 1;
    };

    const startRound = (startSeconds: number) => {
      window.clearInterval(intervalId);
      s = startSeconds;
      pump();
      intervalId = window.setInterval(pump, 1000) as number;
    };

    const bootstrapId = window.setTimeout(() => {
      if ((currentIndex ?? 0) > 0) {
        setSecondsLeft(-1);
        delayAfterBlankId = window.setTimeout(() => startRound(timeLimit), 250) as number;
      } else {
        startRound(timeLimit);
      }
    }, 0) as number;

    return () => {
      window.clearTimeout(bootstrapId);
      window.clearTimeout(delayAfterBlankId);
      window.clearInterval(intervalId);
    };
  }, [currentIndex, timeLimit]);

  const urgent = secondsLeft > 0 && secondsLeft < 11;

  return (
    <>
      <AiFillHome className={styles.homeIcon} onClick={handleGoHome} />
      <p
        className={`${styles.timer}${urgent ? ` ${styles.timerUrgent} ${styles.timerBlink}` : ""}`}
        style={{ fontFamily: poppins.style.fontFamily }}
      >
        {formatMmSs(secondsLeft)}
      </p>
      {starsCount! > 0 && (
        <div className={styles.starBox}>
          <div className={styles.starIcon} />
          <p
            className={styles.starCount}
            style={{ fontFamily: poppins.style.fontFamily }}
          >
            {starsCount}
          </p>
        </div>
      )}
    </>
  );
}

export default memo(MovieSlideHeader);
