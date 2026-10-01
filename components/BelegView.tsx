"use client";

import { useEffect, useState } from "react";
import { txLink } from "@/lib/chainConfig";

interface Verification {
  status: "active" | "completed" | "withdrawn";
  answerCount: number;
  consentTx: string | null;
  sealTx: string | null;
  withdrawTx: string | null;
  storedConsentHash: string | null;
  recomputedTranscriptHash: string | null;
  onChain: { consentHash: string; consentAt: number; transcriptHash: string; sealedAt: number; withdrawn: boolean } | null;
  consentMatches: boolean;
  transcriptMatches: boolean;
  chainError: string | null;
}

const fmt = (unix?: number) => (unix ? new Date(unix * 1000).toLocaleString("de-DE") : "–");

function Tx({ hash }: { hash: string | null }) {
  if (!hash) return <>–</>;
  const link = txLink(hash);
  return link ? <a href={link} className="hash">{hash}</a> : <span className="hash">{hash}</span>;
}

export default function BelegView({ id }: { id: string }) {
  const [v, setV] = useState<Verification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    setError(null);
    const res = await fetch(`/api/verify/${id}`);
    const data = await res.json();
    if (!res.ok) setError(data.error || "Prüfung fehlgeschlagen.");
    else setV(data);
  }
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function withdraw() {
    setBusy(true);
    const res = await fetch("/api/interview/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interviewId: id }),
    });
    const data = await res.json();
    setBusy(false);
    setConfirm(false);
    if (!res.ok) setError(data.error || "Widerruf fehlgeschlagen.");
    else await load();
  }

  return (
    <main className="shell">
      <h1>Ihr Teilnahmebeleg</h1>
      <p className="receipt">{id}</p>
      {error && <div className="notice notice-error" role="alert"><p>{error}</p></div>}
      {!v && !error && <p className="muted">Prüfung läuft …</p>}

      {v && v.status === "withdrawn" && (
        <div className="notice notice-calm">
          <p>Diese Teilnahme wurde widerrufen. Die Antworten und der Schlüssel zur Prüfsumme sind gelöscht.</p>
          {v.withdrawTx && <p className="small">Widerruf vermerkt in Transaktion <Tx hash={v.withdrawTx} /></p>}
        </div>
      )}

      {v && v.status !== "withdrawn" && (
        <>
          <div className={`notice ${v.transcriptMatches ? "notice-ok" : "notice-interrupt"}`}>
            {v.transcriptMatches ? (
              <p>Ihre {v.answerCount} gespeicherten Antworten stimmen mit der Prüfsumme überein, die beim Abschluss auf der Blockchain versiegelt wurde. Sie wurden seitdem nicht verändert.</p>
            ) : v.status === "active" ? (
              <p>Dieses Interview ist noch nicht abgeschlossen und daher noch nicht versiegelt.</p>
            ) : v.onChain && v.onChain.sealedAt > 0 ? (
              <p>Achtung: Die gespeicherten Antworten stimmen nicht mehr mit der versiegelten Prüfsumme überein. Bitte wenden Sie sich an das Projektteam.</p>
            ) : (
              <p>Die Versiegelung auf der Blockchain konnte nicht gefunden werden{v.chainError ? " (Blockchain nicht erreichbar)" : ""}.</p>
            )}
          </div>

          <h2>Nachweise</h2>
          <dl className="kv">
            <dt>Einwilligung</dt>
            <dd>
              <span className={`status ${v.consentMatches ? "status-ok" : "status-warn"}`}>{v.consentMatches ? "vermerkt" : "nicht gefunden"}</span>{" "}
              {v.onChain?.consentAt ? fmt(v.onChain.consentAt) : ""}
            </dd>
            <dt>Transaktion Einwilligung</dt>
            <dd><Tx hash={v.consentTx} /></dd>
            <dt>Versiegelung</dt>
            <dd>
              <span className={`status ${v.transcriptMatches ? "status-ok" : "status-warn"}`}>{v.transcriptMatches ? "gültig" : "offen"}</span>{" "}
              {v.onChain?.sealedAt ? fmt(v.onChain.sealedAt) : ""}
            </dd>
            <dt>Transaktion Versiegelung</dt>
            <dd><Tx hash={v.sealTx} /></dd>
            <dt>Prüfsumme neu berechnet</dt>
            <dd className="hash">{v.recomputedTranscriptHash ?? "–"}</dd>
            <dt>Prüfsumme auf der Blockchain</dt>
            <dd className="hash">{v.onChain?.transcriptHash && v.onChain.sealedAt ? v.onChain.transcriptHash : "–"}</dd>
          </dl>
          <p className="small muted" style={{ marginTop: "1rem" }}>
            Auf der Blockchain stehen nur Prüfsummen und Zeitstempel, keine Antworten.
          </p>

          <h2>Teilnahme widerrufen</h2>
          <p>Wenn Sie widerrufen, löschen wir alle Ihre Antworten. Das lässt sich nicht rückgängig machen.</p>
          {!confirm ? (
            <button className="btn btn-danger" onClick={() => setConfirm(true)}>Teilnahme widerrufen</button>
          ) : (
            <div className="actions">
              <button className="btn btn-danger" onClick={withdraw} disabled={busy}>{busy ? "Wird gelöscht …" : "Ja, alle Antworten löschen"}</button>
              <button className="btn btn-quiet" onClick={() => setConfirm(false)}>Abbrechen</button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
