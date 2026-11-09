// Cambridge IELTS 17 Test 1 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Buckworth Conservation Group",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Buckworth Conservation Group",
      sections: [
        {
          heading: "Regular activities",
          lines: [
            { text: "Beach", isSubheading: true },
            { prefix: "making sure the beach does not have ", number: 1, suffix: " on it" },
            { prefix: "no ", number: 2, suffix: "" },
            { text: "Nature reserve", isSubheading: true },
            { text: "maintaining paths" },
            { text: "nesting boxes for birds installed" },
            { prefix: "next task is taking action to attract ", number: 3, suffix: " to the place" },
            { prefix: "identifying types of ", number: 4, suffix: "" },
            { prefix: "building a new ", number: 5, suffix: "" }
          ]
        },
        {
          heading: "Forthcoming events",
          lines: [
            { text: "Saturday", isSubheading: true },
            { text: "meet at Dunsmore Beach car park" },
            { prefix: "walk across the sands and reach the ", number: 6, suffix: "" },
            { text: "take a picnic" },
            { prefix: "wear appropriate ", number: 7, suffix: "" },
            { text: "Woodwork session", isSubheading: true },
            { prefix: "suitable for ", number: 8, suffix: " to participate in" },
            { prefix: "making ", number: 9, suffix: " out of wood" },
            { text: "17th, from 10 a.m. to 3 p.m." },
            { prefix: "cost of session (no camping): £", number: 10, suffix: "" }
          ]
        }
      ]
    },
    items: [
      {
        number: 1,
        type: "fill_notes",
        section: "Regular activities",
        prefix: "making sure the beach does not have ",
        suffix: " on it",
        answer: "litter",
        answers: ["litter"]
      },
      {
        number: 2,
        type: "fill_notes",
        section: "Regular activities",
        prefix: "no ",
        suffix: "",
        answer: "dogs",
        answers: ["dogs"]
      },
      {
        number: 3,
        type: "fill_notes",
        section: "Regular activities",
        prefix: "next task is taking action to attract ",
        suffix: " to the place",
        answer: "insects",
        answers: ["insects"]
      },
      {
        number: 4,
        type: "fill_notes",
        section: "Regular activities",
        prefix: "identifying types of ",
        suffix: "",
        answer: "butterflies",
        answers: ["butterflies"]
      },
      {
        number: 5,
        type: "fill_notes",
        section: "Regular activities",
        prefix: "building a new ",
        suffix: "",
        answer: "wall",
        answers: ["wall"]
      },
      {
        number: 6,
        type: "fill_notes",
        section: "Forthcoming events",
        prefix: "walk across the sands and reach the ",
        suffix: "",
        answer: "island",
        answers: ["island"]
      },
      {
        number: 7,
        type: "fill_notes",
        section: "Forthcoming events",
        prefix: "wear appropriate ",
        suffix: "",
        answer: "boots",
        answers: ["boots"]
      },
      {
        number: 8,
        type: "fill_notes",
        section: "Forthcoming events",
        prefix: "suitable for ",
        suffix: " to participate in",
        answer: "beginners",
        answers: ["beginners"]
      },
      {
        number: 9,
        type: "fill_notes",
        section: "Forthcoming events",
        prefix: "making ",
        suffix: " out of wood",
        answer: "spoons",
        answers: ["spoons"]
      },
      {
        number: 10,
        type: "fill_notes",
        section: "Forthcoming events",
        prefix: "cost of session (no camping): £",
        suffix: "",
        answer: "35",
        answers: ["35", "thirty five", "thirty-five"]
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Boat trip round Tasmania",
    instructions: "Questions 11–14: Choose the correct letter, A, B or C.\nQuestions 15 and 16: Choose TWO letters, A–E.\nQuestions 17 and 18: Choose TWO letters, A–E.\nQuestions 19 and 20: Choose TWO letters, A–E.",
    questionsRange: [11, 20],
    items: [
      {
        number: 11,
        type: "multiple_choice",
        question: "What is the maximum number of people who can stand on each side of the boat?",
        options: [
          "A 9",
          "B 15",
          "C 18"
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 12,
        type: "multiple_choice",
        question: "What colour are the tour boats?",
        options: [
          "A dark red",
          "B jet black",
          "C light green"
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 13,
        type: "multiple_choice",
        question: "Which lunchbox is suitable for someone who doesn't eat meat or fish?",
        options: [
          "A Lunchbox 1",
          "B Lunchbox 2",
          "C Lunchbox 3"
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 14,
        type: "multiple_choice",
        question: "What should people do with their litter?",
        options: [
          "A take it home",
          "B hand it to a member of staff",
          "C put it in the bins provided on the boat"
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 15,
        type: "choose_two",
        pairNumber: 16,
        question: "Which TWO features of the lighthouse does Lou mention?",
        options: [
          "A why it was built",
          "B who built it",
          "C how long it took to build",
          "D who staffed it",
          "E what it was built with"
        ],
        answer: "A",
        acceptedAnswers: ["A", "D"],
        answers: ["A", "D"]
      },
      {
        number: 16,
        type: "choose_two",
        pairNumber: 15,
        question: "Which TWO features of the lighthouse does Lou mention? (Second choice)",
        options: [
          "A why it was built",
          "B who built it",
          "C how long it took to build",
          "D who staffed it",
          "E what it was built with"
        ],
        answer: "D",
        acceptedAnswers: ["A", "D"],
        answers: ["A", "D"]
      },
      {
        number: 17,
        type: "choose_two",
        pairNumber: 18,
        question: "Which TWO types of creature might come close to the boat?",
        options: [
          "A sea eagles",
          "B fur seals",
          "C dolphins",
          "D whales",
          "E penguins"
        ],
        answer: "B",
        acceptedAnswers: ["B", "C"],
        answers: ["B", "C"]
      },
      {
        number: 18,
        type: "choose_two",
        pairNumber: 17,
        question: "Which TWO types of creature might come close to the boat? (Second choice)",
        options: [
          "A sea eagles",
          "B fur seals",
          "C dolphins",
          "D whales",
          "E penguins"
        ],
        answer: "C",
        acceptedAnswers: ["B", "C"],
        answers: ["B", "C"]
      },
      {
        number: 19,
        type: "choose_two",
        pairNumber: 20,
        question: "Which TWO points does Lou make about the caves?",
        options: [
          "A Only large tourist boats can visit them.",
          "B The entrances to them are often blocked.",
          "C It is too dangerous for individuals to go near them.",
          "D Someone will explain what is inside them.",
          "E They cannot be reached on foot."
        ],
        answer: "D",
        acceptedAnswers: ["D", "E"],
        answers: ["D", "E"]
      },
      {
        number: 20,
        type: "choose_two",
        pairNumber: 19,
        question: "Which TWO points does Lou make about the caves? (Second choice)",
        options: [
          "A Only large tourist boats can visit them.",
          "B The entrances to them are often blocked.",
          "C It is too dangerous for individuals to go near them.",
          "D Someone will explain what is inside them.",
          "E They cannot be reached on foot."
        ],
        answer: "E",
        acceptedAnswers: ["D", "E"],
        answers: ["D", "E"]
      }
    ]
  }
];
