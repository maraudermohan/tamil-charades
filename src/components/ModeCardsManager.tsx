import ModeCard from "@/components/ModeCard";
import { ModeDetailsDialogProvider } from "@/components/ModeDetailsDialog";
import { GAME_SLUGS, type GameSlug } from "@/constant/gameModes";
import styles from "./ModeCardsManager.module.css";

const FEATURED_SLUG: GameSlug = "classic";

function ModeCardsManager() {
  return (
    <ModeDetailsDialogProvider>
      <div className={styles.modeCardsManager}>
        {GAME_SLUGS.map((slug, index) => (
          <ModeCard
            key={slug}
            slug={slug}
            priority={index <= 1}
            featured={slug === FEATURED_SLUG}
          />
        ))}
      </div>
    </ModeDetailsDialogProvider>
  );
}

export default ModeCardsManager;
