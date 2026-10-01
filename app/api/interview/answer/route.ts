import { db, type InterviewRow } from "@/lib/supabase";
import { body, fail, json, UUID_RE, errorMessage } from "@/lib/api";
import { byCode, isAllowed, isProfessional, questionText } from "@/lib/routing";
import { localScreen, IDENTIFIER_LABELS, type IdentifierType } from "@/lib/screening";
import { geminiConfigured, screenAnswer } from "@/lib/gemini";
import { INTERRUPT_SCRIPT } from "@/lib/texts";

export const runtime = "nodejs";
const MAX_LEN = 6000;

export async function POST(req: Request) {
  const b = await body<{ interviewId: string; code: string; text: string; skip: boolean }>(req);
  if (!b.interviewId || !UUID_RE.test(b.interviewId) || !b.code) return fail("Unvollständige Anfrage.");

  const { data: it } = await db().from("interviews").select("*").eq("id", b.interviewId).maybeSingle<InterviewRow>();
  if (!it) return fail("Interview nicht gefunden.", 404);
  if (it.status !== "active") return fail("Dieses Interview ist bereits abgeschlossen.", 409);
  if (!isAllowed(it.role, b.code)) return fail("Diese Frage gehört nicht zu diesem Interview.");
  const q = byCode(b.code)!;
  if (q.reactiveOnly && !it.tool_mentioned) return fail("Diese Frage wird nur gestellt, wenn Sie selbst ein Werkzeug erwähnt haben.");

  // Skipping is always allowed – "Das möchte ich nicht sagen" is never re-asked in another form.
  if (b.skip) {
    const { error } = await db()
      .from("answers")
      .upsert({ interview_id: it.id, question_code: q.code, answer_text: null, skipped: true, ai_checked: false }, { onConflict: "interview_id,question_code" });
    if (error) return fail(error.message, 500);
    return json({ status: "saved", skipped: true });
  }

  const text = (b.text ?? "").trim();
  if (!text) return fail("Bitte geben Sie eine Antwort ein oder überspringen Sie die Frage.");
  if (text.length > MAX_LEN) return fail(`Bitte fassen Sie sich kürzer (höchstens ${MAX_LEN} Zeichen).`);

  const revise = (types: IdentifierType[], by: "lokal" | "ki") =>
    json({
      status: "needs_revision",
      message: INTERRUPT_SCRIPT,
      detected: types.map((t) => IDENTIFIER_LABELS[t]),
      checkedBy: by,
    });

  // Layer 1: local patterns – obvious identifiers never reach the AI.
  const local = localScreen(text);
  if (local.length) return revise(local, "lokal");

  // Layer 2: Gemini screening. If Gemini is unavailable, the answer is stored with ai_checked=false
  // so that the research team knows to check it manually.
  let aiChecked = false;
  let distress: "none" | "mild" | "strong" = "none";
  let tools: string[] = [];
  let aiError: string | null = null;
  if (geminiConfigured()) {
    try {
      const s = await screenAnswer(questionText(q, it.role, it.tool_mentioned), text);
      if (s.containsIdentifiers) return revise(s.identifierTypes.length ? s.identifierTypes : ["sonstiges"], "ki");
      aiChecked = true;
      distress = s.distress;
      tools = s.toolsMentioned;
    } catch (e) {
      aiError = errorMessage(e);
    }
  }

  const { error } = await db()
    .from("answers")
    .upsert({ interview_id: it.id, question_code: q.code, answer_text: text, skipped: false, ai_checked: aiChecked }, { onConflict: "interview_id,question_code" });
  if (error) return fail(error.message, 500);

  // Part D is reactive: it is unlocked only by a tool the respondent named themselves.
  let toolMentioned: string | null = null;
  if (isProfessional(it.role) && !it.tool_mentioned && tools.length) {
    toolMentioned = tools[0].slice(0, 80);
    await db().from("interviews").update({ tool_mentioned: toolMentioned }).eq("id", it.id);
  }
  // Family block: at any sign of distress the remaining family questions must be dropped.
  const stopFamilyBlock = it.role === "angehoerige" && distress !== "none";
  if (stopFamilyBlock) await db().from("interviews").update({ distress_stop: true }).eq("id", it.id);

  return json({ status: "saved", aiChecked, aiError, distress, toolMentioned, stopFamilyBlock });
}
