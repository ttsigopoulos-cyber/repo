import "server-only";
import { timingSafeEqual } from "node:crypto";

/** Very small access gate for the research dashboard (course prototype, not production auth). */
export function researchAuthorized(req: Request): boolean {
  const expected = process.env.RESEARCH_ACCESS_CODE || "";
  const given = req.headers.get("x-research-code") || "";
  if (expected.length < 8 || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}
