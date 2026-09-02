/* Build the Word student booklet from prompts.js, in the Kew High School
   planner style: landscape A4, 1.27 cm margins, Aptos Narrow, purple
   header cells with white text, peach level headers, school logo.

   node tools/build-folio.mjs [output.docx]
   Needs the `docx` package (NODE_PATH to a folder that has it).

   Seven pages, nothing explained on any of them (the teacher explains it):
     1    front page: name, continuum rubric (7 to 11), Table 1 teacher record
     2-3  Session 1 as a spread: Tables 2 to 4, then Table 1 (greyed: the
          booklet is with the teacher) with Tables 5 and 6
     4-5  Session 2, 6-7  Session 3: same. */

import { createRequire } from "node:module";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const FOLIO = require("../prompts.js");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType, PageBreak, VerticalAlign, HeightRule, PageOrientation, ImageRun, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType } = require("docx");

const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(here, "Curious Incident Speaking Folio.docx");
const logo = readFileSync(path.join(here, "kew-logo.jpeg"));

const PURPLE = "70243C", PEACH = "FAE2D5", WHITE = "FFFFFF", MUTED = "595959", INK = "1F1F1F";
const CONTENT = 16838 - 1440;  // landscape A4, 720 margins
const font = "Aptos Narrow";
const thin = { style: BorderStyle.SINGLE, size: 4, color: "808080" };
const box = { top: thin, bottom: thin, left: thin, right: thin };
const none = { style: BorderStyle.NONE, size: 0, color: WHITE };
const shade = fill => ({ type: ShadingType.CLEAR, color: "auto", fill });

const P = (text, o = {}) => new Paragraph({
  spacing: { before: o.before ?? 0, after: o.after ?? 60 }, alignment: o.align, keepNext: o.keepNext,
  children: (Array.isArray(text) ? text : [{ text }]).map(r => new TextRun({
    text: r.text, bold: r.bold ?? o.bold, italics: r.italics ?? o.italics, size: (r.size ?? o.size ?? 11) * 2,
    color: r.color ?? o.color ?? INK, font: r.font ?? o.font ?? font, underline: (r.underline ?? o.underline) ? {} : undefined })),
});
const cell = (children, w, o = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA }, borders: o.borders ?? box, shading: o.fill ? shade(o.fill) : undefined,
  verticalAlign: o.valign, margins: { top: 50, bottom: 50, left: 90, right: 90 },
  children: Array.isArray(children) ? children : [children] });
const table = (rows, widths) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows });
const brk = () => new Paragraph({ children: [new PageBreak()] });
const hcell = (t, w, o = {}) => cell(P([{ text: t, bold: true, color: WHITE, size: o.size ?? 11 }], { align: o.align, after: 0 }), w, { fill: PURPLE, valign: VerticalAlign.CENTER });

const C = FOLIO.continuum, isExp = lv => lv === C.expected;
const LEVELS = C.levels.filter(lv => lv >= 7);   // the booklet shows 7 to 11; the site keeps 5 and 6
const body = [];

/* ---------- page 1: front page ---------- */
body.push(new Paragraph({ spacing: { after: 0 }, children: [
  new ImageRun({ type: "jpg", data: logo, transformation: { width: 63, height: 68 },
    floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.MARGIN, align: "right" }, verticalPosition: { relative: VerticalPositionRelativeFrom.PARAGRAPH, offset: 0 }, wrap: { type: TextWrappingType.SQUARE }, margins: { left: 114300 } } }),
  new TextRun({ text: "Kew High School Speaking and Listening Folio", bold: true, underline: {}, size: 24, font, color: INK }),
] }));
body.push(P(`Year 9 English · ${FOLIO.novel}, ${FOLIO.author}`, { size: 11, after: 120 }));
body.push(table([new TableRow({ children: ["Name", "Class", "Teacher"].map(f =>
  cell(P([{ text: f + ":  ", bold: true }], { after: 0 }), Math.floor(CONTENT / 3), { borders: { top: none, left: none, right: none, bottom: { style: BorderStyle.SINGLE, size: 8, color: PURPLE } } })) })],
  [Math.floor(CONTENT / 3), Math.floor(CONTENT / 3), Math.floor(CONTENT / 3)]));
body.push(P("", { after: 100 }));

