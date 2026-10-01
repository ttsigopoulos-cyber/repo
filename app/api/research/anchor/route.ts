import { db } from "@/lib/supabase";
import { body, fail, json, UUID_RE, errorMessage } from "@/lib/api";
import { researchAuthorized } from "@/lib/research";
import { hashOf } from "@/lib/hash";
import { reportAnchoredAt } from "@/lib/chain";
import type { Hex } from "viem";

export const runtime = "nodejs";

/** Called after the researcher anchored a report hash via MetaMask. The server checks the chain itself. */
export async function POST(req: Request) {
  if (!researchAuthorized(req)) return fail("Zugangscode ungültig.", 401);
  const b = await body<{ reportId: string; txHash: string }>(req);
  if (!b.reportId || !UUID_RE.test(b.reportId) || !b.txHash || !/^0x[0-9a-f]{64}$/i.test(b.txHash)) return fail("Unvollständige Anfrage.");
  const { data: rep } = await db().from("reports").select("*").eq("id", b.reportId).maybeSingle();
  if (!rep) return fail("Bericht nicht gefunden.", 404);
  if (hashOf(rep.content) !== rep.report_hash) return fail("Der gespeicherte Bericht passt nicht mehr zu seiner Prüfsumme.", 409);
  try {
    const at = await reportAnchoredAt(rep.report_hash as Hex);
    if (!at) return fail("Die Prüfsumme ist auf der Blockchain nicht zu finden.", 409);
    await db().from("reports").update({ anchor_tx: b.txHash }).eq("id", b.reportId);
    return json({ anchoredAt: at });
  } catch (e) {
    return fail(errorMessage(e), 502);
  }
}
