/* Build the Word student booklet from prompts.js.

   node tools/build-folio.mjs [output.docx]
   Needs the `docx` package (npm install docx, or NODE_PATH to a folder that has it).

   Four pages, no explanation on any of them (the teacher explains it):
     1  front page: name, continuum rubric, teacher observation at Table 1
     2  Session 1: five rows, one per table (Tables 2 to 6)
     3  Session 2: same
     4  Session 3: same
   Table 1 is the teacher table and is scored on the front page, so it has no row. */

import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const FOLIO = require("../prompts.js");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType,
        BorderStyle, ShadingType, PageBreak, VerticalAlign, HeightRule } = require("docx");

const out = process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), "Curious Incident Speaking Folio.docx");

const DEEP = "22304A", GOLD = "8B681E", GOLD_SOFT = "F6E7C2", BAND = "F4EFE4", LINE = "C9BFAE", MUTED = "645D52";
const CONTENT = 9638; // A4 minus 2 cm margins, in DXA
const font = "Calibri";
const thin = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const box = { top: thin, bottom: thin, left: thin, right: thin };
const shade = fill => ({ type: ShadingType.CLEAR, color: "auto", fill });

const P = (text, o = {}) => new Paragraph({
  spacing: { before: o.before ?? 0, after: o.after ?? 60 }, alignment: o.align, border: o.border, keepNext: o.keepNext,
  children: (Array.isArray(text) ? text : [{ text }]).map(r => new TextRun({
    text: r.text, bold: r.bold ?? o.bold, italics: r.italics ?? o.italics, size: (r.size ?? o.size ?? 10.5) * 2,
    color: r.color ?? o.color, font: r.font ?? o.font ?? font, allCaps: r.caps ?? o.caps })),
});
const H = (text, o = {}) => P(text, { bold: true, size: o.size ?? 15, color: DEEP, after: o.after ?? 100, before: o.before ?? 0, keepNext: true,
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: DEEP, space: 2 } } });
const cell = (children, w, o = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA }, borders: o.borders ?? box, shading: o.fill ? shade(o.fill) : undefined,
  verticalAlign: o.valign, margins: { top: 50, bottom: 50, left: 80, right: 80 },
  children: Array.isArray(children) ? children : [children] });
const table = (rows, widths) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows });
const brk = () => new Paragraph({ children: [new PageBreak()] });

const C = FOLIO.continuum, isExp = lv => lv === C.expected;
const body = [];

/* ---------- page 1: front page ---------- */
body.push(P(FOLIO.unit, { size: 8, bold: true, color: MUTED, caps: true, after: 30 }));
body.push(P("Speaking and Listening Folio", { bold: true, size: 22, color: DEEP, after: 20 }));
body.push(P([{ text: FOLIO.novel, font: "Georgia", size: 12 }, { text: "   " + FOLIO.author, size: 9, color: MUTED }], { after: 160 }));
body.push(table([new TableRow({ children: ["Name", "Class", "Teacher"].map(f =>
  cell(P([{ text: f + ":  ", bold: true, size: 10 }, { text: "", size: 10 }], { after: 0 }), Math.floor(CONTENT / 3), { borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.SINGLE, size: 8, color: DEEP } } })) })],
  [Math.floor(CONTENT / 3), Math.floor(CONTENT / 3), Math.floor(CONTENT / 3)]));
body.push(P("", { after: 140 }));

