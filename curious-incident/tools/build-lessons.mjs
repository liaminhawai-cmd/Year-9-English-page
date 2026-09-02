/* Build the three folio lesson plans as separate Word documents, in the
   house lesson format (the OneNote page shape): purple header row, then
   Learning intention, I will be successful when, Engage (green), Develop
   and Discover (pink), Apply (blue), Review and reflect (yellow), You will
   need. 60-minute lessons. Every resource is a live hyperlink.

   node tools/build-lessons.mjs [output folder]
   Needs the `docx` package (NODE_PATH to a folder that has it). Reads prompts.js. */

import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const FOLIO = require("../prompts.js");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, LevelFormat, AlignmentType, VerticalAlign, ExternalHyperlink } = require("docx");

const outDir = process.argv[2] || path.dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });

const SITE = "https://liaminhawai-cmd.github.io/Year-9-English-page/curious-incident/";
const REPO = "https://github.com/liaminhawai-cmd/year-9-english/blob/claude/curious-incident-folio-k6wypq/English%20LA%20-%20Year%209%20English/";
const file = n => REPO + encodeURIComponent(n);
const L = {
  prompts: n => [`Prompts page · Session ${n}`, `${SITE}index.html#session-${n}`],
  talk: n => [`Table talk · Session ${n}`, `${SITE}wagoll.html#session-${n}`],
  rubric: ["Rubric", `${SITE}rubric.html`],
  groups: ["Group shuffler", `${SITE}groups.html`],
  tBooklet: ["Teacher notes: the booklet", `${SITE}teacher.html#booklet`],
  tGroups: ["Teacher notes: making groups", `${SITE}teacher.html#groups`],
  tScreen: ["Teacher notes: what goes on the screen", `${SITE}teacher.html#screen`],
  tTable1: ["Teacher notes: Table 1", `${SITE}teacher.html#table1`],
  tRun: ["Teacher notes: how a session runs", `${SITE}teacher.html#run`],
  folio: ["Speaking Folio booklet (Word)", file("Curious Incident Speaking Folio.docx")],
  planner: ["Unit planner", file("Curious Incident - Unit Planner.docx")],
};

/* ---------- colours: the house lesson table ---------- */
const PURPLE = "70243C", GOLD = "FFC000";
const ROW = {
  engage:  { fill: "C5E0B4", ink: "375623" },
  develop: { fill: "FBD5D5", ink: "9C0006" },
  apply:   { fill: "BDD7EE", ink: "1F4E79" },
  review:  { fill: "FFF2CC", ink: "7F6000" },
};
const font = "Calibri";
const thin = { style: BorderStyle.SINGLE, size: 4, color: "808080" };
const box = { top: thin, bottom: thin, left: thin, right: thin };
const CONTENT = 9638, LABEL = 2300;

/* segments: a string, {b:"bold"}, {i:"italic"}, or {link:[text,url]} */
const runs = (segs, o = {}) => (Array.isArray(segs) ? segs : [segs]).map(s => {
  if (typeof s === "string") return new TextRun({ text: s, size: 22, font, color: o.color, bold: o.bold });
  if (s.link) return new ExternalHyperlink({ link: s.link[1], children: [new TextRun({ text: s.link[0], size: 22, font, color: "0563C1", underline: {} })] });
  if (s.b !== undefined) return new TextRun({ text: s.b, bold: true, size: 22, font, color: s.color || o.color });
  if (s.i !== undefined) return new TextRun({ text: s.i, italics: true, size: 22, font, color: o.color });
  return new TextRun({ text: String(s), size: 22, font });
});
const P = (segs, o = {}) => new Paragraph({ spacing: { before: o.before ?? 0, after: o.after ?? 40 }, alignment: o.align, children: runs(segs, o) });
const B = (segs, o = {}) => new Paragraph({ numbering: { reference: "bul", level: 0 }, spacing: { before: 0, after: 30 }, children: runs(segs, o) });
const cell = (children, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: box, shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
  verticalAlign: o.valign ?? VerticalAlign.TOP, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children });
const row = (label, content, tone) => new TableRow({ children: [
  cell([P([{ b: label, color: tone ? tone.ink : undefined }], { after: 0 })], LABEL, { fill: tone && tone.fill }),
  cell(content, CONTENT - LABEL, { fill: tone && tone.fill }),
] });
const head = (left, right) => new TableRow({ tableHeader: true, children: [
  cell([P([{ b: left, color: GOLD }], { align: AlignmentType.CENTER, after: 0 })], LABEL, { fill: PURPLE, valign: VerticalAlign.CENTER }),
  cell([P([{ b: right, color: GOLD }], { align: AlignmentType.CENTER, after: 0 })], CONTENT - LABEL, { fill: PURPLE, valign: VerticalAlign.CENTER }),
] });
const task = (title, items) => [P([{ b: title }], { before: 60 }), ...items.map(i => B(i))];

