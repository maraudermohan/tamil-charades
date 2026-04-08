"use client";
import {
  RefObject,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { poppins, rubik, lora } from "app/fonts";
import styles from "./ResultsSlide.module.css";
import { GameStoreContext } from "hooks";
import { useRouter } from "next/navigation";
import { generateShareCard } from "utils";

interface ResultsSlideType {
  elementRef: RefObject<HTMLDivElement | null>;
  resultsText: string[];
}

function ResultsSlide({ elementRef, resultsText }: ResultsSlideType) {
  const router = useRouter();
  const { currentDifficulty, currentIndex, currentMode, starsCount } = useContext(GameStoreContext)!;
  const leftStarRef = useRef<HTMLImageElement>(null);
  const midStarRef = useRef<HTMLImageElement>(null);
  const rightStarRef = useRef<HTMLImageElement>(null);
  const timeoutIDs = useRef<ReturnType<typeof setTimeout>[] | null>(null);

  const shareIndicesRef = useRef({ first: 0, second: 0 });

  useEffect(() => {
    shareIndicesRef.current = {
      first: Math.floor(Math.random() * 4),
      second: Math.floor(Math.random() * 4),
    };
  }, [resultsText]);

  const handleGoHome = useCallback(() => {
    router.push("/");
  }, [router]);

  // Share the score
  const handleShare = useCallback(async () => {
    const { first: firstPartIndex, second: secondPartIndex } =
      shareIndicesRef.current;
    const scoreText = `${starsCount}/${currentIndex}`;
    const imageBlob = await generateShareCard({
      currentMode: currentMode?.title || "",
      currentDifficulty: currentDifficulty ?? 1,
      starsCount: starsCount ?? 0,
      totalCount: currentIndex ?? 0,
      averageTime: resultsText[1] ?? "",
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
  
    const url = "https://tamilcharades.com?ref=share";
  
    // Web Share
    if (imageBlob && navigator.canShare?.({ files: [new File([imageBlob], "x.png", { type: "image/png" })] })) {
      const file = new File(
        [imageBlob],
        "tamil-charades.png",
        { type: "image/png" },
      );
      await navigator.share({
        title: "Tamil Charades",
        text: message,
        url,
        files: [file],
      });
      return;
    }

    // Web Share API without image
    if (navigator.share) {
      await navigator.share({ title: "Tamil Charades", text: message, url });
      return;
    }
  
    // WhatsApp fallback
    const encodedText = encodeURIComponent(`${message}\n\n${url}`);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
  
    // Clipboard fallback
    if (!window.open && navigator.clipboard) {
      navigator.clipboard.writeText(`${message}\n\n${url}`);
    }
  }, [currentDifficulty, currentIndex, currentMode, starsCount, resultsText]);

  // On results slide show, animate the stars
  useEffect(() => {
    if (timeoutIDs.current == null) {
      timeoutIDs.current = [];
    }
    if (resultsText[0] && resultsText[1]) {
      if (starsCount! > 0) {
        let id = setTimeout(() => {
          leftStarRef.current!.style.opacity = "1";
          leftStarRef.current!.style.width = "55px";
          leftStarRef.current!.style.height = "55px";
        }, 750);
        timeoutIDs.current.push(id);
        if (starsCount! / currentIndex! > 0.4) {
          id = setTimeout(() => {
            midStarRef.current!.style.opacity = "1";
            midStarRef.current!.style.width = "65px";
            midStarRef.current!.style.height = "65px";
          }, 1500);
          timeoutIDs.current.push(id);
        }
        if (starsCount! / currentIndex! > 0.8) {
          id = setTimeout(() => {
            rightStarRef.current!.style.opacity = "1";
            rightStarRef.current!.style.width = "55px";
            rightStarRef.current!.style.height = "55px";
          }, 2000);
          timeoutIDs.current.push(id);
        }
      }
    }
  }, [resultsText]);

  // Clear the timeout IDs when the component unmounts
  useEffect(() => {
    return () => {
      timeoutIDs.current?.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <div ref={elementRef} className={styles.resultsSlideBox}>
      <div className={styles.scoreboard}>
        <div ref={leftStarRef} className={styles.starIconLeft} />
        <div ref={midStarRef} className={styles.starIconMid} />
        <div ref={rightStarRef} className={styles.starIconRight} />
        <h4
          className={styles.starsCount}
          style={{ fontFamily: lora.style.fontFamily }}
        >
          {starsCount}
        </h4>
        <p
          className={styles.totalCount}
          style={{ fontFamily: poppins.style.fontFamily }}
        >{`/ ${currentIndex!}`}</p>
      </div>
      <div className={styles.timeBoard}>
        <p
          className={styles.totalKey}
          style={{ fontFamily: rubik.style.fontFamily }}
        >
          Total time :
        </p>
        <p
          className={styles.totalValue}
          style={{ fontFamily: poppins.style.fontFamily }}
        >
          {resultsText[0] || ""}
        </p>
        <p
          className={styles.AverageKey}
          style={{ fontFamily: rubik.style.fontFamily }}
        >
          Average time per{" "}
          {currentMode?.title === "Song Mode" ? "song :" : "movie :"}
        </p>
        <p
          className={styles.AverageValue}
          style={{ fontFamily: poppins.style.fontFamily }}
        >
          {resultsText[1] || ""}
        </p>
      </div>
      <button
        className={styles.continueButton}
        onClick={handleGoHome}
        style={{ fontFamily: poppins.style.fontFamily }}
      >
        CONTINUE
      </button>
      <div className={styles.orangeBg} />
      <div className={styles.patternBg} />
      <div className={styles.socialButtonBox}>
        {(starsCount ?? 0) > 0 && (
          <button
            className={styles.shareButton}
            onClick={handleShare}
            style={{ fontFamily: lora.style.fontFamily }}
          >
            Share 🔥
          </button>
        )}
        <a
          href="https://www.buymeacoffee.com/maraudermohan"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.supportLink}
          style={{ fontFamily: lora.style.fontFamily }}
        >
          ☕ Enjoying the game? Support it
        </a>
      </div>
    </div>
  );
}

export default memo(ResultsSlide);
