import { memo } from "react";
import { alegreya } from "app/fonts";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p
        className={styles.footerDescription}
        style={{ fontFamily: alegreya.style.fontFamily }}
      >
        Designed & Developed by
      </p>
      <a
        href="https://www.moreaboutmohan.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.footerLink}
        style={{ fontFamily: alegreya.style.fontFamily }}
      >
        {'< Mohan Subramanian >'}
      </a>
    </footer>
  );
}

export default memo(Footer);
