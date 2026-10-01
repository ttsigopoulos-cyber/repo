-- ICP interview platform – schema for Supabase (Postgres).
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- (Or let Cursor's agent apply it via the Supabase MCP after switching read_only off.)

create table if not exists public.interviews (
  id               uuid primary key default gen_random_uuid(),
  role             text not null check (role in ('pflegekraft', 'leitung', 'angehoerige')),
  facility_code    text,                        -- optional pseudonymous code from the invitation link, never a facility name
  status           text not null default 'active' check (status in ('active', 'completed', 'withdrawn')),
  consent_version  text not null,
  consent_choices  jsonb,
  consent_hash     text,
  consent_tx       text,
  salt             text,                        -- deleted on withdrawal -> on-chain hashes become unlinkable
  tool_mentioned   text,                        -- tool the respondent named first (unlocks Part D)
  distress_stop    boolean not null default false,
  transcript_hash  text,
  seal_tx          text,
  withdraw_tx      text,
  created_at       timestamptz not null default now(),
  completed_at     timestamptz,
  withdrawn_at     timestamptz
);

create table if not exists public.answers (
  id             bigint generated always as identity primary key,
  interview_id   uuid not null references public.interviews(id) on delete cascade,
  question_code  text not null,
  answer_text    text,
  skipped        boolean not null default false,
  ai_checked     boolean not null default false, -- false = Gemini was unavailable, check manually
  created_at     timestamptz not null default now(),
  unique (interview_id, question_code)
);

create table if not exists public.reports (
  id             uuid primary key default gen_random_uuid(),
  question_code  text not null,
  content        jsonb not null,
  report_hash    text not null,
  anchor_tx      text,
  created_at     timestamptz not null default now()
);

create index if not exists answers_question_idx on public.answers (question_code);
create index if not exists interviews_status_idx on public.interviews (status);

-- Row Level Security ON and deliberately NO policies: the publishable key in the browser
-- can read or write nothing. Only the server (secret key) can access these tables.
alter table public.interviews enable row level security;
alter table public.answers    enable row level security;
alter table public.reports    enable row level security;
