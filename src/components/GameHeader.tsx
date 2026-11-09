"use client";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { BsPauseFill } from "react-icons/bs";
import PageHeader from "@/components/PageHeader";
import ThemeToggle from "@/components/ThemeToggle";
import { getModeShortTitle } from "@/constant/gameModes";
import { useGameStore } from "@/hooks/useGameStore";
import styles from "./GameHeader.module.css";

type GameHeaderProps = {
  /**
   * `intro`: home and the theme switch (details sheet, error screen).
   * `countdown`: home and the mode chip.
   * `game`: home, the mode chip and Pause. Home asks before leaving.
   */
  stage: "intro" | "countdown" | "game";
};

/** The game page's header. MovieSlide renders the Pause and Exit dialogs it opens. */
function GameHeader({ stage }: GameHeaderProps) {
  const { state, actions } = useGameStore();
  const router = useRouter();
  const inGame = stage === "game";

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Modified clicks open home in a new tab and leave this game running.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    if (actions.ignoresTaps()) {
      return;
    }
    actions.openDialog("exit");
    router.prefetch("/");
  };

  const handlePauseClick = () => {
    if (!actions.ignoresTaps()) {
      actions.openDialog("pause");
    }
  };

  return (
    <PageHeader
      chip={stage === "intro" ? undefined : getModeShortTitle(state.mode)}
      onHomeClick={inGame ? handleHomeClick : undefined}
    >
      {stage === "intro" && <ThemeToggle />}
      {inGame && (
        <button
          type="button"
          className={styles.pause}
          aria-label="Pause"
          aria-haspopup="dialog"
          onClick={handlePauseClick}
        >
          <BsPauseFill className={styles.pauseIcon} aria-hidden />
          <span className={styles.pauseLabel}>Pause</span>
        </button>
      )}
    </PageHeader>
  );
}

export default GameHeader;
