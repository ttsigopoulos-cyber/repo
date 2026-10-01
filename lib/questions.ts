// AUTO-GENERATED from 260930TT_ESCP_ICP_SCB_CareHousesGermany_Questionnaire.xlsx
// (sheet "QUESTIONAIRE 2026CW39", version of 30.09.2026). Do not edit the German
// wording by hand: it was legally reviewed and "the German wording governs in the field".
// Regenerate with scripts/extract_questions.py when the workbook changes.

export type Role = "pflegekraft" | "leitung" | "angehoerige";

export interface Question {
  seq: number;              // running number 1–72 (for counting only)
  code: string;             // stable subquestion index, e.g. "A02.1"
  part: "A" | "B" | "C" | "D";
  block: number;
  blockTitle: string;       // English block name – researcher view only (never shown to participants, to avoid priming)
  tier: 1 | 2 | 3;          // interview priority (25-minute rule)
  neverSkip: boolean;       // interviewer may not cut it (participants can always skip – participation is voluntary)
  familyStopOnDistress: boolean;
  reactiveOnly: boolean;    // Part D: only if the respondent mentioned a tool first
  audiences: Role[];
  risk: string;             // residual legal risk from the workbook
  text: string;             // German wording (verbatim)
  textLeitung: string | null; // variant for Heimleitung/Pflegedienstleitung, where the workbook defines one
}

export const QUESTIONNAIRE_VERSION = "2026CW39 (Stand 30.09.2026)";

