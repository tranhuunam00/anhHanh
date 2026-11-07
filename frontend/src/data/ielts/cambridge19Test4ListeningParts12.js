// Cambridge IELTS 19 Test 4 - Listening Parts 1 & 2 Data
// 100% Authentic Text and Questions from Cambridge 19.pdf (Pages 78-80)

export const cambridge19Test4ListeningPart1 = {
  partNumber: 1,
  title: "Part 1: First Day at Work",
  instructions: "Questions 1–6: Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.\nQuestions 7–10: Complete the table below. Write ONE WORD ONLY for each answer.",
  questionsRange: [1, 10],
  contentBlocks: [
    {
      type: "notes",
      groupTitle: "Questions 1–6",
      instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
      title: "First day at work",
      sections: [
        {
          heading: "",
          lines: [
            { prefix: "Name of supervisor: ", number: 1, suffix: "" },
            { prefix: "Where to leave coat and bag: use ", number: 2, suffix: " in staffroom" },
            { text: "See Tiffany in HR:" },
            { prefix: "— to give ", number: 3, suffix: "" },
            { prefix: "— to collect ", number: 4, suffix: "" },
            { prefix: "Location of HR office: on ", number: 5, suffix: " floor" },
            { prefix: "Supervisor's mobile number: ", number: 6, suffix: "" }
          ]
        }
      ]
    },
    {
      type: "table",
      groupTitle: "Questions 7–10",
      instructions: "Complete the table below. Write ONE WORD ONLY for each answer.",
      title: "Responsibilities",
      headers: ["", "Task 1", "Task 2", "Notes"],
      rows: [
        [
          "Bakery section",
          "Check sell-by dates",
          "Change price labels",
          { prefix: "Use ", number: 7, suffix: " labels" }
        ],
        [
          "Sushi takeaway counter",
          { prefix: "Re-stock with ", number: 8, suffix: " boxes if needed" },
          "Wipe preparation area and clean the sink",
          "Do not clean any knives"
        ],
        [
          "Meat and fish counters",
          "Clean the serving area, including the weighing scales",
          { prefix: "Collect ", number: 9, suffix: " for the fish from the cold-room" },
          { prefix: "Must wear special ", number: 10, suffix: "" }
        ]
      ]
    }
  ],
  items: [
    {
      number: 1,
      type: "fill_notes",
      prefix: "First day at work - Name of supervisor: ",
      suffix: "",
      answers: ["Kaeden", "kaeden"]
    },
    {
      number: 2,
      type: "fill_notes",
      prefix: "Where to leave coat and bag: use ",
      suffix: " in staffroom",
      answers: ["locker", "lockers"]
    },
    {
      number: 3,
      type: "fill_notes",
      prefix: "See Tiffany in HR: to give ",
      suffix: "",
      answers: ["passport"]
    },
    {
      number: 4,
      type: "fill_notes",
      prefix: "to collect ",
      suffix: "",
      answers: ["uniform"]
    },
    {
      number: 5,
      type: "fill_notes",
      prefix: "Location of HR office: on ",
      suffix: " floor",
      answers: ["third", "3rd"]
    },
    {
      number: 6,
      type: "fill_notes",
      prefix: "Supervisor's mobile number: ",
      suffix: "",
      answers: ["0412 665 903", "0412665903"]
    },
    {
      number: 7,
      type: "fill_table",
      prefix: "Bakery section notes: Use ",
      suffix: " labels",
      answers: ["yellow"]
    },
    {
      number: 8,
      type: "fill_table",
      prefix: "Sushi takeaway counter (Task 1): Re-stock with ",
      suffix: " boxes if needed",
      answers: ["plastic"]
    },
    {
      number: 9,
      type: "fill_table",
      prefix: "Meat and fish counters (Task 2): Collect ",
      suffix: " for the fish from the cold-room",
      answers: ["ice"]
    },
    {
      number: 10,
      type: "fill_table",
      prefix: "Meat and fish counters notes: Must wear special ",
      suffix: "",
      answers: ["gloves"]
    }
  ]
};

