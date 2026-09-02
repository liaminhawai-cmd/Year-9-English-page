/* WAGOLL wall content for the speaking folio.
   Mark-up inside a line: {listen|…} {respond|…} {text|…} {invite|…} {voice|…}
   Speakers are letters, never names. Four seats at every table: A B C D.
   The teacher's voice appears as T only in the Table 1 scene. */

const MOVES = [
  { key: "listen",  glyph: "◐", name: "Listening move",
    what: "A clarifying question, or saying back what you heard before you answer it.",
    strand: "Listening 5 to 9" },
  { key: "respond", glyph: "◆", name: "Respond with a reason",
    what: "Say how it hit you, agree or disagree, and give the reason. Naming who you are answering counts.",
    strand: "Interacting 5 and 7" },
  { key: "text",    glyph: "❝", name: "Point at the words",
    what: "A quote, a word, a line, or 'the bit where'. The evidence lives in the book, not in the vibe.",
    strand: "Interacting 7, Listening 8" },
  { key: "invite",  glyph: "⇢", name: "Bring someone in",
    what: "Inclusive and encouraging language: asking a quiet person, going back to a dropped idea, handing over.",
    strand: "Interacting 10" },
  { key: "voice",   glyph: "♪", name: "Voice and body",
    what: "Written in italics like stage directions. Volume, pace, pausing, looking at the person you answer.",
    strand: "Interacting 8 and 9, Presenting 7 to 11" },
];

/* Three versions of the same five minutes at Station 4 of Session 1.
   Read across for growth. The quote is on the table:
   "I do not tell lies. Mother used to say that this was because I was a good
    person. But it is not because I am a good person. It is because I can't
    tell lies." */
