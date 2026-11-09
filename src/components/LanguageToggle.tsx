"use client";
import { anek, rubik } from "@/app/fonts";
import { useRulesLanguage } from "@/hooks/useRulesLanguage";
import styles from "./LanguageToggle.module.css";

type LanguageToggleProps = {
  className?: string;
};

/** Switches the rules between English and Tamil. The active language's label is the larger one. */
function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, toggleLanguage } = useRulesLanguage();
  const tamil = language === "ta";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={tamil}
      aria-label="Rules in Tamil"
      title={tamil ? "Show in English" : "Show in Tamil"}
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      onClick={toggleLanguage}
    >
      <span
        className={`${styles.glyph} ${styles.latinGlyph} ${rubik.className} ${tamil ? styles.back : styles.front}`}
        aria-hidden
      >
        En
      </span>
      <span
        lang="ta"
        className={`${styles.glyph} ${styles.tamilGlyph} ${anek.className} ${tamil ? styles.front : styles.back}`}
        aria-hidden
      >
        த
      </span>
    </button>
  );
}

export default LanguageToggle;
