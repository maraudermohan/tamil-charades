import type { StaticImageData } from "next/image";
import classicLg from "../assets/game-modes/classic-lg.webp";
import hollywoodLg from "../assets/game-modes/hollywood-lg.webp";
import kidsLg from "../assets/game-modes/kids-lg.webp";
import songLg from "../assets/game-modes/song-lg.webp";
import storyLg from "../assets/game-modes/story-lg.webp";
import classicMd from "../assets/game-modes/classic-md.webp";
import hollywoodMd from "../assets/game-modes/hollywood-md.webp";
import kidsMd from "../assets/game-modes/kids-md.webp";
import songMd from "../assets/game-modes/song-md.webp";
import storyMd from "../assets/game-modes/story-md.webp";
import classicSm from "../assets/game-modes/classic-sm.webp";
import hollywoodSm from "../assets/game-modes/hollywood-sm.webp";
import kidsSm from "../assets/game-modes/kids-sm.webp";
import songSm from "../assets/game-modes/song-sm.webp";
import storySm from "../assets/game-modes/story-sm.webp";

export interface GameModeType {
  title: string;
  description: string;
  backgroundLg: StaticImageData;
  backgroundMd: StaticImageData;
  backgroundSm: StaticImageData;
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
    backgroundLg: classicLg,
    backgroundMd: classicMd,
    backgroundSm: classicSm,
    backgroundPosition: "90%",
    endpoint: "/classic-movies.php?difficulty=",
    timeLimit: 75,
  },
  story: {
    title: "Story Mode",
    description:
      "Make the players guess the movie by acting out only the <strong>storyline</strong> or iconic scenes.<br /><br /><strong>Don't</strong> act anything about the <span>movie title, cast or crew</span>. No hints about hero, heroine, villain, director etc.",
    backgroundLg: storyLg,
    backgroundMd: storyMd,
    backgroundSm: storySm,
    backgroundPosition: "85%",
    endpoint: "/story-movies.php?story_difficulty=",
    timeLimit: 90,
  },
  song: {
    title: "Song Mode",
    description:
      "Make the players guess the song by acting out only the <strong>lyrics</strong>, song scenes or <strong>famous dance steps</strong>.<br /><br /><strong>Don't</strong> act anything about the <span>movie title, storyline, cast or crew</span>. No hints about music director, hero, heroine or villain.",
    backgroundLg: songLg,
    backgroundMd: songMd,
    backgroundSm: songSm,
    backgroundPosition: "35%",
    endpoint: "/songs.php?difficulty=",
    timeLimit: 90,
  },
  hollywood: {
    title: "Hollywood Mode",
    description:
      "Act out the movie without speaking or making sounds.<br /><br />Press ✔ for right guesses and ✘ for wrong/skipped ones.<br />Press 🏁 to conclude the game.",
    backgroundLg: hollywoodLg,
    backgroundMd: hollywoodMd,
    backgroundSm: hollywoodSm,
    backgroundPosition: "60%",
    endpoint: "/hollywood.php?difficulty=",
    timeLimit: 75,
  },
  kids: {
    title: "Kids Mode",
    description:
      "Simple day-to-day words for kids to get introduced to the world of <strong>Charades</strong>.",
    backgroundLg: kidsLg,
    backgroundMd: kidsMd,
    backgroundSm: kidsSm,
    backgroundPosition: "50%",
    endpoint: "/kid-words.php",
    timeLimit: 60,
  },
} as const;