const LEVELS = [
  { band: "Working towards", level: 7,
    lines: [
      ["A", "{voice|reads the quote fast, eyes on the page} Okay so, he doesn't lie. {respond|I think that's good.}"],
      ["B", "{respond|Yeah, same.} Lying's bad."],
      ["C", "{respond|I felt a bit sorry for him} 'cause his mum said he was good and he's like, no I'm not."],
      ["A", "{respond|I agree with C.} {text|He says it's because he can't,} not because he's good."],
      ["D", "…"],
      ["B", "{respond|I reckon it's still good though.} Like, if you never lie, people trust you."],
      ["C", "{listen|Wait, what do you mean by trust?}"],
      ["B", "Like, they know you're not gonna, um, make stuff up."],
      ["A", "{voice|looks at the clock} Are we done?"],
    ],
    proves: {
      listen: "One clarifying question (C), late and not followed up.",
      respond: "Opinions are given ('I think that's good') and two people name who they agree with, but reasons stay at 'lying's bad'. Feelings are expressed once.",
      text: "One pointer at the words (A: 'he says it's because he can't'). Nobody reads the line aloud a second time or asks what 'can't' means.",
      invite: "D never speaks and nobody notices. The talk stops when the ideas run out, at about two minutes.",
      voice: "Reading is rushed and nobody looks up; the register is fine for friends but not adjusted for a discussion." },
  },
  { band: "Expected", level: 9,
    lines: [
      ["A", "{voice|reads the quote slowly, looks up at the end} {respond|My first reaction is that it's a bit sad,} {text|because he's correcting his own mum: 'it is not because I am a good person.'}"],
      ["B", "{respond|I felt the opposite, I found it funny,} {text|the way he splits hairs: good person versus 'can't tell lies'.}"],
      ["C", "{listen|So B, do you mean he's being funny on purpose, or we just find it funny?}"],
      ["B", "Not on purpose. {text|He's dead serious, which is what makes it funny.} And a bit sad, {respond|so I partly agree with A.}"],
      ["D", "{respond|I don't think it's sad.} {text|'I can't tell lies' means he never has to decide.} {respond|Honestly I'd find that easier.}"],
      ["A", "{listen|Can you say more about easier?}"],
      ["D", "Like, we lie to be polite. {text|He'd just say the true thing about your haircut.} No stress."],
      ["C", "{respond|I see it differently, because} the stress just moves to everyone else. {invite|What do you think, B, you've been quiet a sec?}"],
      ["B", "{respond|I think C's right,} {text|and later in the book his honesty is exactly what gets him in trouble with the police.}"],
      ["A", "{invite|So do we agree it's a strength and a problem?} {voice|waits}"],
    ],
    proves: {
      listen: "Two clarifying questions (C, A) that are answered, and B checks back to A's point before disagreeing with it.",
      respond: "Everyone states a feeling or a view with a because. Disagreement is explicit and polite ('I see it differently, because') and people move ('so I partly agree with A').",
      text: "Four separate pointers at the words. The quote is re-read, one phrase is contrasted with another ('good person versus can't tell lies'), and B links it to a later event.",
      invite: "C notices B has dropped out and brings them back. A closes by checking the group's shared view rather than just stopping.",
      voice: "The reader slows down and looks up. A pauses after a question instead of filling the silence." },
  },
  { band: "Above", level: 11,
    lines: [
      ["A", "{voice|reads it twice, second time stressing 'can't'} {respond|It hit me as lonely,} {text|because 'I can't' is the only reason he gives, and the mother's kinder version gets crossed out.}"],
      ["B", "{listen|So you're saying he'd rather be accurate than be thought of as good?}"],
      ["A", "Yes. {text|He'd rather be right about himself than liked.}"],
      ["C", "{respond|I'd push back a bit.} {text|He isn't rejecting 'good'; he just can't accept a reason that isn't true.} {respond|Which is kind of the most honest thing in the whole book.}"],
      ["D", "{respond|That's the part I couldn't disagree with more.} {text|Later he says a lie is 'when you say something happened which didn't happen', and he's fine with white lies because they're only leaving things out.} So he's not as pure as this sounds."],
      ["B", "{listen|Where's that, roughly? The white-lies bit.}"],
      ["D", "{text|Chapter 37, straight after this quote, is his definition of a lie. The white-lie bit comes a few chapters on.} {voice|reads two lines}"],
      ["C", "{respond|Okay, that changes my view.} {text|'Leaving things out' is what Father does about Mother,} {respond|so Christopher's rule actually lets in the biggest lie in the book.}"],
      ["A", "{invite|D, you've clearly read ahead. What does that do to 'lonely'?} {voice|leans back, hands the talk over}"],
      ["D", "{respond|It makes it worse,} {text|because his own definition is what lets Father get away with it.} {invite|B, do you buy that?}"],
      ["B", "{respond|Mostly.} {invite|Can we put that down as our one thing: his rule about lies is the plot?}"],
    ],
    proves: {
      listen: "Listening is critical: B paraphrases to test A's claim, then asks for the location of D's evidence so the group can check it, and the group changes its view in response.",
      respond: "Positions are justified and revised out loud ('that changes my view'). Disagreement targets the argument, not the person, and the talk moves from feeling to interpretation to the novel's structure.",
      text: "Evidence is precise: a stressed word, a contrast between two reasons, a second passage with its chapter, a definition quoted and tested against a character's behaviour.",
      invite: "Two hand-overs that are also questions. The last line turns the talk into a shared product for the write-up.",
      voice: "The reader re-reads with different stress to make a point. Leaning back and handing over is a deliberate change of register." },
  },
];

/* One expected-level scene for each of the other two sessions,
   and a non-example so the contrast is visible. */
