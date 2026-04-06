import type { StaticImageData } from "next/image";
import classicBg from "../assets/game-modes/classic-bg.webp";
import hollywoodBg from "../assets/game-modes/hollywood-bg.webp";
import kidsBg from "../assets/game-modes/kids-bg.webp";
import songBg from "../assets/game-modes/song-bg.webp";
import storyBg from "../assets/game-modes/story-bg.webp";

export interface GameModeType {
  title: string;
  description: string;
  backgroundImage: StaticImageData;
  backgroundPosition: string;
  endpoint: string;
  timeLimit: number;
}

export interface GameModeData {
  [key: string]: GameModeType;
}

export const GAME_MODES_DATA: GameModeData = {
  classic: {
    title: "Classic Mode",
    description:
      "Act out the movie without speaking or making sounds.<br /><br />Press ✔ for right guesses and ✘ for wrong/skipped ones.<br />Press 🏁 to conclude the game.",
    backgroundImage: classicBg,
    backgroundPosition: "90%",
    endpoint: "/classic-movies.php?difficulty=",
    timeLimit: 75,
  },
  story: {
    title: "Story Mode",
    description:
      "Make the players guess the movie by acting out only the <strong>storyline</strong> or iconic scenes.<br /><br /><strong>Don't</strong> act anything about the <span>movie title, cast or crew</span>. No hints about hero, heroine, villain, director etc.",
    backgroundImage: storyBg,
    backgroundPosition: "85%",
    endpoint: "/story-movies.php?story_difficulty=",
    timeLimit: 90,
  },
  song: {
    title: "Song Mode",
    description:
      "Make the players guess the song by acting out only the <strong>lyrics</strong>, song scenes or <strong>famous dance steps</strong>.<br /><br /><strong>Don't</strong> act anything about the <span>movie title, storyline, cast or crew</span>. No hints about music director, hero, heroine or villain.",
    backgroundImage: songBg,
    backgroundPosition: "35%",
    endpoint: "/songs.php?difficulty=",
    timeLimit: 90,
  },
  hollywood: {
    title: "Hollywood Mode",
    description:
      "Act out the movie without speaking or making sounds.<br /><br />Press ✔ for right guesses and ✘ for wrong/skipped ones.<br />Press 🏁 to conclude the game.",
    backgroundImage: hollywoodBg,
    backgroundPosition: "60%",
    endpoint: "/hollywood.php?difficulty=",
    timeLimit: 75,
  },
  kids: {
    title: "Kids Mode",
    description:
      "Simple day-to-day words for kids to get introduced to the world of <strong>Charades</strong>.",
    backgroundImage: kidsBg,
    backgroundPosition: "50%",
    endpoint: "/kid-words.php",
    timeLimit: 60,
  },
} as const;
