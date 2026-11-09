"use client";
import {
  useRef,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { IoClose } from "react-icons/io5";
import { rubik } from "@/app/fonts";
import { useModalDialog } from "@/hooks/useModalDialog";
import styles from "./SheetDialog.module.css";

type SheetDialogProps = {
  /** Id of the heading inside `children`. */
  titleId: string;
  /** X, overlay, Esc, or the browser closing the dialog itself. */
  onClose: () => void;
  children: ReactNode;
};

/**
 * A bottom sheet on phones and a centered card from 768px wide, with a close button. Mount it
 * to open it and unmount it to close it; like ConfirmDialog, the page underneath is inert and
 * scroll-locked while it's open, and focus returns to the opener on close.
 */
function SheetDialog({ titleId, onClose, children }: SheetDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedOverlayRef = useRef(false);

  useModalDialog(dialogRef);

  const handleNativeCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  // Only a press that starts and ends on the overlay closes, so a drag out of the panel doesn't.
  const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    pressedOverlayRef.current = event.target === event.currentTarget;
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (pressedOverlayRef.current && event.target === event.currentTarget) {
      onClose();
    }
    pressedOverlayRef.current = false;
  };

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${rubik.className}`}
      aria-labelledby={titleId}
      onCancel={handleNativeCancel}
      // Chrome can skip `cancel` and close outright on repeated Esc; unmount then too.
      onClose={onClose}
      onPointerDown={handlePointerDown}
      onClick={handleOverlayClick}
    >
      <div className={styles.panel}>
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          <IoClose className={styles.closeIcon} aria-hidden />
        </button>
        {children}
      </div>
    </dialog>
  );
}

export default SheetDialog;
