/* Interactive WAGOLL content: the same five minutes at a table, one session
   at a time, at three levels. Click through one line at a time.

   Line shape: [speaker, text, note]
     speaker  A B C D (four seats). T is the teacher, only ever a short prompt.
     text     mark a move with {key|words}. Unmarked words are just talk.
     note     one sentence on what the marked move does in THIS line.
   Level shape: { level, band, lines, proves:{moveKey: sentence} }

   Each session has its own move set (its own legend). Five colour slots are
   shared across sessions: blue, green, orange, purple, grey. Stage directions
   go in {voice|…} in every session and are always grey italics. */

const SESSIONS = [
  {
    n: 1, title: "Personal response", quoteLabel: "Session 1 · Table 4 · Chapter 37",
    prompt: "I do not tell lies. Mother used to say that this was because I was a good person. But it is not because I am a good person. It is because I can't tell lies.",
    task: "Go round once with a feeling and a reason. Then respond to each other.",
    moves: [
      { key: "feel",  slot: "green",  name: "Feeling with a reason", what: "Say how it hit you and why. 'Sad' is a word; 'sad because he corrects his own mum' is a response." },
      { key: "self",  slot: "orange", name: "Link to your own life", what: "Connect the quote to something you have seen or done. The link has to come back to the text." },
      { key: "other", slot: "purple", name: "Link to what someone said", what: "Name the person and use their idea: add to it, turn it, or answer it." },
      { key: "ask",   slot: "blue",   name: "Ask to understand", what: "A question that gets a reason out of someone, or checks what they meant, or asks what they are implying." },
      { key: "voice", slot: "grey",   name: "Voice and body", what: "Stage directions. Pace, pause, looking at the person you answer." },
    ],
    levels: [
      { level: 7, band: "Working towards",
        lines: [
          ["A", "{voice|reads the quote fast, eyes on the page} Okay so, he doesn't lie. {feel|I think that's good.}", "A feeling with no reason. 'Good' on its own gives the others nothing to respond to."],
          ["B", "{feel|Yeah, same.} Lying's bad.", "'Same' agrees without adding anything, so the talk stays where A left it."],
          ["C", "{feel|I felt a bit sorry for him} 'cause his mum said he was good and he's like, no I'm not.", "The first real reason at the table: a feeling attached to a moment in the quote."],
          ["A", "{other|I agree with C.} He says it's because he can't, not because he's good.", "A names C and repeats C's point in different words. That is a link, but it adds nothing new."],
          ["D", "…", "D has said nothing. Nobody asks. This is the line that stops the table reaching level 9."],
          ["B", "{feel|I reckon it's still good though.} Like, if you never lie, people trust you.", "B finally gives a reason, but it answers nobody: it is a fresh opinion dropped next to the others."],
          ["C", "{ask|Wait, what do you mean by trust?}", "The one question at the table. It is the right question, asked late."],
          ["B", "Like, they know you're not gonna, um, make stuff up.", "B answers, and the idea could go somewhere. It doesn't, because nobody links to it."],
          ["A", "{voice|looks at the clock} Are we done?", "About two minutes in. The ideas ran out because nobody built on anybody."],
        ],
        proves: {
          feel: "Everyone states a feeling; only C attaches it to a moment in the quote.",
          self: "No one links the quote to their own life, so there is nothing personal to respond to.",
          other: "One link, and it only repeats. Opinions sit side by side instead of touching.",
          ask: "One question, late. D is never asked anything.",
          voice: "Reading is rushed and nobody looks up.",
        } },
      { level: 9, band: "Expected",
        lines: [
          ["A", "{voice|reads slowly, looks up at the end} {feel|My first reaction is that it's a bit sad, because he's correcting his own mum: 'it is not because I am a good person.'}", "Feeling plus the reason plus the words it comes from. This is the shape every response needs."],
          ["B", "{feel|I felt the opposite, I found it funny, the way he splits hairs: good person versus 'can't tell lies'.}", "B disagrees with the feeling, not the person, and gives the reason in the same breath."],
          ["C", "{ask|So B, do you mean he's being funny on purpose, or we just find it funny?}", "C's question separates two things B ran together. That is what a clarifying question is for."],
          ["B", "Not on purpose. He's dead serious, which is what makes it funny. And a bit sad, {other|so I partly agree with A.}", "B answers, then links back to A: the two feelings are now one conversation."],
          ["D", "{feel|I don't think it's sad.} 'I can't tell lies' means he never has to decide. {self|Honestly I'd find that easier.}", "D adds a new feeling and links it to their own life. The link comes straight back to the quote."],
          ["A", "{ask|Can you say more about easier?}", "A asks D to unpack, which keeps the best idea at the table alive."],
          ["D", "Like, we lie to be polite. {self|He'd just say the true thing about your haircut.} No stress.", "D's own-life example makes the abstract point concrete."],
          ["C", "{other|I see it differently from D, because} the stress just moves to everyone else. {ask|What do you think, B, you've been quiet a sec?}", "C answers D by name, then notices B has dropped out and asks."],
          ["B", "{other|I think C's right,} and later in the book his honesty is exactly what gets him in trouble with the police.", "B links to C and brings in another part of the novel."],
          ["A", "{ask|So do we agree it's a strength and a problem?} {voice|waits}", "A closes by checking the shared view, and waits instead of filling the silence."],
        ],
        proves: {
          feel: "Everyone gives a feeling with a because, and two of them disagree politely.",
          self: "D links the quote to everyday polite lies, and the link returns to the text.",
          other: "Four links by name: 'partly agree with A', 'differently from D', 'C's right'.",
          ask: "Three questions, each of which gets a reason out of someone, and one brings B back in.",
          voice: "The reader slows down and looks up. A pauses after the last question.",
        } },
      { level: 11, band: "Above",
        lines: [
          ["A", "{voice|reads it twice, second time stressing 'can't'} {feel|It hit me as lonely, because 'I can't' is the only reason he gives, and the mother's kinder version gets crossed out.}", "The reason is built from a single stressed word and a contrast between two reasons in the quote."],
          ["B", "{ask|So you're saying he'd rather be accurate than be thought of as good?}", "B paraphrases A's idea back as a question to test it. This is inferring what A implies."],
          ["A", "Yes. He'd rather be right about himself than liked.", "A accepts the sharper version, so B's question has improved A's idea."],
          ["C", "{other|I'd push back on A a bit.} He isn't rejecting 'good'; he just can't accept a reason that isn't true. {feel|Which is kind of the most honest thing in the whole book.}", "C disagrees with A's reading, not A's feeling, and offers a rival reading of the same words."],
          ["D", "{other|That's the part I'd disagree with most.} Later he says a lie is 'when you say something happened which didn't happen', and he's fine with white lies because they only leave things out. So he's not as pure as this sounds.", "D links to C and counters with a second passage. The disagreement is about evidence."],
          ["B", "{ask|Where's that, roughly? The white-lies bit.}", "B asks for the location so the group can check the evidence, not take it on trust."],
          ["D", "Chapter 37, straight after this quote, is his definition of a lie. The white-lie bit comes a few chapters on. {voice|reads two lines}", "D gives the location and reads the words. The talk is now anchored in the book."],
          ["C", "{other|Okay, that changes my view.} 'Leaving things out' is what Father does about Mother, {self|and it's what I'd do too, honestly,} so Christopher's rule actually lets in the biggest lie in the book.", "C revises out loud, links to their own life, and connects the quote to the plot."],
          ["A", "{ask|D, you've clearly read ahead. What does that do to 'lonely'?} {voice|leans back, hands the talk over}", "A hands the turn to the person with the evidence and asks them to answer A's own first idea."],
          ["D", "It makes it worse, because his own definition is what lets Father get away with it. {ask|B, do you buy that?}", "D answers and passes the turn again with a direct question."],
          ["B", "{other|Mostly.} {ask|Can we put that down as our one thing: his rule about lies is the plot?}", "B turns the talk into a shared product for the write-up."],
        ],
        proves: {
          feel: "Feelings are argued from single words ('can't') and revised when the evidence changes.",
          self: "Two links to the students' own lives, both used to test the reading rather than to change the subject.",
          other: "Every speaker answers a named person. Disagreement targets the reading, and the group changes its mind out loud.",
          ask: "Questions paraphrase, infer what is implied, ask for the location of evidence, and hand the turn over.",
          voice: "Re-reading with different stress makes an argument. Leaning back is a deliberate hand-over.",
        } },
    ],
  },

  {
    n: 2, title: "I couldn't disagree more", quoteLabel: "Session 2 · Table 1",
    prompt: "Ed Boone is a good father.",
    task: "B is the Reader: B runs the talk and holds their own view back. Everyone takes a side with one reason from the book.",
    moves: [
      { key: "side",    slot: "green",  name: "Take a side with a reason", what: "Agree or disagree, and give the reason from the book in the same sentence." },
      { key: "quote",   slot: "blue",   name: "Quote your opponent back", what: "Repeat their actual words before you answer them. It proves you listened and it stops you answering something they didn't say." },
      { key: "reframe", slot: "purple", name: "Reframe the question", what: "Show the statement means two different things, or that the real question is a different one." },
      { key: "concede", slot: "grey",   name: "Concede a point", what: "Give ground on the part that is true, out loud, and keep the rest." },
      { key: "counter", slot: "orange", name: "Counter with the text", what: "Answer a point with a specific moment, line or chapter." },
    ],
    levels: [
      { level: 7, band: "Working towards",
        lines: [
          ["B", "{voice|reads the statement} Okay, who agrees?", "The Reader opens, but asks only for agreement, so the first speaker sets the tone."],
          ["A", "{side|No way. He killed the dog.}", "A side and a reason, in five words. It is a start."],
          ["C", "Yeah he's bad.", "Agreement without a reason. C has added nothing A can answer."],
          ["D", "{side|I dunno, he does look after him though.}", "D has a different side and a reason, but it is vague: 'looks after' could mean anything."],
          ["A", "But he killed a dog with a garden fork!", "A repeats their own point louder instead of answering D's. Nobody has quoted anyone."],
          ["D", "Yeah but that's one thing.", "D concedes, sort of, but does not say what the 'one thing' weighs against."],
          ["C", "It's a big thing.", "True, and still not a reason. The talk is going round in a circle."],
          ["B", "So, bad father? Everyone agree?", "The Reader closes early on a vote instead of asking D to say more."],
          ["D", "I guess.", "D gives up a real position because nobody asked for the evidence behind it."],
        ],
        proves: {
          side: "Two sides are taken, one with a specific reason (the fork) and one with a vague one ('looks after him').",
          quote: "Nobody repeats anyone's words. A answers D by repeating A.",
          reframe: "'Good father' is never unpacked, so the two sides argue past each other.",
          concede: "D gives ground without saying what the concession changes, then abandons the position.",
          counter: "One moment from the book in the whole talk.",
        } },
      { level: 9, band: "Expected",
        lines: [
          ["B", "{voice|reads the statement, looks round} Who agrees, who couldn't disagree more? A, you first.", "The Reader asks for both sides and chooses the first speaker."],
          ["A", "{side|I couldn't disagree more. He killed a dog with a garden fork and told his son the mother was dead.}", "A side and two reasons from the book in one breath."],
          ["C", "{side|I'm going to agree, and I know that sounds bad.} {counter|He cooks, he gets Christopher to school, he goes to the police station at one in the morning.} The lie is terrible but the daily stuff is good fathering.", "C takes the harder side and backs it with three concrete moments."],
          ["D", "{reframe|Do you mean good father overall, or good at the daily stuff? Because those aren't the same.}", "D splits 'good father' into two meanings. The whole argument now has somewhere to go."],
          ["C", "{concede|Fair. Good at the daily stuff,} and I think that counts for more than one lie.", "C concedes the distinction and restates their position inside it."],
          ["A", "{quote|You said 'one lie'.} {counter|It's not one lie, it's every day for two years. 'Your mother is dead' every day.}", "A quotes C's exact words back, then counters them with the scale of the lie."],
          ["B", "D, you asked the question. Where do you land?", "The Reader makes the questioner commit."],
          ["D", "{side|Somewhere in the middle.} {counter|The scene where he says 'You have to learn to trust me' is him trying,} but you can't order someone to trust you.", "D takes a position and supports it with a line from the book."],
          ["B", "Has anyone moved?", "The Reader checks for movement, which is the point of the session."],
          ["C", "{concede|A bit. I'd say a loving father who did something unforgivable.} Is that allowed as an answer?", "C revises openly. The concession keeps what was true and drops what wasn't."],
          ["B", "It's a better answer than the statement. A, last word?", "The Reader closes by handing the last turn to the person who started."],
        ],
        proves: {
          side: "Both sides state a reason from the book. D takes a middle position and defends it.",
          quote: "A quotes 'one lie' back at C before answering it.",
          reframe: "D's distinction between 'overall' and 'the daily stuff' is adopted by everyone after it.",
          concede: "C concedes twice, each time keeping the part that survives.",
          counter: "Five moments from the book: the fork, the police station, cooking, the two-year lie, 'learn to trust me'.",
        } },
      { level: 11, band: "Above",
        lines: [
          ["B", "{voice|reads the statement} Before sides: what would count as evidence either way? A?", "The Reader asks the table to agree what evidence would settle it before anyone argues."],
          ["A", "Actions towards Christopher, over time. Not intentions. {side|On that test he fails, because the two-year lie is an action every single day.}", "A sets the test, then applies it. The side comes with the standard it was judged by."],
          ["C", "{quote|'Actions over time' is exactly my test too,} {counter|and the actions over time are also cooking, school runs, the police station at 1 a.m., and the swimming.} {reframe|So the question is really whether one enormous action cancels a thousand small ones.}", "C accepts A's test, quotes it back, fills it with counter-evidence, and reframes the statement as a weighing problem."],
          ["D", "{concede|I'll give C the thousand small ones.} {counter|But the small ones are what a carer does, and the big one is what only a liar does. Christopher's own word for it is 'a lie', full stop, in the chapter where he lists what Father told him.}", "D concedes the whole of C's evidence and still counters, by changing what kind of thing each action is."],
          ["B", "C, answer D's 'carer versus liar' directly.", "The Reader stops C answering something else. Reader's job is to keep the argument on the actual point."],
          ["C", "{quote|'Carer versus liar'} assumes he can only be one. {counter|The confession scene has him doing both in one speech: 'I did it for the best' and 'I killed Wellington' are about ten lines apart.}", "C quotes D's phrase, names its assumption, and counters with the passage that shows both at once."],
          ["A", "{concede|Okay, that's true, he's both.} {reframe|Then 'good father' is the wrong question and the real one is whether Christopher can ever trust him again, which is what the last chapters are actually about.}", "A concedes the reading and reframes toward what the novel itself asks."],
          ["D", "{side|On that question I'd say the book is hopeful: the dog, the maths result, the 'I can do anything'.} {counter|He doesn't say he trusts Father. He says he can do anything. That's not the same.}", "D takes a position on the reframed question and immediately checks it against the exact wording of the ending."],
          ["B", "So the table's answer is: not a good father, possibly a recoverable one. Anyone want that changed? {voice|waits}", "The Reader states the shared position and gives space to object before it goes in the write-up."],
          ["C", "{concede|I'd sign that.} {quote|'Recoverable' is a better word than 'good'.}", "C concedes the group's wording and improves it by quoting it."],
        ],
        proves: {
          side: "Positions come with the standard they were judged by, and shift as the question is refined.",
          quote: "Opponents' exact words are quoted before being answered: 'actions over time', 'carer versus liar', 'recoverable'.",
          reframe: "The statement is reframed twice, each time toward a question the novel actually asks.",
          concede: "Concessions are total and specific, and never end the speaker's argument.",
          counter: "Counters are precise: named scenes, the distance between two lines, the exact words of the ending.",
        } },
    ],
  },

  {
    n: 3, title: "Passage analysis panel", quoteLabel: "Session 3 · Table 1 · Chapter 2",
    prompt: "The opening: 'It was 7 minutes after midnight.' Christopher finds Wellington.",
    task: "What happens, how it is written, what it shows. Everyone points at a word. Finish with the one thing the table would tell the class.",
    moves: [
      { key: "yesand",    slot: "green",  name: "Yes, and", what: "Accept what was just said and add the next piece. Not 'yes, but'." },
      { key: "link",      slot: "blue",   name: "Link two ideas", what: "Join something said earlier to something said now, or to another part of the book." },
      { key: "elaborate", slot: "purple", name: "Elaborate on someone else", what: "Take another person's point further than they took it: an example, a consequence, a sharper word." },
      { key: "turn",      slot: "grey",   name: "Take or hand over a turn", what: "Ask a named person, offer the floor, or say you are stepping in. Turns are given, not grabbed." },
      { key: "text",      slot: "orange", name: "Point at the words", what: "A quoted phrase, a sentence length, a number, a missing word. The feature has to live somewhere on the page." },
    ],
    levels: [
      { level: 7, band: "Working towards",
        lines: [
          ["C", "{voice|reads the first page aloud}", "The reading is done, and then nobody claims the first turn."],
          ["A", "So he finds the dog and it's dead.", "What happens, correctly, and nothing about how it is written."],
          ["D", "{text|It says '7 minutes after midnight'.} That's weird.", "D points at words. 'Weird' is the beginning of a feature, not a description of one."],
          ["B", "Yeah it's like really specific.", "B agrees with D and nearly names the feature. 'Specific' is the word; it needs a second sentence."],
          ["A", "And the dog's got a fork in it.", "Back to what happens. The table has two threads and nobody links them."],
          ["C", "What do we write for the writing bit?", "C asks the sheet's question instead of the table's. Nobody elaborates on 'specific'."],
          ["D", "Um, short sentences?", "A real feature, guessed, not pointed at."],
          ["B", "Okay, short sentences.", "Accepted without anyone finding one. Agreement here is not 'yes, and'; it is 'yes, done'."],
          ["A", "{turn|Who's writing it down?}", "The only hand-over at the table is about the pen."],
        ],
        proves: {
          yesand: "Agreement happens ('yeah', 'okay') but nothing is added to it.",
          link: "'Specific' and 'short sentences' are both right and are never joined into one observation.",
          elaborate: "Nobody takes D's '7 minutes' further, so the best observation dies after one line.",
          turn: "Turns are not given; people speak when a gap appears. The one hand-over is about writing.",
          text: "One quoted phrase. 'Short sentences' is claimed without an example.",
        } },
      { level: 9, band: "Expected",
        lines: [
          ["C", "{voice|reads the first page aloud, evenly} {turn|A, what happens?}", "The reader hands the first turn to a named person with the first panel question."],
          ["A", "What happens is simple: he finds the dog, it's dead, there's a fork through it. What's weird is how calm it is.", "A answers the question and offers the first feature for someone to pick up."],
          ["D", "{elaborate|Calm how? Say what makes it calm.}", "D refuses a vague word and asks A to elaborate on their own point."],
          ["A", "{text|'7 minutes after midnight.' Not 'just after midnight'. And the sentences are all short: 'The dog was dead.' Full stop.}", "A points at two things on the page: a number and a sentence length."],
          ["B", "{yesand|Yes, and there are no feeling words at all.} {text|He says the dog 'was not running or asleep', like he's ruling things out.}", "B accepts A's features and adds a third, with its own quotation."],
          ["C", "{link|So the feature is short sentences plus exact numbers plus no emotion?} That's three things, do we pick one?", "C links the three observations into one claim and asks the table to choose."],
          ["D", "{elaborate|The numbers. Because '7 minutes' is the first thing on the page, it tells you how this narrator's head works before you know his name.}", "D elaborates the chosen feature into an effect on the reader."],
          ["B", "{yesand|Agree, and it's a promise: the whole book is going to be like this.}", "B adds the consequence for the rest of the novel."],
          ["C", "{turn|A, you started on 'calm'. Does 'numbers' cover it, or do you want to keep 'calm'?}", "C hands the turn back to the first speaker before closing, so the dropped idea is decided, not forgotten."],
          ["A", "{link|Numbers covers it, the calm comes from the numbers.}", "A links their first word to the group's final feature."],
          ["C", "{voice|clearly, for the write-up} Our one thing: the exact numbers show us the narrator before he tells us anything about himself.", "The one thing, said as a sentence the table can write down."],
        ],
        proves: {
          yesand: "B twice accepts what was said and adds the next piece.",
          link: "C joins three observations into one feature; A joins 'calm' to 'numbers'.",
          elaborate: "D twice takes someone else's point further: from 'calm' to what makes it calm, from 'numbers' to their effect.",
          turn: "The reader gives the first turn by name and returns to the first speaker before closing.",
          text: "Every speaker quotes: the time, 'The dog was dead', 'not running or asleep'.",
        } },
      { level: 11, band: "Above",
        lines: [
          ["C", "{voice|reads the first page aloud, then reads the first sentence again} {turn|Before 'what happens', does anyone want to say what the first sentence is doing? D?}", "The reader re-reads the sentence that matters and hands a specific turn."],
          ["D", "{text|It's a time, to the minute, with a number not a word: '7', not 'seven'.} It tells us the narrator counts before he feels.", "D points at the smallest possible thing, a digit, and gives it a meaning."],
          ["A", "{yesand|Yes, and the counting continues: 'four moods', 'I had been hugging the dog for 4 minutes'.} {link|So the number in the first sentence isn't a detail, it's a habit we're going to watch for the whole book.}", "A adds two more numbers and links the first sentence to the novel's method."],
          ["B", "{elaborate|And the habit has a cost, which is on this page too: he can tell us the fork went through the dog but not what he felt about it.} {text|The only feeling word is 'I like dogs', and it comes after the blood.}", "B takes A's 'habit' further into its cost, and finds the one feeling word and its position."],
          ["C", "{link|That's the same order as the chapter about faces: the feeling comes last or gets a diagram.} {turn|A, does that connect for you?}", "C links to a later chapter and hands the turn with a question."],
          ["A", "{yesand|It does, and it means the calm isn't calm.} {elaborate|It's the narrator not having a word yet, which is different from not caring. That's the thing a first-time reader gets wrong.}", "A accepts, then elaborates C's link into the distinction the table will keep."],
          ["D", "{elaborate|So the effect of the numbers is that the reader supplies the feeling.} {text|'The dog was dead' is four words; we do the rest.}", "D elaborates to the reader's role and points at the sentence that proves it."],
          ["B", "{turn|Can I push on 'we do the rest'?} {link|Because later at the station he also gives us just numbers and signs, and by then we've learned to read them as panic. Same technique, opposite feeling.}", "B asks for the turn, then links the opening to the London passage to show the technique changing its effect."],
          ["C", "{yesand|Yes, and that's our one thing then:} the numbers make the reader supply the feeling, and the book teaches us which feeling as it goes. {turn|Objections before I say it for the class?}", "The reader closes with the group's sentence and offers a last turn."],
          ["D", "{elaborate|Say 'to the minute' rather than 'numbers'. It's the precision, not the digits.}", "A final elaboration that sharpens the word the class will hear."],
        ],
        proves: {
          yesand: "Every 'yes' carries an 'and': a second number, a cost, a distinction, the shared sentence.",
          link: "Links run forward to the faces chapter and the station, and back to the first sentence.",
          elaborate: "Each point is taken further by the next speaker: habit, cost, reader's role, precision.",
          turn: "Turns are handed by name with a question; B asks for the floor before taking it.",
          text: "Evidence is exact: a digit, a four-word sentence, the position of the one feeling word.",
        } },
    ],
  },
];

/* Not a level. What the same five minutes look like when nothing is happening. */
const NOT_WORKING = {
  title: "When it isn't working",
  lines: [
    ["A", "{voice|reads}", "Reading aloud is the only speaking anyone does."],
    ["B", "Yeah.", ""],
    ["C", "I agree.", "Agreement with no reason is not a response."],
    ["A", "Same.", ""],
    ["D", "It's like, deep.", "'Deep' is a review, not evidence."],
    ["B", "{voice|phone under the table}", ""],
    ["C", "What do we write?", "Nothing was said, so there is nothing to write."],
  ],
};

if (typeof module !== "undefined") module.exports = { SESSIONS, NOT_WORKING };
