import { anek, lora, rubik } from "@/app/fonts";
import styles from "./MovieTicket.module.css";

/** A single-screen cinema ticket, counterfoil already torn off, peeking into the header. */
function MovieTicket() {
  return (
    <div className={`${styles.ticket} ${rubik.className}`} aria-hidden>
      <div className={styles.paper}>
        <div className={styles.theatre}>
          Charades{" "}
          <span lang="ta" className={`${styles.tamil} ${anek.className}`}>
            தியேட்டர்
          </span>
        </div>
        <div className={`${styles.seatClass} ${lora.className}`}>Balcony</div>
        <div className={styles.footer}>
          <span className={styles.price}>
            <small>Rs.</small>120
          </span>
          <span className={styles.serial}>Nº 047312</span>
        </div>
        <svg className={styles.seat} viewBox="0 0 40 28">
          {/* Roughens the stroke edges like marker ink bleeding into paper. */}
          <filter id="ticket-marker">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" />
            <feDisplacementMap in="SourceGraphic" scale="0.9" />
          </filter>
          <g filter="url(#ticket-marker)">
            <path d="M14 6C11 2.5 4.5 3.5 3.5 10 2.8 15 6 19 10.5 18c2-.5 3.5-2 4.3-3.5" />
            <path d="M27 3 19.5 15.5l14.5-1" />
            <path d="M30.5 5c-.3 7-.7 14-1.3 21.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default MovieTicket;
