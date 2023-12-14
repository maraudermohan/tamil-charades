import { memo } from "react";
import styles from "./ModeCardsManager.module.css";
import { GAME_MODES_DATA } from "constant";
import { ModeCard } from "components";

function ModeCardsManager() {
  return (
    <div className={styles.modeCardsManager}>
      {Object.keys(GAME_MODES_DATA).map((modeData, index) => (
        <ModeCard key={modeData + index} modeData={modeData} />
      ))}
    </div>
  );
}

export default memo(ModeCardsManager);
