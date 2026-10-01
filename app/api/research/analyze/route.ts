import { db } from "@/lib/supabase";
import { body, fail, json, errorMessage } from "@/lib/api";
import { researchAuthorized } from "@/lib/research";
import { byCode } from "@/lib/routing";
import { analyseAnswers, geminiConfigured } from "@/lib/gemini";
import { hashOf } from "@/lib/hash";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!researchAuthorized(req)) return fail("Zugangscode ungültig.", 401);
  const b = await body<{ code: string }>(req);
  const q = b.code ? byCode(b.code) : undefined;
  if (!q) return fail("Unbekannte Frage.");
  if (!geminiConfigured()) return fail("GEMINI_API_KEY fehlt – Auswertung nicht möglich.", 503);

  // Only answers from completed (sealed) interviews – withdrawn interviews have no answers left.
  const { data: done } = await db().from("interviews").select("id").eq("status", "completed");
  const ids = (done ?? []).map((d) => d.id);
  if (!ids.length) return fail("Noch keine abgeschlossenen Interviews.");
  const { data: rows, error } = await db()
    .from("answers")
    .select("answer_text")
    .eq("question_code", q.code)
    .eq("skipped", false)
    .in("interview_id", ids);
  if (error) return fail(error.message, 500);
  const answers = (rows ?? []).map((r) => r.answer_text as string).filter(Boolean);
  if (!answers.length) return fail("Zu dieser Frage gibt es noch keine Antworten.");

  try {
    const { analysis, model } = await analyseAnswers(q.text, answers);
    const content = { questionCode: q.code, question: q.text, answerCount: answers.length, model, createdAt: new Date().toISOString(), analysis };
    const reportHash = hashOf(content);
    const { data, error: insErr } = await db()
      .from("reports")
      .insert({ question_code: q.code, content, report_hash: reportHash })
      .select("id")
      .single();
    if (insErr) return fail(insErr.message, 500);
    return json({ reportId: data.id, reportHash, content });
  } catch (e) {
    return fail(`Gemini-Auswertung fehlgeschlagen: ${errorMessage(e)}`, 503);
  }
}
