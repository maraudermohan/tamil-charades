"use client";
import { RefObject, memo, useContext } from "react";
import { MdCamera } from "react-icons/md";
import { anek, lora } from "app/fonts";
import styles from "./TitleSlide.module.css";
import { GameStoreContext } from "hooks";

interface TitleSlideType {
  elementRef: RefObject<HTMLDivElement | null>;
  movieIndex: number;
}

function TitleSlide({ elementRef, movieIndex }: TitleSlideType) {
  const { currentMode, moviesList } = useContext(GameStoreContext)!;

  return (
    <div ref={elementRef} className={styles.titleSlideBox}>
      {currentMode!.title !== "Hollywood Mode" && <MdCamera className={styles.lensIcon} />}
      <h3
        className={currentMode!.title === "Hollywood Mode" ? styles.centeredMovieTitle : styles.movieTitle}
        style={{
          fontFamily: lora.style.fontFamily,
          fontSize: moviesList[movieIndex].english.length > 35 ? "24px" : "",
        }}
      >
        {moviesList[movieIndex].english}
      </h3>
      {moviesList[movieIndex]?.tamil != null && (
        <h3
          className={styles.movieTitle}
          style={{
            fontFamily: anek.style.fontFamily,
            fontSize: moviesList[movieIndex]?.tamil?.length > 35 ? "24px" : "",
          }}
        >
          {moviesList[movieIndex].tamil}
        </h3>
      )}
      {["Song Mode", "Kids Mode"].includes(currentMode!.title) && (
        <h4 className={styles.subtitle}>{moviesList[movieIndex]?.movie}</h4>
      )}
    </div>
  );
}

export default memo(TitleSlide);
