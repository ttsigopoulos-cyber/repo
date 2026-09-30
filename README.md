# Cosmic Horoscope Dashboard

A Next.js horoscope dashboard with daily readings, zodiac sign selection, and cosmic insights.

## Features

- **Daily horoscope** — Overview, love, career, and health readings for all 12 zodiac signs
- **Zodiac grid** — Click any sign to view its reading; cards are color-coded by element (fire, earth, air, water)
- **Birthday lookup** — Enter your birth month and day to find your sign automatically
- **Cosmic overview** — Moon phase, cosmic events, and general energy for the day
- **Lucky details** — Lucky number, lucky color, compatibility, and mood indicator
- **Responsive UI** — Dark cosmic theme with glassmorphism, animated star field, and mobile-friendly layout

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 3](https://tailwindcss.com/)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── globals.css       # Global styles & Tailwind
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Main dashboard page
├── components/
│   ├── CosmicBanner.tsx  # Daily cosmic overview
│   ├── HoroscopeDetail.tsx # Detailed reading view
│   ├── StarField.tsx     # Animated background stars
│   └── ZodiacCard.tsx    # Zodiac sign card
└── lib/
    ├── horoscope.ts      # Horoscope generation logic
    ├── types.ts          # TypeScript types
    └── zodiac.ts         # Zodiac sign data
```

## License

MIT
