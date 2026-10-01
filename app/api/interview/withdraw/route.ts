import { db, type InterviewRow } from "@/lib/supabase";
import { body, fail, json, UUID_RE, errorMessage } from "@/lib/api";
import { chainInterviewId } from "@/lib/hash";
import { chainConfigured, withdrawOnChain } from "@/lib/chain";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await body<{ interviewId: string }>(req);
  if (!b.interviewId || !UUID_RE.test(b.interviewId)) return fail("Ungültiger Code.");
  const { data: it } = await db().from("interviews").select("*").eq("id", b.interviewId).maybeSingle<InterviewRow>();
  if (!it) return fail("Interview nicht gefunden.", 404);
  if (it.status === "withdrawn") return json({ status: "withdrawn" });

  // 1) Delete the content and the salt: the on-chain hashes can no longer be linked to anything.
  const del = await db().from("answers").delete().eq("interview_id", it.id);
  if (del.error) return fail(del.error.message, 500);
  await db()
    .from("interviews")
    .update({ status: "withdrawn", salt: null, consent_choices: null, tool_mentioned: null, withdrawn_at: new Date().toISOString() })
    .eq("id", it.id);

  // 2) Record the withdrawal on-chain (only if consent had been recorded there).
  let withdrawTx: string | null = null;
  let chainError: string | null = null;
  if (chainConfigured() && it.consent_tx) {
    try {
      withdrawTx = (await withdrawOnChain(chainInterviewId(it.id))).txHash;
      await db().from("interviews").update({ withdraw_tx: withdrawTx }).eq("id", it.id);
    } catch (e) {
      chainError = errorMessage(e);
    }
  }
  return json({ status: "withdrawn", withdrawTx, chainError });
}
