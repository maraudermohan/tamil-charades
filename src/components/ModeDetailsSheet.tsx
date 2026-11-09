"use client";
import type { CSSProperties } from "react";
import { IoPlayOutline } from "react-icons/io5";
import { anek, poppins, rubik } from "@/app/fonts";
import DifficultyPicker from "@/components/DifficultyPicker";
import LanguageToggle from "@/components/LanguageToggle";
import type { DifficultyLevel, GameModeType } from "@/constant/gameModes";
import { useRulesLanguage } from "@/hooks/useRulesLanguage";
import styles from "./ModeDetailsSheet.module.css";

type ModeDetailsSheetProps = {
  mode: GameModeType;
  difficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onPlay: () => void;
  /** Inside the homepage's ModeDetailsDialog rather than filling the game page under its header. */
  inDialog?: boolean;
  titleId?: string;
};

/**
 * The mode's details and Play: on the game page when it's opened directly, and in the homepage's
 * mode dialog.
 */
function ModeDetailsSheet({
  mode,
  difficulty,
  onDifficultyChange,
  onPlay,
  inDialog = false,
  titleId,
}: ModeDetailsSheetProps) {
  const Title = inDialog ? "h2" : "h1";
  const { language } = useRulesLanguage();
  const tamil = language === "ta";

  const cards = [
    {
      key: "twist",
      label: "Twist",
      className: styles.twistCard,
      text: tamil ? mode.twistInTamil : mode.twist,
    },
    {
      key: "do",
      className: styles.doCard,
      text: tamil ? mode.doInTamil : mode.do,
    },
    {
      key: "dont",
      className: styles.dontCard,
      text: tamil ? mode.dontInTamil : mode.dont,
    },
  ].filter((card) => card.text);

  return (
    <div className={inDialog ? `${styles.sheet} ${styles.inDialog}` : styles.sheet}>
      <div
        className={`${styles.modeImage} ${styles[mode.mode] ?? ""}`}
        style={
          {
            "--bg-sm": `url(${mode.backgroundSm.src})`,
            "--bg-md": `url(${mode.backgroundMd.src})`,
            "--bg-lg": `url(${mode.backgroundLg.src})`,
          } as CSSProperties
        }
        aria-hidden
      />
      <div className={styles.details}>
        <Title id={titleId} className={`${styles.title} ${rubik.className}`}>
          {mode.title}
        </Title>
        <LanguageToggle className={styles.languageToggle} />
        <div className={`${styles.cards} ${rubik.className}`}>
          {cards.map((card) => (
            <div key={card.key} className={`${styles.card} ${card.className}`}>
              {(card?.label || "").length > 0 && (
                <p className={styles.cardLabel}>{card.label}</p>
              )}
              <p
                lang={language}
                className={
                  tamil
                    ? `${styles.cardText} ${styles.tamilText} ${anek.className}`
                    : styles.cardText
                }
              >
                {card.text}
              </p>
            </div>
          ))}
        </div>
        {mode.hasDifficulty && (
          <>
            <hr className={styles.divider} />
            <DifficultyPicker
              value={difficulty}
              onChange={onDifficultyChange}
              className={`${styles.difficulty} ${rubik.className}`}
            />
          </>
        )}
      </div>
      <div className={styles.playButtonContainer}>
        <button
          type="button"
          className={`${styles.playButton} ${poppins.className}`}
          onClick={onPlay}
        >
          <IoPlayOutline className={styles.playIcon} aria-hidden />
          Play
        </button>
      </div>
    </div>
  );
}

export default ModeDetailsSheet;
