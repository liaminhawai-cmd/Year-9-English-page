/* Passage panel practice: the lesson before folio Session 3. A worksheet
   with the opening passage down the middle and the three panel questions
   (what happens, how is it written, what does it show) as tasks in the
   margins, then a box for the one thing to tell the class; and a lesson
   plan in the house lesson table.

   node tools/build-panel-practice.mjs [output folder]   (needs docx) */
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType, PageBreak, LevelFormat, VerticalAlign, ExternalHyperlink } = require("docx");

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = process.argv[2] || here; mkdirSync(outDir, { recursive: true });
const SITE = "https://liaminhawai-cmd.github.io/Year-9-English-page/curious-incident/";
const WS_NAME = "Curious Incident - Passage Panel Practice - Worksheet.docx";
const LP_NAME = "Curious Incident Speaking Folio - Lesson 3a - Passage Panel Practice.docx";

const DEEP = "22304A", BAND = "F4EFE4", LINE = "C9BFAE", MUTED = "645D52", font = "Calibri";
const CONTENT = 9638;
const thin = { style: BorderStyle.SINGLE, size: 4, color: LINE }, box = { top: thin, bottom: thin, left: thin, right: thin };
const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, nobox = { top: none, bottom: none, left: none, right: none };
const shade = f => ({ type: ShadingType.CLEAR, color: "auto", fill: f });
const P = (t, o = {}) => new Paragraph({ spacing: { before: o.before ?? 0, after: o.after ?? 60, line: o.line }, alignment: o.align, keepNext: o.keepNext,
  children: (Array.isArray(t) ? t : [{ text: t }]).map(r => r.link ? new ExternalHyperlink({ link: r.link[1], children: [new TextRun({ text: r.link[0], size: (o.size ?? 10.5) * 2, font, color: "0563C1", underline: {} })] })
    : new TextRun({ text: r.text, bold: r.bold ?? o.bold, italics: r.italics ?? o.italics, size: (r.size ?? o.size ?? 10.5) * 2, color: r.color ?? o.color, font: r.font ?? o.font ?? font, allCaps: r.caps ?? o.caps })) });
const B = (t, o = {}) => new Paragraph({ numbering: { reference: "bul", level: 0 }, spacing: { after: 30 }, children: (Array.isArray(t) ? t : [{ text: t }]).map(r => r.link ? new ExternalHyperlink({ link: r.link[1], children: [new TextRun({ text: r.link[0], size: 22, font, color: "0563C1", underline: {} })] }) : new TextRun({ text: r.text, bold: r.bold, italics: r.italics, size: 22, font, color: r.color })) });
const cell = (ch, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: o.borders ?? box, shading: o.fill ? shade(o.fill) : undefined, verticalAlign: o.valign, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: Array.isArray(ch) ? ch : [ch] });
const table = (rows, widths) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows });
const brk = () => new Paragraph({ children: [new PageBreak()] });
const lines = n => Array.from({ length: n }, () => new Paragraph({ spacing: { before: 0, after: 0, line: 440 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 1 } }, children: [new TextRun({ text: "", size: 20 })] }));
const numbering = { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] }] };
const docOf = (title, children) => new Document({ creator: "", lastModifiedBy: "", title, numbering, styles: { default: { document: { run: { font, size: 21 } } } },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 900, left: 1134, right: 1134 } } }, children }] });

/* ---------- the passage: chapter 2 ---------- */
const PASSAGE = [
  "It was 7 minutes after midnight. The dog was lying on the grass in the middle of the lawn in front of Mrs. Shears’s house. Its eyes were closed. It looked as if it was running on its side, the way dogs run when they think they are chasing a cat in a dream. But the dog was not running or asleep. The dog was dead.",
  "There was a garden fork sticking out of the dog. The points of the fork must have gone all the way through the dog and into the ground because the fork had not fallen over. I decided that the dog was probably killed with the fork because I could not see any other wounds in the dog and I do not think you would stick a garden fork into a dog after it had died for some other reason, like cancer, for example, or a road accident. But I could not be certain about this.",
  "I went through Mrs. Shears’s gate, closing it behind me. I walked onto her lawn and knelt beside the dog. I put my hand on the muzzle of the dog. It was still warm.",
  "The dog was called Wellington. It belonged to Mrs. Shears, who was our friend. She lived on the opposite side of the road, two houses to the left.",
  "Wellington was a poodle. Not one of the small poodles that have hairstyles but a big poodle. It had curly black fur, but when you got close you could see that the skin underneath the fur was a very pale yellow, like chicken.",
  "I stroked Wellington and wondered who had killed him, and why.",
];

