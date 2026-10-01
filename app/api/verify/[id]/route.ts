import { db, type InterviewRow, type AnswerRow } from "@/lib/supabase";
import { fail, json, UUID_RE, errorMessage } from "@/lib/api";
import { chainInterviewId, transcriptHash } from "@/lib/hash";
import { chainConfigured, readInterview } from "@/lib/chain";

export const runtime = "nodejs";

/** Recomputes the hash of the stored answers and compares it with the value sealed on-chain. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return fail("Ungültiger Code.");
  const { data: it } = await db().from("interviews").select("*").eq("id", id).maybeSingle<InterviewRow>();
  if (!it) return fail("Kein Interview mit diesem Code gefunden.", 404);

  let recomputed: string | null = null;
  let answerCount = 0;
  if (it.status !== "withdrawn" && it.salt) {
    const { data: rows } = await db().from("answers").select("*").eq("interview_id", id);
    const answers = ((rows ?? []) as AnswerRow[]).map((a) => ({ code: a.question_code, text: a.answer_text, skipped: a.skipped }));
    answerCount = answers.length;
    recomputed = transcriptHash({ interviewId: id, role: it.role, answers, salt: it.salt });
  }

  let onChain: Awaited<ReturnType<typeof readInterview>> | null = null;
  let chainError: string | null = null;
  if (chainConfigured()) {
    try {
      onChain = await readInterview(chainInterviewId(id));
    } catch (e) {
      chainError = errorMessage(e);
    }
  }

  const sealed = !!onChain && onChain.sealedAt > 0;
  return json({
    interviewId: id,
    status: it.status,
    role: it.role,
    answerCount,
    consentTx: it.consent_tx,
    sealTx: it.seal_tx,
    withdrawTx: it.withdraw_tx,
    storedConsentHash: it.consent_hash,
    storedTranscriptHash: it.transcript_hash,
    recomputedTranscriptHash: recomputed,
    onChain,
    consentMatches: !!onChain && onChain.consentAt > 0 && onChain.consentHash === it.consent_hash,
    transcriptMatches: sealed && recomputed !== null && onChain!.transcriptHash === recomputed,
    chainError,
  });
}
