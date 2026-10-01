"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Role } from "@/lib/questions";
import { ROLES, byCode, plannedSequence, questionText, REACTIVE_CODES, isProfessional } from "@/lib/routing";
import {
  ANONYMISATION_INSTRUCTION,
  CONSENT_ITEMS,
  CONSENT_PARAGRAPHS,
  DISTRESS_PROTOCOL,
  consentComplete,
  type ConsentChoices,
} from "@/lib/texts";
import { txLink } from "@/lib/chainConfig";

type Phase = "resume" | "role" | "consent" | "intro" | "question" | "checkpoint" | "distress" | "paused" | "stop" | "done" | "withdrawn";
type Stage = { label: string; codes: string[] };

const STORAGE_KEY = "icp-interview-active";
const FAMILY_ENABLED = process.env.NEXT_PUBLIC_ENABLE_FAMILY === "true";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`);
  return data as T;
}

function buildStages(role: Role): { stages: Stage[]; closing: string[] } {
  const plan = plannedSequence(role);
  const labels = { 1: "Teil 1", 2: "Teil 2", 3: "Teil 3" } as const;
  const stages = ([1, 2, 3] as const)
    .map((t) => ({ label: labels[t], codes: plan.tiers[t] }))
    .filter((s) => s.codes.length > 0);
  return { stages, closing: plan.closing };
}

export default function InterviewFlow() {
  const [phase, setPhase] = useState<Phase>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [facilityCode, setFacilityCode] = useState<string>("");
  const [consent, setConsent] = useState<Partial<ConsentChoices>>({});
  const [interviewId, setInterviewId] = useState<string | null>(null);

  const [stageIndex, setStageIndex] = useState(0);
  const [inClosing, setInClosing] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [pos, setPos] = useState(0);
  const [toolMentioned, setToolMentioned] = useState<string | null>(null);
  const [reactiveInserted, setReactiveInserted] = useState(false);

  const [draft, setDraft] = useState("");
  const [interrupt, setInterrupt] = useState<{ message: string; detected: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [result, setResult] = useState<{ sealTx: string | null; consentTx: string | null; chainError?: string | null } | null>(null);
  const consentTxRef = useRef<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const structure = useMemo(() => (role ? buildStages(role) : null), [role]);
  const currentCode = queue[pos];
  const currentQuestion = currentCode ? byCode(currentCode) : undefined;

  // Facility code from the invitation link (?e=HH01) and resume after a pause.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFacilityCode((params.get("e") || "").slice(0, 16));
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setPhase("resume");
  }, []);

  useEffect(() => {
    headingRef.current?.focus();
  }, [phase, pos]);

  const remember = (id: string) => sessionStorage.setItem(STORAGE_KEY, id);
  const forget = () => sessionStorage.removeItem(STORAGE_KEY);

  async function resume() {
    const id = sessionStorage.getItem(STORAGE_KEY);
    if (!id) return setPhase("role");
    setBusy(true);
    try {
      const s = await api<{ role: Role; status: string; answeredCodes: string[]; toolMentioned: string | null; consentTx: string | null }>(`/api/interview/${id}`);
      if (s.status !== "active") {
        forget();
        setPhase("role");
        return;
      }
      const { stages, closing } = buildStages(s.role);
      const answered = new Set(s.answeredCodes);
      let idx = stages.findIndex((st) => st.codes.some((c) => !answered.has(c)));
      let closingPhase = false;
      let codes: string[];
      if (idx === -1) {
        idx = Math.max(stages.length - 1, 0);
        closingPhase = true;
        codes = closing.filter((c) => !answered.has(c));
      } else {
        codes = stages[idx].codes.filter((c) => !answered.has(c));
      }
      if (s.toolMentioned && !REACTIVE_CODES.every((c) => answered.has(c))) {
        codes = [...REACTIVE_CODES.filter((c) => !answered.has(c)), ...codes];
      }
      setRole(s.role);
      setInterviewId(id);
      setToolMentioned(s.toolMentioned);
      setReactiveInserted(!!s.toolMentioned);
      consentTxRef.current = s.consentTx;
      setStageIndex(idx);
      setInClosing(closingPhase);
      setQueue(codes);
      setPos(0);
      setPhase(codes.length ? "question" : "stop");
    } catch (e) {
      setError((e as Error).message);
      forget();
      setPhase("role");
    } finally {
      setBusy(false);
    }
  }

  async function start() {
    if (!role || !consentComplete(consent)) return;
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ interviewId: string; consentTx: string | null; chainError: string | null }>("/api/interview/start", {
        method: "POST",
        body: JSON.stringify({ role, consent, facilityCode }),
      });
      setInterviewId(r.interviewId);
      remember(r.interviewId);
      consentTxRef.current = r.consentTx;
      const { stages } = buildStages(role);
      setStageIndex(0);
      setInClosing(false);
      setQueue(stages[0]?.codes ?? []);
      setPos(0);
      setPhase("intro");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const advance = useCallback(() => {
    setDraft("");
    setInterrupt(null);
    setError(null);
    if (pos + 1 < queue.length) {
      setPos(pos + 1);
      return;
    }
    if (!structure) return;
    if (!inClosing && stageIndex + 1 < structure.stages.length) {
      setPhase("checkpoint");
      return;
    }
    if (!inClosing && structure.closing.length) {
      setInClosing(true);
      setQueue(structure.closing);
      setPos(0);
      return;
    }
    void finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, queue, structure, inClosing, stageIndex]);

  async function submit(skip: boolean) {
    if (!interviewId || !currentCode) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const r = await api<{
        status: "saved" | "needs_revision";
        message?: string;
        detected?: string[];
        distress?: "none" | "mild" | "strong";
        toolMentioned?: string | null;
        stopFamilyBlock?: boolean;
        aiChecked?: boolean;
      }>("/api/interview/answer", {
        method: "POST",
        body: JSON.stringify({ interviewId, code: currentCode, text: draft, skip }),
      });
      if (r.status === "needs_revision") {
        setInterrupt({ message: r.message ?? "", detected: r.detected ?? [] });
        return;
      }
      if (r.stopFamilyBlock) {
        setNotice(
          "Danke, dass Sie das mit uns geteilt haben. Wir beenden die Fragen an dieser Stelle – Ihre bisherigen Antworten sind gespeichert.",
        );
        await finish();
        return;
      }
      // Part D is reactive: it appears right after the answer in which the respondent named a tool.
      if (r.toolMentioned && !reactiveInserted && role && isProfessional(role)) {
        setToolMentioned(r.toolMentioned);
        setReactiveInserted(true);
        setQueue((q) => [...q.slice(0, pos + 1), ...REACTIVE_CODES, ...q.slice(pos + 1)]);
        setDraft("");
        setInterrupt(null);
        setPos(pos + 1);
        return;
      }
      if (r.distress === "strong") {
        setPhase("distress");
        return;
      }
      advance();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function continueToNextStage() {
    if (!structure) return;
    const next = stageIndex + 1;
    setStageIndex(next);
    setQueue(structure.stages[next].codes);
    setPos(0);
    setPhase("question");
  }

  function goToClosing() {
    if (!structure) return;
    if (!structure.closing.length) return void finish();
    setInClosing(true);
    setQueue(structure.closing);
    setPos(0);
    setPhase("question");
  }

  async function finish() {
    if (!interviewId) return;
    setBusy(true);
    try {
      const r = await api<{ sealTx: string | null; chainError: string | null }>("/api/interview/complete", {
        method: "POST",
        body: JSON.stringify({ interviewId }),
      });
      setResult({ sealTx: r.sealTx, consentTx: consentTxRef.current, chainError: r.chainError });
      forget();
      setPhase("done");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function withdrawAll() {
    if (!interviewId) return;
    setBusy(true);
    try {
      await api("/api/interview/withdraw", { method: "POST", body: JSON.stringify({ interviewId }) });
      forget();
      setPhase("withdrawn");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const inInterview = interviewId && ["question", "checkpoint", "distress"].includes(phase);

  return (
    <>
      <main className="shell">
        {error && (
          <div className="notice notice-error" role="alert">
            <p>{error}</p>
          </div>
        )}

        {phase === "resume" && (
          <section>
            <h1 ref={headingRef} tabIndex={-1}>Interview fortsetzen?</h1>
            <p>In diesem Browserfenster ist ein pausiertes Interview gespeichert. Ihre bisherigen Antworten sind erhalten.</p>
            <div className="actions">
              <button className="btn btn-primary" onClick={resume} disabled={busy}>Interview fortsetzen</button>
              <button className="btn btn-quiet" onClick={() => { forget(); setPhase("role"); }}>Neues Interview beginnen</button>
            </div>
          </section>
        )}

        {phase === "role" && (
          <section>
            <h1 ref={headingRef} tabIndex={-1}>In welcher Rolle nehmen Sie teil?</h1>
            <p className="muted">Je nach Rolle stellen wir unterschiedliche Fragen.</p>
            <div className="choices">
              {ROLES.filter((r) => r.id !== "angehoerige" || FAMILY_ENABLED).map((r) => (
                <button key={r.id} className="choice" onClick={() => { setRole(r.id); setPhase("consent"); }}>
                  <strong>{r.label}</strong>
                  <span>{r.hint}</span>
                </button>
              ))}
            </div>
            {facilityCode && <p className="small muted">Einladungscode der Einrichtung: {facilityCode}</p>}
          </section>
        )}

        {phase === "consent" && role && (
          <section>
            <h1 ref={headingRef} tabIndex={-1}>Einwilligungserklärung</h1>
            <div className="consent-text panel">
              {CONSENT_PARAGRAPHS.map((p) => <p key={p}>{p}</p>)}
            </div>
            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="muted small" style={{ marginBottom: "0.5rem" }}>Bitte bestätigen Sie jeden Punkt einzeln.</legend>
              {CONSENT_ITEMS.map((item) => (
                <div className="check" key={item.key}>
                  <input
                    id={`c-${item.key}`}
                    type="checkbox"
                    checked={consent[item.key] === true}
                    onChange={(e) => setConsent((c) => ({ ...c, [item.key]: e.target.checked }))}
                  />
                  <label htmlFor={`c-${item.key}`}>{item.label}</label>
                </div>
              ))}
            </fieldset>
            <div className="actions">
              <button className="btn btn-primary" onClick={start} disabled={busy || !consentComplete(consent)}>
                {busy ? "Einwilligung wird gespeichert …" : "Einwilligen und fortfahren"}
              </button>
              <button className="btn btn-quiet" onClick={() => setPhase("role")}>Zurück</button>
            </div>
          </section>
        )}

        {phase === "intro" && (
          <section>
            <h1 ref={headingRef} tabIndex={-1}>Bevor wir beginnen</h1>
            <p className="spoken">{DISTRESS_PROTOCOL}</p>
            {role !== "angehoerige" && <p className="spoken">{ANONYMISATION_INSTRUCTION}</p>}
            <p className="muted small">
              Unten auf dem Bildschirm können Sie jederzeit pausieren oder das Interview beenden.
            </p>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => setPhase("question")}>Zur ersten Frage</button>
            </div>
          </section>
        )}

        {phase === "question" && currentQuestion && role && (
          <section aria-live="polite">
            <div className="progress">
              <span>{inClosing ? "Abschluss" : structure?.stages[stageIndex]?.label}</span>
              <span>Frage {pos + 1} von {queue.length}</span>
            </div>
            <div className="bar" aria-hidden="true"><i style={{ width: `${(pos / Math.max(queue.length, 1)) * 100}%` }} /></div>

            {(() => {
              const text = questionText(currentQuestion, role, toolMentioned);
              return (
                <h1 ref={headingRef} tabIndex={-1} className={`question${text.length > 180 ? " long" : ""}`}>
                  {text}
                </h1>
              );
            })()}

            {notice && <div className="notice notice-calm"><p>{notice}</p></div>}

            {interrupt && (
              <div className="notice notice-interrupt" role="alert">
                <p className="spoken-line">{interrupt.message}</p>
                {interrupt.detected.length > 0 && (
                  <p className="small">Die Antwort enthält vermutlich {interrupt.detected.join(" und ")}. Bitte formulieren Sie diese Stelle um oder überspringen Sie die Frage. Gespeichert wurde nichts.</p>
                )}
              </div>
            )}

            <label htmlFor="answer" className="muted small">Ihre Antwort</label>
            <textarea
              id="answer"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Schreiben Sie so, wie Sie es erzählen würden."
              maxLength={6000}
            />
            <div className="counter">{draft.length} / 6000</div>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => submit(false)} disabled={busy || !draft.trim()}>
                {busy ? "Wird geprüft …" : "Antwort speichern"}
              </button>
              <button className="btn btn-secondary" onClick={() => submit(true)} disabled={busy}>Frage überspringen</button>
            </div>
          </section>
        )}

        {phase === "checkpoint" && structure && (
          <section>
            <h1 ref={headingRef} tabIndex={-1}>{structure.stages[stageIndex].label} ist geschafft</h1>
            <p className="lead">
              {stageIndex === 0 ? "Die wichtigsten Fragen haben Sie beantwortet. Vielen Dank!" : "Vielen Dank für Ihre Zeit."}
            </p>
            <p>
              Möchten Sie weitere Fragen beantworten? {structure.stages[stageIndex + 1].label} umfasst{" "}
              {structure.stages[stageIndex + 1].codes.length} Fragen. Sie können auch jetzt
              {structure.closing.length ? " mit zwei kurzen Abschlussfragen" : ""} aufhören.
            </p>
            <div className="actions">
              <button className="btn btn-primary" onClick={continueToNextStage}>Weitere Fragen beantworten</button>
              <button className="btn btn-secondary" onClick={goToClosing} disabled={busy}>
                {structure.closing.length ? "Zu den Abschlussfragen" : "Interview abschließen"}
              </button>
            </div>
          </section>
        )}

        {phase === "distress" && (
          <section>
            <h1 ref={headingRef} tabIndex={-1}>Kurz innehalten</h1>
            <p className="spoken">{DISTRESS_PROTOCOL}</p>
            <p>Ihre Antwort ist gespeichert. Wie möchten Sie weitermachen?</p>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => { setPhase("question"); advance(); }}>Weiter zur nächsten Frage</button>
              <button className="btn btn-secondary" onClick={() => setPhase("paused")}>Pause machen</button>
              <button className="btn btn-quiet" onClick={() => setPhase("stop")}>Interview beenden</button>
            </div>
          </section>
        )}

        {phase === "paused" && (
          <section>
            <h1 ref={headingRef} tabIndex={-1}>Pausiert</h1>
            <p>Ihre bisherigen Antworten sind gespeichert. Sie können in diesem Browserfenster später weitermachen.</p>
            <div className="actions">
              <button className="btn btn-primary" onClick={resume} disabled={busy}>Weitermachen</button>
              <button className="btn btn-quiet" onClick={() => setPhase("stop")}>Interview beenden</button>
            </div>
          </section>
        )}

        {phase === "stop" && (
          <section>
            <h1 ref={headingRef} tabIndex={-1}>Interview beenden</h1>
            <p>Sie können aufhören, ohne Gründe zu nennen. Was soll mit Ihren bisherigen Antworten geschehen?</p>
            <div className="actions">
              <button className="btn btn-primary" onClick={finish} disabled={busy}>Antworten behalten und abschließen</button>
              <button className="btn btn-danger" onClick={withdrawAll} disabled={busy}>Alle Antworten löschen</button>
              <button className="btn btn-quiet" onClick={resume} disabled={busy}>Zurück zum Interview</button>
            </div>
          </section>
        )}

        {phase === "done" && interviewId && (
          <section>
            <h1 ref={headingRef} tabIndex={-1}>Vielen Dank für Ihre Unterstützung!</h1>
            {notice && <div className="notice notice-calm"><p>{notice}</p></div>}
            <p>Ihre Antworten sind gespeichert und versiegelt. Bitte bewahren Sie Ihren Teilnahmebeleg auf:</p>
            <p className="receipt" aria-label="Teilnahmebeleg">{interviewId}</p>
            <div className="actions">
              <button className="btn btn-secondary" onClick={() => navigator.clipboard?.writeText(interviewId)}>Beleg kopieren</button>
              <Link className="btn btn-secondary" href={`/beleg/${interviewId}`}>Beleg jetzt prüfen</Link>
            </div>
            <p className="small muted">
              Mit diesem Code können Sie jederzeit prüfen, dass Ihre Antworten nicht verändert wurden, und Ihre Teilnahme
              widerrufen. Wir können den Code nicht wiederherstellen.
            </p>
            {result && (
              <dl className="kv small">
                <dt>Einwilligung vermerkt</dt>
                <dd className="hash">{result.consentTx ? (txLink(result.consentTx) ? <a href={txLink(result.consentTx)!}>{result.consentTx}</a> : result.consentTx) : "noch nicht"}</dd>
                <dt>Antworten versiegelt</dt>
                <dd className="hash">{result.sealTx ? (txLink(result.sealTx) ? <a href={txLink(result.sealTx)!}>{result.sealTx}</a> : result.sealTx) : "noch nicht"}</dd>
              </dl>
            )}
          </section>
        )}

        {phase === "withdrawn" && (
          <section>
            <h1 ref={headingRef} tabIndex={-1}>Ihre Antworten wurden gelöscht</h1>
            <p>Der Widerruf ist vermerkt. Vielen Dank, dass Sie sich die Zeit genommen haben.</p>
            <Link className="btn btn-secondary" href="/">Zur Startseite</Link>
          </section>
        )}
      </main>

      {inInterview && (
        <div className="dock">
          <div className="dock-inner">
            <span className="small">Freiwillig. Sie können jederzeit pausieren oder aufhören.</span>
            <span className="dock-buttons">
              <button className="btn btn-quiet" onClick={() => setPhase("paused")}>Pause</button>
              <button className="btn btn-quiet" onClick={() => setPhase("stop")}>Beenden</button>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
