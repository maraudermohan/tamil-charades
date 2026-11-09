"use client";
import { useRef } from "react";
import { RiMovie2AiFill } from "react-icons/ri";
import { anek, lora } from "@/app/fonts";
import { useFitTitles } from "@/hooks/useFitTitles";
import { useGameStore } from "@/hooks/useGameStore";
import styles from "./TitleSlide.module.css";

interface TitleSlideType {
  movieIndex: number;
  hidden?: boolean;
  /** Parks the card off-screen; changing it animates the slide. */
  offset?: "left" | "right";
}

/** Titles longer than this get a smaller font so they fit the card. */
const LONG_TITLE_LENGTH = 35;

function titleClassName(className: string, title: string) {
  return title.length > LONG_TITLE_LENGTH ? `${className} ${styles.longTitle}` : className;
}

function TitleSlide({ movieIndex, hidden = false, offset }: TitleSlideType) {
  const {
    state: { mode, titles },
  } = useGameStore();
  const entry = titles[movieIndex];
  const cardRef = useRef<HTMLDivElement>(null);
  useFitTitles(cardRef, entry == null ? "" : `${entry.english}\n${entry.tamil}\n${entry.movie}`);
  const isHidden = hidden || entry == null;
  const className = [
    styles.titleSlideBox,
    isHidden && styles.hidden,
    offset === "left" && styles.offLeft,
    offset === "right" && styles.offRight,
  ]
    .filter(Boolean)
    .join(" ");

  if (entry == null) {
    return <div ref={cardRef} className={className} aria-hidden />;
  }

  return (
    <div ref={cardRef} className={className} aria-hidden={isHidden || undefined}>
      {!mode.centeredTitle && <RiMovie2AiFill className={styles.lensIcon} />}
      <h3
        className={titleClassName(
          mode.centeredTitle ? styles.centeredMovieTitle : styles.movieTitle,
          entry.english,
        )}
        style={{ fontFamily: lora.style.fontFamily }}
      >
        {entry.english}
      </h3>
      {entry.tamil != null && (
        <h3
          lang="ta"
          className={titleClassName(styles.movieTitle, entry.tamil)}
          style={{ fontFamily: anek.style.fontFamily }}
        >
          {entry.tamil}
        </h3>
      )}
      {mode.showsSubtitle && (
        <h4 className={styles.subtitle}>{entry.movie}</h4>
      )}
    </div>
  );
}

export default TitleSlide;