/* ---------- WORKSHEET ----------
   Four lines in the passage are already marked ① to ④. The student labels
   what each is doing. Then three open finds: a line that shows you
   something about …, copied and explained. Then the panel's one thing. */
const W = [];
const MARK = ["①", "②", "③", "④"];
const marked = { 0: ["It was 7 minutes after midnight."], 1: ["I decided that the dog was probably killed with the fork because I could not see any other wounds in the dog"], 2: ["It was still warm."], 4: ["like chicken"] };
const paraRuns = (t, k) => {
  const marks = marked[k] || []; let rest = t, runs = [];
  marks.forEach((m, n) => { const i = rest.indexOf(m); if (i < 0) return; const idx = Object.keys(marked).indexOf(String(k)) + n;
    runs.push({ text: rest.slice(0, i) }, { text: MARK[idx] + " ", bold: true, color: DEEP }, { text: m, bold: true }); rest = rest.slice(i + m.length); });
  runs.push({ text: rest }); return runs;
};
W.push(P("Speaking and Listening Folio · The Curious Incident of the Dog in the Night-Time", { size: 8, bold: true, color: MUTED, caps: true, after: 20 }));
W.push(P("Passage panel · practice", { bold: true, size: 18, color: DEEP, after: 40 }));
W.push(table([new TableRow({ children: [
  cell(P([{ text: "Name:  ", bold: true, size: 10 }], { after: 0 }), 4800, { borders: { ...nobox, bottom: { style: BorderStyle.SINGLE, size: 8, color: DEEP } } }),
  cell(P([{ text: "Date:  ", bold: true, size: 10 }], { after: 0 }), 2400, { borders: { ...nobox, bottom: { style: BorderStyle.SINGLE, size: 8, color: DEEP } } }),
  cell(P([{ text: "Table:  ", bold: true, size: 10 }], { after: 0 }), CONTENT - 7200, { borders: { ...nobox, bottom: { style: BorderStyle.SINGLE, size: 8, color: DEEP } } }),
] })], [4800, 2400, CONTENT - 7200]));
W.push(P("", { after: 80 }));
W.push(P([{ text: "Chapter 2 · the opening", bold: true, size: 10, color: DEEP }], { after: 60 }));
const SIDE = 2500, MID = CONTENT - 2 * SIDE;
const lab = (n, hint) => cell([P([{ text: n, bold: true, color: DEEP, size: 11 }, { text: "  " + hint, size: 8.5, color: MUTED }], { after: 20 }), ...lines(3)], SIDE, { borders: box, valign: VerticalAlign.TOP });
const empty = () => cell([P("", { after: 0 })], SIDE, { borders: nobox });
const mid = paras => cell(paras.map(([t, k]) => P(paraRuns(t, k), { size: 10, font: "Times New Roman", after: 60, line: 264 })), MID, { borders: { top: none, bottom: none, left: thin, right: thin } });
const rows = [
  [[[PASSAGE[0], 0]], lab("①", "What is this doing?"), empty()],
  [[[PASSAGE[1], 1]], empty(), lab("②", "What is this doing?")],
  [[[PASSAGE[2], 2], [PASSAGE[3], 3]], lab("③", "What is this doing?"), empty()],
  [[[PASSAGE[4], 4], [PASSAGE[5], 5]], empty(), lab("④", "What is this doing?")],
];
W.push(table(rows.map(([paras, l, r]) => new TableRow({ cantSplit: true, children: [l, mid(paras), r] })), [SIDE, MID, SIDE]));
W.push(brk());
W.push(P("Find a line", { bold: true, size: 12, color: DEEP, after: 40 }));
[["… that shows you something about how Christopher thinks."], ["… that shows you something about what he notices, and what he does not."], ["… that shows you something about how he feels, without saying it."]].forEach(([t]) => {
  W.push(P([{ text: "Find a line ", bold: true, size: 10.5, color: DEEP }, { text: t, size: 10.5 }], { before: 120, after: 20, keepNext: true }));
  W.push(P([{ text: "The line:", bold: true, size: 8.5, color: MUTED }], { after: 0, keepNext: true })); W.push(...lines(2));
  W.push(P([{ text: "What it shows:", bold: true, size: 8.5, color: MUTED }], { before: 60, after: 0, keepNext: true })); W.push(...lines(2));
});
W.push(P([{ text: "Panel talk. ", bold: true, size: 10, color: DEEP }, { text: "Groups of four. Someone reads. What happens, how is it written, what does it show. Every turn starts with “Yes, and …” or a question to the last speaker.", size: 10 }], { before: 200, after: 60 }));
W.push(P("The one thing our table would tell the class, and the words that back it up:", { bold: true, size: 10, color: DEEP, before: 60, after: 20, keepNext: true }));
W.push(...lines(3));

