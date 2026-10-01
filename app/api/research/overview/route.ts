import { db, type InterviewRow } from "@/lib/supabase";
import { fail, json, errorMessage } from "@/lib/api";
import { researchAuthorized } from "@/lib/research";
import { QUESTIONS } from "@/lib/questions";
import { chainConfigured, chainStats } from "@/lib/chain";
import { geminiConfigured, geminiModel } from "@/lib/gemini";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!researchAuthorized(req)) return fail("Zugangscode ungültig.", 401);

  const { data: interviews, error } = await db()
    .from("interviews")
    .select("id, role, facility_code, status, consent_tx, seal_tx, withdraw_tx, tool_mentioned, distress_stop, created_at, completed_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return fail(error.message, 500);

  const completedIds = (interviews as InterviewRow[]).filter((i) => i.status === "completed").map((i) => i.id);
  const counts: Record<string, { answered: number; skipped: number; unchecked: number }> = {};
  if (completedIds.length) {
    const { data: answers } = await db()
      .from("answers")
      .select("question_code, skipped, ai_checked")
      .in("interview_id", completedIds);
    for (const a of answers ?? []) {
      const c = (counts[a.question_code] ??= { answered: 0, skipped: 0, unchecked: 0 });
      if (a.skipped) c.skipped++;
      else {
        c.answered++;
        if (!a.ai_checked) c.unchecked++;
      }
    }
  }

  const { data: reports } = await db()
    .from("reports")
    .select("id, question_code, report_hash, anchor_tx, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  let chain: { consentCount: number; sealedCount: number } | null = null;
  let chainError: string | null = null;
  if (chainConfigured()) {
    try {
      chain = await chainStats();
    } catch (e) {
      chainError = errorMessage(e);
    }
  }

  return json({
    interviews,
    questions: QUESTIONS.map((q) => ({ code: q.code, part: q.part, blockTitle: q.blockTitle, tier: q.tier, text: q.text, counts: counts[q.code] ?? null })),
    reports: reports ?? [],
    chain,
    chainError,
    gemini: geminiConfigured() ? geminiModel() : null,
  });
}
