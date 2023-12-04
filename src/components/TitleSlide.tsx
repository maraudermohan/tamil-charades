"use client";
import { RefObject, memo, useContext } from "react";
import { MdCamera } from "react-icons/md";
import { anek, lora } from "app/fonts";
import styles from "./TitleSlide.module.css";
import { GameStoreContext } from "hooks";

interface TitleSlideType {
  elementRef: RefObject<HTMLDivElement>;
  movieIndex: number;
}

function TitleSlide({ elementRef, movieIndex }: TitleSlideType) {
  const { currentMode, moviesList } = useContext(GameStoreContext)!;

  return (
    <div ref={elementRef} className={styles.titleSlideBox}>
      <MdCamera className={styles.lensIcon} />
      <h3
        className={styles.movieTitle}
        style={{
          fontFamily: lora.style.fontFamily,
          fontSize: moviesList[movieIndex].english.length > 35 ? "24px" : "",
        }}
      >
        {moviesList[movieIndex].english}
      </h3>
      <h3
        className={styles.movieTitle}
        style={{
          fontFamily: anek.style.fontFamily,
          fontSize: moviesList[movieIndex].tamil.length > 35 ? "24px" : "",
        }}
      >
        {moviesList[movieIndex].tamil}
      </h3>
      {currentMode?.title === "Song Mode" && (
        <h4 className={styles.subtitle}>{moviesList[movieIndex]?.movie}</h4>
      )}
    </div>
  );
}

export default memo(TitleSlide);
