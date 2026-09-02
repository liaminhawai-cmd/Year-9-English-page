/* Build the Word version of the student booklet from prompts.js.

   node tools/build-folio.mjs [output.docx]
   Needs the `docx` package: npm install docx   (or set NODE_PATH to a folder that has it)

   Same content and page order as booklet.html: cover, rubric, how it runs,
   then for each session an intro page and one page per table with lines to
   write on, then a self-assessment page. */

import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const FOLIO = require("../prompts.js");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, PageBreak, HeadingLevel, LevelFormat, VerticalAlign, PageNumber, Footer,
} = require("docx");

const out = process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), "Curious Incident Speaking Folio.docx");

/* ---------- helpers ---------- */
const DEEP = "22304A", GOLD = "8B681E", GOLD_SOFT = "F6E7C2", BAND = "F4EFE4", LINE = "C9BFAE", ACCENT = "B7361F", MUTED = "645D52";
const CONTENT = 9638; // A4 (11906) minus 2 x 1134 margins, in DXA
const font = "Calibri";
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const thin = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const box = { top: thin, bottom: thin, left: thin, right: thin };
const shade = fill => ({ type: ShadingType.CLEAR, color: "auto", fill });

const P = (text, o = {}) => new Paragraph({
  spacing: { before: o.before ?? 0, after: o.after ?? 80, line: o.line },
  alignment: o.align, border: o.border, shading: o.shading, keepNext: o.keepNext,
  children: (Array.isArray(text) ? text : [{ text }]).map(r => new TextRun({
    text: r.text, bold: r.bold ?? o.bold, italics: r.italics ?? o.italics, size: (r.size ?? o.size ?? 11) * 2,
    color: r.color ?? o.color, font: r.font ?? o.font ?? font, allCaps: r.caps ?? o.caps,
  })),
});
const H = (text, o = {}) => P(text, { bold: true, size: o.size ?? 15, color: DEEP, after: o.after ?? 120, before: o.before ?? 160, keepNext: true,
  border: o.rule === false ? undefined : { bottom: { style: BorderStyle.SINGLE, size: 12, color: DEEP, space: 2 } } });
const kicker = text => P(text, { size: 8, bold: true, color: MUTED, caps: true, after: 40 });
const small = (text, o = {}) => P(text, { size: 8.5, color: MUTED, ...o });
const brk = () => new Paragraph({ children: [new PageBreak()] });
const numbered = (items, ref) => items.map(t => new Paragraph({
  numbering: { reference: ref, level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: t, size: 21, font })],
}));
const bullets = (items, size = 9.5) => items.map(t => new Paragraph({
  numbering: { reference: "bul", level: 0 }, spacing: { after: 30 }, children: [new TextRun({ text: t, size: size * 2, font })],
}));
/* ruled lines to write on: empty paragraphs with a bottom border */
const lines = n => Array.from({ length: n }, () => new Paragraph({
  spacing: { before: 0, after: 0, line: 480 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 1 } },
  children: [new TextRun({ text: "", size: 22 })],
}));
const label = (text, note) => P([{ text, bold: true, color: DEEP, size: 8.5, caps: true }, ...(note ? [{ text: "   " + note, color: MUTED, size: 8.5 }] : [])], { before: 140, after: 20, keepNext: true });

const cell = (children, w, o = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA }, borders: o.borders ?? box, shading: o.fill ? shade(o.fill) : undefined,
  verticalAlign: o.valign, margins: { top: 60, bottom: 60, left: 90, right: 90 },
  children: Array.isArray(children) ? children : [children],
});
const table = (rows, widths) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows });

/* ---------- pages ---------- */
const C = FOLIO.continuum, isExp = lv => lv === C.expected;
const body = [];

/* cover */
body.push(
  kicker(FOLIO.unit),
  P("Speaking and Listening Folio", { bold: true, size: 30, color: DEEP, before: 600, after: 120 }),
  P(FOLIO.novel, { size: 16, font: "Georgia", after: 20 }),
  P(FOLIO.author, { size: 11, color: MUTED, after: 500 }),
  ...["Name", "Class", "Teacher"].map(f => P([{ text: f + ":  ", bold: true }, { text: "________________________________________________" }], { size: 12, before: 160, after: 160 })),
  P("", { after: 500 }),
  P([{ text: "Three sessions. Six tables. One prompt on each. ", bold: true },
     { text: "Talk for five minutes, write for two, move on. By the end of a session you have talked about all six prompts with the same group, and by the end of the folio you have talked with three different groups." }], { size: 10.5, after: 120 }),
  ...numbered(FOLIO.sessions.map(s => `Session ${s.n} · ${s.title}. ${s.focus}.`), "num1"),
  P("The rubric is on the next page. Your teacher listens at Table 1. Your own notes are the evidence for Listening.", { size: 10.5, before: 80 }),
  brk(),
);

