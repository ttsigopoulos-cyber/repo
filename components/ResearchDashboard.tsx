"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createWalletClient, custom, type Hex } from "viem";
import { registryAbi } from "@/lib/abi";
import { appChain, CONTRACT_ADDRESS, txLink } from "@/lib/chainConfig";

interface Overview {
  interviews: {
    id: string; role: string; facility_code: string | null; status: string; consent_tx: string | null;
    seal_tx: string | null; tool_mentioned: string | null; distress_stop: boolean; created_at: string;
  }[];
  questions: { code: string; part: string; blockTitle: string; tier: number; text: string; counts: { answered: number; skipped: number; unchecked: number } | null }[];
  reports: { id: string; question_code: string; report_hash: string; anchor_tx: string | null; created_at: string }[];
  chain: { consentCount: number; sealedCount: number } | null;
  chainError: string | null;
  gemini: string | null;
}

interface Report {
  reportId: string;
  reportHash: Hex;
  content: {
    questionCode: string; question: string; answerCount: number; model: string; createdAt: string;
    analysis: {
      summary: string;
      themes: { theme: string; count: number; description: string }[];
      timeEstimatesMinutes: number[];
      rankedBurdens: { burden: string; mentions: number; avgRank: number }[];
      caveats: string;
    };
  };
}

const ROLE_LABEL: Record<string, string> = { pflegekraft: "Pflegekraft", leitung: "Leitung", angehoerige: "Angehörige" };
const short = (h?: string | null) => (h ? `${h.slice(0, 10)}…${h.slice(-6)}` : "–");
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function Tx({ hash }: { hash: string | null }) {
  if (!hash) return <>–</>;
  const link = txLink(hash);
  return link ? <a href={link} className="hash">{short(hash)}</a> : <span className="hash" title={hash}>{short(hash)}</span>;
}

