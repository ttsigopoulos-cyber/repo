import { db, type InterviewRow, type AnswerRow } from "@/lib/supabase";
import { body, fail, json, UUID_RE, errorMessage } from "@/lib/api";
import { chainInterviewId, transcriptHash } from "@/lib/hash";
import { chainConfigured, recordConsentOnChain, sealOnChain } from "@/lib/chain";
import type { Hex } from "viem";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await body<{ interviewId: string }>(req);
  if (!b.interviewId || !UUID_RE.test(b.interviewId)) return fail("Ungültiger Code.");
  const { data: it } = await db().from("interviews").select("*").eq("id", b.interviewId).maybeSingle<InterviewRow>();
  if (!it) return fail("Interview nicht gefunden.", 404);
  if (it.status === "withdrawn") return fail("Dieses Interview wurde widerrufen.", 409);
  if (it.status === "completed") return json({ interviewId: it.id, transcriptHash: it.transcript_hash, sealTx: it.seal_tx });

  const { data: rows, error } = await db().from("answers").select("*").eq("interview_id", it.id);
  if (error) return fail(error.message, 500);
  const answers = (rows as AnswerRow[]).map((a) => ({ code: a.question_code, text: a.answer_text, skipped: a.skipped }));
  const tHash = transcriptHash({ interviewId: it.id, role: it.role, answers, salt: it.salt! });

  let sealTx: string | null = null;
  let chainError: string | null = null;
  if (chainConfigured()) {
    try {
      const cid = chainInterviewId(it.id);
      if (!it.consent_tx && it.consent_hash) {
        const c = await recordConsentOnChain(cid, it.consent_hash as Hex);
        await db().from("interviews").update({ consent_tx: c.txHash }).eq("id", it.id);
      }
      sealTx = (await sealOnChain(cid, tHash)).txHash;
    } catch (e) {
      chainError = errorMessage(e);
    }
  }

  await db()
    .from("interviews")
    .update({ status: "completed", transcript_hash: tHash, seal_tx: sealTx, completed_at: new Date().toISOString() })
    .eq("id", it.id);

  return json({ interviewId: it.id, transcriptHash: tHash, sealTx, chainError, answerCount: answers.length });
}
