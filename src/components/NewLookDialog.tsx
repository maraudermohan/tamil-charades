"use client";
import { useId } from "react";
import { PiConfetti } from "react-icons/pi";
import { anek, lora, poppins } from "@/app/fonts";
import SheetDialog from "@/components/SheetDialog";
import styles from "./NewLookDialog.module.css";
import sheet from "./SheetDialog.module.css";

/** Announces the redesign. Mount it to open it. */
function NewLookDialog({ onClose }: { onClose: () => void }) {
  const titleId = useId();

  return (
    <SheetDialog titleId={titleId} onClose={onClose}>
      <span className={styles.band} aria-hidden />
      <span className={`${sheet.icon} ${styles.icon}`} aria-hidden>
        <PiConfetti />
      </span>
      <h2 id={titleId} className={`${sheet.title} ${styles.title} ${lora.className}`}>
        Tamil Charades has a new look!
      </h2>
      <p className={styles.text}>
        Same game you love, with a fresh coat of paint. New features are on their way, so keep an
        eye out.
      </p>
      <p className={styles.text}>
        Thanks for all your support.{" "}
        <span lang="ta" className={`${styles.thanks} ${anek.className}`}>
          நன்றி!
        </span>
      </p>
      <button type="button" className={`${sheet.button} ${poppins.className}`} onClick={onClose}>
        Let&apos;s play!
      </button>
    </SheetDialog>
  );
}

export default NewLookDialog;
