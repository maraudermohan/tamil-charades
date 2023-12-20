import { GameController } from "components";
import styles from "../../page.module.css";

export async function generateStaticParams() {
  return [{ slug: "classic" }, { slug: "story" }, { slug: "song" }, , { slug: "kids" }];
}

function ModePage({ params }: { params: { slug: string } }) {
  return (
    <main className={styles.main} style={{ backgroundColor: "#f5fffa" }}>
      <GameController slug={params.slug} />
    </main>
  );
}

export default ModePage;
