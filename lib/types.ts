export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export type Element = "fire" | "earth" | "air" | "water";

export type Mood = "excellent" | "good" | "neutral" | "challenging";

export interface ZodiacInfo {
  sign: ZodiacSign;
  name: string;
  symbol: string;
  dates: string;
  element: Element;
  rulingPlanet: string;
  traits: string[];
}

export interface HoroscopeReading {
  sign: ZodiacSign;
  date: string;
  overview: string;
  love: string;
  career: string;
  health: string;
  mood: Mood;
  luckyNumber: number;
  luckyColor: string;
  compatibility: ZodiacSign;
}

export interface DailyInsight {
  moonPhase: string;
  cosmicEvent: string;
  generalEnergy: string;
}