const SCENES = [
  { session: 2, title: "Session 2 · I couldn't disagree more",
    statement: "Ed Boone is a good father.",
    note: "B is the Reader at this table: they run the talk and hold their own view back.",
    lines: [
      ["B", "{voice|reads the statement, then looks round} {invite|Who agrees, who couldn't disagree more? A, you first.}"],
      ["A", "{respond|I couldn't disagree more.} {text|He killed a dog with a garden fork and told his son the mother was dead.}"],
      ["C", "{respond|I'm going to agree, and I know that sounds bad.} {text|He cooks, he gets Christopher to school, he goes to the police station at one in the morning.} {respond|The lie is terrible but the daily stuff is good fathering.}"],
      ["D", "{listen|Do you mean good father overall, or good at the daily stuff?} Because those aren't the same."],
      ["C", "Fair. Good at the daily stuff, and {respond|I think that counts for more than one lie.}"],
      ["A", "{respond|It's not one lie,} {text|it's every day for two years. 'Your mother is dead' every day.}"],
      ["B", "{invite|D, you asked the question. Where do you land?}"],
      ["D", "{respond|Somewhere in the middle.} {text|The scene where he says 'You have to learn to trust me' is him trying,} {respond|but you can't order someone to trust you.}"],
      ["B", "{invite|Has anyone moved?}"],
      ["C", "{respond|A bit. I'd say a loving father who did something unforgivable.} {listen|Is that allowed as an answer?}"],
      ["B", "{respond|It's a better answer than the statement.} {invite|A, last word?}"],
    ],
    proves: {
      listen: "D's question separates two meanings of 'good father' and the group adopts the distinction.",
      respond: "Both sides give reasons from the book. C revises openly. A answers C's point directly rather than repeating their own.",
      text: "Concrete evidence on both sides: the fork, the police station, the two-year lie, the 'trust me' scene.",
      invite: "The Reader never argues, only steers: first speaker chosen, the questioner asked to commit, a check for movement, a last word.",
      voice: "The Reader reads then looks round before speaking. A's repetition of 'every day' is deliberate emphasis." },
  },
  { session: 3, title: "Session 3 · Passage analysis panel",
    statement: "The opening, Chapter 2: 'It was 7 minutes after midnight.'",
    note: "The panel works through the three questions in order: what happens, how it is written, what it shows.",
    lines: [
      ["C", "{voice|reads the first page aloud, evenly}"],
      ["A", "What happens is simple: {text|he finds the dog, it's dead, there's a fork through it.} {respond|What's weird is how calm it is.}"],
      ["D", "{listen|Calm how? Say what makes it calm.}"],
      ["A", "{text|'7 minutes after midnight.' Not 'just after midnight'. And the sentences are all short.} {text|'The dog was dead.' Full stop.}"],
      ["B", "{respond|I'd add there are no feeling words at all.} {text|He says the dog 'was not running or asleep', like he's ruling things out.}"],
      ["C", "{listen|So the writing feature is short sentences plus exact numbers plus no emotion?} {respond|That's three things, do we pick one?}"],
      ["D", "{respond|The numbers.} {text|Because '7 minutes' is the first thing on the page,} {respond|it tells you how this narrator's head works before you know his name.}"],
      ["B", "{respond|Agree, and it's a promise:} {text|the whole book is going to be like this.}"],
      ["C", "{invite|A, you started on calm. Does 'numbers' cover it, or do you want to keep 'calm'?}"],
      ["A", "{respond|Numbers covers it,} the calm comes from the numbers."],
      ["C", "{voice|clearly, for the write-up} {respond|Our one thing: the exact numbers show us the narrator before he tells us anything about himself.}"],
    ],
    proves: {
      listen: "D refuses a vague word ('calm') and asks for what makes it calm. C checks the group's list before choosing.",
      respond: "Observations are turned into claims about effect and about the narrator; the table narrows to one claim.",
      text: "Every speaker quotes: the time, 'The dog was dead', 'not running or asleep'. The feature is located in specific words.",
      invite: "C goes back to A's dropped idea before closing, so the first speaker owns the final claim too.",
      voice: "The reader reads evenly to let the flat tone show. The final line is delivered as a sentence the group can write down." },
  },
  { session: 0, title: "What it looks like when it isn't working",
    statement: "Any station, any session.",
    note: "Not a level. This is the five minutes that produces nothing to write down.",
    lines: [
      ["A", "{voice|reads}"],
      ["B", "Yeah."],
      ["C", "I agree."],
      ["A", "Same."],
      ["D", "It's like, deep."],
      ["B", "{voice|phone under the table}"],
      ["C", "What do we write?"],
    ],
    proves: {
      listen: "Nothing is asked, so nothing is checked.",
      respond: "'I agree' with no reason. Agreement without a because is not a response.",
      text: "The book is closed. 'Deep' is a review, not evidence.",
      invite: "Nobody brings anyone in, so the person with the idea never says it.",
      voice: "Reading aloud is the only speaking done, and it is done to get it over with." },
  },
];

if (typeof module !== "undefined") module.exports = { MOVES, LEVELS, SCENES };
