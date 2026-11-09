import ReactDOM from "react-dom";
import { rubik } from "@/app/fonts";
import ModeCardLink from "@/components/ModeCardLink";
import { GAME_MODES_DATA, type GameSlug } from "@/constant/gameModes";
import styles from "./ModeCard.module.css";

interface ModeCardType {
  slug: GameSlug;
  /** First visible card: preload + high-priority fetch the LCP image */
  priority?: boolean;
  /** Spans two columns. */
  featured?: boolean;
}

/** Same crop at three resolutions, so width-descriptor srcSet lets the browser pick. */
const CARD_SIZES =
  "(max-width: 766px) 50vw, (orientation: landscape) 33vw, 50vw";
const FEATURED_CARD_SIZES =
  "(max-width: 766px) 100vw, (orientation: landscape) 67vw, 100vw";

export default function ModeCard({ slug, priority = false, featured = false }: ModeCardType) {
  const mode = GAME_MODES_DATA[slug];
  const sizes = featured ? FEATURED_CARD_SIZES : CARD_SIZES;

  const srcSet = `${mode.backgroundSm.src} 600w, ${mode.backgroundMd.src} 900w, ${mode.backgroundLg.src} 1600w`;

  /**
   * Preload the *exact* resource the <img> will pick (matching srcSet + sizes),
   * so mobile preloads the sm file instead of wasting the connection on md.
   */
  if (priority) {
    ReactDOM.preload(mode.backgroundMd.src, {
      as: "image",
      imageSrcSet: srcSet,
      imageSizes: sizes,
      fetchPriority: "high",
    });
  }

  return (
    <ModeCardLink
      className={featured ? `${styles.modeCardBox} ${styles.featured}` : styles.modeCardBox}
      slug={slug}
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
          sizes={sizes}
          alt=""
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
        />
      </picture>
      <div className={styles.overlay}>
        <h2
          className={styles.title}
          style={{ fontFamily: rubik.style.fontFamily }}
        >
          {mode.title}
        </h2>
      </div>
    </ModeCardLink>
  );
}
