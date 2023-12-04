import { GameController, Footer, Header } from "components";
import styles from "./page.module.css";

function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <GameController />
      <Footer />
      <div className={styles.whiteBg} />
      <div className={styles.patternBg} />
    </main>
  );
}

export default Home;
