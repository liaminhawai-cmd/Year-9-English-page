/* Build resources.html: the Curious Incident files in the year-9-english
   repo, each a direct link on GitHub. Reads the sibling checkout.
   node tools/build-resources.mjs [path to year-9-english] */
import { execSync } from "node:child_process";
import { writeFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = process.argv[2] || path.join(here, "..", "..", "..", "year-9-english");
const BRANCH = "claude/curious-incident-folio-k6wypq";
const BASE = `https://github.com/liaminhawai-cmd/year-9-english/raw/${BRANCH}/`;
const TREE = `https://github.com/liaminhawai-cmd/year-9-english/tree/${BRANCH}/`;
const files = execSync("git ls-files -z", { cwd: repo, encoding: "utf8" }).split("\0").filter(Boolean)
  .filter(f => !/desktop\.ini$|^tools\/|\.gitignore$|^README|\/Archive\/|Older files\//.test(f));
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const url = f => BASE + f.split("/").map(encodeURIComponent).join("/");
const name = f => f.split("/").pop();
const size = f => { try { const b = statSync(path.join(repo, f)).size; return b > 1e6 ? (b / 1e6).toFixed(1) + " MB" : Math.round(b / 1e3) + " KB"; } catch { return ""; } };
const li = f => `<li><a href="${url(f)}">${esc(name(f))}</a> <span class="sz">${size(f)}</span></li>`;
const Y9 = "English LA - Year 9 English/";
const groups = [
  ["Speaking and Listening Folio", "", f => /Curious Incident Speaking Folio|Curious Incident - Unit Planner/.test(f)],
];
const used = new Set();
const sections = groups.map(([h, sub, test]) => {
  const fs = files.filter(f => !used.has(f) && test(f)); fs.forEach(f => used.add(f));
  if (!fs.length) return "";
  return `<section class="g"><h2>${esc(h)} <small>${fs.length}</small></h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}<ul>${fs.map(li).join("")}</ul></section>`;
}).join("");
const rest = files.filter(f => !used.has(f));
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Every current Year 9 English file, linked.">
<title>Year 9 English · Files</title>
<link rel="stylesheet" href="folio.css?v=3">
<style>
html{font-size:clamp(15px, .5vw + 9px, 24px)}
.sheet{max-width:min(96vw,1900px)}
.cols{columns:3 340px;column-gap:24px}
section.g{break-inside:avoid;margin:0 0 18px}
section.g h2{margin:0 0 2px;font-size:1rem;color:var(--deep)} section.g h2 small{font-weight:600;color:var(--muted);font-size:.75em;margin-left:6px}
section.g .sub{margin:0 0 6px;font-size:.8rem;color:var(--muted)}
section.g ul{margin:0;padding-left:1.1em;font-size:.86rem;line-height:1.45}
section.g li{margin:2px 0}
.sz{font-size:.72rem;color:var(--muted)}
.top{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;margin:12px 0 18px}
.top a.card{display:block;text-decoration:none;color:inherit;padding:10px 12px}
.top a.card b{color:var(--deep)} .top a.card span{display:block;font-size:.8rem;color:var(--muted)}
</style>
</head>
<body>
<div class="sheet">
<header class="mast">
  <div>
    <div class="kicker">Year 9 English</div>
    <h1>Files</h1>
    <p class="read">Word files download; PDFs open. Sign in to GitHub first. Everything else is in the <a href="${TREE}English%20LA%20-%20Year%209%20English">shared folder</a>.</p>
  </div>
  <nav class="site" aria-label="Folio pages">
    <a href="index.html">Prompts</a>
    <a href="wagoll.html">Table talk</a>
    <a href="vocab.html">Vocab</a>
    <a href="rubric.html">Rubric</a>
    <a href="groups.html">Groups</a>
    <a href="teacher.html">Teacher</a>
    <a href="resources.html" aria-current="page">Files</a>
  </nav>
</header>
<div class="top">
  <a class="card" href="${url(Y9 + "Curious Incident Speaking Folio.docx")}"><b>Speaking Folio booklet</b><span>Word · one per student · landscape</span></a>
  <a class="card" href="${url(Y9 + "Curious Incident - Unit Planner.docx")}"><b>Unit planner</b><span>Kew High School Unit Planner · weeks, links, continuum</span></a>
  <a class="card" href="${url(Y9 + "Curious Incident Speaking Folio - Lesson 1 - Personal Response.docx")}"><b>Lesson 1 · Personal response</b><span>Word</span></a>
  <a class="card" href="${url(Y9 + "Curious Incident Speaking Folio - Lesson 2 - I Couldn't Disagree More.docx")}"><b>Lesson 2 · I couldn't disagree more</b><span>Word</span></a>
  <a class="card" href="${url(Y9 + "Curious Incident Speaking Folio - Lesson 3 - Passage Analysis Panel.docx")}"><b>Lesson 3 · Passage analysis panel</b><span>Word</span></a>
</div>
<div class="cols">${sections}</div>
<p class="foot">Built from the repository file list by tools/build-resources.mjs. Rebuild after adding files.</p>
</div>
</body>
</html>
`;
writeFileSync(path.join(here, "..", "resources.html"), html);
console.log("resources.html", files.length, "files,", rest.length, "ungrouped");
