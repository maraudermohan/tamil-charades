"use client";
import { lora, rubik } from "@/app/fonts";
import { ErrorData } from "@/constant/ErrorStates";
import { useGameStore } from "@/hooks/useGameStore";
import styles from "./ErrorBoundary.module.css";

/** In-game error screen (server failure, end of the list). GameHeader provides the way home. */
function ErrorBoundary() {
  const {
    state: { error },
  } = useGameStore();
  if (error == null) {
    return null;
  }
  const { title, imageUrl, description } = ErrorData[error];

  return (
    <div className={styles.errorBoundaryBox}>
      <div className={styles.content}>
        <p className={`${styles.oops} ${rubik.className}`}>Oops</p>
        <h1 className={`${styles.title} ${lora.className}`}>{title}</h1>
        <div style={{ backgroundImage: `url(${imageUrl})` }} className={styles.image} />
        <p className={`${styles.description} ${lora.className}`}>{description}</p>
      </div>
    </div>
  );
}

export default ErrorBoundary;
