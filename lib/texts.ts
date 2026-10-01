// Participant-facing texts. The instructions are taken verbatim from the hidden sheet
// "Interviewer Instructions" of the questionnaire workbook; the consent text is a DRAFT
// assembled from the flyer (261001TT_Zoevis_OnePager_DE_v3_Online.docx) and must be
// signed off by qualified German counsel before real fieldwork (see workbook, sheet "Legend").

export const CONSENT_VERSION = "einwilligung-v1-entwurf-2026-10-01";

export const DISTRESS_PROTOCOL =
  "Wir sprechen gleich auch über Belastendes. Sie bestimmen, wie weit Sie gehen. Wir können jederzeit pausieren oder abbrechen — ohne Angabe von Gründen und ohne Nachteil für Sie.";

export const ANONYMISATION_INSTRUCTION =
  "Bevor wir anfangen: Erzählen Sie so konkret wie möglich, aber bitte ohne Angaben, die eine Bewohnerin oder einen Bewohner erkennbar machen — keine Namen, keine Zimmernummern, kein Datum, keine Diagnosen. Wenn es doch passiert, unterbreche ich kurz. Das ist kein Misstrauen Ihnen gegenüber, sondern Schutz für Sie.";

export const INTERRUPT_SCRIPT =
  "Ich unterbreche kurz — bitte ohne konkrete Angaben zur Person. Erzählen Sie gern weiter aus Sicht des Ablaufs.";

export const CONSENT_PARAGRAPHS: string[] = [
  "Diese Online-Interviewstudie ist Teil des International Consultancy Project im Executive Master of Business Administration der ESCP Business School. Projektteam: Zoe Lange-Gonzalez (Projektleitung), Felix Neubert, Olivier Guyot und Thomas Tsigkopoulos.",
  "Wir möchten reale Arbeitsabläufe im Pflegealltag verstehen, den tatsächlichen Umfang der Dokumentation und die Stellen, an denen im Alltag Zeit verloren geht.",
  "Die Teilnahme ist freiwillig. Sie können jede Frage überspringen und jederzeit pausieren oder abbrechen – ohne Angabe von Gründen und ohne Nachteil.",
  "Es werden keine Ton- oder Videoaufnahmen gespeichert. Festgehalten werden ausschließlich Ihre schriftlichen Antworten. Bitte nennen Sie keine Namen, Zimmernummern, Daten oder Diagnosen von Bewohnerinnen und Bewohnern.",
  "Einzelne Antworten geben wir nicht an die Einrichtung weiter; zusammengefasste Ergebnisse teilen wir gern mit der Einrichtungsleitung.",
  "Automatische Prüfung: Bevor eine Antwort gespeichert wird, prüft eine KI (Google Gemini), ob sie Angaben enthält, die eine Person erkennbar machen. Das Forschungsteam nutzt dieselbe KI, um zusammengefasste Auswertungen zu erstellen.",
  "Nachweis ohne Inhalte: Ihre Einwilligung und der Abschluss des Interviews werden als kryptografische Prüfsummen in einer Blockchain vermerkt. Dort stehen keine Antworten und keine personenbezogenen Angaben, nur Prüfsummen und Zeitstempel. Mit Ihrem Teilnahmebeleg können Sie prüfen, dass Ihre Antworten nachträglich nicht verändert wurden, und Ihre Teilnahme widerrufen. Bei einem Widerruf löschen wir Ihre Antworten und den Schlüssel, der die Prüfsumme mit ihnen verbindet.",
  "Kontakt: Zoe Lange-Gonzalez, zoe.lange_gonzalez@edu.escp.eu",
];

export interface ConsentChoices {
  academic: boolean;       // academic purpose
  venture: boolean;        // possible use by the founding venture Zoevis
  healthData: boolean;     // explicit consent (Art. 9 Abs. 2 lit. a DSGVO) for own strain/wellbeing data
  adult: boolean;
}

export const CONSENT_ITEMS: { key: keyof ConsentChoices; label: string }[] = [
  {
    key: "academic",
    label:
      "Ich willige ein, dass meine anonymisierten schriftlichen Antworten für die akademische Arbeit verwendet werden (Abschlussbericht und individuelle wissenschaftliche Arbeiten).",
  },
  {
    key: "venture",
    label:
      "Ich willige ein, dass die anonymisierten Erkenntnisse auch in das von der Studie unabhängige Gründungsvorhaben Zoevis von Zoe Lange-Gonzalez einfließen können. In diesem Interview wird kein Produkt vorgestellt oder verkauft.",
  },
  {
    key: "healthData",
    label:
      "Ich willige ausdrücklich ein, dass Angaben zu meiner eigenen Belastung und meinem Befinden, die ich freiwillig mache, verarbeitet werden (Art. 9 Abs. 2 lit. a DSGVO).",
  },
  { key: "adult", label: "Ich bin mindestens 18 Jahre alt." },
];

export const consentComplete = (c: Partial<ConsentChoices>) =>
  CONSENT_ITEMS.every((i) => c[i.key] === true);
