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
const REPO = "https://github.com/liaminhawai-cmd/year-9-english/raw/claude/curious-incident-folio-k6wypq/English%20LA%20-%20Year%209%20English/";
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
  folio: ["Speaking Folio booklet (Word)", `${SITE}files/${encodeURIComponent("Curious Incident Speaking Folio.docx")}`],
  planner: ["Unit planner", `${SITE}files/${encodeURIComponent("Curious Incident - Unit Planner.docx")}`],
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

/* ---------- the three lessons ---------- */
const H = t => P([{ b: t }], { before: 60 });
const APPLY = (n, extra = "") => [
  B(["Display mode on the ", { link: L.prompts(n) }, ": six rotations, 4 min talk, 2 min write, move up one table." + extra]),
  B(["For varied groupings use the ", { link: L.groups }, ". Alternatively, print the prompts in A3 and place them at six stations for students to rotate through."]),
  B(["Teacher at Table 1: record a score for Listening, Interacting and Presenting on the front page of each student's book. Give brief feedback on strengths and areas to improve. ", { link: L.tTable1 }]),
];
const lessons = [
  {
    file: "Curious Incident Speaking Folio - Lesson 1 - Personal Response.docx",
    title: "Speaking Folio 1 - Personal response",
    li: ["To share my interpretations, ideas and opinions in a group discussion", "To use active listening skills"],
    sc: ["I can present and justify a point of view", "I can ask clarifying questions", "I can describe the key ideas in what someone else said", "I can share my interpretations, ideas and opinions in a group discussion"],
    engage: [P([{ b: "Silent starter:", color: ROW.engage.ink }, " Session 1 passage on the screen (", { link: L.prompts(1) }, "). Write one feeling and one because in the margin of your folio."]),
             B("Three students share.")],
    develop: [H("Task 1 · Table talk"),
              B(["Open ", { link: L.talk(1) }, ", level 7. Click through, mark each line."]),
              B("Discuss and model the difference between the level 5 to 11 conversations.")],
    apply: APPLY(1),
    review: [B("Two tables share the one thing that changed someone's mind."), B("Collect folios if scoring today.")],
    need: [B([{ link: L.folio }, ", one per student."]), B(["Groups on the ", { link: L.groups }, "."]), B(["TV: ", { link: L.prompts(1) }, " and ", { link: L.talk(1) }, "."]), B("Novel, Session 1 chapters.")],
  },
  {
    file: "Curious Incident Speaking Folio - Lesson 2 - I Couldn't Disagree More.docx",
    title: "Speaking Folio 2 - I couldn't disagree more",
    li: ["To interpret implied meaning in spoken texts", "To use my voice and register appropriately in different contexts"],
    sc: ["I can present and justify a point of view", "I can change the way I speak depending on the social relationship", "I can interpret implied meaning in what someone else said", "I can present information clearly to a small group"],
    engage: [P([{ b: "Silent starter:", color: ROW.engage.ink }, " on the board: ", { i: "Homework should be banned." }, " Write one reason for and one against."]),
             B("Thirty seconds each side, whole class.")],
    develop: [H("Task 1 · Table talk"),
              B(["Open ", { link: L.talk(2) }, ", level 7. Click through, mark each line."]),
              B("Discuss and model the difference between the level 5 to 11 conversations."),
              H("Task 2 · The Reader"),
              B("Explain the Reader role: reads the statement, asks both sides, picks who speaks, never argues. A new Reader at each table.")],
    apply: APPLY(2, " New Reader each table."),
    review: [B("Each table: who moved, and why."), B("Collect folios.")],
    need: [B([{ link: L.folio }, "."]), B(["Groups: Session 2 on the ", { link: L.groups }, ". First Reader at each table decided."]), B(["TV: ", { link: L.prompts(2) }, " and ", { link: L.talk(2) }, "."]), B("Novel, past the confession and the letters.")],
  },
  {
    file: "Curious Incident Speaking Folio - Lesson 3 - Passage Analysis Panel.docx",
    title: "Speaking Folio 3 - Passage analysis panel",
    li: ["To listen critically to spoken texts constructed for different purposes", "To change the use of my voice when presenting, discussing or persuading"],
    sc: ["I can use active listening skills", "I can share my interpretations, ideas and opinions in a group discussion", "I can use inclusive and encouraging language to facilitate positive conversations", "I can present information clearly to a class group"],
    engage: [P([{ b: "Silent starter:", color: ROW.engage.ink }, " first page of the novel on the screen. Write one answer to each: what happens, how is it written, what does it show."]),
             B("Three students share, one question each.")],
    develop: [H("Task 1 · Table talk"),
              B(["Open ", { link: L.talk(3) }, ", level 7. Click through, mark each line."]),
              B("Discuss and model the difference between the level 5 to 11 conversations."),
              H("Task 2 · Yes, and"),
              B(["In groups, on the opening: every turn starts with ", { i: "Yes, and" }, " or a question."])],
    apply: APPLY(3, " At each table: someone reads, three questions, one thing agreed."),
    review: [B("Each table: one sentence to the class."), B(["Collect folios. Score the front page against the ", { link: L.rubric }, "."])],
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
