export interface GameModesType {
  title: string;
  description: string;
  backgroundImage: string;
  backgroundPosition: string;
  endpoint: string;
}

export const GAME_MODES_DATA: readonly GameModesType[] = [
  {
    title: "Classic Mode",
    description:
      "Act out the movie without speaking or making sounds.<br /><br />Press ✔ for correct guesses and ✘ for incorrect/skipped ones.<br />Press 🏁 to conclude the game.",
    backgroundImage: "/classic-bg.webp",
    backgroundPosition: "60%",
    endpoint: "/classic-movies.php?difficulty=",
  },
  {
    title: "Story Mode",
    description:
      "Make the players guess the movie by acting out only the <strong>storyline</strong> or iconic scenes.<br /><br /><strong>Don't</strong> act anything about the <span>movie title, cast or crew</span>. No hints about hero, heroine, villain, director etc.",
    backgroundImage: "/story-bg.webp",
    backgroundPosition: "85%",
    endpoint: "/story-movies.php?difficulty=",
  },
  {
    title: "Song Mode",
    description:
      "Make the players guess the song by acting out only the <strong>lyrics</strong>, song scenes or <strong>famous dance steps</strong>.<br /><br /><strong>Don't</strong> act anything about the <span>movie title, storyline, cast or crew</span>. No hints about music director, hero, heroine or villain.",
    backgroundImage: "/song-bg.webp",
    backgroundPosition: "35%",
    endpoint: "/songs.php?difficulty=",
  },
] as const;