const lvW = Math.floor((CONTENT - 1500) / LEVELS.length);
body.push(table([
  new TableRow({ tableHeader: true, children: [
    hcell("Speaking and Listening", 1500, { size: 10 }),
    ...LEVELS.map(lv => isExp(lv)
      ? cell(P([{ text: String(lv), bold: true, color: WHITE, size: 11 }], { align: AlignmentType.CENTER, after: 0 }), lvW, { fill: PURPLE, valign: VerticalAlign.CENTER })
      : cell(P([{ text: String(lv), bold: true, size: 11 }], { align: AlignmentType.CENTER, after: 0 }), lvW, { fill: PEACH, valign: VerticalAlign.CENTER })),
  ] }),
  ...C.strands.map(s => new TableRow({ children: [
    hcell(s.name, 1500, { size: 10 }),
    ...LEVELS.map(lv => cell(P(s.levels[lv] || "", { size: 8.5, after: 0, italics: !!(s.extension && s.extension.includes(lv)) }), lvW,
      { fill: s.levels[lv] ? (isExp(lv) ? PEACH : undefined) : "F2F2F2" })),
  ] })),
], [1500, ...LEVELS.map(() => lvW)]));
body.push(P("Level 9 is the Year 9 expected level. Listening 10 and 11 in italics: draft extension above the school continuum.", { size: 8, color: MUTED, before: 40, after: 140 }));

body.push(P([{ text: "Table 1 · teacher record", bold: true, underline: true, size: 12 }], { after: 60, keepNext: true }));
const obsW = [3400, 1700, 3466, 3466, 3366];
body.push(table([
  new TableRow({ tableHeader: true, children: ["Session", "Date", "Listening", "Interacting", "Presenting"].map((t, i) => hcell(t, obsW[i], { size: 10 })) }),
  ...FOLIO.sessions.map(s => new TableRow({ height: { value: 1000, rule: HeightRule.ATLEAST }, children: [
    cell(P(`${s.n} · ${s.title}`, { size: 10, after: 0 }), obsW[0]), ...obsW.slice(1).map(w => cell(P("", { after: 0 }), w))] })),
], obsW));
body.push(brk());

/* ---------- two pages per session: Tables 2 to 4, then Table 1 (teacher, greyed) with Tables 5 and 6 ---------- */
const W = [4200, 2300, 5100, CONTENT - 11600];
const ROWH = 2750;
const shortQuote = q => q.length > 150 ? q.slice(0, 148).replace(/\s+\S*$/, "") + " …" : q;
const sessHead = (s, cont) => [table([new TableRow({ children: [
  hcell(`Session ${s.n} · ${s.title}${cont ? " (continued)" : ""}`, CONTENT - 2600, { size: 13 }),
  cell(P([{ text: "Date:  ", bold: true, color: WHITE }], { after: 0, align: AlignmentType.RIGHT }), 2600, { fill: PURPLE, valign: VerticalAlign.CENTER }),
] })], [CONTENT - 2600, 2600]), P("", { after: 60 })];
const colHead = () => new TableRow({ tableHeader: true, children: ["Table and prompt", "Who was at my table", "What my table said", "What I think now"].map((t, k) =>
  cell(P([{ text: t, bold: true, size: 10 }], { after: 0 }), W[k], { fill: PEACH, valign: VerticalAlign.CENTER })) });
const stationRow = st => new TableRow({ height: { value: ROWH, rule: HeightRule.ATLEAST }, cantSplit: true, children: [
  cell([P([{ text: `Table ${st.n}`, bold: true, color: PURPLE, size: 10 }], { after: 20 }),
        P(shortQuote(st.quote), { size: 9.5, font: "Georgia", after: 20 }),
        ...(st.source ? [P(st.source, { size: 8, color: MUTED, after: 0 })] : [])], W[0]),
  cell(P("", { after: 0 }), W[1]), cell(P("", { after: 0 }), W[2]), cell(P("", { after: 0 }), W[3]),
] });
const teacherRow = () => new TableRow({ height: { value: ROWH, rule: HeightRule.ATLEAST }, cantSplit: true, children: [
  new TableCell({ columnSpan: 4, width: { size: CONTENT, type: WidthType.DXA }, borders: box, shading: shade("F2F2F2"), verticalAlign: VerticalAlign.CENTER, margins: { top: 50, bottom: 50, left: 90, right: 90 },
    children: [P([{ text: "Table 1 · Teacher table", bold: true, color: MUTED, size: 11 }], { align: AlignmentType.CENTER, after: 40 }),
               P([{ text: "Give your booklet to the teacher.", color: MUTED, size: 10 }], { align: AlignmentType.CENTER, after: 0 })] }),
] });
FOLIO.sessions.forEach((s, i) => {
  const st = s.stations.filter(x => !x.teacher);
  body.push(...sessHead(s, false));
  body.push(table([colHead(), ...st.slice(0, 3).map(stationRow)], W));
  body.push(brk());
  body.push(...sessHead(s, true));
  body.push(table([colHead(), teacherRow(), ...st.slice(3).map(stationRow)], W));
  if (i < FOLIO.sessions.length - 1) body.push(brk());
});

const doc = new Document({
  creator: "", lastModifiedBy: "", title: "Curious Incident Speaking and Listening Folio",
  styles: { default: { document: { run: { font, size: 22 } } } },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, bottom: 720, left: 720, right: 720 } } }, children: body }],
});
Packer.toBuffer(doc).then(buf => { writeFileSync(out, buf); console.log("wrote", out, buf.length, "bytes"); });