/* ---------- LESSON PLAN (house lesson table) ---------- */
const PURPLE = "70243C", GOLD = "FFC000";
const ROW = { engage: { fill: "C5E0B4", ink: "375623" }, develop: { fill: "FBD5D5", ink: "9C0006" }, apply: { fill: "BDD7EE", ink: "1F4E79" }, review: { fill: "FFF2CC", ink: "7F6000" } };
const LABEL = 2300;
const lrow = (label, content, tone) => new TableRow({ children: [
  cell([P([{ text: label, bold: true, color: tone ? tone.ink : undefined }], { size: 11, after: 0 })], LABEL, { fill: tone && tone.fill, valign: VerticalAlign.TOP }),
  cell(content, CONTENT - LABEL, { fill: tone && tone.fill }),
] });
const lp = (t, o = {}) => P(t, { size: 11, after: 40, ...o });
const L = {
  ws: [ "Passage panel practice worksheet", `${SITE}files/${encodeURIComponent(WS_NAME)}` ],
  talk: [ "Table talk · Session 3", `${SITE}wagoll.html#session-3` ],
  prompts: [ "Prompts page · Session 3", `${SITE}index.html#session-3` ],
  vocab: [ "My glossary", `${SITE}glossary.html` ],
};
const LP = [];
LP.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Speaking Folio 3a - Passage panel practice", size: 34, font, color: "1F1F1F" })] }));
LP.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: "Year 9 English · Speaking and Listening Folio", size: 18, font, color: "666666" })] }));
LP.push(table([
  new TableRow({ tableHeader: true, children: [
    cell(P([{ text: "Reading The Curious Incident of the Dog in the Night-Time", bold: true, color: GOLD }], { size: 11, align: AlignmentType.CENTER, after: 0 }), LABEL, { fill: PURPLE, valign: VerticalAlign.CENTER }),
    cell(P([{ text: "Speaking Folio 3a - Passage panel practice", bold: true, color: GOLD }], { size: 11, align: AlignmentType.CENTER, after: 0 }), CONTENT - LABEL, { fill: PURPLE, valign: VerticalAlign.CENTER }),
  ] }),
  lrow("Learning intention", [B("To use active listening skills"), B("To share my interpretations, ideas and opinions in a group discussion")]),
  lrow("I will be successful when:", [lp("I can say what a marked line is doing"), lp("I can find a line myself and say what it shows"), lp("I can build on what the last speaker said with “Yes, and …”", { after: 0 })]),
  lrow("Engage", [P([{ text: "Silent starter:", bold: true, color: ROW.engage.ink }, { text: " worksheet out. Read the passage. Label ①." }], { size: 11, after: 40 }), B("Three labels on the board.")], ROW.engage),
  lrow("Develop and Discover", [
    lp("Task 1 · Table talk", { bold: true }),
    B([{ text: "Open " }, { link: L.talk }, { text: ", level 7, then level 9. Click through, mark each line." }]),
    B("Discuss the difference: at 9 the observation gets taken further, and the turn is handed on."),
    lp("Task 2 · Marked lines", { bold: true, before: 60 }),
    B("② to ④ in pairs: what is each line doing?"),
    B("Page 2: find your own three lines. Copy the line, say what it shows."),
  ], ROW.develop),
  lrow("Apply", [
    B("Groups of four. Panel the passage: someone reads, the three questions in order, every turn starts with “Yes, and …” or a question."),
    B("Write the one thing to tell the class and the words that back it up."),
    B("Teacher circulates: listen for the “yes, and” and the turn handed by name."),
  ], ROW.apply),
  lrow("Review and reflect:", [B("Each table says its one thing to the class."), B("Collect sheets.")], ROW.review),
  lrow("You will need", [B([{ link: L.ws }, { text: ", one per student." }]), B([{ text: "TV: " }, { link: L.talk }, { text: "." }]), B([{ text: "Words: " }, { link: L.vocab }, { text: " (elaborate, evidence, turn-taking)." }]), B("Novel, Chapter 2.")]),
], [LABEL, CONTENT - LABEL]));

Packer.toBuffer(docOf("Passage panel practice worksheet", W)).then(b => { writeFileSync(path.join(outDir, WS_NAME), b); console.log("worksheet", b.length); });
Packer.toBuffer(docOf("Passage panel practice lesson plan", LP)).then(b => { writeFileSync(path.join(outDir, LP_NAME), b); console.log("lesson", b.length); });
