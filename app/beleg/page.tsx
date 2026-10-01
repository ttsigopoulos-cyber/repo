"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BelegEingabe() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const valid = /^[0-9a-f-]{36}$/i.test(code.trim());
  return (
    <main className="shell">
      <h1>Teilnahmebeleg prüfen</h1>
      <p>Geben Sie den Code ein, den Sie am Ende des Interviews erhalten haben.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) router.push(`/beleg/${code.trim().toLowerCase()}`);
        }}
      >
        <label htmlFor="code" className="muted small">Teilnahmebeleg</label>
        <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="z. B. 3f2b8c1e-…" autoComplete="off" />
        <div className="actions">
          <button className="btn btn-primary" type="submit" disabled={!valid}>Beleg prüfen</button>
        </div>
      </form>
    </main>
  );
}
