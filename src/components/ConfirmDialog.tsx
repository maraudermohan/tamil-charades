"use client";
import {
  useId,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type SyntheticEvent,
} from "react";
import type { IconType } from "react-icons";
import { AiFillHome } from "react-icons/ai";
import { BsPauseFill } from "react-icons/bs";
import { FaFlagCheckered } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { anek, poppins, rubik } from "@/app/fonts";
import {
  CONFIRM_DIALOG_STAT_LABELS,
  CONFIRM_DIALOGS,
  pickConfirmDialogTitle,
  type ConfirmDialogStat,
  type ConfirmDialogVariant,
} from "@/constant/confirmDialog";
import { useGameStore } from "@/hooks/useGameStore";
import { useModalDialog } from "@/hooks/useModalDialog";
import styles from "./ConfirmDialog.module.css";

const ICONS: Record<ConfirmDialogVariant, IconType> = {
  pause: BsPauseFill,
  end: FaFlagCheckered,
  exit: AiFillHome,
};

const TAMIL_RUN = /([\u0B80-\u0BFF]+)/;

/** Wraps Tamil-script runs so they get `lang="ta"` and the Tamil font. */
function withTamilSpans(text: string) {
  return text.split(TAMIL_RUN).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} lang="ta" className={anek.className}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

type ConfirmDialogProps = {
  variant: ConfirmDialogVariant;
  /** Remaining round time (e.g. "1:05"); the pause subtitle only mentions it when set. */
  timeLeft?: string;
  /** X, overlay, Esc and `cancel` buttons. */
  onCancel: () => void;
  /** `confirm` buttons. */
  onConfirm?: () => void;
};

/**
 * Modal confirmation for pausing, ending or exiting a game. Mount it to open it and unmount it
 * to close it; MovieSlide renders it for the store's `dialog`, which also pauses the game. While
 * mounted the page underneath is inert and scroll-locked, and focus returns to the opener on close.
 */
function ConfirmDialog({ variant, timeLeft, onCancel, onConfirm }: ConfirmDialogProps) {
  const { state } = useGameStore();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedOverlayRef = useRef(false);
  const [title] = useState(() => pickConfirmDialogTitle(variant));
  const titleId = useId();
  const subtitleId = useId();
  const content = CONFIRM_DIALOGS[variant];
  const Icon = ICONS[variant];

  useModalDialog(dialogRef);

  const handleNativeCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onCancel();
  };

  // Only a press that starts and ends on the overlay closes, so a drag out of the panel doesn't.
  const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    pressedOverlayRef.current = event.target === event.currentTarget;
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (pressedOverlayRef.current && event.target === event.currentTarget) {
      onCancel();
    }
    pressedOverlayRef.current = false;
  };

  const statValues: Record<ConfirmDialogStat, string> = {
    played: String(state.currentIndex ?? 0),
    correct: String(state.starsCount),
  };
  const stats = content.stats.map((stat) => ({ stat, value: statValues[stat] }));

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${rubik.className}`}
      aria-labelledby={titleId}
      aria-describedby={subtitleId}
      onCancel={handleNativeCancel}
      // Chrome can skip `cancel` and close outright on repeated Esc; unmount then too.
      onClose={onCancel}
      onPointerDown={handlePointerDown}
      onClick={handleOverlayClick}
    >
      <div className={styles.panel} data-variant={variant}>
        <button type="button" className={styles.close} aria-label="Close" onClick={onCancel}>
          <IoClose className={styles.closeIcon} aria-hidden />
        </button>
        <span className={styles.icon} aria-hidden>
          <Icon />
        </span>
        <h2 id={titleId} className={styles.title}>
          {withTamilSpans(title)}
        </h2>
        <p id={subtitleId} className={styles.subtitle}>
          {content.subtitle(timeLeft)}
        </p>
        {stats.length > 0 && (
          <dl className={styles.stats}>
            {stats.map(({ stat, value }) => (
              <div key={stat} className={styles.stat}>
                <dt className={styles.statLabel}>{CONFIRM_DIALOG_STAT_LABELS[stat]}</dt>
                <dd className={styles.statValue}>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className={`${styles.actions} ${poppins.className}`}>
          {content.buttons.map((button) => (
            <button
              key={button.label}
              type="button"
              className={`${styles.button} ${styles[button.tone]}`}
              onClick={button.action === "confirm" ? onConfirm : onCancel}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
