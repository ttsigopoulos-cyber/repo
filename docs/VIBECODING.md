# Vibecoding log

How this application was built with AI-assisted development, from setting up the environment to the first live test.

## Phase 1 – Environment (29 September 2026, Cursor agent)

The prescribed stack was set up following the course's Vibecoding Stack Setup Guide, with fixes for Windows documented in our own setup guide (`260930TT\_AI-BLOCKCHAIN-SETUP-GUIDE.html`).

Prompts used in Cursor's agent:

> Create a server-side API route in this Next.js app that sends a short test prompt to Gemini using the @google/genai package and the GEMINI\_API\_KEY from .env.local. Use a current model from the official Gemini quickstart (ai.google.dev/gemini-api/docs/quickstart). Never expose the key to the browser.

Result: `app/api/gemini/route.ts` with model `gemini-3.5-flash`, status 200. (Removed in phase 3; the app's own Gemini calls replace it.)

Supabase MCP: the one-click installer failed with "Client error: terminated"; Supabase's **Copy prompt** pasted into Cursor's agent wrote `.cursor/mcp.json`, completed the login and verified the read-only connection.

Hardhat 3 was initialised with `npx hardhat --init` (node-test-runner-viem); sample tests 5/5 passing; MetaMask connected to Hardhat Local.

## Phase 2 – Specification to application (30 September, Claude)

Instead of writing code, we handed the AI three business documents and one instruction:

* the assignment brief (`ESCP\_AI\_Blockchain\_Final\_Project\_Assignment.pdf`),
* our flyer for participating care homes (`261001TT\_Zoevis\_OnePager\_DE\_v3\_Online.docx`),
* the questionnaire workbook with 72 questions, legal assessment per question and hidden interviewer instructions (`260930TT\_ESCP\_ICP\_SCB\_CareHousesGermany\_Questionnaire.xlsx`).

What the AI derived from the documents rather than from us:

* **AI role:** the workbook's "live interrupt script" and "standing anonymisation instruction" became an automatic two-layer anonymisation guard; the rule "Part D only if the respondent raises the topic first" became AI tool detection; "omit the family block at any sign of distress" became AI distress detection.
* **Blockchain role:** the workbook's insistence that consent naming both purposes must exist *before* the first question became an on-chain consent record that the contract requires before sealing.
* **Order of questions:** the workbook's 25-minute rule (tier 1 first, in sheet order).
* **Wording:** extracted programmatically (`scripts/extract\_questions.py`) so the legally reviewed German text is never retyped.

Human decisions taken during review:

* Flagged answers are never stored and cannot be overridden (privacy over convenience).
* The closing questions A11.1/A11.2 always come last (deviation from strict tier order, for self-administration).
* Interviews with relatives are switched off by default.
* The free Gemini tier is used with invented demo answers only.

## Phase 3 – Verification by the AI, checked by us

|Check|Result|
|-|-|
|`npx hardhat test` (Hardhat 3.18, 5 tests)|5 passing|
|Ignition deployment on a local node|deployed|
|`next build` incl. TypeScript check (Next.js 15.5.27)|passed|
|ESLint (`next/core-web-vitals`, `next/typescript`)|no warnings or errors|
|End-to-end script: app's own `lib/chain.ts` and `lib/hash.ts` against a running Hardhat node|consent recorded, interview sealed, hash order-independent, tampered answer detected, withdrawal recorded|
|Scripted browser walkthrough (Playwright, desktop and mobile), Supabase/Gemini responses mocked|interrupt message, reactive Part D, tier checkpoint and closing questions behave as specified|
|Screenshot review|found a pause/stop bar that wrapped on phones; fixed and re-checked|

Not verified in the AI's sandbox (no network access to these services): live calls to Supabase and Gemini.

## Phase 4 – Integration and live tests (30 September 2026)

Integration was done by the student in Cursor's terminal (PowerShell, Windows), with Claude reviewing each step from screenshots and supplying fixes. Every problem that came up, in order:

|Step|What happened|Resolution|
|-|-|-|
|Merge|The delivered files were copied over the existing Next.js project. `git status` showed exactly the six intended modified files (layout, page, global styles, README, `next.config.ts`, `tsconfig.json`) plus the new folders.|–|
|Dependencies|`npm install viem @supabase/supabase-js server-only` added 22 packages. npm reported 2 vulnerabilities (1 moderate, 1 high) and its advisory install-scripts notice.|No `npm audit fix --force`: it would upgrade to Next.js 16, a breaking change. The old Gemini test route was deleted.|
|First build|Failed: `Definition for rule '@typescript-eslint/no-explicit-any' was not found` in `lib/chain.ts`. The project's ESLint configuration does not load the TypeScript rule set, so a comment disabling one of its rules counted as an error.|Claude replaced the generic, `any`-typed helper with three fully typed contract functions, re-verified the build and the chain flow in its sandbox, and the second build passed (16 routes). Pushed as commit `2245afc`.|
|Database|Cursor's agent view showed no file explorer.|The migration was copied to the clipboard with `Get-Content -Raw …|
|Contract|`npx hardhat test`: 10 passing (3 Solidity, 7 node:test), compiled with solc 0.8.34. Ignition deployed `InterviewRegistry` to `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`, with a harmless warning that the Counter example had been deployed on the same chain earlier.|–|
|Configuration|A review of `.env.local` before restarting found a duplicate `NEXT\_PUBLIC\_CONTRACT\_ADDRESS` line (old Counter address) and two unreplaced placeholders.|Old line removed, placeholders filled. The relayer key was verified locally with viem (`privateKeyToAccount` returned Hardhat account #1).|
|Health check|`/api/health`: Supabase and Gemini configured, chain configured and reachable.|–|
|Test interview|Invented answers. "Zimmer 12" was stopped by the local pattern check and nothing was stored. After rephrasing, Gemini detected the tool "Vivendi" and the reactive Part D appeared. 17 answers stored; consent recorded on-chain before the first question, interview sealed at the end; the receipt page confirmed that stored answers and on-chain checksum match.|–|
|Tamper test|An answer was edited directly in Supabase to simulate manipulation, then restored.|*Result: \[confirm: receipt page turned yellow after the edit and green again after restoring]*|
|Research dashboard|The first Gemini analysis failed with HTTP 503 "This model is currently experiencing high demand". A temporary Google-side overload, but the same could hit a participant mid-interview.|Claude added automatic retries and a fallback model (`gemini-3.1-flash-lite`, configurable) to all Gemini calls. The next analysis succeeded with `gemini-3.5-flash`.|
|Anchoring|The report checksum was anchored from MetaMask (Hardhat account #0, contract owner).|Transaction `0xb4ec7f3d…2ebfde`; the server confirmed it on-chain and listed the report as anchored.|
|Demo data|`scripts/seed-demo.mjs` runs four invented interviews through the real API, so the dashboard shows meaningful themes, a median documentation time and a burden ranking.|–|

### What this phase showed

* **The AI's sandbox tests did not catch environment differences.** The build passed with Next.js's TypeScript lint rules in the sandbox but failed with the project's own configuration. Testing in the target environment remains essential.
* **Human review caught configuration errors the AI could not see.** The duplicate variable and placeholders in `.env.local` were found by checking a screenshot before restarting.
* **Live operation exposed a robustness gap.** Overload of an external AI service is not a code error, but a platform used in real interviews has to absorb it. The fix came from a real failure, not from the original specification.

