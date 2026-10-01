// Seeds INVENTED demo interviews through the app's real API (consent on-chain, Gemini check, sealing).
// Usage (app and Hardhat node must be running):   node scripts/seed-demo.mjs
// All personas and answers are fictitious. Demo interviews carry the facility code "DEMO".
// Remove them later in Supabase:  delete from public.interviews where facility_code = 'DEMO';

const BASE = process.env.APP_URL || "http://localhost:3000";
const PAUSE_MS = Number(process.env.SEED_PAUSE_MS || 2500); // be gentle with the free Gemini quota
const CONSENT = { academic: true, venture: true, healthData: true, adult: true };
const ORDER = ["A02.1", "A02.3", "A03.1", "A03.2", "A03.3", "A04.1", "A04.3", "A05.1", "A07.1", "A07.2", "A07.6", "A10.1", "A11.1", "A11.2"];

const PERSONAS = [
  {
    label: "Pflegefachkraft, Frühdienst",
    role: "pflegekraft",
    answers: {
      "A02.1": "Letzter Frühdienst: Start mit der Übergabe aus dem Nachtdienst, etwa zwanzig Minuten. Danach Grundpflege im Wohnbereich, dazwischen Medikamente stellen und zwei Telefonate mit Hausarztpraxen. Frühstück begleiten, Visite vorbereiten. Ab Mittag habe ich Pflegeberichte, Trinkprotokolle und Wunddokumentation in Medifox nachgetragen. Die Übergabe an den Spätdienst war dann hektisch.",
      "A02.3": "Gegen neun, als ein Kollege krank ausgefallen ist und ich seinen Bereich mit übernehmen musste. Ab da war klar, dass die Dokumentation wieder ans Schichtende rutscht.",
      "A03.1": "Die vielen Unterbrechungen. Kaum fange ich etwas an, klingelt das Telefon oder es fehlt eine Unterschrift. Und die Dokumentation geht nicht nebenbei, weil der Rechner im Dienstzimmer steht.",
      "A03.2": "1. Dokumentation am Schichtende, 2. kurzfristige Personalausfälle, 3. Telefonate mit Hausarztpraxen und Apotheken.",
      "A03.3": "Grundpflege, dann Dokumentation, dann Medikamente stellen und kontrollieren. Die Abstimmung mit den Arztpraxen frisst mehr Zeit, als man denkt.",
      "A04.1": "Ja. Ich saß eine halbe Stunde am Rechner, um Protokolle nachzutragen, während ich eigentlich bei der Mobilisation hätte helfen sollen. Die Kollegin hat das dann allein gemacht.",
      "A04.3": "Dass ich gerade für das Papier arbeite und nicht für die Menschen. Und ein schlechtes Gewissen gegenüber der Kollegin.",
      "A05.1": "Ein Sonntag mit voller Besetzung und ohne anstehende Prüfung. Wir konnten die Berichte direkt nach der Grundpflege schreiben und hatten nachmittags Zeit für einen Spaziergang im Garten.",
      "A07.1": "Medikamentendokumentation, Wundverläufe und alles, was die Übergabe braucht: Veränderungen, Auffälligkeiten, Absprachen mit Ärzten. Ohne das wäre die Versorgung nicht sicher.",
      "A07.2": "Viele Einzelnachweise, die nur für die Prüfung da sind, zum Beispiel Trink- und Lagerungsprotokolle bei Bewohnern, die selbstständig trinken und sich bewegen. Da dokumentieren wir Routine, die niemand liest.",
      "A07.6": "Ungefähr anderthalb Stunden pro Schicht, an schlechten Tagen eher zwei.",
      "A10.1": "Ich habe von einem Haus gehört, das direkt beim Bewohner mit mobilen Geräten dokumentiert und Routine nur noch als Abweichung erfasst. Dort bleibt angeblich mehr Zeit für die Pflege.",
      "A11.1": "Dass ich dort dokumentieren kann, wo ich arbeite, und nicht am Ende der Schicht alles nachtragen muss.",
      "A11.2": "Vielleicht, wie die Dokumentation mit der Übergabe zusammenhängt. Vieles doppelt sich da.",
    },
    toolAnswers: {
      "D01.1": "Die Medikamentenübersicht ist klar, man sieht schnell, was noch offen ist.",
      "D01.2": "Dass es nur am Rechner im Dienstzimmer läuft und manche Felder mehrfach ausgefüllt werden müssen.",
      "D01.3": "Ich würde eher die Papierlisten abschaffen, die wir zusätzlich zur Software führen.",
    },
  },
  {
    label: "Pflegehilfskraft, Nachtdienst",
    role: "pflegekraft",
    answers: {
      "A02.1": "Nachtdienst: Übergabe vom Spätdienst kurz vor neun, dann Rundgang, Lagerungen, Toilettengänge. Zwischen eins und drei die Protokolle auf Papier ausgefüllt, morgens alles noch einmal in den Computer übertragen, bevor der Frühdienst kam.",
      "A02.3": "Morgens gegen fünf, wenn viele gleichzeitig wach werden und ich gleichzeitig die Protokolle übertragen muss.",
      "A03.1": "Dass ich nachts allein für zwei Wohnbereiche zuständig bin und trotzdem jede Lagerung doppelt dokumentieren muss, einmal auf Papier und einmal im System.",
      "A03.2": "1. Unterbesetzung in der Nacht, 2. Doppeldokumentation auf Papier und im Computer, 3. Sturzprotokolle und Nachweise nach jedem Ereignis.",
      "A03.3": "Die Rundgänge und Lagerungen, danach das Übertragen der Papierprotokolle.",
      "A04.1": "Ja, wenn nach einem Sturz die Protokolle ausgefüllt werden müssen. Ich sitze dann fast eine Stunde, während im anderen Wohnbereich niemand ist.",
      "A04.3": "Hoffentlich passiert drüben gerade nichts.",
      "A05.1": "Eine Nacht, in der wir zu zweit waren, weil eine Aushilfe da war. Wir haben uns die Bereiche geteilt und ich konnte die Protokolle direkt eintragen.",
      "A07.1": "Die Lagerungen bei Menschen mit Dekubitusrisiko und alles rund um Stürze. Das ist wichtig.",
      "A07.2": "Dass ich alles zweimal schreibe. Und dass Kontrollgänge mit Uhrzeit protokolliert werden, auch wenn nichts passiert ist.",
      "A07.6": "Etwa eine Stunde pro Nacht, mit dem Übertragen am Morgen.",
      "A10.1": "Nein, ehrlich gesagt nicht. Überall, wo ich gearbeitet habe, war es ähnlich.",
      "A11.1": "Dass das Papier wegfällt und ich nur noch einmal dokumentiere.",
      "A11.2": "Wie es ist, nachts allein zu sein. Das unterschätzen viele.",
    },
  },
  {
    label: "Pflegefachkraft, Spätdienst",
    role: "pflegekraft",
    answers: {
      "A02.1": "Spätdienst: Übergabe um eins, dann Mittagsruhe begleiten, Nachmittagskaffee, Gespräche mit Angehörigen vorbereitet, Abendessen und Abendmedikation. Die Pflegeplanungen habe ich nach Dienstende fertig gemacht.",
      "A02.3": "Schon bei der Übergabe, weil zwei Kolleginnen fehlten und trotzdem Aufnahmegespräche geplant waren.",
      "A03.1": "Dass ich ständig zwischen Pflege, Telefon und Angehörigengesprächen springe. Und die Pflegeplanung, die bei jeder Veränderung angepasst werden muss.",
      "A03.2": "1. Personalausfälle, 2. Dokumentation und Pflegeplanung, 3. Gespräche und Telefonate mit Angehörigen.",
      "A03.3": "Pflegeplanungen und Evaluationen, danach die direkte Pflege und die Angehörigengespräche.",
      "A04.1": "Ja, bei den Evaluationen der Pflegeplanung. Ich saß zwei Stunden am Schreibtisch, während die Kolleginnen das Abendessen allein gestemmt haben.",
      "A04.3": "Dass das eigentlich niemand liest, außer bei der Prüfung.",
      "A05.1": "Ein Spätdienst ohne Aufnahme und mit voller Besetzung. Wir haben die Planung gemeinsam im Team gemacht und am Abend noch Zeit für ein Gesellschaftsspiel gehabt.",
      "A07.1": "Die Pflegeplanung im Kern, Risiken wie Sturz oder Ernährung und die Absprachen mit Ärzten. Das muss jeder im Team wissen.",
      "A07.2": "Evaluationen in festen Abständen, auch wenn sich nichts verändert hat, und Formulare, die nur für die Qualitätsprüfung ausgefüllt werden.",
      "A07.6": "Zwischen zwei und zweieinhalb Stunden pro Schicht, die Pflegeplanungen eingeschlossen.",
      "A10.1": "Eine Einrichtung in den Niederlanden, von der eine Kollegin erzählt hat. Dort dokumentieren kleine Teams nur das Nötigste und entscheiden selbst, was wichtig ist.",
      "A11.1": "Weniger Evaluationen nach Kalender, mehr nach tatsächlicher Veränderung.",
      "A11.2": "Wie viel unbezahlte Zeit nach Dienstende in die Dokumentation fließt.",
    },
  },
  {
    label: "Pflegedienstleitung",
    role: "leitung",
    answers: {
      "A02.1": "Mein letzter Arbeitstag begann um halb acht mit der Durchsicht der Dienstpläne und zwei kurzfristigen Krankmeldungen. Danach Teambesprechung, Telefonate mit der Personalabteilung, eine Begehung mit der Hygienebeauftragten, nachmittags Vorbereitung auf die Qualitätsprüfung und Gespräche mit Angehörigen.",
      "A02.3": "Schon um acht, als klar war, dass ich zwei Dienste neu besetzen muss.",
      "A03.1": "Die Personalplanung. Ich verbringe mehr Zeit damit, Lücken zu stopfen, als das Team fachlich zu begleiten.",
      "A03.2": "1. Personalausfälle und Dienstplanung, 2. Vorbereitung auf Qualitätsprüfungen, 3. Kontrolle der Pflegedokumentation.",
      "A03.3": "Dienstplanung, Prüfungsvorbereitung und das Kontrollieren der Pflegedokumentation.",
      "A04.1": "Ja. Eine Pflegefachkraft hat mir erzählt, dass sie nach jeder Schicht noch eine Stunde Evaluationen schreibt. Sie wollte eigentlich neue Kolleginnen anleiten, dafür bleibt keine Zeit.",
      "A04.3": "Dass wir unsere besten Leute mit Papier verschleißen.",
      "A05.1": "Eine Woche nach der letzten Prüfung, als niemand krank war. Wir hatten Zeit für eine Fallbesprechung im Team, ohne auf die Uhr zu schauen.",
      "A07.1": "Was für die Sicherheit relevant ist: Medikation, Risiken, ärztliche Anordnungen, Veränderungen. Das brauchen wir auch, um als Haus haftungsfest zu sein.",
      "A07.2": "Mehrfachnachweise für dieselbe Leistung und Formulare, die eher der Absicherung gegenüber Prüfungen dienen.",
      "A07.6": "Für mich selbst etwa die Hälfte meiner Arbeitszeit, also rund vier Stunden am Tag.",
      "A10.1": "Ja, ein Haus in unserem Verbund hat die Entbürokratisierung konsequent umgesetzt und dokumentiert nur Abweichungen. Den Namen nenne ich lieber nicht.",
      "A11.1": "Verlässliche Personalbesetzung, damit Planung wieder Planung ist und kein Krisenmanagement.",
      "A11.2": "Wie stark die Prüfungen selbst die Dokumentation antreiben.",
    },
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path}: ${data.error || res.status}`);
  return data;
}

async function answer(interviewId, code, text) {
  const r = await post("/api/interview/answer", { interviewId, code, text, skip: false });
  if (r.status === "needs_revision") {
    console.log(`   ${code}: flagged by the anonymisation check (${(r.detected || []).join(", ")}) – skipped`);
    await post("/api/interview/answer", { interviewId, code, skip: true });
    return r;
  }
  const flags = [r.aiChecked ? "AI checked" : "NOT AI checked", r.toolMentioned ? `tool: ${r.toolMentioned}` : null].filter(Boolean);
  console.log(`   ${code}: saved (${flags.join(", ")})`);
  await sleep(PAUSE_MS);
  return r;
}

async function main() {
  const health = await fetch(`${BASE}/api/health`).then((r) => r.json()).catch(() => null);
  if (!health) throw new Error(`App not reachable at ${BASE}. Is "npm run dev" running?`);
  console.log("Health:", JSON.stringify(health));
  const receipts = [];

  for (const p of PERSONAS) {
    console.log(`\n▶ ${p.label} (${p.role})`);
    const start = await post("/api/interview/start", { role: p.role, consent: CONSENT, facilityCode: "DEMO" });
    console.log(`   consent on-chain: ${start.consentTx ?? "no (" + start.chainError + ")"}`);
    let toolDone = false;
    for (const code of ORDER) {
      if (code.startsWith("A11") && !toolDone) toolDone = true; // closing questions come last
      const r = await answer(start.interviewId, code, p.answers[code]);
      // Part D is reactive: answer it only if Gemini detected a tool the persona named itself.
      if (r.toolMentioned && p.toolAnswers && !toolDone) {
        toolDone = true;
        for (const [dCode, dText] of Object.entries(p.toolAnswers)) await answer(start.interviewId, dCode, dText);
      }
    }
    const done = await post("/api/interview/complete", { interviewId: start.interviewId });
    console.log(`   sealed on-chain: ${done.sealTx ?? "no (" + done.chainError + ")"}`);
    receipts.push(`${p.label}: ${start.interviewId}`);
  }
  console.log("\nReceipt codes (open http://localhost:3000/beleg/<code>):");
  receipts.forEach((r) => console.log("  " + r));
}

main().catch((e) => {
  console.error("\nStopped:", e.message);
  process.exit(1);
});
