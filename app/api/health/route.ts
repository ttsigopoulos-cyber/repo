import { json } from "@/lib/api";
import { chainConfigured, chainStats } from "@/lib/chain";
import { geminiConfigured, geminiModel } from "@/lib/gemini";
import { CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/chainConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Which parts of the stack are configured – no secrets are returned. */
export async function GET() {
  let chainReachable = false;
  if (chainConfigured()) {
    try {
      await chainStats();
      chainReachable = true;
    } catch {
      chainReachable = false;
    }
  }
  return json({
    supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SECRET_KEY,
    gemini: geminiConfigured() ? geminiModel() : false,
    chain: { configured: chainConfigured(), reachable: chainReachable, chainId: CHAIN_ID, contract: CONTRACT_ADDRESS || null },
  });
}