export const cambridge19Test4ListeningPart2 = {
  partNumber: 2,
  title: "Part 2: Compton Park Runners Club",
  instructions: "Questions 11–12: Choose TWO letters, A–E.\nQuestions 13–14: Choose TWO letters, A–E.\nQuestions 15–18: Write the correct letter, A, B or C.\nQuestions 19–20: Choose the correct letter, A, B or C.",
  questionsRange: [11, 20],
  items: [
    {
      number: 11,
      type: "choose_two",
      pairNumber: 12,
      question: "Which TWO problems with some training programmes for new runners does Liz mention? (First selection):",
      options: [
        "A. There is a risk of serious injury.",
        "B. They are unsuitable for certain age groups.",
        "C. They are unsuitable for people with health issues.",
        "D. It is difficult to stay motivated.",
        "E. There is a lack of individual support."
      ],
      answers: ["C", "D"]
    },
    {
      number: 12,
      type: "choose_two",
      pairNumber: 11,
      question: "Which TWO problems with some training programmes for new runners does Liz mention? (Second selection):",
      options: [
        "A. There is a risk of serious injury.",
        "B. They are unsuitable for certain age groups.",
        "C. They are unsuitable for people with health issues.",
        "D. It is difficult to stay motivated.",
        "E. There is a lack of individual support."
      ],
      answers: ["C", "D"]
    },
    {
      number: 13,
      type: "choose_two",
      pairNumber: 14,
      question: "Which TWO tips does Liz recommend for new runners? (First selection):",
      options: [
        "A. doing two runs a week",
        "B. running in the evening",
        "C. going on runs with a friend",
        "D. listening to music during runs",
        "E. running very slowly"
      ],
      answers: ["B", "E"]
    },
    {
      number: 14,
      type: "choose_two",
      pairNumber: 13,
      question: "Which TWO tips does Liz recommend for new runners? (Second selection):",
      options: [
        "A. doing two runs a week",
        "B. running in the evening",
        "C. going on runs with a friend",
        "D. listening to music during runs",
        "E. running very slowly"
      ],
      answers: ["B", "E"]
    },
    {
      number: 15,
      type: "multiple_choice",
      question: "What reason prevented Ceri from joining until recently?",
      options: [
        "A. a lack of confidence",
        "B. a dislike of running",
        "C. a lack of time"
      ],
      answers: ["C"]
    },
    {
      number: 16,
      type: "multiple_choice",
      question: "What reason prevented James from joining until recently?",
      options: [
        "A. a lack of confidence",
        "B. a dislike of running",
        "C. a lack of time"
      ],
      answers: ["B"]
    },
    {
      number: 17,
      type: "multiple_choice",
      question: "What reason prevented Leo from joining until recently?",
      options: [
        "A. a lack of confidence",
        "B. a dislike of running",
        "C. a lack of time"
      ],
      answers: ["A"]
    },
    {
      number: 18,
      type: "multiple_choice",
      question: "What reason prevented Mark from joining until recently?",
      options: [
        "A. a lack of confidence",
        "B. a dislike of running",
        "C. a lack of time"
      ],
      answers: ["C"]
    },
    {
      number: 19,
      type: "multiple_choice",
      question: "What does Liz say about running her first marathon?",
      options: [
        "A. It had always been her ambition.",
        "B. Her husband persuaded her to do it.",
        "C. She nearly gave up before the end."
      ],
      answers: ["B"]
    },
    {
      number: 20,
      type: "multiple_choice",
      question: "Liz says new runners should sign up for a race",
      options: [
        "A. every six months.",
        "B. within a few weeks of taking up running.",
        "C. after completing several practice runs."
      ],
      answers: ["A"]
    }
  ]
};

