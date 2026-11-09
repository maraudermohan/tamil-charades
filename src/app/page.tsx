import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ModeCardsManager from "@/components/ModeCardsManager";
import NewLookAnnouncement from "@/components/NewLookAnnouncement";
import PaperShower from "@/components/PaperShower";
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
      <PaperShower />
      <NewLookAnnouncement />
    </main>
  );
}

export default Home;
