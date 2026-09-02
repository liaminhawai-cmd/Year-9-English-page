/* Build the teacher lesson plans (Word) for the three folio sessions, in the
   school's format: a Kew High School Unit Planner page (unit overview, unit
   sequence, learning continuum), then one lesson table per session in the
   house lesson shape (learning intention, success criteria, Engage, Develop
   and Discover, Apply, Explore and extend, Review and reflect, You will need).

   node tools/build-lessons.mjs [output.docx]
   Reads prompts.js. Everything the student pages and booklet leave out is here. */

import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const FOLIO = require("../prompts.js");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak, LevelFormat, AlignmentType, VerticalAlign, PageOrientation } = require("docx");

const out = process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), "Curious Incident Speaking Folio - Lesson Plans.docx");
const SITE = "https://liaminhawai-cmd.github.io/Year-9-English-page/curious-incident/";

const DEEP = "22304A", BAND = "F4EFE4", LINE = "C9BFAE", MUTED = "645D52", GOLD_SOFT = "F6E7C2";
const font = "Calibri";
const thin = { style: BorderStyle.SINGLE, size: 4, color: LINE }; const box = { top: thin, bottom: thin, left: thin, right: thin };
const shade = fill => ({ type: ShadingType.CLEAR, color: "auto", fill });
const P = (text, o = {}) => new Paragraph({ spacing: { before: o.before ?? 0, after: o.after ?? 60 }, keepNext: o.keepNext, border: o.border, alignment: o.align,
  children: (Array.isArray(text) ? text : [{ text }]).map(r => new TextRun({ text: r.text, bold: r.bold ?? o.bold, italics: r.italics ?? o.italics, size: (r.size ?? o.size ?? 10) * 2, color: r.color ?? o.color, font })) });
const H1 = t => P(t, { bold: true, size: 16, color: DEEP, before: 0, after: 120, keepNext: true, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: DEEP, space: 2 } } });
const H2 = t => P(t, { bold: true, size: 11.5, color: DEEP, before: 160, after: 50, keepNext: true });
const bullets = (items, size = 9.5) => items.map(t => new Paragraph({ numbering: { reference: "bul", level: 0 }, spacing: { after: 30 }, children: [new TextRun({ text: t, size: size * 2, font })] }));
const cell = (children, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: box, shading: o.fill ? shade(o.fill) : undefined, verticalAlign: o.valign, margins: { top: 60, bottom: 60, left: 90, right: 90 }, children: Array.isArray(children) ? children : [children] });
const table = (rows, widths) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows });
const brk = () => new Paragraph({ children: [new PageBreak()] });
const C = FOLIO.continuum;

/* ---------- page geometry: portrait for lessons ---------- */
const CONTENT = 9638;

