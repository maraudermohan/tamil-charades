import { memo } from 'react';
import styles from './ModeCardsManager.module.css';
import { GAME_MODES_DATA } from 'constant';
import { ModeCard } from 'components';

function ModeCardsManager() {
  return (
    <div className={styles.modeCardsManager}>
      {
        GAME_MODES_DATA.map((modeData, index) => (
          <ModeCard
            key={modeData.title + index}
            modeData={modeData}
          />
        ))
      }
    </div>
  );
}

export default memo(ModeCardsManager);