/* rubric page */
const lvW = Math.floor((CONTENT - 1100) / C.levels.length);
const contWidths = [1100, ...C.levels.map(() => lvW)];
body.push(H("Rubric · Speaking and Listening continuum", { before: 0 }));
body.push(table([
  new TableRow({ tableHeader: true, children: [
    cell(P("Substrand", { bold: true, size: 8, color: "FFFFFF" }), 1100, { fill: DEEP }),
    ...C.levels.map(lv => cell(P([{ text: String(lv), bold: true, size: 10, color: "FFFFFF" }, ...(isExp(lv) ? [{ text: "\nYear 9", size: 7, color: "FFFFFF", bold: true }] : [])], { align: AlignmentType.CENTER, after: 0 }), lvW, { fill: isExp(lv) ? GOLD : DEEP })),
  ] }),
  ...C.strands.map(s => new TableRow({ children: [
    cell(P(s.name, { bold: true, size: 8, color: DEEP, after: 0 }), 1100, { fill: BAND, valign: VerticalAlign.CENTER }),
    ...C.levels.map(lv => cell(P(s.levels[lv] || "", { size: 7.5, after: 0 }), lvW, { fill: s.levels[lv] ? (isExp(lv) ? GOLD_SOFT : undefined) : BAND })),
  ] })),
], contWidths));
body.push(P("", { after: 60 }));
body.push(table([new TableRow({ children: C.strands.map(s => cell([
  P(s.name, { bold: true, size: 9, color: DEEP, after: 20 }), P(FOLIO.evidence[s.key], { size: 8.5, after: 0 }),
], Math.floor(CONTENT / 3), { fill: BAND })) })], [Math.floor(CONTENT / 3), Math.floor(CONTENT / 3), Math.floor(CONTENT / 3)]));
body.push(H("Teacher observation · Table 1", { size: 12, before: 200 }));
const obsW = [2500, 1200, 1000, 1000, 1000, CONTENT - 6700];
body.push(table([
  new TableRow({ tableHeader: true, children: ["Session", "Date", "Listening", "Interacting", "Presenting", "What I heard"].map((t, i) => cell(P(t, { bold: true, size: 7.5, caps: true, after: 0 }), obsW[i], { fill: BAND })) }),
  ...FOLIO.sessions.map(s => new TableRow({ height: { value: 620, rule: "atLeast" }, children: [cell(P(`${s.n} · ${s.title}`, { size: 9, after: 0 }), obsW[0]), ...obsW.slice(1).map(w => cell(P("", { after: 0 }), w))] })),
], obsW));
body.push(small("Levels are the continuum numbers above. Blank cells in the continuum are blank in the source document too.", { before: 80 }));
body.push(brk());

/* how + starters */
body.push(H("How a session runs", { before: 0 }));
body.push(...numbered(FOLIO.howItWorks, "num2"));
body.push(H("Sentence starters", { before: 200 }));
body.push(small("The colours are the same on the WAGOLL wall. A good five minutes uses all four; a great one doesn't need the list."));
const stW = Math.floor(CONTENT / 2);
const starterCell = g => cell([P(g.name, { bold: true, size: 9.5, color: DEEP, after: 30 }), ...bullets(g.items, 9)], stW, { fill: BAND });
const st = FOLIO.starters;
const stRows = [];
for (let i = 0; i < st.length; i += 2) stRows.push(new TableRow({ children: [starterCell(st[i]), st[i + 1] ? starterCell(st[i + 1]) : cell(P(""), stW, { borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder } })] }));
body.push(table(stRows, [stW, stW]));
body.push(brk());