export default function ResearchDashboard() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [selected, setSelected] = useState("A07.6");
  const [report, setReport] = useState<Report | null>(null);
  const [anchorTx, setAnchorTx] = useState<string | null>(null);

  const headers = useMemo(() => ({ "Content-Type": "application/json", "x-research-code": code }), [code]);

  async function load() {
    setBusy("load");
    setError(null);
    try {
      const res = await fetch("/api/research/overview", { headers });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setData(d);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function analyse() {
    setBusy("analyse");
    setError(null);
    setReport(null);
    setAnchorTx(null);
    try {
      const res = await fetch("/api/research/analyze", { method: "POST", headers, body: JSON.stringify({ code: selected }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setReport(d);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function anchor() {
    if (!report) return;
    if (!window.ethereum) return setError("MetaMask wurde in diesem Browser nicht gefunden.");
    setBusy("anchor");
    setError(null);
    try {
      const wallet = createWalletClient({ chain: appChain, transport: custom(window.ethereum) });
      const [account] = await wallet.requestAddresses();
      if ((await wallet.getChainId()) !== appChain.id) {
        await wallet.switchChain({ id: appChain.id });
      }
      const hash = await wallet.writeContract({
        account,
        address: CONTRACT_ADDRESS,
        abi: registryAbi,
        functionName: "anchorReport",
        args: [report.reportHash, `${report.content.questionCode} · ${report.content.answerCount} Antworten`],
      });
      // Let the server confirm on-chain and store the transaction hash (retries while the block is mined).
      let lastErr = "";
      for (let i = 0; i < 10; i++) {
        const res = await fetch("/api/research/anchor", { method: "POST", headers, body: JSON.stringify({ reportId: report.reportId, txHash: hash }) });
        if (res.ok) {
          setAnchorTx(hash);
          await load();
          return;
        }
        lastErr = (await res.json()).error;
        await new Promise((r) => setTimeout(r, 1500));
      }
      throw new Error(lastErr || "Verankerung nicht bestätigt.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const stats = useMemo(() => {
    if (!data) return null;
    const by = (s: string) => data.interviews.filter((i) => i.status === s).length;
    return { completed: by("completed"), active: by("active"), withdrawn: by("withdrawn") };
  }, [data]);

  if (!data) {
    return (
      <main className="shell">
        <h1>Bereich für das Forschungsteam</h1>
        <p>Zugang nur für das Projektteam. Einzelne Antworten werden hier nicht angezeigt, nur Zählungen und KI-Auswertungen über alle Antworten.</p>
        <form onSubmit={(e) => { e.preventDefault(); void load(); }}>
          <label htmlFor="rc" className="muted small">Zugangscode</label>
          <input id="rc" type="password" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" />
          <div className="actions"><button className="btn btn-primary" disabled={busy === "load" || code.length < 8}>Anmelden</button></div>
        </form>
        {error && <div className="notice notice-error"><p>{error}</p></div>}
      </main>
    );
  }

  const q = data.questions.find((x) => x.code === selected);
  const a = report?.content.analysis;

  return (
    <main className="shell wide">
      <h1>Forschungsteam</h1>
      {error && <div className="notice notice-error" role="alert"><p>{error}</p></div>}

      <div className="grid-2">
        <div className="panel">
          <p className="muted small">Abgeschlossene Interviews</p>
          <p className="stat">{stats?.completed}</p>
          <p className="small muted">{stats?.active} laufend, {stats?.withdrawn} widerrufen</p>
        </div>
        <div className="panel">
          <p className="muted small">Auf der Blockchain</p>
          <p className="stat">{data.chain ? data.chain.sealedCount : "–"}</p>
          <p className="small muted">
            {data.chain ? `${data.chain.consentCount} Einwilligungen vermerkt, ${data.chain.sealedCount} Interviews versiegelt` : data.chainError ? "Blockchain nicht erreichbar" : "nicht konfiguriert"}
          </p>
        </div>
        <div className="panel">
          <p className="muted small">KI-Modell</p>
          <p className="stat" style={{ fontSize: "1.3rem" }}>{data.gemini ?? "nicht konfiguriert"}</p>
          <p className="small muted">Google Gemini über die Google AI Studio API</p>
        </div>
      </div>

      <h2>KI-Auswertung je Frage</h2>
      <p className="muted">Gemini fasst alle Antworten auf eine Frage zu Themen zusammen. Die Prüfsumme des Berichts können Sie mit MetaMask auf der Blockchain verankern.</p>
      <div className="actions">
        <select value={selected} onChange={(e) => { setSelected(e.target.value); setReport(null); setAnchorTx(null); }} aria-label="Frage auswählen">
          {data.questions.map((x) => (
            <option key={x.code} value={x.code}>
              {x.code} ({x.counts?.answered ?? 0} Antworten) {x.text.slice(0, 70)}{x.text.length > 70 ? "…" : ""}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={analyse} disabled={busy !== null || !q?.counts?.answered}>
          {busy === "analyse" ? "Gemini wertet aus …" : "Auswertung erstellen"}
        </button>
      </div>
      {q && <p className="small muted">Block: {q.blockTitle}. Stufe {q.tier}. {q.counts?.unchecked ? `${q.counts.unchecked} Antworten ohne KI-Prüfung – bitte manuell auf Personenangaben prüfen.` : ""}</p>}

      {report && a && (
        <div className="panel">
          <h3>{report.content.questionCode}: {report.content.question}</h3>
          <p>{a.summary}</p>
          {a.themes.length > 0 && (
            <>
              <h3>Themen</h3>
              <ul className="theme-list">
                {a.themes.map((t) => <li key={t.theme}><strong>{t.theme}</strong> ({t.count}): {t.description}</li>)}
              </ul>
            </>
          )}
          {a.timeEstimatesMinutes.length > 0 && (
            <>
              <h3>Geschätzte Zeit pro Schicht</h3>
              <p>
                {a.timeEstimatesMinutes.length} Schätzungen, Median {Math.round(median(a.timeEstimatesMinutes))} Minuten,
                Spanne {Math.min(...a.timeEstimatesMinutes)} bis {Math.max(...a.timeEstimatesMinutes)} Minuten.
                Das sind wahrgenommene Schätzungen, keine Messungen.
              </p>
            </>
          )}
          {a.rankedBurdens.length > 0 && (
            <>
              <h3>Rangfolge der Belastungen</h3>
              <ol>{[...a.rankedBurdens].sort((x, y) => x.avgRank - y.avgRank).map((r) => <li key={r.burden}>{r.burden}: {r.mentions} Nennungen, Durchschnittsrang {r.avgRank.toFixed(1)}</li>)}</ol>
            </>
          )}
          <p className="small muted">Grenzen: {a.caveats}</p>
          <dl className="kv small">
            <dt>Modell</dt><dd>{report.content.model}</dd>
            <dt>Prüfsumme des Berichts</dt><dd className="hash">{report.reportHash}</dd>
            <dt>Verankert</dt><dd>{anchorTx ? <Tx hash={anchorTx} /> : "noch nicht"}</dd>
          </dl>
          {!anchorTx && (
            <div className="actions">
              <button className="btn btn-secondary" onClick={anchor} disabled={busy !== null}>
                {busy === "anchor" ? "Warte auf MetaMask …" : "Mit MetaMask verankern"}
              </button>
            </div>
          )}
        </div>
      )}

      <h2>Interviews</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Beleg</th><th>Rolle</th><th>Einrichtung</th><th>Status</th><th>Einwilligung</th><th>Versiegelung</th><th>Hinweise</th></tr>
          </thead>
          <tbody>
            {data.interviews.map((i) => (
              <tr key={i.id}>
                <td><Link href={`/beleg/${i.id}`} className="hash">{i.id.slice(0, 8)}</Link></td>
                <td>{ROLE_LABEL[i.role] ?? i.role}</td>
                <td>{i.facility_code ?? "–"}</td>
                <td>{i.status}</td>
                <td><Tx hash={i.consent_tx} /></td>
                <td><Tx hash={i.seal_tx} /></td>
                <td className="small">{[i.tool_mentioned && `Werkzeug erwähnt: ${i.tool_mentioned}`, i.distress_stop && "Familienblock wegen Belastung beendet"].filter(Boolean).join("; ") || "–"}</td>
              </tr>
            ))}
            {!data.interviews.length && <tr><td colSpan={7} className="muted">Noch keine Interviews.</td></tr>}
          </tbody>
        </table>
      </div>

      {data.reports.length > 0 && (
        <>
          <h2>Gespeicherte Berichte</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Frage</th><th>Erstellt</th><th>Prüfsumme</th><th>Verankert</th></tr></thead>
              <tbody>
                {data.reports.map((r) => (
                  <tr key={r.id}>
                    <td>{r.question_code}</td>
                    <td>{new Date(r.created_at).toLocaleString("de-DE")}</td>
                    <td className="hash" title={r.report_hash}>{short(r.report_hash)}</td>
                    <td><Tx hash={r.anchor_tx} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="actions"><button className="btn btn-quiet" onClick={load} disabled={busy !== null}>Aktualisieren</button></div>
    </main>
  );
}
