"use client";
import { memo, useCallback, useContext } from "react";
import { rubik, lora } from "app/fonts";
import { AiFillHome } from "react-icons/ai";
import styles from "./ErrorBoundary.module.css";
import { GameStoreContext } from "hooks";
import { ErrorData } from "constant";
import { useRouter } from "next/navigation";

function ErrorBoundary() {
  const router = useRouter();
  const { error, gameStoreMethods } = useContext(GameStoreContext)!;
  const { title = "", imageUrl = "", description = "" } = ErrorData[error!];

  const handleGoHome = useCallback(() => {
    router.push("/");
  }, []);

  return (
    <div className={styles.errorBoundaryBox}>
      <AiFillHome className={styles.homeIcon} onClick={handleGoHome} />
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
        {title}
      </h4>
      <div
        style={{ backgroundImage: `url(${imageUrl})` }}
        className={styles.image}
      />
      <p
        className={styles.description}
        style={{ fontFamily: lora.style.fontFamily }}
      >
        {description}
      </p>
    </div>
  );
}

export default memo(ErrorBoundary);
