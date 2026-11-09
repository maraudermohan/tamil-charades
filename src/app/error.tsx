"use client";
import { lora, rubik } from "@/app/fonts";
import styles from "@/components/ErrorBoundary.module.css";
import PageHeader from "@/components/PageHeader";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Catches render errors, such as a screen's code failing to download. The link is a full page
 * load, so it picks up fresh code after a deploy.
 */
function AppError() {
  return (
    <>
      <PageHeader>
        <ThemeToggle />
      </PageHeader>
      <div className={styles.errorBoundaryBox}>
        <div className={styles.content}>
          <p className={`${styles.oops} ${rubik.className}`}>Oops</p>
          <h1 className={`${styles.title} ${lora.className}`}>Something went wrong</h1>
          <div style={{ backgroundImage: "url('/backend-fail.webp')" }} className={styles.image} />
          <p className={`${styles.description} ${lora.className}`}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            Please check your connection and return to the <a href="/">Homepage</a>.
          </p>
        </div>
      </div>
    </>
  );
}

export default AppError;
