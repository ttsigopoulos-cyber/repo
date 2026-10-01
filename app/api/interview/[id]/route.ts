import { db, type InterviewRow } from "@/lib/supabase";
import { fail, json, UUID_RE } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return fail("Ungültiger Code.");
  const { data: it } = await db().from("interviews").select("*").eq("id", id).maybeSingle<InterviewRow>();
  if (!it) return fail("Interview nicht gefunden.", 404);
  const { data: answers } = await db().from("answers").select("question_code").eq("interview_id", id);
  return json({
    interviewId: it.id,
    role: it.role,
    status: it.status,
    toolMentioned: it.tool_mentioned,
    distressStop: it.distress_stop,
    consentTx: it.consent_tx,
    answeredCodes: (answers ?? []).map((a) => a.question_code),
  });
}
