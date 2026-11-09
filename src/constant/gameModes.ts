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

export const GameDifficulty = ["easy", "medium", "hard"] as const;

/** 1 = easy, 2 = medium, 3 = hard; also the value sent to the PHP endpoints. */
export type DifficultyLevel = 1 | 2 | 3;

export const DEFAULT_DIFFICULTY: DifficultyLevel = 2;

/** Display order on the homepage; also drives static params and the sitemap. */
export const GAME_SLUGS = ["classic", "story", "song", "hollywood", "kids"] as const;

export type GameSlug = (typeof GAME_SLUGS)[number];

export interface GameModeType {
  title: string;
  mode: GameSlug;
  /** The one rule shown on the instruction card before the countdown. */
  instruction: string;
  instructionInTamil: string;
  twist?: string;
  twistInTamil?: string;
  dont?: string;
  dontInTamil?: string;
  do?: string;
  doInTamil?: string;
  backgroundLg: StaticImageData;
  backgroundMd: StaticImageData;
  backgroundSm: StaticImageData;
  endpoint: string;
  timeLimit: number;
  /** Shows the difficulty slider and appends the level to `endpoint`. */
  hasDifficulty: boolean;
  /** Renders the `movie` field under the title (song name's film, kids word's meaning). */
  showsSubtitle: boolean;
  /** Single centered title with no film-reel icon (no Tamil translation). */
  centeredTitle: boolean;
}

export const GAME_MODES_DATA: Record<GameSlug, GameModeType> = {
  classic: {
    title: "Classic Mode",
    mode: "classic",
    instruction: "No lip-reading, whispering or making any sounds!",
    instructionInTamil: "உதட்டு அசைவு, முணுமுணுப்பு, எந்த சத்தமும் - கூடாது!",
    do: "Act out the movie by any means.",
    doInTamil: "படத்தை எந்த குறிப்பு, கருத்து, நுணுக்கம் மூலமும் நடிக்கலாம்!",
    dont: "No lip-reading, whispering or making any sounds!",
    dontInTamil: "உதட்டு அசைவு, முணுமுணுப்பு, எந்த சத்தமும் - கூடாது!",
    backgroundLg: classicLg,
    backgroundMd: classicMd,
    backgroundSm: classicSm,
    endpoint: "/classic-movies.php?difficulty=",
    timeLimit: 75,
    hasDifficulty: true,
    showsSubtitle: false,
    centeredTitle: false,
  },
  story: {
    title: "Story Mode",
    mode: "story",
    instruction: "Don't act the movie name, cast or crew!",
    instructionInTamil: "படத்தின் பெயர், நடிகர், நடிகை, இயக்குனர் பற்றி நடிக்கக் கூடாது!",
    twist: "Act out the story line, iconic scenes or mass dialogues.",
    twistInTamil: "படத்தின் கதைக்களம், குறிப்புகள், முக்கிய காட்சிகள் - இவற்றை பற்றி மட்டுமே நடிக்கலாம்!",
    dont: "Don't act about the movie name, hero, heroine, villain, director, etc.",
    dontInTamil: "படத்தின் பெயர், நடிகர், நடிகை, இயக்குனர் பற்றி நடிக்கக் கூடாது!",
    backgroundLg: storyLg,
    backgroundMd: storyMd,
    backgroundSm: storySm,
    endpoint: "/story-movies.php?story_difficulty=",
    timeLimit: 90,
    hasDifficulty: true,
    showsSubtitle: false,
    centeredTitle: false,
  },
  song: {
    title: "Song Mode",
    mode: "song",
    instruction: "Don't sing or hum. No hints about the movie, cast or crew!",
    instructionInTamil: "படத்தின் பெயர், நடிகர், நடிகை, இசை, இயக்குனர் பற்றி நடிக்கக் கூடாது!",
    twist: "Act out the lyrics, song scenes or famous dance steps.",
    twistInTamil: "பாடலின் வரிகள், காட்சிகள், நடன அமைப்பு - இவற்றை பற்றி மட்டுமே நடிக்கலாம்!",
    dont: "Don't act about the movie name, hero, heroine, music, director, etc.",
    dontInTamil: "படத்தின் பெயர், நடிகர், நடிகை, இசை, இயக்குனர் பற்றி நடிக்கக் கூடாது!",
    backgroundLg: songLg,
    backgroundMd: songMd,
    backgroundSm: songSm,
    endpoint: "/songs.php?difficulty=",
    timeLimit: 90,
    hasDifficulty: true,
    showsSubtitle: true,
    centeredTitle: false,
  },
  hollywood: {
    title: "Hollywood Mode",
    mode: "hollywood",
    instruction: "No lip-reading, whispering or making any sounds!",
    instructionInTamil: "உதட்டு அசைவு, முணுமுணுப்பு, எந்த சத்தமும் - கூடாது!",
    do: "Act out the movie by any means.",
    doInTamil: "படத்தை எந்த குறிப்பு, கருத்து, நுணுக்கம் மூலமும் நடிக்கலாம்!",
    dont: "No lip-reading, whispering or making any sounds!",
    dontInTamil: "உதட்டு அசைவு, முணுமுணுப்பு, எந்த சத்தமும் - கூடாது!",
    backgroundLg: hollywoodLg,
    backgroundMd: hollywoodMd,
    backgroundSm: hollywoodSm,
    endpoint: "/hollywood.php?difficulty=",
    timeLimit: 75,
    hasDifficulty: true,
    showsSubtitle: false,
    centeredTitle: true,
  },
  kids: {
    title: "Kids Mode",
    mode: "kids",
    instruction: "No lip-reading, whispering or making any sounds!",
    instructionInTamil: "உதட்டு அசைவு, முணுமுணுப்பு, எந்த சத்தமும் - கூடாது!",
    do: "Simple day-to-day words for kids to get introduced to the world of Charades.",
    doInTamil: "குழந்தைகள் விளையாட அன்றாடம் பயன்படும், எளிய சொற்கள்!",
    dont: "No lip-reading, whispering or making any sounds!",
    dontInTamil: "உதட்டு அசைவு, முணுமுணுப்பு, எந்த சத்தமும் - கூடாது!",
    backgroundLg: kidsLg,
    backgroundMd: kidsMd,
    backgroundSm: kidsSm,
    endpoint: "/kid-words.php",
    timeLimit: 60,
    hasDifficulty: false,
    showsSubtitle: true,
    centeredTitle: false,
  },
};

/** First word of the mode's title ("Hollywood" for "Hollywood Mode"), for the category chip. */
export function getModeShortTitle(mode: GameModeType): string {
  return mode.title.split(" ")[0];
}

export function isGameSlug(value: string): value is GameSlug {
  return (GAME_SLUGS as readonly string[]).includes(value);
}
