"use client";
import { memo, useEffect, useState } from "react";
import { GameStoreContext, useGameStore } from "hooks";
import {
  ModeCardsManager,
  MovieSlide,
  ModeExpanded,
  ErrorBoundary,
} from "components";

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
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function GameController() {
  const [gameState, gameStoreMethods] = useGameStore();
  const [showModes, setShowModes] = useState<boolean>(true);

  useEffect(() => {
    setVariableVH();
    const debouncedResized = debounce(setVariableVH);
    window.addEventListener('resize', debouncedResized);

    return () => {
      window.removeEventListener('resize', debouncedResized);
    };
  }, []);

  useEffect(() => {
    if (gameState.currentMode == null) {
      setShowModes(true);
    } else {
      setTimeout(() => setShowModes(false), 500);
    }
  }, [gameState.currentMode]);

  return (
    <GameStoreContext.Provider value={{ ...gameState, gameStoreMethods }}>
      {gameState.error != null ? (
        <ErrorBoundary />
      ) : (
        <>
          {showModes && <ModeCardsManager />}
          {gameState.currentMode != null && gameState.currentIndex == null && (
            <ModeExpanded />
          )}
          {gameState.currentMode != null && gameState.currentIndex != null && (
            <MovieSlide />
          )}
        </>
      )}
    </GameStoreContext.Provider>
  );
}

export default memo(GameController);
