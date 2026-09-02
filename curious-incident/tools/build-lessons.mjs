/* Build the three folio lesson plans as separate Word documents, in the
   house lesson format (the OneNote page shape): purple header row, then
   Learning intention, I will be successful when, Engage (green), Develop
   and Discover (pink), Apply (blue), Review and reflect (yellow), You will
   need. Every resource is a live hyperlink.

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

/* ---------- the three lessons ---------- */
const lessons = [
  {
    file: "Curious Incident Speaking Folio - Lesson 1 - Personal Response.docx",
    title: "Speaking Folio 1 - Personal response",
    li: ["To give a personal response to a quote and back it with a reason from the words on the page",
         "To link an idea to what someone else at the table said, by name",
         "To ask a question that gets a reason out of someone"],
    sc: ["I can say how a quote hit me and why, using words from the quote (Interacting 7)",
         "I can answer a named person: agree, add, or see it differently, because … (Interacting 7)",
         "I can ask what someone meant, or say back what they implied and check it (Listening 5, 8)",
         "I can notice who has not spoken and bring them in (Interacting 10)"],
    engage: [P([{ b: "Silent starter:", color: ROW.engage.ink }, " groups to their starting tables (board, or display mode on the ", { link: L.prompts(1) }, "). Folios open at Session 1."]),
             P(["Session 1 passage on the screen (the faces passage). Read it. Each student writes one feeling and one ", { b: "because" }, " in the margin of the folio."]),
             P(["Three students share. Write the three on the board with the because underlined. That underlined part is the lesson."])],
    develop: [...task("Task 1 · Table talk", [
                ["Open ", { link: L.talk(1) }, " on the TV. Level 7. Click through the first four lines, marking each one. Ask what is missing. (Reasons. Links. Nobody asks anything.)"],
                ["Level 9. Stop on B's ", { i: "So you're reading it as him rejecting her?" }, " (Listening 8) and A's ", { i: "I'd find that easier" }, " (Interacting 7). Say the names of the moves as the rubric rows light up."],
                ["Level 11, two lines only: B's ", { i: "So you're saying …" }, " and the last line, where B changes their mind out loud. This is what above 9 sounds like."],
              ]),
              ...task("Task 2 · Model Table 1", [
                ["Ninety seconds with one group on the Table 1 quote. Play the level 7 student: ", { i: "I think it's sad." }, " Ask which rubric row that lands in and why it is only level 5. Then play it at 9."],
                ["Everyone else: sentence starters on the ", { link: L.prompts(1) }, ". Pick two you will use today."],
              ])],
    apply: [P([{ b: "Six rotations." }, " Display mode on the ", { link: L.prompts(1) }, ": five minutes talk, the bell, two minutes writing in the row for that table, groups move up one table."]),
            B(["You are at Table 1 with the front page of each folio in that group. Record the level per strand and the words you heard. ", { link: L.tTable1 }]),
            B(["Intervene only to hand a turn to someone who has not spoken."]),
            P([{ b: "Early finishers:" }, " find a second quote in the same chapter that says the same thing a different way, and say which one Haddon needed."], { before: 60 }),
            P([{ b: "Working above:" }, " the spare prompts on the prompts page as a seventh table."])],
    review: [P(["Two tables read out the one thing someone said that changed or confirmed what they think. Ask the class which rubric row it lands in (", { link: L.rubric }, ")."]),
             P(["Collect folios if the front page is being scored today."])],
    need: [B([{ link: L.folio }, ": one per student, printed landscape and double-sided. ", { link: L.tBooklet }]),
           B(["Groups made on the ", { link: L.groups }, " on the classroom computer, before the lesson. ", { link: L.tGroups }]),
           B(["Screen: ", { link: L.prompts(1) }, " in display mode, and ", { link: L.talk(1) }, ". ", { link: L.tScreen }]),
           B(["Novel open at the chapters for Session 1 (page numbers on the board)."]),
           B(["Full run sheet: ", { link: L.tRun }, " · ", { link: L.planner }])],
  },
  {
    file: "Curious Incident Speaking Folio - Lesson 2 - I Couldn't Disagree More.docx",
    title: "Speaking Folio 2 - I couldn't disagree more",
    li: ["To take a side and give a reason from the book",
         "To quote the other person's exact words back before answering them",
         "To reframe a statement, concede a point, and keep the argument"],
    sc: ["I can say which side I am on and give a reason from the book in the same sentence (Interacting 5)",
         "I can repeat the other person's words before I answer them (Listening 9)",
         "I can show a statement means two different things, or ask what would count as evidence (Listening 8, 10)",
         "I can give ground on the part that is true and keep the rest (Interacting 9)",
         "As Reader I can read the statement clearly and run the talk without taking a side (Presenting 6, Interacting 8)"],
    engage: [P([{ b: "Silent starter:", color: ROW.engage.ink }, " groups to their starting tables, folios open at Session 2. On the board: ", { i: "Homework should be banned." }, " Each student writes one reason for and one against."]),
             P(["Thirty seconds each side, whole class, no book needed. Stop it. Ask what anyone did while the other side spoke. (Waited to talk.)"])],
    develop: [...task("Task 1 · Table talk", [
                ["Open ", { link: L.talk(2) }, ". Level 7. Click through, marking each line. Ask what A did when B disagreed. (Repeated themselves, louder. Nothing lands in the Listening row.)"],
                ["Level 9. Stop on ", { i: "Do you mean good father overall, or good at the daily stuff?" }, " (Listening 8: reframe). Stop on ", { i: "You said one lie" }, " (Listening 9: quote back). Stop on ", { i: "Fair. Good at the daily stuff" }, " (Interacting 9: concede, and keep the rest)."],
                ["Level 11, two lines: ", { i: "what would actually count as evidence?" }, " and ", { i: "'Carer or liar' is saying he can only be one." }, " The argument is about the evidence, not the volume."],
              ]),
              ...task("Task 2 · The Reader role", [
                ["Explain it once: the Reader reads the statement, asks both sides, chooses who speaks, checks who moved, never argues. Rotates every table."],
                ["Be the Reader at Table 1 for one group for ninety seconds. Ask a student to quote another back before answering. Concede something yourself, out loud."],
              ])],
    apply: [P([{ b: "Six rotations" }, " on the six statements. Display mode on the ", { link: L.prompts(2) }, ". Reader changes every table."]),
            B(["At Table 1: record the level per strand and the words you heard. Listen for the quote-back and the concession. ", { link: L.tTable1 }]),
            P([{ b: "Early finishers:" }, " write the statement the table would have argued about more, and one reason each side."], { before: 60 }),
            P([{ b: "Working above:" }, " the spare statements on the prompts page, or ", { i: "whose side does the novel take?" }])],
    review: [P(["Each table: who moved, and what moved them. The moving is the evidence."]), P(["Collect folios."])],
    need: [B([{ link: L.folio }, " (students keep the same booklet all unit). ", { link: L.tBooklet }]),
           B(["Groups: Session 2 tab on the ", { link: L.groups }, ", already made. Decide who is Reader first at each table."]),
           B(["Screen: ", { link: L.prompts(2) }, " in display mode, and ", { link: L.talk(2) }, ". ", { link: L.tScreen }]),
           B(["Novel open past the confession and the letters."]),
           B([{ link: L.tRun }, " · ", { link: L.planner }])],
  },
  {
    file: "Curious Incident Speaking Folio - Lesson 3 - Passage Analysis Panel.docx",
    title: "Speaking Folio 3 - Passage analysis panel",
    li: ["To locate a writing feature in the words on the page",
         "To say 'yes, and', and take another person's point further",
         "To give and take turns by name, and present one clear sentence to the class"],
    sc: ["I can name a feature and quote the words it lives in (Interacting 7)",
         "I can accept what was just said and add the next piece (Listening 11)",
         "I can take someone else's point further: an example, a consequence, a sharper word (Listening 11, 12)",
         "I can hand a turn to someone by name, and go back to a dropped idea (Interacting 10)",
         "I can say our one thing to the class in one clear sentence (Presenting 8)"],
    engage: [P([{ b: "Silent starter:", color: ROW.engage.ink }, " groups to their starting tables, folios open at Session 3, novel open at the passage for their first table."]),
             P(["First page of the novel on the screen. Read it aloud. The three panel questions in order: ", { b: "what happens, how is it written, what does it show." }, " One answer each, no discussion yet."])],
    develop: [...task("Task 1 · Table talk", [
                ["Open ", { link: L.talk(3) }, ". Level 7. Click through, marking. Ask where the good observation (", { i: "7 minutes after midnight" }, ") went. (Nowhere. Nobody took it further.)"],
                ["Level 9. Stop on ", { i: "Calm how? What makes it calm?" }, " (Listening 7: make the other person say more). Stop on ", { i: "Yes, and there are no feeling words at all" }, " (Interacting 7: yes, and). Stop on ", { i: "Do we pick one?" }, " (Listening 8: summarise and hand the choice over)."],
                ["Level 11, two lines: ", { i: "he keeps counting" }, " and the link to the station. Linking across the book is Listening 11."],
              ]),
              ...task("Task 2 · One-minute drill", [
                ["In groups, on the opening: each person must start with ", { i: "Yes, and" }, " or a question to the previous speaker. Anyone who starts with ", { i: "but" }, " starts again."],
                ["Panel one passage with a volunteer group at Table 1: you read, you hand the first turn by name, you elaborate once on a student's point and say that you are doing it."],
              ])],
    apply: [P([{ b: "Six rotations" }, " on the six passages. Display mode on the ", { link: L.prompts(3) }, ". Someone reads, everyone follows in the book, three questions, everyone points at a word, one thing agreed in the last minute."]),
            B(["At Table 1: record the level per strand and the words you heard. Listen for the feature located in words, the ", { i: "yes, and" }, ", and the turn handed by name. ", { link: L.tTable1 }]),
            P([{ b: "Early finishers:" }, " find the same feature in a second passage and say whether it does the same job."], { before: 60 }),
            P([{ b: "Working above:" }, " the spare passages (the Monty Hall chapter, the ending) as a seventh table."])],
    review: [P(["Each table gives its one thing to the class in one sentence. Presenting evidence: who says it and how."]),
             P(["Collect folios: the front page is complete after this session. Score against the ", { link: L.rubric }, "."])],
    need: [B([{ link: L.folio }, ". ", { link: L.tBooklet }]),
           B(["Groups: Session 3 tab on the ", { link: L.groups }, "."]),
           B(["Screen: ", { link: L.prompts(3) }, " in display mode, and ", { link: L.talk(3) }, ". ", { link: L.tScreen }]),
           B(["Novel with the six passages marked; page numbers on the board. Table 6 covers several chapters, choose one page."]),
           B([{ link: L.tRun }, " · ", { link: L.planner }])],
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
