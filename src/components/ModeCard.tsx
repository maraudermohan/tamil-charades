import { memo, useCallback, useContext } from "react";
import styles from "./ModeCard.module.css";
import { rubik } from "app/fonts";
import { GameModesType } from "constant";
import { GameStoreContext } from "hooks";

interface ModeCardType {
  modeData: GameModesType;
}

function ModeCard({ modeData }: ModeCardType) {
  const { gameStoreMethods } = useContext(GameStoreContext)!;

  const handleModeCardClick = useCallback(() => {
    gameStoreMethods.setCurrentMode(modeData);
  }, [gameStoreMethods, modeData]);

  return (
    <div
      className={styles.modeCardBox}
      style={{
        backgroundImage: `url(${modeData.backgroundImage})`,
        backgroundPosition: modeData.backgroundPosition,
      }}
      onClick={handleModeCardClick}
    >
      <div className={styles.overlay}>
        <h3
          className={styles.title}
          style={{ fontFamily: rubik.style.fontFamily }}
        >
          {modeData.title}
        </h3>
      </div>
    </div>
  );
}

export default memo(ModeCard);
