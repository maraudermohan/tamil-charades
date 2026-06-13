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
import { GameStoreContext } from "hooks";
import { fetchData } from "utils";
import styles from "./ModeExpanded.module.css";
import { ErrorStates, GameModeType, type MoviesListType } from "constant";

interface ModeExpandedType {
  currentModeData: GameModeType;
}

function ModeExpanded({ currentModeData }: ModeExpandedType) {
  const router = useRouter();
  const { gameStoreMethods } = useContext(GameStoreContext)!;
  const [difficulty, setDifficulty] = useState<number>(2);
  const elementRef = useRef<HTMLDivElement>(null);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);
  const playBusyRef = useRef(false);
  const [playLocked, setPlayLocked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<number | null>(null);

  const COUNTDOWN_MS = 1000;
  const COUNTDOWN_START = 3;

  const fetchMovies = useCallback(async (): Promise<false | MoviesListType[]> => {
    const modeUrl =
      currentModeData?.endpoint! +
      (currentModeData?.title !== "Kids Mode" ? difficulty : "");
    const result = await fetchData(modeUrl);
    if (!result) {
      gameStoreMethods.setError(ErrorStates.BACKEND_FAIL);
      return false;
    }
    gameStoreMethods.setCurrentDifficulty(difficulty);
    gameStoreMethods.updateMoviesList(result);
    return result;
  }, [currentModeData, difficulty, gameStoreMethods]);

  const handleSubmit = useCallback(() => {
    if (playBusyRef.current) {
      return;
    }
    playBusyRef.current = true;
    setPlayLocked(true);

    const fetchPromise = fetchMovies();

    let remaining = COUNTDOWN_START;
    setIsSubmitted(remaining);

    if (intervalId.current != null) {
      clearInterval(intervalId.current);
    }

    intervalId.current = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setIsSubmitted(remaining);
        return;
      }

      if (intervalId.current != null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }

      void (async () => {
        const ok = await fetchPromise;
        playBusyRef.current = false;
        setPlayLocked(false);
        setIsSubmitted(null);
        if (ok) {
          gameStoreMethods.startGame();
        }
      })();
    }, COUNTDOWN_MS);
  }, [fetchMovies, gameStoreMethods]);

  const handleGoHome = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    setTimeout(() => {
      elementRef.current!.style.transform = "translateX(0)";
    }, 0);

    return () => {
      if (intervalId.current != null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, []);

  return (
    <div ref={elementRef} className={styles.modeExpandedBox}>
      {isSubmitted == null ? (
        <>
          <div
            style={{
              "--bg-sm": `url(${currentModeData!.backgroundSm.src})`,
              "--bg-md": `url(${currentModeData!.backgroundMd.src})`,
              "--bg-lg": `url(${currentModeData!.backgroundLg.src})`,
            } as React.CSSProperties}
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
              {currentModeData?.mode === "hollywood" ? "Hollywood" : currentModeData?.title}
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
            <div
              className={styles.controlsBox}
              style={{
                justifyContent: currentModeData?.title !== "Kids Mode" ? "space-between" : "center",
              }}
            >
              {
                currentModeData?.title !== "Kids Mode" && (
                  <DifficultySlider
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                  />
                )
              }
              <button
                type="button"
                className={styles.modePlayButton}
                onClick={handleSubmit}
                disabled={playLocked}
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