const lvW = Math.floor((CONTENT - 1000) / C.levels.length);
body.push(table([
  new TableRow({ tableHeader: true, children: [
    cell(P("", { after: 0 }), 1000, { fill: DEEP }),
    ...C.levels.map(lv => cell(P([{ text: String(lv), bold: true, size: 10, color: "FFFFFF" }], { align: AlignmentType.CENTER, after: 0 }), lvW, { fill: isExp(lv) ? GOLD : DEEP })),
  ] }),
  ...C.strands.map(s => new TableRow({ children: [
    cell(P(s.name, { bold: true, size: 8, color: DEEP, after: 0 }), 1000, { fill: BAND, valign: VerticalAlign.CENTER }),
    ...C.levels.map(lv => cell(P(s.levels[lv] || "", { size: 6.5, after: 0, italics: !!(s.extension && s.extension.includes(lv)) }), lvW,
      { fill: s.levels[lv] ? (isExp(lv) ? GOLD_SOFT : undefined) : BAND })),
  ] })),
], [1000, ...C.levels.map(() => lvW)]));
body.push(P("Listening 10 to 12 in italics: draft extension above the school continuum.", { size: 7, color: MUTED, before: 40, after: 160 }));

body.push(H("Table 1 · teacher observation", { size: 12 }));
const obsW = [2300, 1100, 1000, 1000, 1000, CONTENT - 6400];
body.push(table([
  new TableRow({ tableHeader: true, children: ["Session", "Date", "Listening", "Interacting", "Presenting", "Heard"].map((t, i) =>
    cell(P(t, { bold: true, size: 7.5, caps: true, after: 0 }), obsW[i], { fill: BAND })) }),
  ...FOLIO.sessions.map(s => new TableRow({ height: { value: 1250, rule: HeightRule.ATLEAST }, children: [
    cell(P(`${s.n} · ${s.title}`, { size: 9, after: 0 }), obsW[0]), ...obsW.slice(1).map(w => cell(P("", { after: 0 }), w))] })),
], obsW));
body.push(brk());

/* ---------- pages 2 to 4: one per session, five rows ---------- */
const W = [2700, 1500, 3300, CONTENT - 7500];
const shortQuote = q => q.length > 150 ? q.slice(0, 148).replace(/\s+\S*$/, "") + " …" : q;
FOLIO.sessions.forEach((s, i) => {
  body.push(table([new TableRow({ children: [
    cell(P([{ text: `Session ${s.n} · ${s.title}`, bold: true, size: 14, color: DEEP }], { after: 0 }), CONTENT - 2600, { borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.SINGLE, size: 12, color: DEEP } } }),
    cell(P([{ text: "Date:  ", bold: true, size: 9 }], { after: 0, align: AlignmentType.RIGHT }), 2600, { borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.SINGLE, size: 12, color: DEEP } }, valign: VerticalAlign.BOTTOM }),
  ] })], [CONTENT - 2600, 2600]));
  body.push(P("", { after: 80 }));
  const head = new TableRow({ tableHeader: true, children: ["Table and prompt", "Who was at my table", "What my table said", "What I think now"].map((t, k) =>
    cell(P(t, { bold: true, size: 7.5, caps: true, after: 0 }), W[k], { fill: BAND })) });
  const rows = s.stations.filter(st => !st.teacher).map(st => new TableRow({ height: { value: 2560, rule: HeightRule.ATLEAST }, cantSplit: true, children: [
    cell([P(`Table ${st.n}`, { bold: true, size: 9, color: DEEP, after: 30 }),
          P(shortQuote(st.quote), { size: 8.5, font: "Georgia", after: 20 }),
          ...(st.source ? [P(st.source, { size: 7, color: MUTED, after: 0 })] : [])], W[0]),
    cell(P("", { after: 0 }), W[1]), cell(P("", { after: 0 }), W[2]), cell(P("", { after: 0 }), W[3]),
  ] }));
  body.push(table([head, ...rows], W));
  if (i < FOLIO.sessions.length - 1) body.push(brk());
});

const doc = new Document({
  creator: "", lastModifiedBy: "", title: "Curious Incident Speaking and Listening Folio",
  styles: { default: { document: { run: { font, size: 21 } } } },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 900, left: 1134, right: 1134 } } }, children: body }],
});
Packer.toBuffer(doc).then(buf => { writeFileSync(out, buf); console.log("wrote", out, buf.length, "bytes"); });
