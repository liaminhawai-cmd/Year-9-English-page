/* Build the teacher lesson plans (Word) for the three folio sessions.

   node tools/build-lessons.mjs [output.docx]
   Reads prompts.js for the prompts, continuum and run sequence. Everything
   the student pages and booklet deliberately leave out is here. */

import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const FOLIO = require("../prompts.js");
const { SESSIONS } = require("../wagoll-content.js");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak, LevelFormat, AlignmentType, HeightRule } = require("docx");

const out = process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), "Curious Incident Speaking Folio - Lesson Plans.docx");
const SITE = "https://liaminhawai-cmd.github.io/Year-9-English-page/curious-incident/";

const DEEP = "22304A", BAND = "F4EFE4", LINE = "C9BFAE", MUTED = "645D52";
const CONTENT = 9638; const font = "Calibri";
const thin = { style: BorderStyle.SINGLE, size: 4, color: LINE }; const box = { top: thin, bottom: thin, left: thin, right: thin };
const shade = fill => ({ type: ShadingType.CLEAR, color: "auto", fill });
const P = (text, o = {}) => new Paragraph({ spacing: { before: o.before ?? 0, after: o.after ?? 80 }, keepNext: o.keepNext, border: o.border,
  children: (Array.isArray(text) ? text : [{ text }]).map(r => new TextRun({ text: r.text, bold: r.bold ?? o.bold, italics: r.italics ?? o.italics, size: (r.size ?? o.size ?? 10.5) * 2, color: r.color ?? o.color, font })) });
const H1 = t => P(t, { bold: true, size: 17, color: DEEP, before: 0, after: 120, keepNext: true, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: DEEP, space: 2 } } });
const H2 = t => P(t, { bold: true, size: 12, color: DEEP, before: 180, after: 60, keepNext: true });
const bullets = items => items.map(t => new Paragraph({ numbering: { reference: "bul", level: 0 }, spacing: { after: 40 }, children: [new TextRun({ text: t, size: 21, font })] }));
const cell = (children, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: box, shading: o.fill ? shade(o.fill) : undefined, margins: { top: 50, bottom: 50, left: 80, right: 80 }, children: Array.isArray(children) ? children : [children] });
const table = (rows, widths) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows });
const brk = () => new Paragraph({ children: [new PageBreak()] });
const seq = rows => table([
  new TableRow({ tableHeader: true, children: [cell(P("Min", { bold: true, size: 8, after: 0 }), 900, { fill: BAND }), cell(P("What happens", { bold: true, size: 8, after: 0 }), CONTENT - 900, { fill: BAND })] }),
  ...rows.map(([m, ...ps]) => new TableRow({ children: [cell(P(m, { size: 9.5, after: 0 }), 900), cell(ps.map((t, i) => P(t, { size: 9.5, after: i === ps.length - 1 ? 0 : 40 })), CONTENT - 900)] })),
], [900, CONTENT - 900]);

const C = FOLIO.continuum;
const lv = (key, n) => `${C.strands.find(s => s.key === key).name} ${n}: ${C.strands.find(s => s.key === key).levels[n]}`;
const body = [];

/* ---------- overview ---------- */
body.push(P(FOLIO.unit, { size: 8, bold: true, color: MUTED, after: 30 }));
body.push(H1("Speaking and Listening Folio · lesson plans"));
body.push(P("Three sessions, each one period. Same structure every time: pre-teach one set of interaction moves, model at Table 1, six rotations, close. The folio is the student's record; the front page is where the teacher scores. Timings assume a 70-minute period and are trimmed by cutting rotations to 6 minutes, not by cutting the pre-teach.", { after: 100 }));
body.push(H2("What the students hold"));
body.push(...bullets([
  "The folio (Word, in the resources folder): front page rubric and Table 1 record, then one page per session with five rows for Tables 2 to 6. Nothing on it explains the task. You do.",
  "The novel, with the chapter for the session marked.",
]));
body.push(H2("What is on the screen"));
body.push(...bullets([
  `Prompts and timer: ${SITE}index.html. Display mode gives the six prompts, the rotation counter and the 5 + 2 timer. If groups were made on the shuffler on the same device, each table shows who should be there.`,
  `Table talk: ${SITE}wagoll.html. One session at a time, one line at a time, level up and down. Add ?session=2 or ?session=3 to open on that session.`,
  `Rubric: ${SITE}rubric.html. The continuum and what to listen for at Table 1.`,
  `Groups: ${SITE}groups.html. Paste the class list once, get groups for all three sessions with different company each time. Everyone visits every table.`,
]));
body.push(H2("How a session runs"));
body.push(...bullets(FOLIO.run));
body.push(H2("Assessment"));
body.push(...bullets([
  "Table 1 is the observation point. One group per rotation, so every student is heard once per session. Record on the front page: level per strand and the words you heard.",
  "The session pages are the student's Listening evidence: what the table said, in their words.",
  `Year 9 expected is level ${C.expected}. Listening 10 to 12 are the draft extension (VCE-aligned) for students working above.`,
  "Presenting evidence comes from Session 2 (reading the statement and running the talk) and Session 3 (the share-back).",
]));
body.push(H2("EAL and support"));
body.push(...bullets([
  "Pre-teach the sentence starters as a script before the first session: say each one aloud, students repeat, then use one on a throwaway prompt.",
  "Seat EAL students so the Reader role in Session 2 comes to them at a table they have heard once already.",
  "Allow a minute of first-language planning before the go-round at each table. The talk is in English.",
  "Let a student write the table's ideas as dot points rather than sentences. The evidence is that they heard, not that they wrote prose.",
  "The interactive table talk at level 7 is the model for students who need to see the smallest version of the move first.",
]));
body.push(brk());

