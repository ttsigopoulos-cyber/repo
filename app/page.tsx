"use client";

import { useState, useMemo } from "react";
import { StarField } from "@/components/StarField";
import { ZodiacCard } from "@/components/ZodiacCard";
import { HoroscopeDetail } from "@/components/HoroscopeDetail";
import { CosmicBanner } from "@/components/CosmicBanner";
import { getHoroscope, getDailyInsight } from "@/lib/horoscope";
import { ZODIAC_SIGNS, getSignFromBirthday } from "@/lib/zodiac";
import type { ZodiacSign } from "@/lib/types";

export default function Dashboard() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>("leo");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const reading = useMemo(() => getHoroscope(selectedSign), [selectedSign]);
  const insight = useMemo(() => getDailyInsight(), []);

  function handleBirthdayLookup() {
    const month = parseInt(birthMonth, 10);
    const day = parseInt(birthDay, 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      setSelectedSign(getSignFromBirthday(month, day));
    }
  }

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="text-center mb-10 animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold-400 via-cosmic-300 to-gold-400 bg-clip-text text-transparent">
            Cosmic Horoscope
          </h1>
          <p className="text-white/50 mt-3 text-lg max-w-xl mx-auto">
            Discover what the stars have aligned for you today
          </p>
        </header>

        <CosmicBanner insight={insight} />

        <div className="glass rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="text-sm text-white/50 block mb-1.5">
              Find your sign by birthday
            </label>
            <div className="flex gap-3">
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50"
              >
                <option value="" className="bg-cosmic-900">Month</option>
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December",
                ].map((m, i) => (
                  <option key={m} value={i + 1} className="bg-cosmic-900">
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={31}
                placeholder="Day"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
              />
            </div>
          </div>
          <button
            onClick={handleBirthdayLookup}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-cosmic-950 font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            Find My Sign
          </button>
        </div>

        <HoroscopeDetail reading={reading} />

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold mb-6 text-center">
            All Zodiac Signs
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ZODIAC_SIGNS.map((zodiac) => (
              <ZodiacCard
                key={zodiac.sign}
                zodiac={zodiac}
                isSelected={selectedSign === zodiac.sign}
                onSelect={() => setSelectedSign(zodiac.sign)}
              />
            ))}
          </div>
        </section>

        <footer className="text-center mt-16 pb-8 text-white/30 text-sm">
          <p>Readings are generated for entertainment purposes.</p>
          <p className="mt-1">The stars guide, but you choose your path.</p>
        </footer>
      </div>
    </div>
  );
}
