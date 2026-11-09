"use client";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useTheme } from "@/hooks/useTheme";
import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = {
  className?: string;
};

/**
 * Light/dark switch. The knob covers the icon of the inactive theme. Its position comes
 * from `[data-theme]` in CSS (not React state) so it is right on first paint.
 */
function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="Dark theme"
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      onClick={toggleTheme}
    >
      <BsSunFill className={`${styles.icon} ${styles.sun}`} aria-hidden />
      <BsMoonFill className={`${styles.icon} ${styles.moon}`} aria-hidden />
      <span className={styles.knob} aria-hidden />
    </button>
  );
}

export default ThemeToggle;
