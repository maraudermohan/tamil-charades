import { GameController } from "components";
import styles from "../../page.module.css";

export async function generateStaticParams() {
  return [{ slug: "classic" }, { slug: "story" }, { slug: "song" }, { slug: "kids" }, { slug: "hollywood" }];
}

async function ModePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className={styles.main} style={{ backgroundColor: "#f5fffa" }}>
      <GameController slug={slug} />
    </main>
  );
}

export default ModePage;