export const QUESTIONS: Question[] = [
  {
    "seq": 1,
    "code": "A01.1",
    "part": "A",
    "block": 1,
    "blockTitle": "1. Vocation and place",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Wie sind Sie eigentlich in die Altenpflege gekommen?",
    "textLeitung": null
  },
  {
    "seq": 2,
    "code": "A02.1",
    "part": "A",
    "block": 2,
    "blockTitle": "2. One concrete day",
    "tier": 1,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Können Sie mir einen Ihrer letzten Arbeitstage beschreiben – nicht idealtypisch, sondern einen ganz konkreten Tag? Führen Sie mich bitte vom Anfang der Schicht bis zum Ende. Bitte ohne Namen, Zimmernummern oder Diagnosen – uns interessiert der Ablauf, nicht die einzelne Bewohnerin.",
    "textLeitung": null
  },
  {
    "seq": 3,
    "code": "A02.2",
    "part": "A",
    "block": 2,
    "blockTitle": "2. One concrete day",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Was war an diesem Tag anders als geplant?",
    "textLeitung": null
  },
  {
    "seq": 4,
    "code": "A02.3",
    "part": "A",
    "block": 2,
    "blockTitle": "2. One concrete day",
    "tier": 1,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "An welchem Punkt haben Sie zum ersten Mal gedacht, dass die Zeit knapp wird?",
    "textLeitung": null
  },
  {
    "seq": 5,
    "code": "A02.5",
    "part": "A",
    "block": 2,
    "blockTitle": "2. One concrete day",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Und was läuft anders, wenn nachts oder bei Unterbesetzung gearbeitet wird?",
    "textLeitung": null
  },
  {
    "seq": 6,
    "code": "A03.1",
    "part": "A",
    "block": 3,
    "blockTitle": "3. Open pain, unprompted (never skip)",
    "tier": 1,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Wenn Sie an die letzte Woche denken: Was hat Sie am meisten davon abgehalten, Ihre Arbeit so zu machen, wie Sie sie machen wollen?",
    "textLeitung": null
  },
  {
    "seq": 7,
    "code": "A03.2",
    "part": "A",
    "block": 3,
    "blockTitle": "3. Open pain, unprompted (never skip)",
    "tier": 1,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Und wenn Sie die drei größten Belastungen in Ihrem Arbeitsalltag nennen müssten – welche wären das, in welcher Reihenfolge?",
    "textLeitung": null
  },
  {
    "seq": 8,
    "code": "A03.3",
    "part": "A",
    "block": 3,
    "blockTitle": "3. Open pain, unprompted (never skip)",
    "tier": 1,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Welche Aufgaben nehmen in Ihrem Arbeitsalltag am meisten Zeit in Anspruch?",
    "textLeitung": null
  },
  {
    "seq": 9,
    "code": "A04.1",
    "part": "A",
    "block": 4,
    "blockTitle": "4. The core episode",
    "tier": 1,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Gab es einen Moment, in dem Sie das Gefühl hatten, dass Verwaltungsarbeit zwischen Ihnen und Ihrer eigentlichen Aufgabe stand? Wenn ja, erzählen Sie mir bitte, was genau passiert ist. Wenn nein – was steht bei Ihnen sonst dazwischen?",
    "textLeitung": "Gab es einen Moment, in dem Sie das Gefühl hatten, dass Verwaltungsarbeit zwischen einer Ihrer Pflegekräfte und deren eigentlicher Aufgabe stand? Wenn ja, erzählen Sie mir bitte, was genau passiert ist. Wenn nein – was steht bei Ihnen sonst dazwischen?"
  },
  {
    "seq": 10,
    "code": "A04.3",
    "part": "A",
    "block": 4,
    "blockTitle": "4. The core episode",
    "tier": 1,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Was ging Ihnen in diesem Moment durch den Kopf?",
    "textLeitung": null
  },
  {
    "seq": 11,
    "code": "A05.1",
    "part": "A",
    "block": 5,
    "blockTitle": "5. The good shift (never skip)",
    "tier": 1,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Erzählen Sie mir von einer Schicht in der letzten Zeit, die sich richtig gut angefühlt hat – und was war an diesem Tag anders als sonst?",
    "textLeitung": null
  },
  {
    "seq": 12,
    "code": "A06.1",
    "part": "A",
    "block": 6,
    "blockTitle": "6. Good care, and who disagrees",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Vervollständigen Sie bitte diesen Satz: „Ich weiß, dass ich meine Arbeit gut gemacht habe, wenn …\"",
    "textLeitung": null
  },
  {
    "seq": 13,
    "code": "A06.3",
    "part": "A",
    "block": 6,
    "blockTitle": "6. Good care, and who disagrees",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Und wie würde jemand in der Leitungsrolle diesen Satz beenden?",
    "textLeitung": null
  },
  {
    "seq": 14,
    "code": "A06.4",
    "part": "A",
    "block": 6,
    "blockTitle": "6. Good care, and who disagrees",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Wo, glauben Sie, würden Sie sich am ehesten uneinig sein? Bitte auf Ebene der Rollen, nicht einzelner Personen.",
    "textLeitung": null
  },
  {
    "seq": 15,
    "code": "A07.1",
    "part": "A",
    "block": 7,
    "blockTitle": "7. Necessary versus imposed",
    "tier": 1,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Von der gesamten Dokumentation, die in Ihrem Alltag anfällt – welcher Teil ist aus Ihrer Sicht wirklich notwendig, also etwas, ohne das die Versorgung der Bewohner leiden würde?",
    "textLeitung": null
  },
  {
    "seq": 16,
    "code": "A07.2",
    "part": "A",
    "block": 7,
    "blockTitle": "7. Necessary versus imposed",
    "tier": 1,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Und welcher Teil fühlt sich eher von außen aufgezwungen an, ohne echten Bezug zur eigentlichen Pflege?",
    "textLeitung": null
  },
  {
    "seq": 17,
    "code": "A07.4",
    "part": "A",
    "block": 7,
    "blockTitle": "7. Necessary versus imposed",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Gibt es Elemente, die Sie mehrfach dokumentieren müssen – das heißt dieselbe Information an verschiedenen Stellen?",
    "textLeitung": null
  },
  {
    "seq": 18,
    "code": "A07.5",
    "part": "A",
    "block": 7,
    "blockTitle": "7. Necessary versus imposed",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Können Sie mir ein konkretes Beispiel vom letzten Dienst geben – welches Feld genau, und an welchen Stellen mussten Sie es eintragen?",
    "textLeitung": null
  },
  {
    "seq": 19,
    "code": "A07.6",
    "part": "A",
    "block": 7,
    "blockTitle": "7. Necessary versus imposed",
    "tier": 1,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Wie viel Zeit pro Schicht verbringen Sie schätzungsweise mit Dokumentation und Verwaltungsaufgaben?",
    "textLeitung": null
  },
  {
    "seq": 20,
    "code": "A07.7",
    "part": "A",
    "block": 7,
    "blockTitle": "7. Necessary versus imposed",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Welche Nachweis- oder Dokumentationspflichten empfinden Sie als besonders zeitaufwendig – zum Beispiel im Zusammenhang mit der Personalbemessung, mit Prüfungen des Medizinischen Dienstes oder mit Sturzprotokollen?",
    "textLeitung": null
  },
  {
    "seq": 21,
    "code": "A07.8",
    "part": "A",
    "block": 7,
    "blockTitle": "7. Necessary versus imposed",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Gibt es Formulare oder Prozesse, bei denen Sie das Gefühl haben, dass sie eher der Absicherung als der tatsächlichen Versorgung dienen?",
    "textLeitung": null
  },
  {
    "seq": 22,
    "code": "A08.1",
    "part": "A",
    "block": 8,
    "blockTitle": "8. Historicity",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Wie sah die Dokumentation aus, als Sie in diesem Beruf angefangen haben?",
    "textLeitung": null
  },
  {
    "seq": 23,
    "code": "A08.3",
    "part": "A",
    "block": 8,
    "blockTitle": "8. Historicity",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Was hat sich Ihrer Meinung nach verändert?",
    "textLeitung": null
  },
  {
    "seq": 24,
    "code": "A08.4",
    "part": "A",
    "block": 8,
    "blockTitle": "8. Historicity",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "War das eine schleichende Entwicklung oder gab es einen konkreten Auslöser – eine neue Regelung, eine Prüfung, eine Vorgabe von außen?",
    "textLeitung": null
  },
  {
    "seq": 25,
    "code": "A09.1",
    "part": "A",
    "block": 9,
    "blockTitle": "9. Families",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Wenn Angehörige zu Besuch kommen, was fragen sie meistens zuerst?",
    "textLeitung": null
  },
  {
    "seq": 26,
    "code": "A09.3",
    "part": "A",
    "block": 9,
    "blockTitle": "9. Families",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Welche Sorgen hören Sie von Angehörigen immer wieder? Und gibt es welche, die Sie eher spüren als hören?",
    "textLeitung": null
  },
  {
    "seq": 27,
    "code": "A09.4",
    "part": "A",
    "block": 9,
    "blockTitle": "9. Families",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Hat Sie einmal ein Angehöriger etwas gefragt, bei dem Sie gemerkt haben: Der hat keine Vorstellung davon, wie mein Arbeitstag wirklich aussieht?",
    "textLeitung": null
  },
  {
    "seq": 28,
    "code": "A10.1",
    "part": "A",
    "block": 10,
    "blockTitle": "10. The negative case (never skip)",
    "tier": 1,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Kennen Sie eine andere Einrichtung – in Deutschland oder anderswo – bei der Sie sagen würden: „Die haben es geschafft, diese Belastung in den Griff zu bekommen\"? Sie müssen das Haus nicht benennen – die Praxis interessiert mich mehr als der Name.",
    "textLeitung": null
  },
  {
    "seq": 29,
    "code": "A10.3",
    "part": "A",
    "block": 10,
    "blockTitle": "10. The negative case (never skip)",
    "tier": 2,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Wenn Ihnen jemand erzählen würde, er arbeite in einem Haus, in dem Dokumentation kein Problem ist – würden Sie ihm glauben?",
    "textLeitung": null
  },
  {
    "seq": 30,
    "code": "A10.4",
    "part": "A",
    "block": 10,
    "blockTitle": "10. The negative case (never skip)",
    "tier": 2,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Was müsste dieses Haus anders machen?",
    "textLeitung": null
  },
  {
    "seq": 31,
    "code": "A11.1",
    "part": "A",
    "block": 11,
    "blockTitle": "11. Open close",
    "tier": 1,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Wenn Sie eine einzige Sache in Ihrem Arbeitsalltag verändern könnten – eine konkrete Sache – was wäre das?",
    "textLeitung": null
  },
  {
    "seq": 32,
    "code": "A11.2",
    "part": "A",
    "block": 11,
    "blockTitle": "11. Open close",
    "tier": 1,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Und gibt es etwas, das ich Sie nicht gefragt habe, das ich aber hätte fragen sollen?",
    "textLeitung": null
  },
  {
    "seq": 33,
    "code": "A13.1",
    "part": "A",
    "block": 13,
    "blockTitle": "13. Coordination with people outside the home",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Welche Abstimmungen mit Personen außerhalb des Hauses gehören zu Ihrem Arbeitsalltag – zum Beispiel mit Hausärztinnen und Hausärzten oder mit Apotheken?",
    "textLeitung": null
  },
  {
    "seq": 34,
    "code": "A13.2",
    "part": "A",
    "block": 13,
    "blockTitle": "13. Coordination with people outside the home",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Wo hakt es dabei am häufigsten? Und woran liegt das aus Ihrer Sicht?",
    "textLeitung": null
  },
  {
    "seq": 35,
    "code": "B01.1",
    "part": "B",
    "block": 1,
    "blockTitle": "1. The tipping point",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Ab welchem Punkt in einer Schicht merken Sie, dass Sie nur noch hinterherlaufen?",
    "textLeitung": null
  },
  {
    "seq": 36,
    "code": "B01.2",
    "part": "B",
    "block": 1,
    "blockTitle": "1. The tipping point",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Woran genau merken Sie das zuerst?",
    "textLeitung": null
  },
  {
    "seq": 37,
    "code": "B02.1",
    "part": "B",
    "block": 2,
    "blockTitle": "2. Knowing before the record knows",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Es gibt Situationen, in denen Pflegekräfte merken, dass mit jemandem etwas nicht stimmt, bevor es dokumentiert ist. Woran merken Sie so etwas?",
    "textLeitung": null
  },
  {
    "seq": 38,
    "code": "B02.2",
    "part": "B",
    "block": 2,
    "blockTitle": "2. Knowing before the record knows",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Woher wissen Sie das dann?",
    "textLeitung": null
  },
  {
    "seq": 39,
    "code": "B02.3",
    "part": "B",
    "block": 2,
    "blockTitle": "2. Knowing before the record knows",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Welche Signale sind das – und wo landen sie, wenn überhaupt?",
    "textLeitung": null
  },
  {
    "seq": 40,
    "code": "B03.1",
    "part": "B",
    "block": 3,
    "blockTitle": "3. Habituation",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Was macht Berufsanfängerinnen in der Pflege erfahrungsgemäß noch zu schaffen, was Sie selbst kaum noch berührt?",
    "textLeitung": null
  },
  {
    "seq": 41,
    "code": "B03.2",
    "part": "B",
    "block": 3,
    "blockTitle": "3. Habituation",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Wann hat sich das bei Ihnen verändert?",
    "textLeitung": null
  },
  {
    "seq": 42,
    "code": "B04.1",
    "part": "B",
    "block": 4,
    "blockTitle": "4. The inspector's three documents",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Stellen Sie sich vor, eine Prüferin dürfte nur drei Dokumente ansehen, um zu beurteilen, ob ein Bewohner gut versorgt wird. Welche drei sollte sie sich ansehen?",
    "textLeitung": null
  },
  {
    "seq": 43,
    "code": "B04.2",
    "part": "B",
    "block": 4,
    "blockTitle": "4. The inspector's three documents",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Und gibt es welche, bei denen Sie erleichtert wären, wenn sie sie überspringt?",
    "textLeitung": null
  },
  {
    "seq": 44,
    "code": "B05.1",
    "part": "B",
    "block": 5,
    "blockTitle": "5. When documentation helped (never skip)",
    "tier": 2,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Hat Ihnen die Dokumentation schon einmal tatsächlich geholfen – also dass Ihnen dadurch etwas aufgefallen ist, bevor es zum Problem wurde?",
    "textLeitung": null
  },
  {
    "seq": 45,
    "code": "B05.2",
    "part": "B",
    "block": 5,
    "blockTitle": "5. When documentation helped (never skip)",
    "tier": 2,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Erzählen Sie mir davon – gern am Beispiel, aber bitte ohne bewohnerbezogene Details. Mich interessiert, was die Dokumentation geleistet hat.",
    "textLeitung": null
  },
  {
    "seq": 46,
    "code": "B06.1",
    "part": "B",
    "block": 6,
    "blockTitle": "6. Divergence inside the team",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Gab es eine Situation, in der Sie und eine Kollegin unterschiedlich eingeschätzt haben, was Priorität hat? Was ist passiert?",
    "textLeitung": null
  },
  {
    "seq": 47,
    "code": "B06.2",
    "part": "B",
    "block": 6,
    "blockTitle": "6. Divergence inside the team",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Gibt es jemanden im Team – vielleicht aus einer anderen Generation – der das alles völlig anders sieht als Sie?",
    "textLeitung": null
  },
  {
    "seq": 48,
    "code": "B06.3",
    "part": "B",
    "block": 6,
    "blockTitle": "6. Divergence inside the team",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Was ist dessen Sicht?",
    "textLeitung": null
  },
  {
    "seq": 49,
    "code": "B07.1",
    "part": "B",
    "block": 7,
    "blockTitle": "7. Handover",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Erzählen Sie mir von der letzten Übergabe, bei der die Information nicht angekommen ist. Wo im Prozess ist sie verloren gegangen?",
    "textLeitung": null
  },
  {
    "seq": 50,
    "code": "B08.1",
    "part": "B",
    "block": 8,
    "blockTitle": "8. The team veto (never skip)",
    "tier": 2,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Gab es ein Werkzeug oder einen Prozess, der eingeführt wurde und bei dem das Team einfach nicht mitgemacht hat? Was ist passiert?",
    "textLeitung": null
  },
  {
    "seq": 51,
    "code": "B08.2",
    "part": "B",
    "block": 8,
    "blockTitle": "8. The team veto (never skip)",
    "tier": 2,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Woran hat es gelegen?",
    "textLeitung": null
  },
  {
    "seq": 52,
    "code": "B08.3",
    "part": "B",
    "block": 8,
    "blockTitle": "8. The team veto (never skip)",
    "tier": 2,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Und was hätte anders laufen müssen, damit es funktioniert?",
    "textLeitung": null
  },
  {
    "seq": 53,
    "code": "C01.1",
    "part": "C",
    "block": 1,
    "blockTitle": "1. How decisions actually get made",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "leitung"
    ],
    "risk": "Low",
    "text": "Wenn in Ihrem Haus über eine Investition in neue Technik oder neue Prozesse entschieden wird – wie läuft das ab?",
    "textLeitung": null
  },
  {
    "seq": 54,
    "code": "C01.2",
    "part": "C",
    "block": 1,
    "blockTitle": "1. How decisions actually get made",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "leitung"
    ],
    "risk": "Low",
    "text": "Wer ist beteiligt, und was gibt am Ende den Ausschlag?",
    "textLeitung": null
  },
  {
    "seq": 55,
    "code": "C01.3",
    "part": "C",
    "block": 1,
    "blockTitle": "1. How decisions actually get made",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Gab es in den letzten Jahren eine solche Investition, die im Nachhinein ein Fehler war? Was ist passiert?",
    "textLeitung": null
  },
  {
    "seq": 56,
    "code": "C01.4",
    "part": "C",
    "block": 1,
    "blockTitle": "1. How decisions actually get made",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "leitung"
    ],
    "risk": "Low",
    "text": "Über welchen Weg wurde das finanziert – Eigenmittel, Förderung, Paragraf 8 Absatz 8 Sozialgesetzbuch Elftes Buch?",
    "textLeitung": null
  },
  {
    "seq": 57,
    "code": "C02.1",
    "part": "C",
    "block": 2,
    "blockTitle": "2. Regulatory pressure: staffing assessment",
    "tier": 2,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "leitung"
    ],
    "risk": "Low",
    "text": "Seit Januar 2026 ist das Personalbemessungsverfahren nach Paragraf 113c Sozialgesetzbuch Elftes Buch verbindlich. Wie hat sich das in Ihrem Alltag ausgewirkt – für Sie und für die Pflegekräfte auf den Stationen?",
    "textLeitung": null
  },
  {
    "seq": 58,
    "code": "C03.1",
    "part": "C",
    "block": 3,
    "blockTitle": "3. What makes something stick",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "leitung"
    ],
    "risk": "Low",
    "text": "Wenn Sie an neue Werkzeuge oder Prozesse denken, die in Ihrem Haus eingeführt wurden – was unterscheidet die, die sich durchgesetzt haben, von denen, die ungenutzt geblieben sind?",
    "textLeitung": null
  },
  {
    "seq": 59,
    "code": "C04.1",
    "part": "C",
    "block": 4,
    "blockTitle": "4. Reputation and occupancy (never skip)",
    "tier": 2,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "leitung"
    ],
    "risk": "Low",
    "text": "Wie wirkt sich der Ruf Ihres Hauses bei Angehörigen auf Ihre Belegung aus?",
    "textLeitung": null
  },
  {
    "seq": 60,
    "code": "C04.2",
    "part": "C",
    "block": 4,
    "blockTitle": "4. Reputation and occupancy (never skip)",
    "tier": 2,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "leitung"
    ],
    "risk": "Low",
    "text": "Woran merken Sie das?",
    "textLeitung": null
  },
  {
    "seq": 61,
    "code": "C04.3",
    "part": "C",
    "block": 4,
    "blockTitle": "4. Reputation and occupancy (never skip)",
    "tier": 3,
    "neverSkip": true,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Gab es einen Fall, in dem die Meinung von Angehörigen tatsächlich etwas verändert hat – bei einer Entscheidung, bei der Belegung, beim Personal? Gern ohne Angaben zur konkreten Familie oder zu einzelnen Mitarbeitenden.",
    "textLeitung": null
  },
  {
    "seq": 62,
    "code": "C05.1",
    "part": "C",
    "block": 5,
    "blockTitle": "5. The resident's perspective",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft"
    ],
    "risk": "Low",
    "text": "Was, glauben Sie, würde ein Bewohner antworten, wenn ihn jemand fragen würde: „Wie viel Zeit hatte die Pflegekraft heute für Sie?\"",
    "textLeitung": null
  },
  {
    "seq": 63,
    "code": "C05.2",
    "part": "C",
    "block": 5,
    "blockTitle": "5. The resident's perspective",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": false,
    "audiences": [
      "pflegekraft"
    ],
    "risk": "Low",
    "text": "Merken die Bewohner, wenn Sie unter Zeitdruck stehen? Woran?",
    "textLeitung": null
  },
  {
    "seq": 64,
    "code": "C06.1",
    "part": "C",
    "block": 6,
    "blockTitle": "6. The decision moment",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": true,
    "reactiveOnly": false,
    "audiences": [
      "angehoerige"
    ],
    "risk": "Medium",
    "text": "Erinnern Sie sich an den Tag, an dem klar wurde, dass Ihre Mutter oder Ihr Vater in eine Einrichtung ziehen sollte?",
    "textLeitung": null
  },
  {
    "seq": 65,
    "code": "C07.1",
    "part": "C",
    "block": 7,
    "blockTitle": "7. First visit versus today",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": true,
    "reactiveOnly": false,
    "audiences": [
      "angehoerige"
    ],
    "risk": "Low",
    "text": "Bei Ihrer ersten Besichtigung des Pflegeheimes – was hat Sie beruhigt, was hat Sie beunruhigt?",
    "textLeitung": null
  },
  {
    "seq": 66,
    "code": "C07.2",
    "part": "C",
    "block": 7,
    "blockTitle": "7. First visit versus today",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": true,
    "reactiveOnly": false,
    "audiences": [
      "angehoerige"
    ],
    "risk": "Low",
    "text": "Und wenn Sie heute zu Besuch kommen, worauf achten Sie automatisch, ohne dass Sie es aussprechen?",
    "textLeitung": null
  },
  {
    "seq": 67,
    "code": "C08.1",
    "part": "C",
    "block": 8,
    "blockTitle": "8. Perception of care",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": true,
    "reactiveOnly": false,
    "audiences": [
      "angehoerige"
    ],
    "risk": "Low to medium",
    "text": "Denken Sie an einen Moment, in dem Sie das Gefühl hatten „hier wird gut gepflegt\". Was war das genau?",
    "textLeitung": null
  },
  {
    "seq": 68,
    "code": "C08.2",
    "part": "C",
    "block": 8,
    "blockTitle": "8. Perception of care",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": true,
    "reactiveOnly": false,
    "audiences": [
      "angehoerige"
    ],
    "risk": "Low to medium",
    "text": "Und im Gegensatz dazu, wann haben Sie sich einmal Sorgen gemacht? Ohne dass Sie einzelne Mitarbeitende benennen müssen. Was Sie hier sagen, geht nicht an das Haus zurück.",
    "textLeitung": null
  },
  {
    "seq": 69,
    "code": "C09.1",
    "part": "C",
    "block": 9,
    "blockTitle": "9. Choosing again",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": true,
    "reactiveOnly": false,
    "audiences": [
      "angehoerige"
    ],
    "risk": "Low",
    "text": "Wenn Sie heute noch einmal ein Haus aussuchen müssten – worauf würden Sie achten, was Sie damals nicht wussten?",
    "textLeitung": null
  },
  {
    "seq": 70,
    "code": "D01.1",
    "part": "D",
    "block": 1,
    "blockTitle": "1. Only if they raise it first",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": true,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low to medium",
    "text": "Sie haben gerade [Werkzeug oder System] erwähnt. Was funktioniert daran gut?",
    "textLeitung": null
  },
  {
    "seq": 71,
    "code": "D01.2",
    "part": "D",
    "block": 1,
    "blockTitle": "1. Only if they raise it first",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": true,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Was frustriert Sie täglich?",
    "textLeitung": null
  },
  {
    "seq": 72,
    "code": "D01.3",
    "part": "D",
    "block": 1,
    "blockTitle": "1. Only if they raise it first",
    "tier": 3,
    "neverSkip": false,
    "familyStopOnDistress": false,
    "reactiveOnly": true,
    "audiences": [
      "pflegekraft",
      "leitung"
    ],
    "risk": "Low",
    "text": "Wenn Sie eines dieser Werkzeuge morgen abschaffen könnten, welches wäre es?",
    "textLeitung": null
  }
];
