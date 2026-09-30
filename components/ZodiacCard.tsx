import type { ZodiacInfo } from "@/lib/types";
import { ELEMENT_COLORS } from "@/lib/zodiac";

interface ZodiacCardProps {
  zodiac: ZodiacInfo;
  isSelected: boolean;
  onSelect: () => void;
}

export function ZodiacCard({ zodiac, isSelected, onSelect }: ZodiacCardProps) {
  const elementStyle = ELEMENT_COLORS[zodiac.element];

  return (
    <button
      onClick={onSelect}
      className={`
        group relative rounded-2xl p-5 text-left transition-all duration-300
        bg-gradient-to-br border
        ${elementStyle}
        ${isSelected
          ? "ring-2 ring-gold-400 scale-[1.02] shadow-lg shadow-gold-400/10"
          : "hover:scale-[1.02] hover:shadow-lg hover:shadow-white/5"
        }
      `}
    >
      <div className="flex items-start justify-between">
        <span className="text-4xl">{zodiac.symbol}</span>
        {isSelected && (
          <span className="text-xs font-medium text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-full">
            Selected
          </span>
        )}
      </div>
      <h3 className="font-display text-lg font-semibold mt-3">{zodiac.name}</h3>
      <p className="text-sm text-white/50 mt-1">{zodiac.dates}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {zodiac.traits.map((trait) => (
          <span
            key={trait}
            className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full"
          >
            {trait}
          </span>
        ))}
      </div>
    </button>
  );
}
