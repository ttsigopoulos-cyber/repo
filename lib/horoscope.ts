import type { DailyInsight, HoroscopeReading, Mood, ZodiacSign } from "./types";

const MOODS: Mood[] = ["excellent", "good", "neutral", "challenging"];

const LUCKY_COLORS = [
  "Gold",
  "Silver",
  "Crimson",
  "Sapphire",
  "Emerald",
  "Violet",
  "Rose",
  "Azure",
  "Amber",
  "Pearl",
  "Coral",
  "Jade",
];

const OVERVIEWS: Record<ZodiacSign, string[]> = {
  aries: [
    "Your fiery energy is at a peak today. Take initiative on projects you've been postponing — the stars favor bold action.",
    "Mars energizes your ambitions. A surprise opportunity may appear; stay alert and trust your instincts.",
  ],
  taurus: [
    "Stability and comfort are your allies today. Focus on building lasting foundations in work and relationships.",
    "Venus brings harmony to your finances. A practical decision made now will pay dividends later.",
  ],
  gemini: [
    "Your wit and charm open doors today. Conversations lead to unexpected connections and fresh ideas.",
    "Mercury sharpens your mind. It's an excellent day for writing, learning, or starting a new hobby.",
  ],
  cancer: [
    "Emotional intuition guides you strongly today. Trust your gut feelings in personal matters.",
    "The Moon illuminates your home and family sector. Nurturing others brings you deep fulfillment.",
  ],
  leo: [
    "Your natural charisma shines brightly. Step into the spotlight — others are ready to follow your lead.",
    "Creative projects flourish under today's cosmic alignment. Express yourself without holding back.",
  ],
  virgo: [
    "Precision and organization serve you well today. Tackle detailed tasks — your analytical mind is razor-sharp.",
    "Health and wellness take center stage. Small improvements to your routine create lasting benefits.",
  ],
  libra: [
    "Balance and beauty surround you today. Diplomatic skills help resolve a lingering conflict gracefully.",
    "Venus enhances your social magnetism. An elegant evening or artistic pursuit brings joy.",
  ],
  scorpio: [
    "Deep transformation is in the air. Embrace change rather than resisting it — renewal awaits.",
    "Your investigative powers are heightened. Secrets revealed today lead to powerful breakthroughs.",
  ],
  sagittarius: [
    "Adventure calls your name today. Expand your horizons through travel, study, or meeting new people.",
    "Optimism fuels your journey. A long-held dream feels within reach — keep moving forward.",
  ],
  capricorn: [
    "Discipline and patience reward you today. Career milestones are within grasp — stay the course.",
    "Saturn supports your long-term plans. A mentor or authority figure offers valuable guidance.",
  ],
  aquarius: [
    "Innovation and originality set you apart today. Your unique perspective solves a problem others couldn't.",
    "Community connections strengthen. Collaborating with like-minded people amplifies your impact.",
  ],
  pisces: [
    "Your imagination flows freely today. Creative and spiritual pursuits bring profound satisfaction.",
    "Compassion opens hearts around you. A kind gesture returns to you in unexpected ways.",
  ],
};

const LOVE: Record<ZodiacSign, string> = {
  aries: "Passion runs high. Single Aries may meet someone exciting; couples should plan an adventurous date.",
  taurus: "Romance blooms slowly but surely. Show affection through thoughtful gestures rather than grand declarations.",
  gemini: "Flirtatious energy is strong. Deep conversations with your partner strengthen your bond.",
  cancer: "Emotional vulnerability creates intimacy. Share your feelings openly with someone you trust.",
  leo: "You radiate warmth and attract admiration. Let your partner feel like the star of your world.",
  virgo: "Small acts of service speak louder than words. Show love through practical support and attention to detail.",
  libra: "Harmony in relationships is achievable today. A romantic gesture restores balance where needed.",
  scorpio: "Intensity defines your connections. Deep, transformative conversations deepen existing bonds.",
  sagittarius: "Freedom and love coexist beautifully. Plan an adventure together to reignite the spark.",
  capricorn: "Commitment feels natural today. Serious conversations about the future go smoothly.",
  aquarius: "Intellectual connection sparks romance. Shared ideals bring you closer to someone special.",
  pisces: "Dreamy, poetic energy surrounds your love life. Express your feelings through art or music.",
};

