import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="shell">
        <h1>Arbeitsalltag und Dokumentationsaufwand in der Pflege verstehen</h1>
        <p className="lead">
          Eine Online-Interviewstudie des Executive Master of Business Administration der ESCP Business School in
          Pflegeeinrichtungen in Deutschland.
        </p>
        <p>
          Wie viel Arbeitszeit binden Dokumentation und Verwaltung tatsächlich – und welcher Teil davon ist wirklich
          notwendig? Das möchten wir gemeinsam mit den Menschen verstehen, die diese Arbeit täglich leisten.
        </p>

        <div className="actions">
          <Link className="btn btn-primary" href="/interview">Interview beginnen</Link>
          <span className="muted small">etwa 15 bis 30 Minuten, schriftlich</span>
        </div>

        <h2>So läuft die Teilnahme ab</h2>
        <ol className="steps">
          <li>Sie wählen Ihre Rolle und lesen die Einwilligungserklärung.</li>
          <li>Sie beantworten die Fragen schriftlich, eine nach der anderen. Jede Frage können Sie überspringen.</li>
          <li>Nach den wichtigsten Fragen entscheiden Sie, ob Sie weitermachen oder abschließen.</li>
          <li>Zum Schluss erhalten Sie einen Teilnahmebeleg. Damit können Sie später prüfen, dass Ihre Antworten unverändert sind, oder Ihre Teilnahme widerrufen.</li>
        </ol>

        <h2>Was Sie wissen sollten</h2>
        <div className="panel">
          <p>
            Die Teilnahme ist freiwillig. Sie können jederzeit pausieren oder abbrechen – ohne Angabe von Gründen und
            ohne Nachteil.
          </p>
          <p>
            Es werden keine Ton- oder Videoaufnahmen gespeichert, nur Ihre schriftlichen Antworten. Bitte nennen Sie
            keine Namen, Zimmernummern oder Diagnosen von Bewohnerinnen und Bewohnern.
          </p>
          <p>
            Einzelne Antworten geben wir nicht an die Einrichtung weiter. In den Interviews wird kein Produkt
            vorgestellt oder verkauft.
          </p>
        </div>
      </main>
      <footer className="site-foot">
        <p>
          Ein akademisches Projekt im International Consultancy Project des Executive Master of Business Administration
          der ESCP Business School. Projektteam: Zoe Lange-Gonzalez (Projektleitung), Felix Neubert, Olivier Guyot und
          Thomas Tsigkopoulos.
        </p>
        <p>
          Kontakt: <a href="mailto:zoe.lange_gonzalez@edu.escp.eu">zoe.lange_gonzalez@edu.escp.eu</a><br />
          <Link href="/forschung">Bereich für das Forschungsteam</Link>
        </p>
      </footer>
    </>
  );
}
