"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { memo, useEffect } from "react";
import { GameStoreContext, useGameStore } from "hooks";
import { ModeExpanded, ErrorBoundary } from "components";
import { GAME_MODES_DATA } from "constant";

const MovieSlide = dynamic(() => import("./MovieSlide"), {
  ssr: false,
  loading: () => null,
});

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
  const modeConfig = GAME_MODES_DATA[slug];

  useEffect(() => {
    setVariableVH();
    const debouncedResized = debounce(setVariableVH);
    window.addEventListener("resize", debouncedResized);
    if (modeConfig != null) {
      gameStoreMethods.setCurrentMode(modeConfig);
    }

    return () => {
      window.removeEventListener("resize", debouncedResized);
    };
    // gameStoreMethods is a new object each render; setCurrentMode dispatches the same actions.
  }, [slug, modeConfig]);

  if (modeConfig == null) {
    return (
      <main style={{ padding: "24px", textAlign: "center" }}>
        <p>Unknown game mode.</p>
        <Link href="/">Back to home</Link>
      </main>
    );
  }

  return (
    <GameStoreContext.Provider value={{ ...gameState, gameStoreMethods }}>
      {gameState.error != null ? (
        <ErrorBoundary />
      ) : (
        <>
          {gameState.currentIndex == null && (
            <ModeExpanded currentModeData={modeConfig} />
          )}
          {gameState.currentIndex != null && <MovieSlide />}
        </>
      )}
    </GameStoreContext.Provider>
  );
}

export default memo(GameController);