/* ================= UNIT PLANNER ================= */
const U = [];
U.push(P("Kew High School Unit Planner", { bold: true, size: 16, color: DEEP, after: 20 }));
U.push(P("Year 9 English", { size: 10, color: MUTED, after: 120 }));
U.push(P("Unit overview:", { bold: true, size: 11, after: 40 }));
const ovW = [2600, CONTENT - 2600];
const ov = [
  ["Name of Unit", "Speaking and Listening Folio: The Curious Incident of the Dog in the Night-Time"],
  ["Strand of Victorian Curriculum 2.0", "English: Literacy, Interacting with others (VC2E9LY01, VC2E9LY02). Literature: Examining literature (responding to and discussing a novel)."],
  ["Capabilities assessed", "Personal and Social Capability: collaboration, respectful disagreement, inclusive language."],
  ["Duration", "Three sessions across the text study (about weeks 2, 4 and 6 of the novel). One period each."],
  ["New key vocabulary", "personal response, justify, evidence, clarify, paraphrase, infer, imply, concede, reframe, elaborate, register, turn-taking, metalanguage, literal, precise, chatting"],
  ["Unit assessments", "Speaking and Listening Folio. Table 1 (teacher table): each group is observed once per session and recorded on the folio front page against the continuum. Session pages: what the table said, in the student's words, as Listening evidence. Presenting evidence from reading the statement (Session 2) and the share-back (Session 3)."],
];
U.push(table(ov.map(([k, v]) => new TableRow({ children: [cell(P(k, { bold: true, size: 9.5, after: 0 }), ovW[0], { fill: BAND }), cell(P(v, { size: 9.5, after: 0 }), ovW[1])] })), ovW));
U.push(P("", { after: 100 }));
U.push(P("Unit sequence:", { bold: true, size: 11, after: 40 }));
const sqW = [1500, 3600, CONTENT - 5100];
const seqRows = [
  ["Session 1\nPersonal response", ["We are learning to give a personal response to a quote with a reason.", "We are learning to link our idea to what someone else at the table said.", "We are learning to ask a question that gets a reason out of someone."],
    ["Pre-teach with Table talk (Session 1) at level 7, then 9, then two lines of 11.", "Six rotations: one quote per table, five minutes of talk, two minutes writing.", "Table 1: teacher observation, recorded on the folio front page.", "Close: two tables read out the one thing that changed someone's mind."]],
  ["Session 2\nI couldn't disagree more", ["We are learning to take a side and give a reason from the book.", "We are learning to quote the other person's words back before answering them.", "We are learning to reframe a statement, concede a point and keep our argument."],
    ["Throwaway statement, then Table talk (Session 2) at 7, 9 and two lines of 11.", "Reader role: reads, runs the talk, takes no side, rotates every table.", "Six rotations on six statements about the novel.", "Close: who moved, and what moved them."]],
  ["Session 3\nPassage analysis panel", ["We are learning to locate a writing feature in the words on the page.", "We are learning to say 'yes, and', and to take another person's point further.", "We are learning to give and take turns by name, and to present one clear sentence to the class."],
    ["Panel the opening on the screen with the three questions: what happens, how is it written, what does it show.", "Table talk (Session 3) at 7, 9 and 11.", "Six rotations on six passages.", "Close: each table's one thing to the class. Presenting evidence."]],
];
U.push(table([
  new TableRow({ tableHeader: true, children: ["Session", "Learning intentions", "Common learning activities and assessments"].map((t, i) => cell(P(t, { bold: true, size: 9.5, after: 0 }), sqW[i], { fill: BAND })) }),
  ...seqRows.map(([s, li, acts]) => new TableRow({ children: [
    cell(s.split("\n").map((t, i) => P(t, { bold: i === 0, size: 9.5, after: 0 })), sqW[0]),
    cell(bullets(li, 9), sqW[1]),
    cell(bullets(acts, 9), sqW[2]),
  ] })),
], sqW));
U.push(P("", { after: 100 }));
U.push(P("Learning Continuum:", { bold: true, size: 11, after: 40 }));
const lvW = Math.floor((CONTENT - 1100) / C.levels.length);
U.push(table([
  new TableRow({ tableHeader: true, children: [cell(P("Relevant curriculum strand", { bold: true, size: 8, after: 0 }), 1100, { fill: BAND }), ...C.levels.map(lv => cell(P(String(lv), { bold: true, size: 9, after: 0, align: AlignmentType.CENTER }), lvW, { fill: lv === C.expected ? GOLD_SOFT : BAND }))] }),
  ...C.strands.map(s => new TableRow({ children: [cell(P(s.name, { bold: true, size: 8.5, after: 0 }), 1100, { fill: BAND, valign: VerticalAlign.CENTER }), ...C.levels.map(lv => cell(P(s.levels[lv] || "", { size: 6.5, after: 0, italics: !!(s.extension && s.extension.includes(lv)) }), lvW, { fill: lv === C.expected && s.levels[lv] ? GOLD_SOFT : undefined }))] })),
], [1100, ...C.levels.map(() => lvW)]));
U.push(P("Level 9 is the Year 9 expected level. Listening 10 to 12 (italics) are the draft extension, written against the VCE English study design.", { size: 8, color: MUTED, before: 40 }));
U.push(P("VC Capabilities: Personal and Social Capability, Social awareness and management: collaboration.", { size: 8, color: MUTED }));

/* ================= LESSONS ================= */
const lessonTable = rows => table(rows.map(([k, v]) => new TableRow({ children: [
  cell(P(k, { bold: true, size: 9.5, after: 0 }), 2200, { fill: BAND, valign: VerticalAlign.TOP }),
  cell(Array.isArray(v) ? v : [P(v, { size: 9.5, after: 0 })], CONTENT - 2200),
] })), [2200, CONTENT - 2200]);
const paras = items => items.map((t, i) => P(t, { size: 9.5, after: i === items.length - 1 ? 0 : 50 }));
const timed = items => items.map((t, i) => P([{ text: t[0] + "  ", bold: true, color: DEEP, size: 9 }, { text: t[1] }], { size: 9.5, after: i === items.length - 1 ? 0 : 50 }));

