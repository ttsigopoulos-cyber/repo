# Vibecoding log

How this application was built with AI-assisted development. Entries marked *to do* are steps still to be carried out in Cursor; replace them with what actually happened.

## Phase 1 – Environment (30 September 2026, Cursor agent)

The prescribed stack was set up following the course's Vibecoding Stack Setup Guide, with fixes for Windows documented in our own setup guide (`260930TT_AI-BLOCKCHAIN-SETUP-GUIDE.html`).

Prompts used in Cursor's agent:

> Create a server-side API route in this Next.js app that sends a short test prompt to Gemini using the @google/genai package and the GEMINI_API_KEY from .env.local. Use a current model from the official Gemini quickstart (ai.google.dev/gemini-api/docs/quickstart). Never expose the key to the browser.

Result: `app/api/gemini/route.ts` with model `gemini-3.5-flash`, status 200. (Removed in phase 3; the app's own Gemini calls replace it.)

Supabase MCP: the one-click installer failed with "Client error: terminated"; Supabase's **Copy prompt** pasted into Cursor's agent wrote `.cursor/mcp.json`, completed the login and verified the read-only connection.

Hardhat 3 was initialised with `npx hardhat --init` (node-test-runner-viem); sample tests 5/5 passing; MetaMask connected to Hardhat Local.

## Phase 2 – Specification to application (1 October 2026, Claude)

Instead of writing code, we handed the AI three business documents and one instruction:

- the assignment brief (`ESCP_AI_Blockchain_Final_Project_Assignment.pdf`),
- our flyer for participating care homes (`261001TT_Zoevis_OnePager_DE_v3_Online.docx`),
- the questionnaire workbook with 72 questions, legal assessment per question and hidden interviewer instructions (`260930TT_ESCP_ICP_SCB_CareHousesGermany_Questionnaire.xlsx`).


What the AI derived from the documents rather than from us:

- **AI role:** the workbook's "live interrupt script" and "standing anonymisation instruction" became an automatic two-layer anonymisation guard; the rule "Part D only if the respondent raises the topic first" became AI tool detection; "omit the family block at any sign of distress" became AI distress detection.
- **Blockchain role:** the workbook's insistence that consent naming both purposes must exist *before* the first question became an on-chain consent record that the contract requires before sealing.
- **Order of questions:** the workbook's 25-minute rule (tier 1 first, in sheet order).
- **Wording:** extracted programmatically (`scripts/extract_questions.py`) so the legally reviewed German text is never retyped.

Human decisions taken during review:

- Flagged answers are never stored and cannot be overridden (privacy over convenience).
- The closing questions A11.1/A11.2 always come last (deviation from strict tier order, for self-administration).
- Interviews with relatives are switched off by default.
- The free Gemini tier is used with invented demo answers only.

## Phase 3 – Verification by the AI, checked by us

| Check | Result |
|---|---|
| `npx hardhat test` (Hardhat 3.18, 5 tests) | 5 passing |
| Ignition deployment on a local node | deployed |
| `next build` incl. TypeScript check (Next.js 15.5.27) | passed |
| ESLint (`next/core-web-vitals`, `next/typescript`) | no warnings or errors |
| End-to-end script: app's own `lib/chain.ts` and `lib/hash.ts` against a running Hardhat node | consent recorded, interview sealed, hash order-independent, tampered answer detected, withdrawal recorded |
| Scripted browser walkthrough (Playwright, desktop and mobile), Supabase/Gemini responses mocked | interrupt message, reactive Part D, tier checkpoint and closing questions behave as specified |
| Screenshot review | found a pause/stop bar that wrapped on phones; fixed and re-checked |

Not verified in the AI's sandbox (no network access to these services): live calls to Supabase and Gemini.

## Phase 4 – Integration in Cursor (*to do*)

Suggested agent prompts:

1. > Merge the files from the delivered folder into this repository. Keep my existing blockchain/hardhat.config.ts. Delete app/api/gemini/route.ts. Install viem, @supabase/supabase-js and server-only. Then run npm run build and fix any errors without changing lib/questions.ts.
2. > Using the Supabase MCP, apply supabase/migrations/20261001000000_interview_platform.sql to my project and list the tables afterwards. (Switch `read_only=true` off for this step, then back on.)
3. > Start the app and call /api/health. Explain any part that is not configured.

Record here what the agent did, which errors appeared and how they were fixed.
