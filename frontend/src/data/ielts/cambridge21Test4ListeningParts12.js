// Parts 1 and 2 for Cambridge 21 Test 4 Listening
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Survey about Shopping in Broadbeach",
    instructions: "Complete the form below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [1, 10],
    items: [
      {
        number: 1,
        type: "note_completion",
        prefix: "Name: Martyn ",
        suffix: ".",
        answers: ["Leigh"],
        notes: "Respondent last name"
      },
      {
        number: 2,
        type: "note_completion",
        prefix: "Today's journey to Broadbeach town centre: used his ",
        suffix: ".",
        answers: ["motorbike"],
        notes: "Transport used"
      },
      {
        number: 3,
        type: "note_completion",
        prefix: "Purpose of today's trip: has visited the ",
        suffix: ".",
        answers: ["hairdresser"],
        notes: "First destination"
      },
      {
        number: 4,
        type: "note_completion",
        prefix: "Purpose of today's trip: looking for a new ",
        suffix: ".",
        answers: ["suit"],
        notes: "Item shopping for"
      },
      {
        number: 5,
        type: "note_completion",
        prefix: "Purpose of today's trip: collecting ",
        suffix: " (after repair)",
        answers: ["laptop"],
        notes: "Repaired item"
      },
      {
        number: 6,
        type: "note_completion",
        prefix: "Preferred day for shopping: ",
        suffix: ".",
        answers: ["Monday"],
        notes: "Preferred shopping day"
      },
      {
        number: 7,
        type: "note_completion",
        prefix: "Opinions about shopping in the town centre: Thinks there are too many places selling ",
        suffix: ".",
        answers: ["coffee"],
        notes: "Excessive shop type"
      },
      {
        number: 8,
        type: "note_completion",
        prefix: "Opinions about shopping in the town centre: Would like more places to buy ",
        suffix: ".",
        answers: ["books"],
        notes: "Desired shop type"
      },
      {
        number: 9,
        type: "note_completion",
        prefix: "Opinions about new out-of-town Shopping Centre: Likes the ",
        suffix: " best",
        answers: ["plants"],
        notes: "Favourite feature"
      },
      {
        number: 10,
        type: "note_completion",
        prefix: "Opinions about new out-of-town Shopping Centre: Believes the ",
        suffix: " is unnecessary",
        answers: ["cinema"],
        notes: "Unnecessary amenity"
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Business Exhibition Information",
    instructions: "Questions 11-14: Choose TWO letters, A-E.\nQuestions 15-20: Choose SIX answers from the box and write the correct letter, A-G, next to Questions 15-20.",
    questionsRange: [11, 20],
    groups: [
      {
        groupType: "choose_two",
        title: "Questions 11 and 12",
        prompt: "In which TWO areas of the business exhibition did James Craig promote his company last year?",
        numbers: [11, 12],
        options: [
          { letter: "A", text: "the Digital Marketing Centre" },
          { letter: "B", text: "the TalkCon Zone" },
          { letter: "C", text: "the Breakout area" },
          { letter: "D", text: "the Business Village" },
          { letter: "E", text: "the Business Connections Zone" }
        ],
        answers: ["C", "E"]
      },
      {
        groupType: "choose_two",
        title: "Questions 13 and 14",
        prompt: "Which TWO facts are given about discounts on popular brands available to exhibitors?",
        numbers: [13, 14],
        options: [
          { letter: "A", text: "They are available to all members of exhibiting companies." },
          { letter: "B", text: "They can be used for both food and clothing." },
          { letter: "C", text: "They only apply if people spend at least £400." },
          { letter: "D", text: "They can be used by family members." },
          { letter: "E", text: "The percentage saved is always the same." }
        ],
        answers: ["A", "B"]
      },
      {
        groupType: "matching_box",
        title: "Questions 15-20",
        prompt: "Which topic will each of the following speakers focus on?\nChoose SIX answers from the box and write the correct letter, A-G, next to Questions 15-20.",
        boxTitle: "Topics",
        boxOptions: [
          { letter: "A", text: "Supporting job seekers" },
          { letter: "B", text: "Dealing with personal problems" },
          { letter: "C", text: "Effects of an unexpectedly rapid expansion" },
          { letter: "D", text: "A global range of business experiences" },
          { letter: "E", text: "Coping with financial set-backs" },
          { letter: "F", text: "Developing a company in response to changing markets" },
          { letter: "G", text: "Combining business success with contributions to charities" }
        ],
        items: [
          { number: 15, label: "Jim Clowrie", answer: "C", answers: ["C"] },
          { number: 16, label: "David France", answer: "G", answers: ["G"] },
          { number: 17, label: "Oliver Stanton", answer: "D", answers: ["D"] },
          { number: 18, label: "Francesca Heptonstall", answer: "A", answers: ["A"] },
          { number: 19, label: "Salman Khan", answer: "F", answers: ["F"] },
          { number: 20, label: "Annie Craven", answer: "B", answers: ["B"] }
        ]
      }
    ]
  }
];

