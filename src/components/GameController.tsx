"use client";
import { memo, useEffect } from "react";
import { GameStoreContext, useGameStore } from "hooks";
import { MovieSlide, ModeExpanded, ErrorBoundary } from "components";
import { GAME_MODES_DATA } from "constant";

const debounce = (callback: Function) => {
  let timeoutId: null | ReturnType<typeof setTimeout> = null;

  return () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback();
      timeoutId = null;
    }, 300);
  };
};

const setVariableVH = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

interface GameControllerType {
  slug: string;
}

function GameController({ slug }: GameControllerType) {
  const [gameState, gameStoreMethods] = useGameStore();

  useEffect(() => {
    setVariableVH();
    const debouncedResized = debounce(setVariableVH);
    window.addEventListener("resize", debouncedResized);
    gameStoreMethods.setCurrentMode(GAME_MODES_DATA[slug]);

    return () => {
      window.removeEventListener("resize", debouncedResized);
    };
  }, []);

  return (
    <GameStoreContext.Provider value={{ ...gameState, gameStoreMethods }}>
      {gameState.error != null ? (
        <ErrorBoundary />
      ) : (
        <>
          {gameState.currentIndex == null && (
            <ModeExpanded currentModeData={GAME_MODES_DATA[slug]} />
          )}
          {gameState.currentIndex != null && <MovieSlide />}
        </>
      )}
    </GameStoreContext.Provider>
  );
}

export default memo(GameController);
