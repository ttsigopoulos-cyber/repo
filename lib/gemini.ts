import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import type { IdentifierType } from "./screening";

// Model name: your test route returned 200 with this model on 30.09.2026. Model names change
// often – check https://ai.google.dev/gemini-api/docs/models and override via GEMINI_MODEL.
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

let ai: GoogleGenAI | null = null;
export const geminiConfigured = () => !!process.env.GEMINI_API_KEY;
function client() {
  if (!ai) ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return ai;
}

// ---------------------------------------------------------------------------
// 1) Per-answer screening (anonymisation guard, distress signal, tool mention)
// ---------------------------------------------------------------------------

export interface Screening {
  containsIdentifiers: boolean;
  identifierTypes: IdentifierType[];
  distress: "none" | "mild" | "strong";
  toolsMentioned: string[];
}

const SCREEN_SYSTEM = `Du bist ein Datenschutz-Prüfer für eine akademische Interviewstudie in deutschen Pflegeeinrichtungen.
Du erhältst die Frage und die schriftliche Antwort einer befragten Person. Du bewertest NUR, du formulierst nichts um und stellst keine Fragen.

Prüfe drei Dinge:
1. containsIdentifiers: true, wenn die Antwort eine Bewohnerin, einen Bewohner, eine angehörige Person oder eine Kollegin/einen Kollegen erkennbar machen könnte:
   Namen oder Initialen von Personen, Zimmernummern, konkrete Kalenderdaten, Diagnosen oder Erkrankungen einer bestimmten Person,
   oder eine Kombination von Merkmalen, die in einer Einrichtung bekannter Größe auf eine einzelne Person schließen lässt.
   NICHT markieren: Rollen ("die Pflegedienstleitung", "eine Kollegin"), allgemeine Aussagen über Bewohner im Plural,
   Namen von Softwareprodukten, Gesetzen, Behörden oder Organisationen, allgemeine Wochentage oder Schichtzeiten.
2. distress: "strong", wenn die Person deutliche akute Belastung, Verzweiflung oder Überforderung ausdrückt; "mild" bei spürbarer, aber moderater Belastung; sonst "none".
3. toolsMentioned: Werkzeuge, Software oder technische Systeme, die die Person SELBST ausdrücklich nennt (z. B. ein Produktname oder "unsere Dokumentationssoftware"),
   genau so geschrieben, wie die Person sie nennt. Nichts ergänzen, nichts erfinden. Leeres Array, wenn keine genannt werden.`;

export async function screenAnswer(question: string, answer: string): Promise<Screening> {
  const res = await client().models.generateContent({
    model: MODEL,
    contents: `FRAGE:\n${question}\n\nANTWORT:\n${answer}`,
    config: {
      systemInstruction: SCREEN_SYSTEM,
      temperature: 0,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          containsIdentifiers: { type: Type.BOOLEAN },
          identifierTypes: {
            type: Type.ARRAY,
            items: { type: Type.STRING, enum: ["name", "zimmernummer", "datum", "diagnose", "sonstiges"] },
          },
          distress: { type: Type.STRING, enum: ["none", "mild", "strong"] },
          toolsMentioned: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["containsIdentifiers", "identifierTypes", "distress", "toolsMentioned"],
      },
    },
  });
  const parsed = JSON.parse(res.text ?? "{}") as Partial<Screening>;
  return {
    containsIdentifiers: parsed.containsIdentifiers === true,
    identifierTypes: Array.isArray(parsed.identifierTypes) ? parsed.identifierTypes : [],
    distress: parsed.distress === "strong" || parsed.distress === "mild" ? parsed.distress : "none",
    // Only keep tool names that literally occur in the answer – the AI must never introduce a tool.
    toolsMentioned: (parsed.toolsMentioned ?? []).filter(
      (t) => typeof t === "string" && t.trim() && answer.toLowerCase().includes(t.trim().toLowerCase()),
    ),
  };
}

// ---------------------------------------------------------------------------
// 2) Researcher analysis across all answers to one question
// ---------------------------------------------------------------------------

export interface Analysis {
  summary: string;
  themes: { theme: string; count: number; description: string }[];
  timeEstimatesMinutes: number[]; // perceived estimates only (A07.6)
  rankedBurdens: { burden: string; mentions: number; avgRank: number }[]; // A03.2
  caveats: string;
}

const ANALYSE_SYSTEM = `Du unterstützt ein Forschungsteam bei der qualitativen Auswertung einer Interviewstudie zu Dokumentationsaufwand in deutschen Pflegeeinrichtungen.
Du erhältst eine Frage und alle anonymisierten schriftlichen Antworten darauf. Arbeite ausschließlich mit dem Material; erfinde nichts.
- summary: 3–5 Sätze auf Deutsch, was die Antworten insgesamt zeigen.
- themes: induktiv gebildete Themen mit der Zahl der Antworten, in denen sie vorkommen, und einer kurzen Beschreibung in eigenen Worten (keine wörtlichen Zitate, keine Personenangaben).
- timeEstimatesMinutes: nur wenn Antworten Zeitschätzungen enthalten, jede Schätzung in Minuten pro Schicht umgerechnet (Spannen als Mittelwert). Es sind wahrgenommene Schätzungen, keine Messungen. Sonst leeres Array.
- rankedBurdens: nur wenn Antworten Rangfolgen von Belastungen enthalten, zusammengefasste Belastung, Anzahl Nennungen und durchschnittlicher Rang. Sonst leeres Array.
- caveats: Grenzen der Auswertung (z. B. kleine Stichprobe, Mehrdeutigkeiten).`;

export async function analyseAnswers(question: string, answers: string[]): Promise<Analysis> {
  const numbered = answers.map((a, i) => `[${i + 1}] ${a}`).join("\n\n");
  const res = await client().models.generateContent({
    model: MODEL,
    contents: `FRAGE:\n${question}\n\nANTWORTEN (${answers.length}):\n${numbered}`,
    config: {
      systemInstruction: ANALYSE_SYSTEM,
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          themes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                count: { type: Type.INTEGER },
                description: { type: Type.STRING },
              },
              required: ["theme", "count", "description"],
            },
          },
          timeEstimatesMinutes: { type: Type.ARRAY, items: { type: Type.NUMBER } },
          rankedBurdens: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                burden: { type: Type.STRING },
                mentions: { type: Type.INTEGER },
                avgRank: { type: Type.NUMBER },
              },
              required: ["burden", "mentions", "avgRank"],
            },
          },
          caveats: { type: Type.STRING },
        },
        required: ["summary", "themes", "timeEstimatesMinutes", "rankedBurdens", "caveats"],
      },
    },
  });
  return JSON.parse(res.text ?? "{}") as Analysis;
}

export const geminiModel = () => MODEL;