/* ---------- per session ---------- */
const plans = [
  {
    focus: [lv("listening", 5), lv("listening", 7), lv("interacting", 5), lv("interacting", 7), lv("interacting", 10)],
    preteach: [
      "Open Table talk on Session 1 at level 7. Click through the first four lines. Ask: what is missing? (Reasons. Links. Nobody asks D anything.)",
      "Level up to 9. Click through. Stop on C's question and on D's 'I'd find that easier'. Name the four moves from the legend: feeling with a reason, link to your own life, link to what someone said, ask to understand.",
      "Level up to 11 for two lines only: B's 'So you're saying…' Name it: inferring what the speaker implies, then checking. That is the move that gets a student above 9.",
      "Throwaway practice, two minutes, in the groups they will sit in: the 'faces' passage where Siobhan draws expressions. Go round once with a feeling and a because. One person asks one question.",
    ],
    model: "Sit at Table 1 with one group for ninety seconds on the Table 1 quote. Play the level 7 student once: 'I think it's sad.' Ask the class what the next person should say. Then play it at 9.",
    listen: ["A feeling with a because, from the words on the table.", "A question that gets a reason out of someone.", "Someone named and answered ('like C said…').", "Who notices the quiet one."],
    close: "Two tables read out the one thing someone said that changed their mind. Collect folios if the front page is being scored today.",
  },
  {
    focus: [lv("interacting", 5), lv("interacting", 8), lv("interacting", 9), lv("listening", 8), lv("listening", 9), lv("presenting", 6)],
    preteach: [
      "Throwaway statement on the board: 'Homework should be banned.' Thirty seconds each side, no book needed. Stop it.",
      "Open Table talk on Session 2 at level 7. Click through. Ask what A did when D disagreed. (Repeated themselves, louder.)",
      "Level 9. Stop on D's 'Do you mean good father overall, or good at the daily stuff?' Name it: reframe. Stop on A's 'You said one lie.' Name it: quote your opponent back. Stop on C's 'Fair. Good at the daily stuff': concede, and keep the rest.",
      "Level 11, two lines: B's opening ('what would count as evidence?') and C's 'carer versus liar assumes he can only be one'. This is what above-standard sounds like: the argument is about the evidence, not the volume.",
      "Explain the Reader role once: reads, asks both sides, chooses who speaks, checks who moved, never argues. Rotates every table.",
      "Re-run the homework statement for one minute using the three moves. Listen for one quote-back.",
    ],
    model: "Be the Reader at Table 1 for one group for ninety seconds. Ask a student to quote another back before answering. Show the concession by doing one yourself.",
    listen: ["A side with a reason from the book.", "The opponent's exact words repeated before the answer.", "A reframe ('do you mean…') that the table then uses.", "A concession that keeps the speaker's argument alive.", "The Reader running it without taking a side."],
    close: "Ask each table: who moved, and what moved them. The moving is the evidence.",
  },
  {
    focus: [lv("interacting", 7), lv("listening", 9), lv("listening", 10), lv("listening", 11), lv("presenting", 8)],
    preteach: [
      "Put the first page of the novel on the screen. Read it aloud. Ask the three panel questions in order: what happens, how is it written, what does it show. Take one answer each, no discussion yet.",
      "Open Table talk on Session 3 at level 7. Click through. Ask where the good observation ('7 minutes after midnight') went. (Nowhere. Nobody took it further.)",
      "Level 9. Stop on D's 'Calm how? Say what makes it calm.' Name it: elaborate on someone else. Stop on B's 'Yes, and there are no feeling words at all.' Name it: yes, and. Stop on C handing the turn back to A. Name it: turns are given.",
      "Level 11, two lines: A's 'the counting continues' and B's link to the station. Name it: linking across the book. This is Listening 11, building on the ideas of others to develop your own.",
      "One-minute drill in groups on the opening: each person must start with 'Yes, and' or a question to the previous speaker. Anyone who starts with 'but' starts again.",
    ],
    model: "Panel one passage with a volunteer group at Table 1: you read, you hand the first turn by name, you elaborate once on a student's point and say that you are doing it.",
    listen: ["A feature located in words on the page, not asserted.", "'Yes, and' that actually adds.", "Someone's point taken further by someone else.", "Turns given by name, and the first speaker returned to before closing.", "One clear sentence for the class at the end."],
    close: "Each table gives its one thing to the class in one sentence. Presenting evidence: who says it and how.",
  },
];