const lessons = [
  {
    title: "Session 1 · Personal response",
    li: ["We are learning to give a personal response to a quote and back it with a reason.", "We are learning to link our idea to what someone else at the table said, by name.", "We are learning to ask a question that gets a reason out of someone."],
    sc: ["I can say how a quote hit me and why, using words from the quote. (Interacting 7)", "I can answer a named person: agree, add, or see it differently, because … (Interacting 7)", "I can ask what someone meant, or say back what they implied and check it. (Listening 5, 8)", "I can notice who hasn't spoken and bring them in. (Interacting 10)"],
    engage: [["0–5", "Groups to their starting tables, folios open at Session 1. Say what the folio is and where the teacher sits."], ["5–10", "The 'faces' passage on the screen. Read it. Ask for a feeling and a because from three students. Write the three on the board with the because underlined. That underlined part is the lesson."]],
    develop: [["10–17", `Table talk, Session 1, level 7 (${SITE}wagoll.html). Click through the first four lines, marking each. Ask what is missing. (Reasons. Links. Nobody asks anything.)`], ["", "Level 9. Mark B's 'So you're reading it as him rejecting her?' (Listening 8) and A's 'I'd find that easier' (Interacting 7). Say the names of the moves as the rubric rows light up."], ["", "Level 11, two lines only: B's 'So you're saying …' and the last line where B changes their mind out loud. This is what above 9 sounds like."], ["17–20", "Model at Table 1 with one group for ninety seconds on the Table 1 quote. Play the level 7 student: 'I think it's sad.' Ask which rubric row that lands in and why it is only level 5. Then play it at 9."]],
    apply: [["20–62", "Six rotations. Display mode on the prompts page, five minutes talk, the bell, two minutes writing in the row for that table, move up one table."], ["", "You are at Table 1 with the front page of each folio in that group. Record the level per strand and the words you heard. Intervene only to hand a turn to someone who has not spoken."]],
    extend: ["A table that finishes early: find a second quote in the same chapter that says the same thing a different way, and say which one Haddon needed.", "Working above: use the spare prompts on the prompts page as a seventh table."],
    review: [["62–70", "Two tables read out the one thing someone said that changed or confirmed what they think. Ask the class which rubric row it lands in. Collect folios if the front page is being scored today."]],
    need: ["PowerPoint: none. Screen: prompts page in display mode; Table talk on Session 1.", "Handouts: the folio (Word, resources folder), one per student. Novel open at the chapters for Session 1.", "Groups made on the shuffler and on the board, or typed by hand."],
    listen: ["A feeling with a because, from the words on the table.", "A question that gets a reason out of someone.", "Someone named and answered.", "Who notices the quiet one."],
  },
  {
    title: "Session 2 · I couldn't disagree more",
    li: ["We are learning to take a side and give a reason from the book.", "We are learning to quote the other person's exact words back before we answer them.", "We are learning to reframe a statement, concede a point, and keep our argument."],
    sc: ["I can say which side I am on and give a reason from the book in the same sentence. (Interacting 5)", "I can repeat the other person's words before I answer them. (Listening 9)", "I can show a statement means two different things, or ask what would count as evidence. (Listening 8, 10)", "I can give ground on the part that is true and keep the rest. (Interacting 9)", "As Reader I can read the statement clearly and run the talk without taking a side. (Presenting 6, Interacting 8)"],
    engage: [["0–5", "Groups to their starting tables, folios open at Session 2."], ["5–8", "Throwaway statement on the board: 'Homework should be banned.' Thirty seconds each side, no book needed. Stop it. Ask what anyone did when the other side spoke. (Waited to talk.)"]],
    develop: [["8–17", "Table talk, Session 2, level 7. Click through, marking each line. Ask what A did when B disagreed. (Repeated themselves, louder. Nothing lands in the Listening row.)"], ["", "Level 9. Stop on 'Do you mean good father overall, or good at the daily stuff?' (Listening 8: reframe). Stop on 'You said one lie' (Listening 9: quote back). Stop on 'Fair. Good at the daily stuff' (Interacting 9: concede, and keep the rest)."], ["", "Level 11, two lines: 'what would actually count as evidence?' and ''Carer or liar' is saying he can only be one.' The argument is about the evidence, not the volume."], ["", "Explain the Reader role once: reads, asks both sides, chooses who speaks, checks who moved, never argues. Rotates every table."], ["17–20", "Be the Reader at Table 1 for one group for ninety seconds. Ask a student to quote another back before answering. Concede something yourself, out loud."]],
    apply: [["20–62", "Six rotations on the six statements. Reader changes every table."], ["", "At Table 1: record the level per strand and the words you heard. Listen for the quote-back and the concession."]],
    extend: ["Early finishers: write the statement the table would have argued about more, and one reason each side.", "Working above: the spare statements on the prompts page, or the question 'whose side does the novel take?'"],
    review: [["62–70", "Each table: who moved, and what moved them. The moving is the evidence. Collect folios."]],
    need: ["Screen: prompts page in display mode on Session 2; Table talk on Session 2 (add ?session=2 to the address).", "Handouts: folios, novel open past the confession and the letters.", "Decide who is Reader first at each table."],
    listen: ["A side with a reason from the book.", "The opponent's exact words repeated before the answer.", "A reframe the table then uses.", "A concession that keeps the argument alive.", "The Reader running it without taking a side."],
  },
  {
    title: "Session 3 · Passage analysis panel",
    li: ["We are learning to locate a writing feature in the words on the page.", "We are learning to say 'yes, and', and to take another person's point further.", "We are learning to give and take turns by name, and to present one clear sentence to the class."],
    sc: ["I can name a feature and quote the words it lives in. (Interacting 7)", "I can accept what was just said and add the next piece. (Listening 11)", "I can take someone else's point further: an example, a consequence, a sharper word. (Listening 11, 12)", "I can hand a turn to someone by name, and go back to a dropped idea. (Interacting 10)", "I can say our one thing to the class in one clear sentence. (Presenting 8)"],
    engage: [["0–5", "Groups to their starting tables, folios open at Session 3, novel open at the passage for their first table."], ["5–10", "First page of the novel on the screen. Read it aloud. Ask the three panel questions in order: what happens, how is it written, what does it show. One answer each, no discussion yet."]],
    develop: [["10–17", "Table talk, Session 3, level 7. Click through, marking. Ask where the good observation ('7 minutes after midnight') went. (Nowhere. Nobody took it further.)"], ["", "Level 9. Stop on 'Calm how? What makes it calm?' (Listening 7: make the other person say more). Stop on 'Yes, and there are no feeling words at all' (Interacting 7: yes, and). Stop on 'Do we pick one?' (Listening 8: summarise and hand the choice over)."], ["", "Level 11, two lines: 'he keeps counting' and the link to the station. Linking across the book is Listening 11."], ["", "One-minute drill in groups on the opening: each person must start with 'Yes, and' or a question to the previous speaker. Anyone who starts with 'but' starts again."], ["17–20", "Panel one passage with a volunteer group at Table 1: you read, you hand the first turn by name, you elaborate once on a student's point and say that you are doing it."]],
    apply: [["20–62", "Six rotations on the six passages. Someone reads, everyone follows in the book, three questions, everyone points at a word, one thing agreed in the last minute."], ["", "At Table 1: record the level per strand and the words you heard. Listen for the feature located in words, the 'yes, and', and the turn handed by name."]],
    extend: ["Early finishers: find the same feature in a second passage and say whether it does the same job.", "Working above: the spare passages (the Monty Hall chapter, the ending) as a seventh table."],
    review: [["62–70", "Each table gives its one thing to the class in one sentence. Presenting evidence: who says it and how. Collect folios: the front page is complete after this session."]],
    need: ["Screen: prompts page in display mode on Session 3; Table talk on Session 3 (?session=3).", "Handouts: folios, novel with the six passages marked. Table 6 covers several chapters; choose one page.", "Passages checked against the class edition, page numbers on the board."],
    listen: ["A feature located in words on the page.", "'Yes, and' that adds.", "Someone's point taken further by someone else.", "Turns given by name; the first speaker returned to.", "One clear sentence for the class."],
  },
];

