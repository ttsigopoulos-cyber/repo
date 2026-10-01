import { db } from "@/lib/supabase";
import { body, fail, json, errorMessage } from "@/lib/api";
import { isRole, familyEnabled } from "@/lib/routing";
import { consentComplete, CONSENT_VERSION, type ConsentChoices } from "@/lib/texts";
import { chainInterviewId, consentHash, randomSalt } from "@/lib/hash";
import { chainConfigured, recordConsentOnChain } from "@/lib/chain";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await body<{ role: string; consent: ConsentChoices; facilityCode: string }>(req);
  if (!isRole(b.role)) return fail("Unbekannte Rolle.");
  if (b.role === "angehoerige" && !familyEnabled()) return fail("Interviews mit Angehörigen sind derzeit nicht freigeschaltet.", 403);
  if (!b.consent || !consentComplete(b.consent)) return fail("Bitte bestätigen Sie alle Punkte der Einwilligung.");
  const facilityCode = typeof b.facilityCode === "string" ? b.facilityCode.trim().slice(0, 16).toUpperCase() || null : null;

  const salt = randomSalt();
  const choices: ConsentChoices = {
    academic: b.consent.academic === true,
    venture: b.consent.venture === true,
    healthData: b.consent.healthData === true,
    adult: b.consent.adult === true,
  };

  const { data, error } = await db()
    .from("interviews")
    .insert({ role: b.role, facility_code: facilityCode, consent_version: CONSENT_VERSION, consent_choices: choices, salt })
    .select("id")
    .single();
  if (error || !data) return fail(`Interview konnte nicht angelegt werden: ${error?.message}`, 500);

  const id = data.id as string;
  const cHash = consentHash({ interviewId: id, role: b.role, choices, salt });
  await db().from("interviews").update({ consent_hash: cHash }).eq("id", id);

  // Consent goes on-chain BEFORE the first question is shown.
  let consentTx: string | null = null;
  let chainError: string | null = null;
  if (chainConfigured()) {
    try {
      consentTx = (await recordConsentOnChain(chainInterviewId(id), cHash)).txHash;
      await db().from("interviews").update({ consent_tx: consentTx }).eq("id", id);
    } catch (e) {
      chainError = errorMessage(e);
    }
  }
  return json({ interviewId: id, role: b.role, consentTx, chainError });
}