FOLIO.sessions.forEach((s, i) => {
  const plan = plans[i], scene = SESSIONS[i];
  body.push(P(`Session ${s.n} of 3`, { size: 8, bold: true, color: MUTED, after: 30 }));
  body.push(H1(`${s.title}`));
  body.push(P(s.skill, { size: 11, color: MUTED, after: 120 }));
  body.push(H2("Continuum focus"));
  body.push(...bullets(plan.focus));
  body.push(H2("Before the lesson"));
  body.push(...bullets([
    "Groups made on the shuffler and on the board, or typed by hand. Six groups, Group 1 starts at Table 1.",
    `Six tables numbered. Table 1 has a chair for you. Prompts on the display, or printed from ${SITE}index.html.`,
    "Folios out, novel open at the session's chapters. Check the quotes against the class edition and add page numbers on the display if the edition differs.",
    i === 1 ? "Decide who is Reader first at each table. Rotate it every table." : i === 2 ? "Passages marked in the books before the lesson. Table 6 covers several chapters; choose one page." : "The 'faces' passage ready on the screen for the pre-teach.",
  ]));
  body.push(H2("Sequence"));
  body.push(seq([
    ["0 to 5", "Settle. Groups to starting tables. Folios open at the session page."],
    ["5 to 17", "Pre-teach the moves.", ...plan.preteach],
    ["17 to 20", "Model.", plan.model],
    ["20 to 62", "Six rotations. Start the timer in display mode. Five minutes of talk, the bell, two minutes writing in the row for that table, move up one table.", "You are at Table 1 with the front page of each folio in that group. Record the level and the words you heard. Only intervene to hand a turn to someone who has not spoken."],
    ["62 to 70", "Close.", plan.close],
  ]));
  body.push(H2("What to listen for at Table 1"));
  body.push(...bullets(plan.listen));
  body.push(H2("The moves, as the students hear them"));
  body.push(table([
    new TableRow({ tableHeader: true, children: [cell(P("Move", { bold: true, size: 8, after: 0 }), 2400, { fill: BAND }), cell(P("What it is", { bold: true, size: 8, after: 0 }), CONTENT - 2400, { fill: BAND })] }),
    ...scene.moves.map(m => new TableRow({ children: [cell(P(m.name, { bold: true, size: 9.5, after: 0 }), 2400), cell(P(m.what, { size: 9.5, after: 0 }), CONTENT - 2400)] })),
  ], [2400, CONTENT - 2400]));
  body.push(H2("The prompts"));
  body.push(table([
    new TableRow({ tableHeader: true, children: [cell(P("Table", { bold: true, size: 8, after: 0 }), 900, { fill: BAND }), cell(P("Prompt", { bold: true, size: 8, after: 0 }), 5200, { fill: BAND }), cell(P("Talk questions", { bold: true, size: 8, after: 0 }), CONTENT - 6100, { fill: BAND })] }),
    ...s.stations.map(st => new TableRow({ children: [
      cell(P(`${st.n}${st.teacher ? " (teacher)" : ""}`, { size: 9.5, after: 0 }), 900),
      cell([P(st.quote, { size: 9, after: st.source ? 20 : 0 }), ...(st.source ? [P(st.source, { size: 7.5, color: MUTED, after: 0 })] : [])], 5200),
      cell(st.talk.map((t, k) => P(t, { size: 8.5, after: k === st.talk.length - 1 ? 0 : 30 })), CONTENT - 6100),
    ] })),
  ], [900, 5200, CONTENT - 6100]));
  if (s.spare && s.spare.length) { body.push(P("Spare prompts: " + s.spare.map(p => p.quote + (p.source ? ` (${p.source})` : "")).join(" · "), { size: 8.5, color: MUTED, before: 60 })); }
  if (i < FOLIO.sessions.length - 1) body.push(brk());
});

const doc = new Document({
  creator: "", lastModifiedBy: "", title: "Curious Incident Speaking Folio · lesson plans",
  styles: { default: { document: { run: { font, size: 21 } } } },
  numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, children: body }],
});
Packer.toBuffer(doc).then(buf => { writeFileSync(out, buf); console.log("wrote", out, buf.length, "bytes"); });
