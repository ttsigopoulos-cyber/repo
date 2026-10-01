import { keccak256, stringToBytes, type Hex } from "viem";
import { CONSENT_PARAGRAPHS, CONSENT_ITEMS, CONSENT_VERSION, type ConsentChoices } from "./texts";

/** Deterministic JSON: object keys sorted, so the same data always hashes the same way. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export const hashOf = (value: unknown): Hex => keccak256(stringToBytes(canonicalJson(value)));

/** On-chain key of an interview. The uuid is random, so it reveals nothing about the person. */
export const chainInterviewId = (interviewId: string): Hex => keccak256(stringToBytes(`icp-interview:${interviewId}`));

export const consentTextHash = (): Hex =>
  hashOf({ version: CONSENT_VERSION, paragraphs: CONSENT_PARAGRAPHS, items: CONSENT_ITEMS.map((i) => i.label) });

export function consentHash(p: { interviewId: string; role: string; choices: ConsentChoices; salt: string }): Hex {
  return hashOf({ kind: "consent", version: CONSENT_VERSION, textHash: consentTextHash(), ...p });
}

export interface HashableAnswer {
  code: string;
  text: string | null;
  skipped: boolean;
}

export function transcriptHash(p: { interviewId: string; role: string; answers: HashableAnswer[]; salt: string }): Hex {
  const answers = [...p.answers]
    .sort((a, b) => (a.code < b.code ? -1 : 1))
    .map((a) => ({ code: a.code, text: a.skipped ? null : a.text, skipped: a.skipped }));
  return hashOf({ kind: "transcript", interviewId: p.interviewId, role: p.role, answers, salt: p.salt });
}

export function randomSalt(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