const CAREER: Record<ZodiacSign, string> = {
  aries: "Leadership opportunities emerge. Volunteer for challenging projects to showcase your capabilities.",
  taurus: "Financial stability improves through careful planning. Avoid impulsive spending today.",
  gemini: "Networking pays off. A casual conversation could lead to a promising professional connection.",
  cancer: "Team dynamics improve when you offer emotional support. Your empathy is a professional asset.",
  leo: "Recognition for past efforts arrives. Accept praise gracefully and share credit with collaborators.",
  virgo: "Efficiency is your superpower today. Streamline workflows and eliminate unnecessary steps.",
  libra: "Negotiations favor your diplomatic approach. Partnerships and collaborations thrive.",
  scorpio: "Strategic thinking gives you an edge. Research thoroughly before making major decisions.",
  sagittarius: "Learning opportunities abound. Enroll in a course or attend a workshop to expand skills.",
  capricorn: "Hard work is rewarded. A promotion or raise becomes more likely with sustained effort.",
  aquarius: "Innovative ideas catch attention. Present your unconventional approach with confidence.",
  pisces: "Creative projects gain momentum. Trust your intuition when choosing between opportunities.",
};

const HEALTH: Record<ZodiacSign, string> = {
  aries: "Channel excess energy into physical activity. A vigorous workout boosts mood and vitality.",
  taurus: "Indulge in self-care rituals. A massage or nature walk restores your inner balance.",
  gemini: "Mental stimulation is essential. Balance screen time with outdoor activities.",
  cancer: "Emotional health affects physical well-being. Journaling or meditation brings clarity.",
  leo: "Heart health benefits from joyful movement. Dance, swim, or play a sport you love.",
  virgo: "Digestive wellness improves with mindful eating. Stick to whole, unprocessed foods today.",
  libra: "Balance is key — alternate activity with rest. Yoga or tai chi harmonizes body and mind.",
  scorpio: "Detox and renewal support your energy. Hydrate well and prioritize quality sleep.",
  sagittarius: "Outdoor adventures boost your spirits. Hiking or exploring new places invigorates you.",
  capricorn: "Joint and bone health deserve attention. Stretch regularly and maintain good posture.",
  aquarius: "Circulation improves with movement. Try something unconventional like aerial yoga.",
  pisces: "Water activities soothe your soul. Swimming or a long bath promotes deep relaxation.",
};

const COMPATIBILITY: Record<ZodiacSign, ZodiacSign> = {
  aries: "leo",
  taurus: "virgo",
  gemini: "libra",
  cancer: "scorpio",
  leo: "sagittarius",
  virgo: "capricorn",
  libra: "aquarius",
  scorpio: "pisces",
  sagittarius: "aries",
  capricorn: "taurus",
  aquarius: "gemini",
  pisces: "cancer",
};

function hashDate(date: string, sign: string): number {
  let hash = 0;
  const input = `${date}-${sign}`;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getHoroscope(sign: ZodiacSign, date?: Date): HoroscopeReading {
  const today = date ?? new Date();
  const dateStr = today.toISOString().split("T")[0];
  const seed = hashDate(dateStr, sign);

  const overviewOptions = OVERVIEWS[sign];
  const overview = overviewOptions[seed % overviewOptions.length];

  return {
    sign,
    date: today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    overview,
    love: LOVE[sign],
    career: CAREER[sign],
    health: HEALTH[sign],
    mood: MOODS[seed % MOODS.length],
    luckyNumber: (seed % 99) + 1,
    luckyColor: LUCKY_COLORS[seed % LUCKY_COLORS.length],
    compatibility: COMPATIBILITY[sign],
  };
}

export function getDailyInsight(date?: Date): DailyInsight {
  const today = date ?? new Date();
  const day = today.getDate();

  const moonPhases = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
  ];

  const events = [
    "Mercury in retrograde shadow — double-check communications",
    "Venus trine Jupiter — abundance and joy flow freely",
    "Mars sextile Saturn — disciplined action yields results",
    "Sun conjunct Mercury — clarity of thought prevails",
    "Moon in Pisces — intuition and creativity peak",
    "Jupiter direct — expansion and growth accelerate",
  ];

  const energies = [
    "A day of renewal and fresh beginnings",
    "Grounded energy supports practical achievements",
    "Social connections bring unexpected blessings",
    "Inner reflection reveals important truths",
    "Dynamic energy fuels ambitious pursuits",
    "Harmonious vibes ease tensions and conflicts",
  ];

  return {
    moonPhase: moonPhases[day % moonPhases.length],
    cosmicEvent: events[day % events.length],
    generalEnergy: energies[day % energies.length],
  };
}
