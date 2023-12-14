import { Footer, Header, ModeCardsManager } from "components";
import styles from "./page.module.css";

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
