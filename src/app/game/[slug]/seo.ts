/** Plain-text SEO per game route (no HTML). */
export interface GamePathSeoEntry {
  title: string;
  description: string;
  keywords: string[];
}

export const GAME_PATH_SEO: Record<string, GamePathSeoEntry> = {
  classic: {
    title: "Classic Mode",
    description:
      "Tamil movie dumb charades in classic mode. Act the title without speaking; others guess the film.",
    keywords: [
      "Tamil charades",
      "dumb charades",
      "Tamil movies",
      "classic mode",
      "party game",
      "damsharas"
    ],
  },
  story: {
    title: "Story Mode",
    description:
      "Charades using Tamil movie storylines and iconic scenes only. No title, cast, or crew hints.",
    keywords: [
      "Tamil charades",
      "story mode",
      "movie storyline",
      "Tamil cinema",
      "damsharas",
    ],
  },
  song: {
    title: "Song Mode",
    description:
      "Guess Tamil film songs from lyrics, scenes, or dance steps. No direct movie-title hints.",
    keywords: [
      "Tamil songs",
      "charades",
      "film songs",
      "lyrics game",
      "Tough songs"
    ],
  },
  hollywood: {
    title: "Hollywood Mode",
    description:
      "Hollywood movie dumb charades. Act without speaking; track correct and skipped guesses.",
    keywords: [
      "Hollywood charades",
      "English movies",
      "dumb charades",
    ],
  },
  kids: {
    title: "Kids Mode",
    description:
      "Simple words and phrases for kids learning charades. Family-friendly guessing game.",
    keywords: [
      "kids charades",
      "family game",
      "children",
      "easy words",
    ],
  },
};
