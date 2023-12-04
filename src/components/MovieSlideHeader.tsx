"use client";
import { memo, useCallback, useContext, useEffect, useRef } from "react";
import { AiFillHome } from "react-icons/ai";
import { poppins  } from "app/fonts";
import styles from "./MovieSlideHeader.module.css";
import { GameStoreContext } from "hooks";

function MovieSlideHeader() {
  const { starsCount, gameStoreMethods } = useContext(GameStoreContext)!;
  const intervalId = useRef<any>(null);
  const dateRef = useRef<any>(null);
  const elementRef = useRef<HTMLParagraphElement>(null);

  const updateTimer = useCallback(() => {
    const newTime = new Date().getTime();
    const totalSeconds = Math.round((newTime - dateRef.current) / 1000) + 1;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    elementRef.current!.innerHTML = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }, []);

  useEffect(() => {
    dateRef.current = new Date().getTime();
    gameStoreMethods.setStartTime(dateRef.current);
    updateTimer();
    intervalId.current = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(intervalId.current!);
    };
  }, []);

  return (
    <>
      <AiFillHome
        className={styles.homeIcon}
        onClick={gameStoreMethods.resetStore}
      />
      <p
        ref={elementRef}
        className={styles.timer}
        style={{ fontFamily: poppins.style.fontFamily }}
      >
        0
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
