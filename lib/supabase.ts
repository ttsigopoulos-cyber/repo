import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only client with the SECRET key. All tables have Row Level Security switched on
// and no policies, so the browser (publishable key) cannot read or write anything directly;
// every access goes through the API routes in app/api.
let client: SupabaseClient | null = null;

export function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SECRET_KEY fehlt in .env.local");
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

export interface InterviewRow {
  id: string;
  role: "pflegekraft" | "leitung" | "angehoerige";
  facility_code: string | null;
  status: "active" | "completed" | "withdrawn";
  consent_version: string;
  consent_choices: Record<string, boolean> | null;
  consent_hash: string | null;
  consent_tx: string | null;
  salt: string | null;
  tool_mentioned: string | null;
  distress_stop: boolean;
  transcript_hash: string | null;
  seal_tx: string | null;
  withdraw_tx: string | null;
  created_at: string;
  completed_at: string | null;
  withdrawn_at: string | null;
}

export interface AnswerRow {
  interview_id: string;
  question_code: string;
  answer_text: string | null;
  skipped: boolean;
  ai_checked: boolean;
  created_at: string;
}