/* sessions */
FOLIO.sessions.forEach(s => {
  body.push(H(`Session ${s.n} · ${s.title}`, { before: 0 }));
  body.push(P(s.focus, { size: 11, color: MUTED, after: 120 }));
  body.push(...numbered(s.how, `how${s.n}`));
  if (s.panelQuestions) {
    body.push(P("The three panel questions", { bold: true, color: DEEP, size: 10, before: 140, after: 40, keepNext: true }));
    body.push(...numbered(s.panelQuestions, `pq${s.n}`));
  }
  body.push(P([{ text: "Write for two minutes at every table.  ", bold: true }, { text: s.write }], { size: 10, before: 140, after: 140, shading: shade(BAND), border: { left: { style: BorderStyle.SINGLE, size: 24, color: "176B87", space: 6 } } }));
  body.push(table(s.stations.map(stn => new TableRow({ children: [
    cell(P(`Table ${stn.n}${stn.teacher ? " ★" : ""}`, { bold: true, size: 9, color: DEEP, after: 0 }), 1300, { borders: { top: noBorder, left: noBorder, right: noBorder, bottom: thin } }),
    cell(P([{ text: stn.quote.length > 100 ? stn.quote.slice(0, 98).replace(/\s+\S*$/, "") + " …" : stn.quote, size: 9 }, ...(stn.source ? [{ text: `  (${stn.source})`, size: 8, color: MUTED }] : [])], { after: 0 }), CONTENT - 1300, { borders: { top: noBorder, left: noBorder, right: noBorder, bottom: thin } }),
  ] })), [1300, CONTENT - 1300]));
  body.push(small("★ Teacher table. Your group's starting table and the order you move in are on the board.", { before: 80 }));
  body.push(brk());

  s.stations.forEach(stn => {
    body.push(P([{ text: `Session ${s.n} · Table ${stn.n}`, bold: true, size: 14, color: DEEP }, { text: `     ${stn.teacher ? "Teacher table · " : ""}${s.title}`, size: 8.5, color: MUTED }],
      { border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: DEEP, space: 2 } }, after: 140 }));
    body.push(P(stn.quote, { size: 11.5, font: "Georgia", after: stn.source ? 20 : 120, shading: shade(BAND), border: { left: { style: BorderStyle.SINGLE, size: 24, color: ACCENT, space: 6 } } }));
    if (stn.source) body.push(P(stn.source, { size: 8, color: MUTED, after: 120 }));
    body.push(...numbered(stn.talk, `talk${s.n}${stn.n}`));
    body.push(table([new TableRow({ children: [
      cell([label("Date"), ...lines(1)], 3000, { borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder } }),
      cell([label("Who was at my table"), ...lines(1)], CONTENT - 3000, { borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder } }),
    ] })], [3000, CONTENT - 3000]));
    body.push(label("What my table said", "who said it, in your words"));
    body.push(...lines(9));
    body.push(label("What I think now", s.key === "disagree" ? "which side, and did anyone move" : s.key === "panel" ? "the one thing we'd tell the class" : "what changed or what got confirmed"));
    body.push(...lines(5));
    body.push(brk());
  });
});

/* self-assessment */
body.push(H("After Session 3 · Where is my evidence?", { before: 0 }));
body.push(small("For each substrand, find the continuum line you can prove, and write the page in this booklet where the proof is. Your teacher's Table 1 notes are on page 2."));
const selfW = [1800, 1400, CONTENT - 5400, 2200];
body.push(table([
  new TableRow({ tableHeader: true, children: ["Substrand", "Level I'm claiming", "The line, in my words", "Where the proof is"].map((t, i) => cell(P(t, { bold: true, size: 7.5, caps: true, after: 0 }), selfW[i], { fill: BAND })) }),
  ...C.strands.map(s => new TableRow({ height: { value: 1500, rule: "atLeast" }, children: [cell(P(s.name, { bold: true, size: 9.5, after: 0 }), selfW[0]), ...selfW.slice(1).map(w => cell(P("", { after: 0 }), w))] })),
], selfW));
body.push(H("Next time I'm at a table I will", { size: 12, before: 240 }));
body.push(...lines(4));

/* ---------- numbering definitions ---------- */
const numRefs = ["num1", "num2", ...FOLIO.sessions.flatMap(s => [`how${s.n}`, `pq${s.n}`, ...s.stations.map(st => `talk${s.n}${st.n}`)])];
const numbering = {
  config: [
    { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] },
    ...numRefs.map(ref => ({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 420, hanging: 300 } } } }] })),
  ],
};

const doc = new Document({
  creator: "", lastModifiedBy: "", title: "Curious Incident Speaking and Listening Folio",
  styles: { default: { document: { run: { font, size: 21 } } } },
  numbering,
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
      new TextRun({ text: "Curious Incident · Speaking and Listening Folio · ", size: 15, color: MUTED, font }),
      new TextRun({ children: [PageNumber.CURRENT], size: 15, color: MUTED, font }),
    ] })] }) },
    children: body,
  }],
});

Packer.toBuffer(doc).then(buf => { writeFileSync(out, buf); console.log("wrote", out, buf.length, "bytes"); });
