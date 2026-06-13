import Link from "next/link";
import ReactDOM from "react-dom";
import { rubik } from "app/fonts";
import { GAME_MODES_DATA } from "constant";
import styles from "./ModeCard.module.css";

interface ModeCardType {
  modeData: string;
  /** First visible card: preload + high-priority fetch the LCP image */
  priority?: boolean;
}

/** Same crop at three resolutions, so width-descriptor srcSet lets the browser pick. */
const CARD_SIZES =
  "(max-width: 766px) 50vw, (max-width: 999px) and (orientation: landscape) 33vw, (min-width: 1000px) 33vw, 50vw";

export default function ModeCard({ modeData, priority = false }: ModeCardType) {
  const mode = GAME_MODES_DATA[modeData];

  const srcSet = `${mode.backgroundSm.src} 600w, ${mode.backgroundMd.src} 900w, ${mode.backgroundLg.src} 1600w`;

  /**
   * Preload the *exact* resource the <img> will pick (matching srcSet + sizes),
   * so mobile preloads the sm file instead of wasting the connection on md.
   */
  if (priority) {
    ReactDOM.preload(mode.backgroundMd.src, {
      as: "image",
      imageSrcSet: srcSet,
      imageSizes: CARD_SIZES,
      fetchPriority: "high",
    });
  }

  return (
    <Link
      className={styles.modeCardBox}
      href={`/game/${modeData}`}
      prefetch={false}
    >
      <picture
        className={styles.modePicture}
        style={
          mode.backgroundMd.blurDataURL
            ? { backgroundImage: `url(${mode.backgroundMd.blurDataURL})` }
            : undefined
        }
      >
        <img
          className={styles.modeImage}
          src={mode.backgroundMd.src}
          srcSet={srcSet}
          sizes={CARD_SIZES}
          alt={mode.title}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
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
