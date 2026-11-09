"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { BsStars } from "react-icons/bs";
import { LuChevronDown, LuRotateCcw } from "react-icons/lu";
import { lora, poppins, rubik } from "@/app/fonts";
import Confetti from "@/components/Confetti";
import ScrollOnceText from "@/components/ScrollOnceText";
import { getModeShortTitle } from "@/constant/gameModes";
import { TrackEvents } from "@/constant/metricsData";
import { SITE_URL } from "@/constant/site";
import { getMetricsContext, useGameStore } from "@/hooks/useGameStore";
import { useScreenFocus } from "@/hooks/useScreenFocus";
import { trackShareNativeResult } from "@/utils/gameMetrics";
import { generateShareCard } from "@/utils/generateShareCard";
import { track } from "@/utils/trackMetrics";
import styles from "./ResultsSlide.module.css";

const SHARE_URL = `${SITE_URL}/?ref=share`;
/** How long Share reads "Copied!" after the clipboard fallback. */
const COPIED_LABEL_MS = 2000;
/** A double tap on Share or Support would otherwise open a second tab or popup. */
const REPEAT_TAP_MS = 1000;

/** "1h 4m 9s", "4m 9s" or "9s". */
function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function ResultsSlide() {
  const router = useRouter();
  const { state } = useGameStore();
  const { mode, starsCount, stats, titles } = state;
  const answeredCount = stats.answers.length;
  const totalSeconds = Math.round(state.clock.playedMs / 1000);
  const accuracy = answeredCount > 0 ? Math.round((starsCount / answeredCount) * 100) : 0;
  const fastestTitle = stats.fastest == null ? null : titles[stats.fastest.index]?.english;
  const missedTitles = stats.answers.flatMap((correct, index) =>
    correct ? [] : [titles[index]?.english ?? `Title ${index + 1}`],
  );
  const shareIndicesRef = useRef({ first: 0, second: 0 });
  const sharingRef = useRef(false);
  const sharedAtRef = useRef(-Infinity);
  const donatedAtRef = useRef(-Infinity);
  const [copied, setCopied] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useScreenFocus(scrollAreaRef);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timerId = setTimeout(() => setCopied(false), COPIED_LABEL_MS);
    return () => clearTimeout(timerId);
  }, [copied]);

  useEffect(() => {
    shareIndicesRef.current = {
      first: Math.floor(Math.random() * 4),
      second: Math.floor(Math.random() * 4),
    };
  }, []);

  const ratio = answeredCount > 0 ? starsCount / answeredCount : 0;
  // Stars light up one after another via staggered CSS animation delays.
  const litStars = starsCount <= 0 ? 0 : 1 + Number(ratio > 0.4) + Number(ratio > 0.8);
  const starClass = (base: string, position: number) =>
    `${base} ${litStars >= position ? styles.starLit : ""}`;

  const handleGoHome = () => {
    router.push("/");
  };

  const handleDonate = (event: MouseEvent) => {
    if (event.timeStamp - donatedAtRef.current < REPEAT_TAP_MS) {
      return;
    }
    donatedAtRef.current = event.timeStamp;
    track(
      TrackEvents.DONATE_CLICKED,
      {
        totalCount: answeredCount + 1,
        totalTime: totalSeconds,
      },
      getMetricsContext(state),
    );
    window.open("https://www.buymeacoffee.com/maraudermohan", "_blank", "noopener noreferrer");
  };

  // A second tap while the share sheet is opening would fail and be tracked as a cancel.
  const handleShare = async () => {
    if (sharingRef.current || performance.now() - sharedAtRef.current < REPEAT_TAP_MS) {
      return;
    }
    sharingRef.current = true;
    try {
      await share();
    } finally {
      sharingRef.current = false;
      sharedAtRef.current = performance.now();
    }
  };

  const share = async () => {
    const { first: firstPartIndex, second: secondPartIndex } =
      shareIndicesRef.current;
    const scoreText = `${starsCount}/${answeredCount}`;
    const imageBlob = await generateShareCard({
      currentMode: getModeShortTitle(mode),
      starsCount,
      totalCount: answeredCount,
      stats: {
        bestStreak: stats.bestStreak,
        fastestTitle: fastestTitle ?? null,
        accuracy,
        totalTime: formatDuration(totalSeconds),
      },
      firstPartIndex,
      secondPartIndex,
    });

    const firstPart = [
      `TamilCharades got wild.\nWe scored ${scoreText}\n`,
      `Absolute chaos in TamilCharades \nWe scored ${scoreText}\n`,
      `We just smashed TamilCharades \nScore: ${scoreText}\n`,
      `We crushed it in TamilCharades \nScore: ${scoreText}\n`,
    ];

    const secondPart = [
      "\nBeat that.",
      "\nYour turn.",
      "\nThink you can top it?",
      "\nCan you beat our score?",
    ];

    const message = firstPart[firstPartIndex] + secondPart[secondPartIndex];
    const metricsCtx = getMetricsContext(state);

    track(
      TrackEvents.SHARE_CLICKED,
      {
        correctCount: starsCount,
        totalCount: answeredCount + 1,
        totalTime: totalSeconds,
        // Same definition as game.ended's avgTime.
        avgTime: Math.ceil(totalSeconds / (answeredCount + 1)),
      },
      metricsCtx,
    );

    // Web Share
    if (imageBlob && navigator.canShare?.({ files: [new File([imageBlob], "x.png", { type: "image/png" })] })) {
      const file = new File(
        [imageBlob],
        "tamil-charades.png",
        { type: "image/png" },
      );
      await trackShareNativeResult(
        navigator.share({
          title: "Tamil Charades",
          text: message,
          url: SHARE_URL,
          files: [file],
        }),
        metricsCtx,
      );
      return;
    }

    // Web Share API without image
    if (typeof navigator.share === "function") {
      await trackShareNativeResult(
        navigator.share({ title: "Tamil Charades", text: message, url: SHARE_URL }),
        metricsCtx,
      );
      return;
    }

    // WhatsApp fallback, then clipboard if the popup was blocked
    const shareText = `${message}\n\n${SHARE_URL}`;
    const popup = window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    if (popup == null && navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => setCopied(true), () => {});
    }
  };

  return (
    <div className={styles.resultsSlideBox}>
      <div ref={scrollAreaRef} tabIndex={-1} className={styles.scrollArea}>
        <div className={styles.content}>
          <div className={styles.scoreSection}>
            <div className={styles.scoreboard}>
              <div className={starClass(styles.starIconLeft, 1)} />
              <div className={starClass(styles.starIconMid, 2)} />
              <div className={starClass(styles.starIconRight, 3)} />
              <h4
                className={styles.starsCount}
                style={{ fontFamily: lora.style.fontFamily }}
              >
                {starsCount}
              </h4>
              <p
                className={styles.totalCount}
                style={{ fontFamily: poppins.style.fontFamily }}
              >{`/ ${answeredCount}`}</p>
            </div>
          </div>
          {state.ranOutOfTitles != null && (
            <p className={`${styles.exhaustedNote} ${rubik.className}`}>
              {state.ranOutOfTitles === "exhausted"
                ? `You've played every title in ${mode.title}! Try ${
                    mode.hasDifficulty ? "another difficulty or mode" : "another mode"
                  } next.`
                : "We couldn't load more titles, so the game ended here. Check your connection and play again."}
            </p>
          )}
          {answeredCount > 0 && (
            <ol className={styles.answerStrip} aria-label="Your answers, in order">
              {stats.answers.map((correct, index) => (
                <li
                  key={index}
                  className={`${styles.answerSquare} ${correct ? styles.answerRight : styles.answerWrong}`}
                  aria-label={`${titles[index]?.english ?? `Title ${index + 1}`}: ${correct ? "correct" : "wrong"}`}
                />
              ))}
            </ol>
          )}
          <dl className={styles.statCards}>
            <div className={styles.statCard}>
              <dt className={`${styles.statLabel} ${rubik.className}`}>Best Streak</dt>
              <dd className={`${styles.statValue} ${poppins.className}`}>{stats.bestStreak}</dd>
            </div>
            <div className={styles.statCard}>
              <dt className={`${styles.statLabel} ${rubik.className}`}>Fastest guess</dt>
              <dd className={`${styles.statValue} ${poppins.className}`} title={fastestTitle ?? undefined}>
                {fastestTitle == null ? "–" : <ScrollOnceText text={fastestTitle} />}
              </dd>
            </div>
            <div className={styles.statCard}>
              <dt className={`${styles.statLabel} ${rubik.className}`}>Accuracy</dt>
              <dd className={`${styles.statValue} ${poppins.className}`}>{accuracy}%</dd>
            </div>
            <div className={styles.statCard}>
              <dt className={`${styles.statLabel} ${rubik.className}`}>Total time</dt>
              <dd className={`${styles.statValue} ${poppins.className}`}>
                {formatDuration(totalSeconds)}
              </dd>
            </div>
          </dl>
          {missedTitles.length > 0 && (
            <div className={styles.missedSection}>
              <details className={styles.missed}>
                <summary className={`${styles.missedSummary} ${rubik.className}`}>
                  Missed
                  <span className={styles.missedCount}>{missedTitles.length}</span>
                  <LuChevronDown className={styles.missedChevron} aria-hidden />
                </summary>
                <ul className={`${styles.missedList} ${poppins.className}`}>
                  {missedTitles.map((title, index) => (
                    <li key={index} className={styles.missedItem} title={title}>
                      {title}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}
          <div className={styles.supportSection}>
            <button
              type="button"
              className={styles.supportLink}
              onClick={handleDonate}
              style={{ fontFamily: lora.style.fontFamily }}
            >
              <span className={styles.supportIcon} aria-hidden>
                ☕
              </span>
              <span className={styles.supportText}>
                <span>Enjoying the game?</span> <span>Support it</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      {starsCount > 0 && <Confetti />}
      <div className={`${styles.buttons} ${poppins.className}`}>
        <button
          type="button"
          className={`${styles.button} ${styles.playAgainButton}`}
          onClick={handleGoHome}
        >
          Play Again
          <LuRotateCcw className={styles.buttonIcon} aria-hidden />
        </button>
        {starsCount > 0 && (
          <button
            type="button"
            className={`${styles.button} ${styles.shareButton}`}
            onClick={handleShare}
          >
            <span aria-live="polite">{copied ? "Copied!" : "Share"}</span>
            <BsStars className={styles.buttonIcon} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

export default ResultsSlide;
