"use client";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiFillHome } from "react-icons/ai";
import { IoPlay } from "react-icons/io5";
import { lora, poppins, rubik } from "app/fonts";
import { DifficultySlider } from "components";
import { GameStoreContext, fetchData } from "hooks";
import styles from "./ModeExpanded.module.css";
import { ErrorStates } from "constant";

function ModeExpanded() {
  const { currentMode, gameStoreMethods } = useContext(GameStoreContext)!;
  const [difficulty, setDifficulty] = useState<number>(2);
  const elementRef = useRef<HTMLDivElement>(null);
  const intervalId = useRef<any>(null);
  const timerCount = useRef<any>(null);
  const [isSubmitted, setIsSubmitted] = useState<number | null>(null);

  const fetchMovies = useCallback(async () => {
    const result = await fetchData(currentMode?.endpoint! + difficulty);
    if (!result) {
      gameStoreMethods.setError(ErrorStates.BACKEND_FAIL);
      return;
    }
    gameStoreMethods.setCurrentDifficulty(difficulty);
    gameStoreMethods.updateMoviesList(result);
  }, [currentMode, difficulty, gameStoreMethods]);

  const handleSubmit = useCallback(() => {
    fetchMovies();
    if (timerCount.current == null) {
      timerCount.current = 3;
      setIsSubmitted(3);
    }
    intervalId.current = setInterval(() => {
      if (timerCount.current === 1) {
        clearInterval(intervalId.current);
        setIsSubmitted(null);
        gameStoreMethods.startGame();
      } else if (timerCount.current > 0) {
        timerCount.current -= 1;
        setIsSubmitted(timerCount.current);
      }
    }, 1050);
  }, [fetchMovies]);

  useEffect(() => {
    setTimeout(() => {
      elementRef.current!.style.transform = "translateX(0)";
    }, 0);

    return () => {
      clearInterval(intervalId.current);
    };
  }, []);

  return (
    <div ref={elementRef} className={styles.modeExpandedBox}>
      {isSubmitted == null ? (
        <>
          <div
            style={{ backgroundImage: `url(${currentMode!.backgroundImage})` }}
            className={`${styles.modeImage} ${currentMode?.title && styles[currentMode.title.split(' ')[0]]}`}
          />
          <div className={styles.layout}>
            <AiFillHome
              className={styles.homeIcon}
              onClick={gameStoreMethods.resetStore}
            />
            <h3
              className={styles.modeTitle}
              style={{ fontFamily: rubik.style.fontFamily }}
            >
              {currentMode?.title}
            </h3>
            <p
              className={styles.modeDescription}
              style={{ fontFamily: lora.style.fontFamily }}
              dangerouslySetInnerHTML={{ __html: currentMode?.description! }}
            />
            <div className={styles.controlsBox}>
              <DifficultySlider
                difficulty={difficulty}
                setDifficulty={setDifficulty}
              />
              <button
                className={styles.modePlayButton}
                onClick={handleSubmit}
                style={{ fontFamily: poppins.style.fontFamily }}
              >
                PLAY
                <IoPlay className={styles.modePlayIcon} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <h3
          className={styles.timer}
          style={{ fontFamily: rubik.style.fontFamily }}
        >
          {isSubmitted}
        </h3>
      )}
    </div>
  );
}

export default memo(ModeExpanded);
