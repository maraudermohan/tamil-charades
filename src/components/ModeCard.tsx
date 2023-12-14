import { memo } from "react";
import styles from "./ModeCard.module.css";
import { rubik } from "app/fonts";
import { GAME_MODES_DATA } from "constant";
import Link from "next/link";

interface ModeCardType {
  modeData: string;
}

function ModeCard({ modeData }: ModeCardType) {
  return (
    <Link
      className={styles.modeCardBox}
      style={{
        backgroundImage: `url(${GAME_MODES_DATA[modeData].backgroundImage})`,
        backgroundPosition: GAME_MODES_DATA[modeData].backgroundPosition,
      }}
      href={`game/${modeData}`}
    >
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
