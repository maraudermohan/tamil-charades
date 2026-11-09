"use client";
import { useRouter } from "next/navigation";
import {
  createContext,
  use,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { IoClose } from "react-icons/io5";
import ModeDetailsSheet from "@/components/ModeDetailsSheet";
import { GAME_MODES_DATA, isGameSlug, type GameSlug } from "@/constant/gameModes";
import { useModalDialog } from "@/hooks/useModalDialog";
import { getRememberedDifficulty } from "@/utils/difficultyMemory";
import { markPlayIntent } from "@/utils/playIntent";
import styles from "./ModeDetailsDialog.module.css";

/**
 * Mashing Play Again or the exit Confirm keeps tapping after the homepage appears: one tap opens a
 * card's dialog and the next would land on its Play and start a game nobody chose. So Play
 * ignores taps this soon after the dialog opens…
 */
const PLAY_AFTER_OPEN_MS = 400;
/** …and taps this close to the previous one, so a mash stays ignored but a normal retry counts. */
const PLAY_MASH_GAP_MS = 300;
/** The mode cards ignore taps this soon after the homepage appears, so the mash opens nothing. */
const CARDS_AFTER_ARRIVAL_MS = 400;

type ModeDetailsDialogProps = {
  slug: GameSlug;
  /** X, overlay, Esc, or the browser closing the dialog itself; called at most once. */
  onClose: () => void;
};

/**
 * A mode's details sheet over the homepage, opened from its mode card without changing the URL.
 * Play goes to the game page, which starts the countdown at the difficulty picked here. Mount it
 * to open it and unmount it to close it; like ConfirmDialog, the page underneath is inert and
 * scroll-locked while it's open, and focus returns to the card on close.
 */
function ModeDetailsDialog({ slug, onClose }: ModeDetailsDialogProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedOverlayRef = useRef(false);
  const leavingRef = useRef(false);
  const openedAtRef = useRef(0);
  const lastPlayTapAtRef = useRef(-Infinity);
  const [difficulty, setDifficulty] = useState(() => getRememberedDifficulty(slug));
  const titleId = useId();
  const href = `/game/${slug}` as const;

  useModalDialog(dialogRef);

  useEffect(() => {
    openedAtRef.current = performance.now();
  }, []);

  // The mode cards don't prefetch, so fetch the game page while the player reads the rules.
  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  // Closing goes back in history, so a second Esc, click or `close` event must not go back again.
  const requestClose = () => {
    if (!leavingRef.current) {
      leavingRef.current = true;
      onClose();
    }
  };

  const handlePlay = () => {
    const now = performance.now();
    const sincePreviousTap = now - lastPlayTapAtRef.current;
    lastPlayTapAtRef.current = now;
    if (now - openedAtRef.current < PLAY_AFTER_OPEN_MS || sincePreviousTap < PLAY_MASH_GAP_MS) {
      return;
    }
    leavingRef.current = true;
    markPlayIntent({ slug, difficulty });
    // Replaces the dialog's history entry, so Back from the game returns to the homepage.
    router.replace(href);
  };

  const handleNativeCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    requestClose();
  };

  // Only a press that starts and ends on the overlay closes, so a drag out of the panel doesn't.
  const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    pressedOverlayRef.current = event.target === event.currentTarget;
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (pressedOverlayRef.current && event.target === event.currentTarget) {
      requestClose();
    }
    pressedOverlayRef.current = false;
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={handleNativeCancel}
      // Chrome can skip `cancel` and close outright on repeated Esc; unmount then too.
      onClose={requestClose}
      onPointerDown={handlePointerDown}
      onClick={handleOverlayClick}
    >
      <div className={styles.panel}>
        <button type="button" className={styles.close} aria-label="Close" onClick={requestClose}>
          <IoClose className={styles.closeIcon} aria-hidden />
        </button>
        <ModeDetailsSheet
          mode={GAME_MODES_DATA[slug]}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onPlay={handlePlay}
          inDialog
          titleId={titleId}
        />
      </div>
    </dialog>
  );
}

const OpenModeDetailsContext = createContext<((slug: GameSlug) => void) | null>(null);

const HISTORY_KEY = "modeDetails";

function slugFromHistory(state: unknown): GameSlug | null {
  const value = (state as Record<string, unknown> | null)?.[HISTORY_KEY];
  return typeof value === "string" && isGameSlug(value) ? value : null;
}

/**
 * Hosts the homepage's mode dialog; ModeCardLink opens it. The open dialog has its own history
 * entry on the same URL, so Back closes it, Forward reopens it and a reload keeps it open.
 */
export function ModeDetailsDialogProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<GameSlug | null>(null);
  const arrivedAtRef = useRef(Infinity);

  useEffect(() => {
    arrivedAtRef.current = performance.now();
  }, []);

  useEffect(() => {
    const syncWithHistory = () => {
      const next = slugFromHistory(window.history.state);
      // Forward onto a mode entry while another dialog is up: leave that one in charge.
      if (next != null && document.querySelector("dialog[open]") != null) {
        return;
      }
      setSlug(next);
    };
    syncWithHistory();
    window.addEventListener("popstate", syncWithHistory);
    return () => window.removeEventListener("popstate", syncWithHistory);
  }, []);

  const open = (next: GameSlug) => {
    if (performance.now() - arrivedAtRef.current < CARDS_AFTER_ARRIVAL_MS) {
      return;
    }
    window.history.pushState({ [HISTORY_KEY]: next }, "");
    setSlug(next);
  };

  return (
    <OpenModeDetailsContext value={open}>
      {children}
      {slug != null && (
        <ModeDetailsDialog key={slug} slug={slug} onClose={() => window.history.back()} />
      )}
    </OpenModeDetailsContext>
  );
}

/** Opens a mode's dialog; null outside ModeDetailsDialogProvider. */
export function useOpenModeDetails(): ((slug: GameSlug) => void) | null {
  return use(OpenModeDetailsContext);
}

export default ModeDetailsDialog;
