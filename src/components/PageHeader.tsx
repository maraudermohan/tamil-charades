import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { AiFillHome } from "react-icons/ai";
import { rubik } from "@/app/fonts";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  /** Category chip after the home button. */
  chip?: string;
  /** Runs before the home link navigates; call `event.preventDefault()` to stay. */
  onHomeClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Controls on the right side (theme switch, Pause). */
  children?: ReactNode;
};

/**
 * Fixed top bar for the game and error pages: home on the left, an optional chip, and controls on
 * the right. Screens under it leave `--page-header-height` (globals.css) free at the top.
 */
function PageHeader({ chip, onHomeClick, children }: PageHeaderProps) {
  return (
    <header className={`${styles.header} ${rubik.className}`}>
      {/* No prefetch: the homepage's data preloads its card images, which this page doesn't show. */}
      <Link
        href="/"
        prefetch={false}
        className={styles.home}
        aria-label="Back to home"
        onClick={onHomeClick}
      >
        <AiFillHome className={styles.homeIcon} aria-hidden />
      </Link>
      {chip != null && <span className={styles.chip}>{chip}</span>}
      {children != null && <div className={styles.actions}>{children}</div>}
    </header>
  );
}

export default PageHeader;
