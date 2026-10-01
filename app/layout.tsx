import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online-Interviewstudie Pflege · ESCP Executive MBA",
  description:
    "Arbeitsalltag und Dokumentationsaufwand in Pflege und Seniorenbetreuung verstehen – eine akademische Interviewstudie der ESCP Business School.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1f5f66" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <header className="site-head">
          <Link href="/" className="brand">Interviewstudie Pflege</Link>
          <nav aria-label="Hauptnavigation">
            <Link href="/beleg">Teilnahmebeleg</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
