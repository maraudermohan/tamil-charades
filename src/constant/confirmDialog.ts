export type ConfirmDialogVariant = "pause" | "end" | "exit";

export type ConfirmDialogStat = "played" | "correct";

export type ConfirmDialogButtonTone = "neutral" | "success" | "danger";

export interface ConfirmDialogButton {
  label: string;
  tone: ConfirmDialogButtonTone;
  /** `cancel` resumes the game (same as X, overlay and Esc); `confirm` calls `onConfirm`. */
  action: "confirm" | "cancel";
}

export interface ConfirmDialogContent {
  /** One is picked at random each time the dialog opens. */
  titles: readonly string[];
  subtitle: (timeLeft: string | undefined) => string;
  stats: readonly ConfirmDialogStat[];
  buttons: readonly [ConfirmDialogButton] | readonly [ConfirmDialogButton, ConfirmDialogButton];
}

export const CONFIRM_DIALOG_STAT_LABELS: Record<ConfirmDialogStat, string> = {
  played: "Played so far",
  correct: "Correct so far",
};

export const CONFIRM_DIALOGS: Record<ConfirmDialogVariant, ConfirmDialogContent> = {
  pause: {
    titles: [
      "Hold that pose!",
      "Freeze the frame!",
      "Interval!",
      "Popcorn break!",
      "Power cut!",
      "Cut! Cut! Take five.",
    ],
    subtitle: (timeLeft) =>
      timeLeft == null ? "This game is paused." : `This game is paused. ${timeLeft} time left.`,
    stats: ["played"],
    buttons: [{ label: "Resume", tone: "success", action: "cancel" }],
  },
  end: {
    titles: [
      "That's a wrap, folks!",
      "Take a bow!",
      "Ring down the curtain?",
      "Roll the end credits?",
      "The End (சுபம்)?",
      "Cue the climax?",
    ],
    subtitle: () => "End this game and see the final scores.",
    stats: [],
    buttons: [{ label: "Confirm", tone: "neutral", action: "confirm" }],
  },
  exit: {
    titles: [
      "Leaving the party?",
      "Exit, stage left?",
      "Exit before end credits?",
      "Heading back to base?",
      "No more spotlight?",
    ],
    subtitle: () => "Return to homepage without seeing the scores.",
    stats: ["correct"],
    buttons: [{ label: "Confirm", tone: "danger", action: "confirm" }],
  },
};

const lastTitleIndex: Partial<Record<ConfirmDialogVariant, number>> = {};

/** Random title for `variant`, never the same one twice in a row. */
export function pickConfirmDialogTitle(variant: ConfirmDialogVariant): string {
  const { titles } = CONFIRM_DIALOGS[variant];
  const previous = lastTitleIndex[variant];
  let index = Math.floor(Math.random() * titles.length);
  if (titles.length > 1 && index === previous) {
    index = (index + 1 + Math.floor(Math.random() * (titles.length - 1))) % titles.length;
  }
  lastTitleIndex[variant] = index;
  return titles[index];
}
