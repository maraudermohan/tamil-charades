"use client";
import { useId } from "react";
import { PiFilmSlate } from "react-icons/pi";
import { anek, poppins } from "@/app/fonts";
import LanguageToggle from "@/components/LanguageToggle";
import SheetDialog from "@/components/SheetDialog";
import { useRulesLanguage } from "@/hooks/useRulesLanguage";
import styles from "./HowToPlayDialog.module.css";
import sheet from "./SheetDialog.module.css";

const STEPS = [
  {
    en: "Act out the given movie or song, using gestures, expressions & actions.",
    ta: "கொடுக்கப்பட்ட படம் / பாடலை - சைகை, முகபாவனை மற்றும் உடல் மொழி மூலம் நடித்துக் காட்டவும்.",
  },
  {
    en: "Your team / friends must guess what you are acting.",
    ta: "நடித்துக் காட்டுவது, உங்கள் அணி / நண்பர்கள் ஊகிக்கும் வகையில் இருக்க வேண்டும்.",
  },
  {
    en: "Tap to score! Green button for correct guesses, Red button for incorrect ones.",
    ta: "யார் அதிக புள்ளிகள்! சரியான ஊகங்களுக்குப் பச்சை பொத்தான், தவறான ஊகங்களுக்கு சிவப்பு பொத்தான்.",
  },
  { en: "Ready?", ta: "ஆரம்பிக்கலாங்களா?" },
];

/** The game's instructions, opened from the homepage subtitle. Mount it to open it. */
function HowToPlayDialog({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const { language } = useRulesLanguage();
  const tamil = language === "ta";

  return (
    <SheetDialog titleId={titleId} onClose={onClose}>
      <LanguageToggle className={styles.languageToggle} />
      <span className={sheet.icon} aria-hidden>
        <PiFilmSlate />
      </span>
      <h2 id={titleId} className={sheet.title}>
        How to Play
      </h2>
      <ol
        lang={language}
        className={tamil ? `${styles.steps} ${styles.tamil} ${anek.className}` : styles.steps}
      >
        {STEPS.map((step) => (
          <li key={step.en} className={styles.step}>
            {tamil ? step.ta : step.en}
          </li>
        ))}
      </ol>
      <button type="button" className={`${sheet.button} ${poppins.className}`} onClick={onClose}>
        Got it
      </button>
    </SheetDialog>
  );
}

export default HowToPlayDialog;
