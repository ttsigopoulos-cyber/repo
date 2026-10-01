import { QUESTIONS, type Question, type Role } from "./questions";

export const ROLES: { id: Role; label: string; hint: string }[] = [
  { id: "pflegekraft", label: "Pflegekraft", hint: "Pflegefachkraft, Pflegehilfskraft oder Betreuungskraft" },
  { id: "leitung", label: "Heimleitung oder Pflegedienstleitung", hint: "Leitungsfunktion in der Einrichtung" },
  { id: "angehoerige", label: "Angehörige Person", hint: "Nur nach Einladung durch die Einrichtung" },
];

export const familyEnabled = () => process.env.NEXT_PUBLIC_ENABLE_FAMILY === "true";

export function isRole(x: unknown): x is Role {
  return x === "pflegekraft" || x === "leitung" || x === "angehoerige";
}

export const isProfessional = (role: Role) => role !== "angehoerige";

/** The "Open close" block (A11) is always asked last, whatever the tier the participant reaches. */
export const isClosing = (q: Question) => q.part === "A" && q.block === 11;

export function byCode(code: string): Question | undefined {
  return QUESTIONS.find((q) => q.code === code);
}

/** Questions a role may be asked at all (Part D is inserted reactively, never planned). */
export function questionsForRole(role: Role): Question[] {
  return QUESTIONS.filter((q) => q.audiences.includes(role));
}

export function isAllowed(role: Role, code: string): boolean {
  const q = byCode(code);
  return !!q && q.audiences.includes(role);
}

/**
 * 25-minute rule from the workbook: tier 1 first in sheet order, then tier 2, then tier 3.
 * Deviation for self-administration: the two closing questions (A11.1, A11.2) are held back
 * and asked at the very end, so "Is there anything I did not ask?" is really the last question.
 */
export function plannedSequence(role: Role): { tiers: Record<1 | 2 | 3, string[]>; closing: string[] } {
  const qs = questionsForRole(role).filter((q) => !q.reactiveOnly);
  const bySeq = (a: Question, b: Question) => a.seq - b.seq;
  const main = qs.filter((q) => !isClosing(q));
  return {
    tiers: {
      1: main.filter((q) => q.tier === 1).sort(bySeq).map((q) => q.code),
      2: main.filter((q) => q.tier === 2).sort(bySeq).map((q) => q.code),
      3: main.filter((q) => q.tier === 3).sort(bySeq).map((q) => q.code),
    },
    closing: qs.filter(isClosing).sort(bySeq).map((q) => q.code),
  };
}

export const REACTIVE_CODES = QUESTIONS.filter((q) => q.reactiveOnly).map((q) => q.code);

/** Text shown to the participant, with role variant and the tool the respondent named themselves. */
export function questionText(q: Question, role: Role, toolMentioned?: string | null): string {
  let text = role === "leitung" && q.textLeitung ? q.textLeitung : q.text;
  if (q.reactiveOnly && toolMentioned) text = text.replace("[Werkzeug oder System]", toolMentioned);
  return text;
}