/* ---------- the three lessons: 60 minutes each ---------- */
const T = (m, segs) => P([{ b: m + "  " }, ...(Array.isArray(segs) ? segs : [segs])]);
const lessons = [
  {
    file: "Curious Incident Speaking Folio - Lesson 1 - Personal Response.docx",
    title: "Speaking Folio 1 - Personal response",
    li: ["To respond to a quote with a reason from the words", "To link my idea to what someone else at the table said"],
    sc: ["I can give a feeling and a because from the quote (Interacting 7)", "I can agree, add or disagree with a named person (Interacting 7)", "I can ask a question that gets a reason out of someone (Listening 5, 8)"],
    engage: [T("5 min", [{ b: "Silent starter:", color: ROW.engage.ink }, " Session 1 passage on the screen (", { link: L.prompts(1) }, "). Write one feeling and one ", { b: "because" }, " in the margin of your folio."]),
             B("Three students share. Write the becauses on the board.")],
    develop: [T("8 min", [{ b: "Task 1 · Table talk" }]),
              B(["Open ", { link: L.talk(1) }, ", level 7. Click through, mark each line. Ask: what is missing?"]),
              B(["Level 9. Stop on ", { i: "So you're reading it as him rejecting her?" }, " (Listening 8) and ", { i: "I'd find that easier" }, " (Interacting 7)."]),
              B(["Level 11. Last two lines only."]),
              T("2 min", [{ b: "Task 2 · Model Table 1" }]),
              B(["One group, 90 seconds. Play level 5 (", { i: "I think it's sad" }, "), ask which row. Play it at 9."])],
    apply: [T("36 min", ["Display mode on the ", { link: L.prompts(1) }, ": six rotations, 4 min talk, 2 min write, move up one table."]),
            B(["Teacher at Table 1: level and evidence on the front page of each folio. ", { link: L.tTable1 }]),
            B(["Finished early: find a second quote in the chapter that does the same job."])],
    review: [T("5 min", ["Two tables share the one thing that changed someone's mind. Which row of the ", { link: L.rubric }, "?"]), B("Collect folios if scoring today.")],
    need: [B([{ link: L.folio }, ", one per student. ", { link: L.tBooklet }]), B(["Groups made on the ", { link: L.groups }, ". ", { link: L.tGroups }]), B(["TV: ", { link: L.prompts(1) }, " and ", { link: L.talk(1) }, ". ", { link: L.tScreen }]), B("Novel, Session 1 chapters.")],
  },
  {
    file: "Curious Incident Speaking Folio - Lesson 2 - I Couldn't Disagree More.docx",
    title: "Speaking Folio 2 - I couldn't disagree more",
    li: ["To take a side and give a reason from the book", "To quote the other person back, reframe and concede"],
    sc: ["I can say my side and a reason from the book in one sentence (Interacting 5)", "I can repeat the other person's words before I answer (Listening 9)", "I can give ground on the part that is true and keep the rest (Interacting 9)", "As Reader I can read the statement and run the talk without taking a side (Presenting 6)"],
    engage: [T("5 min", [{ b: "Silent starter:", color: ROW.engage.ink }, " on the board: ", { i: "Homework should be banned." }, " Write one reason for and one against."]),
             B("Thirty seconds each side. Stop. Ask: what did you do while the other side spoke?")],
    develop: [T("8 min", [{ b: "Task 1 · Table talk" }]),
              B(["Open ", { link: L.talk(2) }, ", level 7. Click through, mark each line. Ask: what did A do when B disagreed?"]),
              B(["Level 9. Stop on ", { i: "Do you mean good father overall, or good at the daily stuff?" }, " (Listening 8), ", { i: "You said one lie" }, " (Listening 9), ", { i: "Fair. Good at the daily stuff" }, " (Interacting 9)."]),
              B(["Level 11. ", { i: "What would actually count as evidence?" }]),
              T("2 min", [{ b: "Task 2 · The Reader" }]),
              B("Reads the statement, asks both sides, picks who speaks, checks who moved, never argues. Changes every table. Be Reader at Table 1 for one group, 90 seconds.")],
    apply: [T("36 min", ["Display mode on the ", { link: L.prompts(2) }, ": six rotations, 4 min talk, 2 min write, move up one table. New Reader each table."]),
            B(["Teacher at Table 1: level and evidence on the front page. Listen for the quote-back and the concession. ", { link: L.tTable1 }]),
            B("Finished early: write the statement your table would argue about more, one reason each side.")],
    review: [T("5 min", "Each table: who moved, and what moved them."), B("Collect folios.")],
    need: [B([{ link: L.folio }, " (same booklet as Session 1)."]), B(["Groups: Session 2 on the ", { link: L.groups }, ". First Reader at each table decided."]), B(["TV: ", { link: L.prompts(2) }, " and ", { link: L.talk(2) }, "."]), B("Novel, past the confession and the letters.")],
  },
  {
    file: "Curious Incident Speaking Folio - Lesson 3 - Passage Analysis Panel.docx",
    title: "Speaking Folio 3 - Passage analysis panel",
    li: ["To locate a writing feature in the words on the page", "To build on another person's point and present one clear sentence"],
    sc: ["I can name a feature and quote the words it lives in (Interacting 7)", "I can say 'yes, and' and take someone's point further (Listening 11)", "I can hand a turn to someone by name (Interacting 10)", "I can say our one thing to the class in one clear sentence (Presenting 8)"],
    engage: [T("5 min", [{ b: "Silent starter:", color: ROW.engage.ink }, " first page of the novel on the screen. Write one answer to each: ", { b: "what happens, how is it written, what does it show." }]),
             B("One answer each from three students. No discussion yet.")],
    develop: [T("8 min", [{ b: "Task 1 · Table talk" }]),
              B(["Open ", { link: L.talk(3) }, ", level 7. Click through, mark each line. Ask: where did ", { i: "7 minutes after midnight" }, " go?"]),
              B(["Level 9. Stop on ", { i: "Calm how?" }, " (Listening 7), ", { i: "Yes, and there are no feeling words" }, " (Interacting 7), ", { i: "Do we pick one?" }, " (Listening 8)."]),
              B(["Level 11. ", { i: "He keeps counting" }, " and the link to the station."]),
              T("2 min", [{ b: "Task 2 · Yes, and" }]),
              B(["In groups, on the opening: every turn starts with ", { i: "Yes, and" }, " or a question. Start with ", { i: "but" }, " and you start again."])],
    apply: [T("36 min", ["Display mode on the ", { link: L.prompts(3) }, ": six rotations, 4 min talk, 2 min write, move up one table. Someone reads, three questions, everyone points at a word, one thing agreed."]),
            B(["Teacher at Table 1: level and evidence on the front page. Listen for the feature in words, the ", { i: "yes, and" }, ", the turn handed by name. ", { link: L.tTable1 }]),
            B("Finished early: find the same feature in a second passage.")],
    review: [T("5 min", "Each table gives its one thing to the class in one sentence."), B(["Collect folios. Front page complete: score against the ", { link: L.rubric }, "."])],
    need: [B([{ link: L.folio }, "."]), B(["Groups: Session 3 on the ", { link: L.groups }, "."]), B(["TV: ", { link: L.prompts(3) }, " and ", { link: L.talk(3) }, "."]), B("Novel, six passages marked; page numbers on the board.")],
  },
];

for (const l of lessons) {
  const t = new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [LABEL, CONTENT - LABEL], rows: [
    head(`Reading ${FOLIO.novel}`, l.title),
    row("Learning intention", l.li.map(x => B(x))),
    row("I will be successful when:", l.sc.map(x => P(x, { after: 20 }))),
    row("Engage", l.engage, ROW.engage),
    row("Develop and Discover", l.develop, ROW.develop),
    row("Apply", l.apply, ROW.apply),
    row("Review and reflect:", l.review, ROW.review),
    row("You will need", l.need),
  ] });
  const doc = new Document({
    creator: "", lastModifiedBy: "", title: l.title,
    styles: { default: { document: { run: { font, size: 22 } } } },
    numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] }] },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 900, left: 1134, right: 1134 } } }, children: [
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: l.title, size: 34, font, color: "1F1F1F" })] }),
      new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: FOLIO.unit, size: 18, font, color: "666666" })] }),
      t,
    ] }],
  });
  const buf = await Packer.toBuffer(doc);
  const p = path.join(outDir, l.file);
  writeFileSync(p, buf); console.log("wrote", p, buf.length);
}
