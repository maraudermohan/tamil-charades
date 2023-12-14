import { memo } from "react";
import { lora } from "app/fonts";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLogo} />
      <h3
        className={styles.subtitle}
        style={{ fontFamily: lora.style.fontFamily }}
      >
        Charades for Tamil movie lovers!
      </h3>
    </header>
  );
}

export default memo(Header);
