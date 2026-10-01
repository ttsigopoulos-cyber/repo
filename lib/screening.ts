// Layer 1 of the anonymisation guard: cheap local patterns. If one of these hits, the answer
// is sent back for rephrasing WITHOUT ever being passed to the AI – so obvious identifiers
// never leave the server.

export type IdentifierType = "name" | "zimmernummer" | "datum" | "diagnose" | "sonstiges";

const PATTERNS: { type: IdentifierType; re: RegExp }[] = [
  { type: "zimmernummer", re: /\b(zimmer|zi\.|raum|bett|wohnbereich\s+\w+\s+zimmer)\s*(nr\.?|nummer)?\s*\d+/i },
  { type: "datum", re: /\b\d{1,2}\.\s?\d{1,2}\.(\s?\d{2,4})?(?!\d)/ },
  { type: "datum", re: /\b\d{1,2}\.\s?(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)\b/i },
  { type: "name", re: /\b(herr|frau|hr\.|fr\.)\s+[A-ZÄÖÜ][a-zäöüß]+/ },
];

export function localScreen(text: string): IdentifierType[] {
  const found = new Set<IdentifierType>();
  for (const p of PATTERNS) if (p.re.test(text)) found.add(p.type);
  return [...found];
}

export const IDENTIFIER_LABELS: Record<IdentifierType, string> = {
  name: "einen Namen",
  zimmernummer: "eine Zimmernummer",
  datum: "ein konkretes Datum",
  diagnose: "eine Diagnose oder Erkrankung einer bestimmten Person",
  sonstiges: "eine andere Angabe, die eine Person erkennbar machen könnte",
};