const L = [];
lessons.forEach((l, i) => {
  L.push(P("Year 9 English · The Curious Incident of the Dog in the Night-Time · Speaking and Listening Folio", { size: 8, bold: true, color: MUTED, after: 30 }));
  L.push(H1(l.title));
  L.push(lessonTable([
    ["Learning intention(s)", bullets(l.li, 9.5)],
    ["I will be successful when:", bullets(l.sc, 9.5)],
    ["Engage", timed(l.engage)],
    ["Develop and Discover", timed(l.develop)],
    ["Apply", timed(l.apply)],
    ["Explore and extend", paras(l.extend)],
    ["Review and reflect:", timed(l.review)],
    ["You will need", paras(l.need)],
    ["Listen for at Table 1", bullets(l.listen, 9.5)],
  ]));
  L.push(brk());
});

/* ================= APPENDIX ================= */
const A = [];
A.push(H1("Running the folio"));
A.push(H2("How a session runs"));
A.push(...bullets(FOLIO.run));
A.push(H2("Assessment"));
A.push(...bullets([
  "Table 1 is the observation point. One group per rotation, so every student is heard once per session. Record on the front page: level per strand and the words you heard.",
  "The session pages are the student's Listening evidence: what the table said, in their words.",
  `Year 9 expected is level ${C.expected}. Listening 10 to 12 are the draft extension for students working above.`,
  "Presenting evidence comes from Session 2 (reading the statement and running the talk) and Session 3 (the share-back).",
  "Timings assume a 70-minute period. Trim by cutting rotations to six minutes, not by cutting Develop and Discover.",
]));
A.push(H2("What is on the screen"));
A.push(...bullets([
  `Prompts and timer: ${SITE}index.html. Display mode gives the six prompts, the rotation counter and the 5 + 2 timer. Groups made on the shuffler on the same device show at each table.`,
  `Table talk: ${SITE}wagoll.html. Two speakers, one line at a time; Next shows a line, Next again marks it against the three rubric rows. Level control from not working through 7 to 11. Add ?session=2 or ?session=3.`,
  `Rubric: ${SITE}rubric.html. The continuum only.`,
  `Groups: ${SITE}groups.html. Paste the class list once; groups for all three sessions with different company each time. Everyone visits every table.`,
]));
A.push(H2("EAL and support"));
A.push(...bullets([
  "Pre-teach the sentence starters as a script before Session 1: say each one aloud, students repeat, then use one on a throwaway prompt.",
  "Seat EAL students so the Reader role in Session 2 comes to them at a table they have heard once already.",
  "Allow a minute of first-language planning before the go-round at each table. The talk is in English.",
  "Let a student write the table's ideas as dot points rather than sentences. The evidence is that they heard, not that they wrote prose.",
  "Table talk at level 7 is the model for students who need the smallest version of a move first.",
]));
A.push(H2("The prompts"));
FOLIO.sessions.forEach(s => {
  A.push(P(`Session ${s.n} · ${s.title}`, { bold: true, size: 10, color: DEEP, before: 100, after: 30, keepNext: true }));
  const pW = [900, 4600, CONTENT - 5500];
  A.push(table([
    new TableRow({ tableHeader: true, children: ["Table", "Prompt", "Talk questions"].map((t, i) => cell(P(t, { bold: true, size: 8, after: 0 }), pW[i], { fill: BAND })) }),
    ...s.stations.map(st => new TableRow({ children: [
      cell(P(`${st.n}${st.teacher ? " (teacher)" : ""}`, { size: 9, after: 0 }), pW[0]),
      cell([P(st.quote, { size: 8.5, after: st.source ? 20 : 0 }), ...(st.source ? [P(st.source, { size: 7.5, color: MUTED, after: 0 })] : [])], pW[1]),
      cell(st.talk.map((t, k) => P(t, { size: 8, after: k === st.talk.length - 1 ? 0 : 20 })), pW[2]),
    ] })),
  ], pW));
  if (s.spare && s.spare.length) A.push(P("Spare: " + s.spare.map(p => p.quote + (p.source ? ` (${p.source})` : "")).join(" · "), { size: 8, color: MUTED, before: 30 }));
});

const doc = new Document({
  creator: "", lastModifiedBy: "", title: "Curious Incident Speaking Folio · lesson plans",
  styles: { default: { document: { run: { font, size: 20 } } } },
  numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 300, hanging: 200 } } } }] }] },
  sections: [
    { properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 900, left: 1134, right: 1134 } } }, children: [...U] },
    { properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 900, left: 1134, right: 1134 } } }, children: [...L, ...A] },
  ],
});
Packer.toBuffer(doc).then(buf => { writeFileSync(out, buf); console.log("wrote", out, buf.length, "bytes"); });
