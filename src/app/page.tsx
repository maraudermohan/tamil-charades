import type { Metadata } from "next";
import { Footer, Header, ModeCardsManager } from "components";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <ModeCardsManager />
      <Footer />
      <div className={styles.whiteBg} />
      <div className={styles.patternBg} />
    </main>
  );
}

export default Home;
