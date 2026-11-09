import Image from "next/image";
import { lora } from "@/app/fonts";
import FilmFrameSubtitle from "@/components/FilmFrameSubtitle";
import MovieTicket from "@/components/MovieTicket";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <MovieTicket />
      <ThemeToggle className={styles.themeToggle} />
      <div className={styles.brand} style={{ fontFamily: lora.style.fontFamily }}>
        <span className={styles.arch}>
          <Image
            className={styles.glyph}
            src="/tamil_logo_white.png"
            alt=""
            width={138}
            height={256}
            loading="eager"
          />
        </span>
        <h1 className={styles.title}>
          <span>Tamil</span> <span>Charades</span>
        </h1>
      </div>
      <FilmFrameSubtitle className={styles.subtitle} style={{ fontFamily: lora.style.fontFamily }} />
    </header>
  );
}

export default Header;
