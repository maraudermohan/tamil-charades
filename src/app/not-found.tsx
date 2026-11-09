import Link from "next/link";
import { lora, rubik } from "@/app/fonts";
import styles from "@/components/ErrorBoundary.module.css";
import PageHeader from "@/components/PageHeader";
import ThemeToggle from "@/components/ThemeToggle";

function NotFound() {
  return (
    <>
      <PageHeader>
        <ThemeToggle />
      </PageHeader>
      <div className={styles.errorBoundaryBox}>
        <div className={styles.content}>
          <p className={`${styles.oops} ${rubik.className}`}>Oops</p>
          <h1 className={`${styles.title} ${lora.className}`}>Page Not Found</h1>
          <div style={{ backgroundImage: "url('/404-bg.webp')" }} className={styles.image} />
          <p className={`${styles.description} ${lora.className}`}>
            Return to <Link href="/">Homepage</Link>, while we investigate this.
          </p>
        </div>
      </div>
    </>
  );
}

export default NotFound;
