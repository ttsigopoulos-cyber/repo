import type { DailyInsight } from "@/lib/types";

interface CosmicBannerProps {
  insight: DailyInsight;
}

export function CosmicBanner({ insight }: CosmicBannerProps) {
  return (
    <div className="glass rounded-2xl p-5 md:p-6 mb-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🌌</span>
        <h2 className="font-display text-xl font-semibold">Cosmic Overview</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🌙</span>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Moon Phase</p>
            <p className="text-white/80 font-medium mt-0.5">{insight.moonPhase}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">⭐</span>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Cosmic Event</p>
            <p className="text-white/80 font-medium mt-0.5">{insight.cosmicEvent}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🔮</span>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">General Energy</p>
            <p className="text-white/80 font-medium mt-0.5">{insight.generalEnergy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
