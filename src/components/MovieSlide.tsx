"use client";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ImCheckmark } from "react-icons/im";
import { FaFlagCheckered } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import styles from "./MovieSlide.module.css";
import { GameStoreContext } from "hooks";
import { MovieSlideHeader, ResultsSlide, TitleSlide } from "components";

function MovieSlide() {
  const { currentIndex, startTime, gameStoreMethods } =
    useContext(GameStoreContext)!;
  const boxRef = useRef<HTMLDivElement>(null);
  const presentSlideRef = useRef<HTMLDivElement>(null);
  const prevSlideRef = useRef<HTMLDivElement>(null);
  const nextSlideRef = useRef<HTMLDivElement>(null);
  const resultSlideRef = useRef<HTMLDivElement>(null);
  const controlButtonsRef = useRef<HTMLDivElement>(null);
  const [resultsText, setResultsText] = useState<string[]>([]);

  const startAnimation = useCallback(() => {
    boxRef.current!.style.backgroundColor = "#f5fffa";
    prevSlideRef.current!.style.visibility = "hidden";
    prevSlideRef.current!.style.transform = "translateX(0)";
    presentSlideRef.current!.style.visibility = "visible";
    nextSlideRef.current!.style.visibility = "hidden";
    nextSlideRef.current!.style.transform = "translateX(120%)";
    resultSlideRef.current!.style.visibility = "hidden";
    setTimeout(() => {
      if (controlButtonsRef.current) {
        controlButtonsRef.current!.style.pointerEvents = "auto";
        controlButtonsRef.current!.style.opacity = "1";
      }
    }, 1000);
  }, []);

  const endAnimation = useCallback((isPass: boolean) => {
    boxRef.current!.style.backgroundColor = isPass
      ? "rgba(72,209,204,.5)"
      : "rgba(209,72,77,.5)";
    presentSlideRef.current!.style.visibility = "hidden";
    prevSlideRef.current!.style.visibility = "visible";
    prevSlideRef.current!.style.transform = "translateX(-120%)";
    nextSlideRef.current!.style.visibility = "visible";
    nextSlideRef.current!.style.transform = "translateX(0)";
    controlButtonsRef.current!.style.pointerEvents = "none";
    controlButtonsRef.current!.style.opacity = "0";
  }, []);

  const resultAnimation = useCallback(() => {
    const newTime = new Date().getTime();
    const totalTime = Math.round((newTime - startTime!) / 1000) + 1;
    const totalMinutes = Math.floor(totalTime / 60);
    const totalSeconds = totalTime % 60;
    if (currentIndex === 0) {
      setResultsText([
        `${totalMinutes < 10 ? "0" : ""}${totalMinutes} : ${
          totalSeconds < 10 ? "0" : ""
        }${totalSeconds}`,
        "00 : 00",
      ]);
    } else {
      const AverageTime = Math.ceil(totalTime / currentIndex!);
      const AverageMinutes = Math.floor(AverageTime / 60);
      const AverageSeconds = AverageTime % 60;
      setResultsText([
        `${totalMinutes < 10 ? "0" : ""}${totalMinutes} : ${
          totalSeconds < 10 ? "0" : ""
        }${totalSeconds}`,
        `${AverageMinutes < 10 ? "0" : ""}${AverageMinutes} : ${
          AverageSeconds < 10 ? "0" : ""
        }${AverageSeconds}`,
      ]);
    }
    resultSlideRef.current!.style.visibility = "visible";
    resultSlideRef.current!.style.transform = "translateX(0)";
  }, [currentIndex, startTime]);

  const handleFailClick = useCallback(() => {
    setTimeout(gameStoreMethods.updateFailAnswer, 300);
    endAnimation(false);
  }, []);

  const handlePassClick = useCallback(() => {
    setTimeout(gameStoreMethods.updatePassAnswer, 300);
    endAnimation(true);
  }, []);

  useEffect(() => {
    startAnimation();
  }, [currentIndex]);

  return (
    <div className={styles.movieSlideBox} ref={boxRef}>
      <MovieSlideHeader />
      <TitleSlide elementRef={presentSlideRef} movieIndex={currentIndex!} />
      <TitleSlide elementRef={prevSlideRef} movieIndex={currentIndex!} />
      <TitleSlide elementRef={nextSlideRef} movieIndex={currentIndex! + 1} />
      <ResultsSlide elementRef={resultSlideRef} resultsText={resultsText} />
      <div ref={controlButtonsRef} className={styles.controlButtonsBox}>
        <div
          className={`${styles.controlButton} ${styles.stopButton}`}
          onClick={resultAnimation}
        >
          <FaFlagCheckered className={styles.stopControlIcon} />
        </div>
        <div
          className={`${styles.controlButton} ${styles.passButton}`}
          onClick={handlePassClick}
        >
          <ImCheckmark className={styles.passControlIcon} />
        </div>
        <div
          className={`${styles.controlButton} ${styles.failButton}`}
          onClick={handleFailClick}
        >
          <ImCross className={styles.failControlIcon} />
        </div>
      </div>
    </div>
  );
}

export default memo(MovieSlide);
