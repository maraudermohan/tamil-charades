import { memo, useContext } from "react";
import { rubik, lora } from "app/fonts";
import { AiFillHome } from "react-icons/ai";
import styles from "./ErrorBoundary.module.css";
import { GameStoreContext } from "hooks";
import { ErrorData } from "constant";

function ErrorBoundary() {
  const { error, gameStoreMethods } = useContext(GameStoreContext)!;
  const { title = "", imageUrl = "", description = "" } = ErrorData[error!];

  return (
    <div className={styles.errorBoundaryBox}>
      <AiFillHome
        className={styles.homeIcon}
        onClick={gameStoreMethods.resetStore}
      />
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
