import Image from "next/image";
import Link from "next/link";
import { rubik } from "app/fonts";
import { GAME_MODES_DATA } from "constant";
import styles from "./ModeCard.module.css";

interface ModeCardType {
  modeData: string;
  /** First visible cards: request full image early for LCP */
  priority?: boolean;
}

export default function ModeCard({ modeData, priority = false }: ModeCardType) {
  const mode = GAME_MODES_DATA[modeData];

  return (
    <Link
      className={styles.modeCardBox}
      href={`/game/${modeData}`}
      prefetch={false}
    >
      <picture className={styles.modePicture}>
        <source media="(min-width: 1500px)" srcSet={mode.backgroundLg.src} />
        <source media="(min-height: 1500px)" srcSet={mode.backgroundLg.src} />
        <source media="(max-width: 766px) and (orientation: portrait)" srcSet={mode.backgroundSm.src} />
        <source media="(max-height: 500px) and (orientation: landscape)" srcSet={mode.backgroundSm.src} />
        <Image
          className={styles.modeImage}
          src={mode.backgroundMd}
          alt={mode.title}
          fill
          sizes="(max-width: 766px) 50vw, (max-width: 999px) and (orientation: landscape) 33vw, (min-width: 1000px) 33vw, 50vw"
          placeholder="blur"
          priority={priority}
          fetchPriority={priority ? "high" : "low"}
        />
      </picture>
      <div className={styles.overlay}>
        <h3
          className={styles.title}
          style={{ fontFamily: rubik.style.fontFamily }}
        >
          {mode.title}
        </h3>
      </div>
    </Link>
  );
}
