import type { ZodiacInfo, ZodiacSign } from "./types";

export const ZODIAC_SIGNS: ZodiacInfo[] = [
  {
    sign: "aries",
    name: "Aries",
    symbol: "♈",
    dates: "Mar 21 – Apr 19",
    element: "fire",
    rulingPlanet: "Mars",
    traits: ["Bold", "Ambitious", "Energetic"],
  },
  {
    sign: "taurus",
    name: "Taurus",
    symbol: "♉",
    dates: "Apr 20 – May 20",
    element: "earth",
    rulingPlanet: "Venus",
    traits: ["Reliable", "Patient", "Devoted"],
  },
  {
    sign: "gemini",
    name: "Gemini",
    symbol: "♊",
    dates: "May 21 – Jun 20",
    element: "air",
    rulingPlanet: "Mercury",
    traits: ["Curious", "Adaptable", "Witty"],
  },
  {
    sign: "cancer",
    name: "Cancer",
    symbol: "♋",
    dates: "Jun 21 – Jul 22",
    element: "water",
    rulingPlanet: "Moon",
    traits: ["Intuitive", "Loyal", "Protective"],
  },
  {
    sign: "leo",
    name: "Leo",
    symbol: "♌",
    dates: "Jul 23 – Aug 22",
    element: "fire",
    rulingPlanet: "Sun",
    traits: ["Confident", "Creative", "Generous"],
  },
  {
    sign: "virgo",
    name: "Virgo",
    symbol: "♍",
    dates: "Aug 23 – Sep 22",
    element: "earth",
    rulingPlanet: "Mercury",
    traits: ["Analytical", "Practical", "Diligent"],
  },
  {
    sign: "libra",
    name: "Libra",
    symbol: "♎",
    dates: "Sep 23 – Oct 22",
    element: "air",
    rulingPlanet: "Venus",
    traits: ["Diplomatic", "Fair", "Social"],
  },
  {
    sign: "scorpio",
    name: "Scorpio",
    symbol: "♏",
    dates: "Oct 23 – Nov 21",
    element: "water",
    rulingPlanet: "Pluto",
    traits: ["Passionate", "Resourceful", "Brave"],
  },
  {
    sign: "sagittarius",
    name: "Sagittarius",
    symbol: "♐",
    dates: "Nov 22 – Dec 21",
    element: "fire",
    rulingPlanet: "Jupiter",
    traits: ["Optimistic", "Adventurous", "Honest"],
  },
  {
    sign: "capricorn",
    name: "Capricorn",
    symbol: "♑",
    dates: "Dec 22 – Jan 19",
    element: "earth",
    rulingPlanet: "Saturn",
    traits: ["Disciplined", "Responsible", "Ambitious"],
  },
  {
    sign: "aquarius",
    name: "Aquarius",
    symbol: "♒",
    dates: "Jan 20 – Feb 18",
    element: "air",
    rulingPlanet: "Uranus",
    traits: ["Progressive", "Original", "Humanitarian"],
  },
  {
    sign: "pisces",
    name: "Pisces",
    symbol: "♓",
    dates: "Feb 19 – Mar 20",
    element: "water",
    rulingPlanet: "Neptune",
    traits: ["Compassionate", "Artistic", "Intuitive"],
  },
];

export const ELEMENT_COLORS: Record<string, string> = {
  fire: "from-orange-500/20 to-red-600/20 border-orange-500/30",
  earth: "from-emerald-500/20 to-green-700/20 border-emerald-500/30",
  air: "from-sky-400/20 to-blue-500/20 border-sky-400/30",
  water: "from-indigo-500/20 to-purple-600/20 border-indigo-500/30",
};

export const ELEMENT_BADGE: Record<string, string> = {
  fire: "bg-orange-500/20 text-orange-300",
  earth: "bg-emerald-500/20 text-emerald-300",
  air: "bg-sky-400/20 text-sky-300",
  water: "bg-indigo-500/20 text-indigo-300",
};

export function getZodiacBySign(sign: ZodiacSign): ZodiacInfo {
  return ZODIAC_SIGNS.find((z) => z.sign === sign)!;
}

export function getSignFromBirthday(month: number, day: number): ZodiacSign {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius";
  return "pisces";
}
