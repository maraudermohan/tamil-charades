"use client";
import { memo, useEffect, useState } from "react";
import styles from "./ModeCard.module.css";
import { rubik } from "app/fonts";
import { GAME_MODES_DATA } from "constant";
import Link from "next/link";

interface ModeCardType {
  modeData: string;
}

function ModeCard({ modeData }: ModeCardType) {
  const [isFirstLoadDone, setIsFirstLoadDone] = useState(false);

  useEffect(() => {
    const deferredImg = document.createElement("img");
    deferredImg.src = GAME_MODES_DATA[modeData].backgroundImage;
    deferredImg.onload = () => {
      setIsFirstLoadDone(true);
    };

    return () => {
      deferredImg.remove();
    }
  }, []);

  return (
    <Link
      className={styles.modeCardBox}
      href={`game/${modeData}`}
    >
      {isFirstLoadDone && (
        <img
          className={styles.modeImage}
          alt={GAME_MODES_DATA[modeData].title}
          src={GAME_MODES_DATA[modeData].backgroundImage}
        />
      )}
      <div className={styles.overlay}>
        <h3
          className={styles.title}
          style={{ fontFamily: rubik.style.fontFamily }}
        >
          {GAME_MODES_DATA[modeData].title}
        </h3>
      </div>
    </Link>
  );
}

export default memo(ModeCard);
