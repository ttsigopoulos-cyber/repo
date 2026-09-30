import type { HoroscopeReading, Mood } from "@/lib/types";
import { getZodiacBySign } from "@/lib/zodiac";

interface HoroscopeDetailProps {
  reading: HoroscopeReading;
}

const MOOD_CONFIG: Record<
  Mood,
  { label: string; color: string; emoji: string }
> = {
  excellent: { label: "Excellent", color: "text-emerald-400", emoji: "✨" },
  good: { label: "Good", color: "text-sky-400", emoji: "😊" },
  neutral: { label: "Neutral", color: "text-amber-400", emoji: "😐" },
  challenging: { label: "Challenging", color: "text-rose-400", emoji: "💪" },
};

function ReadingSection({
  title,
  icon,
  content,
}: {
  title: string;
  icon: string;
  content: string;
}) {
  return (
    <div className="glass rounded-xl p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h4 className="font-display font-semibold text-cosmic-200">{title}</h4>
      </div>
      <p className="text-white/70 text-sm leading-relaxed">{content}</p>
    </div>
  );
}

export function HoroscopeDetail({ reading }: HoroscopeDetailProps) {
  const zodiac = getZodiacBySign(reading.sign);
  const mood = MOOD_CONFIG[reading.mood];
  const compatZodiac = getZodiacBySign(reading.compatibility);

  return (
    <div className="animate-fade-in">
      <div className="glass rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <span className="text-6xl">{zodiac.symbol}</span>
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold">{zodiac.name}</h2>
            <p className="text-white/50 mt-1">{reading.date}</p>
            <p className="text-white/80 mt-4 leading-relaxed">{reading.overview}</p>
          </div>
          <div className="flex flex-col items-center gap-1 glass rounded-xl px-5 py-3">
            <span className="text-2xl">{mood.emoji}</span>
            <span className={`text-sm font-medium ${mood.color}`}>
              {mood.label}
            </span>
            <span className="text-xs text-white/40">Today&apos;s Mood</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ReadingSection title="Love" icon="💕" content={reading.love} />
        <ReadingSection title="Career" icon="💼" content={reading.career} />
        <ReadingSection title="Health" icon="🌿" content={reading.health} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-white/40 uppercase tracking-wider">Lucky Number</p>
          <p className="font-display text-3xl font-bold text-gold-400 mt-1">
            {reading.luckyNumber}
          </p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-white/40 uppercase tracking-wider">Lucky Color</p>
          <p className="font-display text-lg font-semibold text-cosmic-300 mt-2">
            {reading.luckyColor}
          </p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-white/40 uppercase tracking-wider">Compatibility</p>
          <p className="text-2xl mt-1">{compatZodiac.symbol}</p>
          <p className="text-sm text-white/60">{compatZodiac.name}</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-white/40 uppercase tracking-wider">Element</p>
          <p className="font-display text-lg font-semibold capitalize text-cosmic-300 mt-2">
            {zodiac.element}
          </p>
          <p className="text-xs text-white/40 mt-1">{zodiac.rulingPlanet}</p>
        </div>
      </div>
    </div>
  );
}
