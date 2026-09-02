/* Curious Incident speaking folio: the one source of truth for prompts,
   sentence starters and the learning continuum. index.html, rubric.html,
   groups.html, wagoll.html and tools/build-folio.mjs all read this file.

   Draft prompts. Check quote wording and add page numbers from the class
   edition before printing. Chapter numbers follow the novel's prime-numbered
   chapters. Anything that explains the task to the student is NOT here:
   the teacher explains the resource, and the lesson plan holds that. */

const FOLIO = {
  novel: "The Curious Incident of the Dog in the Night-Time",
  author: "Mark Haddon",
  unit: "Year 9 English · Speaking and Listening Folio",
  tables: 6,
  teacherTable: 1,
  talkMinutes: 5,
  writeMinutes: 2,

  /* Learning continuum. Levels 5 to 9 (Listening), 5 to 10 (Interacting) and
     5 to 11 (Presenting) are the school's Speaking and Listening continuum
     verbatim. Listening 10 to 12 are the draft extension written against the
     VCE English study design so a Year 9 student can be placed above 9. */
  continuum: {
    levels: [5, 6, 7, 8, 9, 10, 11, 12],
    expected: 9,
    strands: [
      { key: "listening", name: "Listening",
        levels: {
          5: "I can ask clarifying questions",
          6: "I can describe the key ideas in spoken texts",
          7: "I can use active listening skills",
          8: "I can interpret implied meaning in spoken texts",
          9: "I can listen critically to spoken texts constructed for different purposes",
          10: "I can use interaction skills to discuss and analyse the purposes and effects of text structures and language features",
          11: "I can engage productively in discussion, listening to and building on the ideas of others to develop and clarify my own thinking",
          12: "I can engage in sustained, critical and constructive discussion, developing, defending and refining ideas in response to peers and teachers",
        },
        extension: [10, 11, 12] },
      { key: "interacting", name: "Interacting",
        levels: {
          5: "I can present and justify a point of view",
          6: "I can change the way I speak depending on the social relationship",
          7: "I can share my interpretations, ideas and opinions in a group discussion",
          8: "I can use my voice and register appropriately in different contexts",
          9: "I can change the use of my voice when presenting, discussing or persuading",
          10: "I can use inclusive and encouraging language to facilitate positive conversations",
        } },
      { key: "presenting", name: "Presenting",
        levels: {
          5: "I can plan, rehearse and present information",
          6: "I can present information clearly to a small group",
          7: "I can use body language and voice qualities to clarify meaning in a presentation",
          8: "I can present information clearly to a class group",
          9: "I can change my use of body language and voice qualities to suit different audiences and purposes",
          10: "I can use voice and body language to enhance meaning and engage audiences across a range of different contexts",
          11: "I can use voice and body language features to engage and position the audience",
        } },
    ],
  },

  /* Sentence starters, grouped by the discussion move they make.
     Keys match the colours on the WAGOLL page. */
  starters: [
    { key: "respond", name: "Feeling and reason",
      items: ["When I read this I felt … because …", "What struck me was …", "My first reaction is …"] },
    { key: "respond", name: "Agree, disagree",
      items: ["I agree with …, and I'd add …", "I see it differently, because …", "I couldn't disagree more. …", "I partly agree. The bit I'm not sure about is …"] },
    { key: "listen", name: "Check and infer",
      items: ["Do you mean …?", "So you're saying …", "Are you implying …?", "What in the text makes you think that?"] },
    { key: "text", name: "Point at the words",
      items: ["The word … makes me think …", "Look at the line where …", "Haddon puts … right next to …"] },
    { key: "invite", name: "Bring people in",
      items: ["What do you think, …?", "We haven't heard from …", "Going back to what … said …", "Does anyone see it differently?"] },
  ],

  /* Teacher-facing: where the evidence for each strand comes from. */
  evidence: {
    listening: "The session pages: what the table said, in the student's words.",
    interacting: "Table 1: what the teacher hears from each group, once per session.",
    presenting: "Session 2 (reading the statement and running the talk) and Session 3 (the share-back).",
  },

  /* Teacher-facing. Read by the lesson plan builder, not shown on student pages. */
  run: [
    "Groups of four or five. Each group starts at a different table.",
    "One prompt per table. Five minutes of talk, then two minutes writing on the session page.",
    "Groups move up one table each rotation. Six rotations covers all six prompts.",
    "Table 1 is the teacher table: the teacher listens and records against the continuum on the front page of the folio.",
  ],

  sessions: [
    {
      n: 1, key: "respond",
      title: "Personal response",
      skill: "Connecting ideas: feeling with a reason, linking to your own experience, linking to what someone else just said",
      how: [
        "One person reads the quote aloud.",
        "Go round once: everyone says how the quote hit them and why.",
        "Then respond to each other: agree, disagree, add, ask.",
      ],
      write: "Who was at the table, what two people felt, and one thing someone said that changed or confirmed what you think.",
      stations: [
        { n: 1, teacher: true,
          quote: "I pulled the fork out of the dog and lifted him into my arms and hugged him. He was leaking blood from the fork holes. I like dogs. You always know what a dog is thinking. It has four moods. Happy, sad, cross and concentrating. Also, dogs are faithful and they do not tell lies because they cannot talk.",
          source: "Chapter 5",
          talk: ["How did this passage make you feel the first time you read it?",
                 "Christopher hugs the dog but describes the blood calmly. What does that do to you as a reader?",
                 "Do you agree that 'you always know what a dog is thinking'? Is that true of people?"] },
        { n: 2,
          quote: "I find people confusing. This is for two main reasons. The first main reason is that people do a lot of talking without using any words.",
          source: "Chapter 5",
          talk: ["When have you misread someone's face or tone? What happened?",
                 "Is Christopher right that people say a lot without words? Give an example from today.",
                 "Does this make you feel closer to Christopher, or further away?"] },
        { n: 3,
          quote: "Prime numbers are what is left when you have taken all the patterns away. I think prime numbers are like life. They are very logical but you could never work out the rules, even if you spent all your time thinking about them.",
          source: "Chapter 19",
          talk: ["Put Christopher's idea about life in your own words.",
                 "Do you agree that life is 'logical but you could never work out the rules'?",
                 "How does it feel to have a maths idea used to explain life?"] },
        { n: 4,
          quote: "I do not tell lies. Mother used to say that this was because I was a good person. But it is not because I am a good person. It is because I can't tell lies.",
          source: "Chapter 37",
          talk: ["Is never lying a strength or a problem? Say why.",
                 "Is there such a thing as a kind lie? Does Christopher think so?",
                 "How do you feel about Christopher correcting his own mother here?"] },
        { n: 5,
          quote: "Mr Jeavons said that I liked maths because it was safe. He said I liked maths because it meant solving problems, and these problems were difficult and interesting but there was always a straightforward answer at the end.",
          source: "Chapter 61",
          talk: ["Do you have a 'safe' thing the way Christopher has maths? What is it?",
                 "Mr Jeavons goes on to say life is not like maths because there are no straightforward answers. Do you agree?",
                 "Does it feel fair that an adult explains Christopher to himself like this?"] },
        { n: 6,
          quote: "I think it should be called a lie because a pig is not like a day and people do not have skeletons in their cupboards.",
          source: "Chapter 29, on metaphors",
          talk: ["What is Christopher's problem with metaphors? Is he being silly or logical?",
                 "Give a metaphor you use all the time. Would it confuse someone who takes words literally?",
                 "Does this passage make you laugh, or feel for him, or both?"] },
      ],
      spare: [
        { quote: "This will not be a funny book. I cannot tell jokes because I do not understand them.", source: "Chapter 7" },
        { quote: "Everyone has learning difficulties because learning to speak French or understanding relativity is difficult and also everyone has special needs.", source: "Chapter 71" },
        { quote: "I think people believe in heaven because they don't like the idea of dying, because they want to carry on living and they don't like the idea that other people will move into their house and put their things into the rubbish.", source: "Chapter 41" },
      ],
    },

    {
      n: 2, key: "disagree",
      title: "I couldn't disagree more",
      skill: "Agreeing and disagreeing: quoting your opponent back, reframing the question, conceding a point, countering with the text",
      how: [
        "One person reads the statement aloud. That person is the Reader: they run the talk and hold their own view back.",
        "Reader asks who agrees and who couldn't disagree more. Everyone takes a side and gives one reason from the book.",
        "Reader keeps it going. Change sides if someone convinces you, and say so.",
        "A different person is Reader at each table.",
      ],
      write: "The statement, which side you took, the best reason you heard from someone else, and whether anyone changed their mind.",
      stations: [
        { n: 1, teacher: true,
          quote: "Ed Boone is a good father.",
          talk: ["What has Father done for Christopher? What has he done to him?",
                 "Can someone be a good parent and still lie about something enormous?",
                 "What would Christopher say? Is he the right judge?"] },
        { n: 2,
          quote: "Christopher's mother had every right to leave.",
          talk: ["What does Judy say in her letters about why she went?",
                 "Does having a hard time excuse leaving a child? Is that what happened?",
                 "Whose side does the novel take, if any?"] },
        { n: 3,
          quote: "If everyone told the truth all the time, like Christopher, the world would be a better place.",
          talk: ["Find a moment where Christopher's honesty helps, and one where it hurts.",
                 "Which lies in the novel do the most damage?",
                 "Would you last a day telling only the truth?"] },
        { n: 4,
          quote: "The adults in this novel have more 'behavioural problems' than Christopher does.",
          talk: ["Look at Christopher's list of his own behavioural problems. Now list the adults' behaviour.",
                 "Who decides what counts as a 'problem'? Who gets a label and who doesn't?",
                 "Is the statement fair, or just clever?"] },
        { n: 5,
          quote: "Christopher's rules about red and yellow cars are no stranger than the superstitions everyone else has.",
          talk: ["What does Christopher say when Mr Jeavons calls the car rule illogical?",
                 "Name a rule or ritual people around you follow that makes no logical sense.",
                 "Is there a difference between a superstition and a coping strategy?"] },
        { n: 6,
          quote: "Lying to protect someone is worse than telling them a painful truth.",
          talk: ["Who lies to protect someone in this novel? Does it protect them?",
                 "Is there a truth in the book that should have been kept from Christopher?",
                 "Does your answer change if the person is a child?"] },
      ],
      spare: [
        { quote: "Siobhan is the only adult who really understands Christopher." },
        { quote: "Mrs Alexander should never have told Christopher about his mother." },
        { quote: "The reader is meant to like Christopher more than anyone else in the book." },
      ],
    },

    {
      n: 3, key: "panel",
      title: "Passage analysis panel",
      skill: "Building together: 'yes, and', linking ideas, elaborating on someone else's point, taking and handing over turns",
      how: [
        "Someone reads the passage aloud. Everyone follows in the book.",
        "Work through the three panel questions together: what happens, how it is written, what it shows.",
        "Everyone points at a word or a line at least once.",
        "Last minute: agree on the one thing about the writing the table would tell the class.",
      ],
      write: "The passage, the writing feature the table noticed, the words it lives in, and what it shows. Then the one thing you'd tell the class.",
      panelQuestions: [
        "What happens in the passage? Who is there, what is said, what does Christopher do?",
        "How is it written? Sentence length, lists, numbers, repetition, dialogue, what is missing.",
        "What does it show about Christopher, another character, or a big idea in the novel?",
      ],
      stations: [
        { n: 1, teacher: true,
          quote: "The opening: Christopher finds Wellington.",
          source: "Chapter 2, from 'It was 7 minutes after midnight.'",
          talk: ["Count the sentences. What do you notice about their length and about the numbers?",
                 "Which feeling words are missing? What does that do to you?",
                 "What kind of narrator does this page promise?"] },
        { n: 2,
          quote: "Christopher lists his Behavioural Problems.",
          source: "Chapter 73, the list from A to R",
          talk: ["Why a list, and why letters? Who normally writes lists like this about people?",
                 "Which item surprised you? Which one is not really a 'problem'?",
                 "Whose words are these, Christopher's or the adults'?"] },
        { n: 3,
          quote: "Christopher reads his mother's letters.",
          source: "Chapter 157",
          talk: ["Two voices are on the page: Judy's letters and Christopher's narration. How are they different?",
                 "How does Haddon show shock without Christopher saying 'I was shocked'?",
                 "Find the moment you realised what the letters meant, before Christopher did."] },
        { n: 4,
          quote: "Father tells the truth about Wellington.",
          source: "Chapter 167",
          talk: ["Look at Father's sentences. What does he keep repeating, and why?",
                 "What does Christopher say? What does he do instead of speaking?",
                 "Who does the reader trust at the end of this chapter?"] },
        { n: 5,
          quote: "'I see everything.' Christopher explains how he notices a field of cows.",
          source: "Chapter 181",
          talk: ["Compare what Christopher sees with what he says other people see. How does the layout show the difference?",
                 "Is this passage a strength or a burden? Find the words that tell you.",
                 "How does this explain what happens to him at the station?"] },
        { n: 6,
          quote: "The station: signs, noise and detaching the mind.",
          source: "London, around Chapters 193 to 197",
          talk: ["How does Haddon put the noise and the signs onto the page? What does it feel like to read?",
                 "What does Christopher do to cope? Where does that idea come from?",
                 "What does this passage show about bravery?"] },
      ],
      spare: [
        { quote: "The Monty Hall problem: why Christopher includes a maths puzzle in a murder mystery.", source: "Chapter 101" },
        { quote: "The ending: 'And I know I can do this because …'", source: "Chapter 233" },
      ],
    },
  ],
};

/* Rotation plan. Group g starts at table g and moves +1 each rotation,
   so every group visits every table exactly once in six rotations. */
FOLIO.rotation = (groups, tables) =>
  Array.from({ length: tables }, (_, r) =>
    Array.from({ length: groups }, (_, g) => ((g + r) % tables) + 1));

if (typeof module !== "undefined") module.exports = FOLIO;
