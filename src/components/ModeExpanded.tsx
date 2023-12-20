"use client";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AiFillHome } from "react-icons/ai";
import { IoPlay } from "react-icons/io5";
import { lora, poppins, rubik } from "app/fonts";
import { DifficultySlider } from "components";
import { GameStoreContext, fetchData } from "hooks";
import styles from "./ModeExpanded.module.css";
import { ErrorStates, GameModeType } from "constant";

interface ModeExpandedType {
  currentModeData: GameModeType;
}

function ModeExpanded({ currentModeData }: ModeExpandedType) {
  const router = useRouter();
  const { gameStoreMethods } = useContext(GameStoreContext)!;
  const [difficulty, setDifficulty] = useState<number>(2);
  const elementRef = useRef<HTMLDivElement>(null);
  const intervalId = useRef<any>(null);
  const timerCount = useRef<any>(null);
  const [isSubmitted, setIsSubmitted] = useState<number | null>(null);

  const fetchMovies = useCallback(async () => {
    const modeUrl = currentModeData?.endpoint! + (currentModeData?.title !== "Kids Mode" ? difficulty : '');
    const result = await fetchData(modeUrl);
    if (!result) {
      gameStoreMethods.setError(ErrorStates.BACKEND_FAIL);
      return;
    }
    gameStoreMethods.setCurrentDifficulty(difficulty);
    gameStoreMethods.updateMoviesList(result);
  }, [currentModeData, difficulty, gameStoreMethods]);

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

  const handleGoHome = useCallback(() => {
    router.push("/");
  }, []);

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
            style={{
              backgroundImage: `url(${currentModeData!.backgroundImage})`,
            }}
            className={`${styles.modeImage} ${
              currentModeData?.title &&
              styles[currentModeData.title.split(" ")[0]]
            }`}
          />
          <div className={styles.layout}>
            <AiFillHome className={styles.homeIcon} onClick={handleGoHome} />
            <h3
              className={styles.modeTitle}
              style={{ fontFamily: rubik.style.fontFamily }}
            >
              {currentModeData?.title}
            </h3>
            <p
              className={`${styles.modeDescription} ${
                currentModeData.title === "Classic Mode"
                  ? styles.modeDescriptionClassic
                  : null
              }`}
              style={{ fontFamily: lora.style.fontFamily }}
              dangerouslySetInnerHTML={{
                __html: currentModeData?.description!,
              }}
            />
            <div className={styles.controlsBox}>
              {
                currentModeData?.title !== "Kids Mode" && (
                  <DifficultySlider
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                  />
                )
              }
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
