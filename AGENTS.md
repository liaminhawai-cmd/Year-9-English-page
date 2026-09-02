# Read this first (AI assistants)

**This repo is PUBLIC and LIVE** once GitHub Pages is switched on: everything on
`main` is on the internet at `liaminhawai-cmd.github.io/Year-9-English-page/`
within a minute or two of pushing. Students will use these pages.

Read `STYLE_GUIDE.md` first: the portable build principles shared across the
teacher's resource repos. The private resources (Word documents, planners,
assessment tasks) live in the `year-9-english` repo; nothing from there is
published here as-is.

## Hard rules for a public, live repo

1. **No student or staff names, ever**: not in code, content, examples,
   commit messages, or file metadata. Worked examples use letters (A, B, C, D),
   never names. The group shuffler keeps names in the viewer's own browser
   (`localStorage`) and nowhere else.
2. **No reproducing copyrighted works.** Short quotes inside original
   teaching commentary are fine (a line from the novel next to a prompt); whole
   passages, chapters or planning documents are not.
3. **Nothing that collects personal data.** No accounts, no tracking, no
   analytics. `localStorage` only, and the page says so honestly.
4. **Teacher-facing controls are cosmetic.** This is a static site; never
   present anything here as access control.

## Core principles

- **No fluff.** No points, streaks, badges, confetti or encouragement banners.
  If a line does not teach, instruct or report a real state, delete it.
- **Teach the rule with the example.** Every model is annotated with the move
  it demonstrates: point at the words, name the pattern, match it to the
  continuum line.
- **Nothing is locked.** Teachers jump around mid-lesson.
- **Colour is a taxonomy.** On the speaking folio the four discussion moves
  own four colours (listen, respond, text, invite) and they mean the same
  thing on every page. Correctness is never carried by colour alone.
- **Say the honest thing.** The shuffler is a good guess, the timer is a
  timer, nothing here judges speech.

## Layout

- `index.html`: hub for the whole site.
- `curious-incident/`: the speaking and listening folio for *The Curious
  Incident of the Dog in the Night-Time*.
  - `prompts.js` is the one source of truth for prompts, starters and the
    continuum. Edit it and every page and the Word booklet follow.
  - `wagoll-content.js` holds the annotated table talk for the WAGOLL wall.
  - `tools/build-folio.mjs` builds the Word booklet
    (`node curious-incident/tools/build-folio.mjs out.docx`, needs `npm i docx`).
- One self-contained page per tool, plain HTML and vanilla JS, no build step,
  no CDNs, no external fonts. Must work offline and on a phone.
