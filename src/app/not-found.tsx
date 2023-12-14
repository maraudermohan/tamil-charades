import { AiFillHome } from "react-icons/ai";
import { rubik, lora } from "app/fonts";
import styles from "../components/ErrorBoundary.module.css";
import Link from "next/link";

function NotFound() {
  return (
    <div className={styles.errorBoundaryBox}>
      <Link href="/">
        <AiFillHome className={styles.homeIcon} />
      </Link>
      <h3
        className={styles.oops}
        style={{ fontFamily: rubik.style.fontFamily }}
      >
        Oops
      </h3>
      <h4
        className={styles.title}
        style={{ fontFamily: lora.style.fontFamily }}
      >
        Page Not Found
      </h4>
      <div
        style={{ backgroundImage: "url('/404-bg.webp')" }}
        className={styles.image}
      />
      <p
        className={styles.description}
        style={{ fontFamily: lora.style.fontFamily }}
      >
        Return to <Link href="/">Homepage</Link>, while we investigate this.
      </p>
    </div>
  );
}

export default NotFound;
