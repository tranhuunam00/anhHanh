// Cambridge IELTS 18 Test 3 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Wayside Camera Club",
    instructions: "Questions 1–4: Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.\nQuestions 5–10: Complete the table below. Write NO MORE THAN TWO WORDS for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Wayside Camera Club membership form",
      sections: [
        {
          heading: "Personal details",
          lines: [
            { text: "Name: Dan Green" },
            { text: "Email address: dan1068@market.com" },
            { prefix: "Home address: 52 ", number: 1, suffix: " Street, Peacetown" },
            { prefix: "Heard about us: from a ", number: 2, suffix: "" },
            { text: "Reasons for joining:" },
            { text: "- to enter competitions" },
            { prefix: "- to ", number: 3, suffix: "" },
            { prefix: "Type of membership: ", number: 4, suffix: " membership (£30)" }
          ]
        }
      ]
    },
    tableBlock: {
      title: "Photography competitions",
      headers: ["Title of competition", "Instructions", "Feedback to Dan"],
      rows: [
        {
          cols: [
            { prefix: "'", number: 5, suffix: "'" },
            { text: "A scene in the home" },
            { text: "The picture's composition was not good." }
          ]
        },
        {
          cols: [
            { text: "'Beautiful Sunsets'" },
            { prefix: "Scene must show some ", number: 6, suffix: "" },
            { prefix: "The ", number: 7, suffix: " was wrong." }
          ]
        },
        {
          cols: [
            { prefix: "'", number: 8, suffix: "'" },
            { prefix: "Scene must show ", number: 9, suffix: "" },
            { prefix: "The photograph was too ", number: 10, suffix: "." }
          ]
        }
      ]
    },
    items: [
      {
        number: 1,
        type: "fill_notes",
        section: "Personal details",
        prefix: "Home address: 52 ",
        suffix: " Street, Peacetown",
        answer: "Marrowfield",
        answers: ["Marrowfield"]
      },
      {
        number: 2,
        type: "fill_notes",
        section: "Personal details",
        prefix: "Heard about us: from a ",
        suffix: "",
        answer: "relative",
        answers: ["relative"]
      },
      {
        number: 3,
        type: "fill_notes",
        section: "Personal details",
        prefix: "Reasons for joining: to ",
        suffix: "",
        answer: "socialise",
        answers: ["socialise", "socialize"]
      },
      {
        number: 4,
        type: "fill_notes",
        section: "Personal details",
        prefix: "Type of membership: ",
        suffix: " membership (£30)",
        answer: "full",
        answers: ["full"]
      },
      {
        number: 5,
        type: "fill_table",
        section: "Title of competition",
        prefix: "'",
        suffix: "'",
        answer: "Domestic Life",
        answers: ["Domestic Life", "Domestic life"]
      },
      {
        number: 6,
        type: "fill_table",
        section: "Instructions",
        prefix: "Scene must show some ",
        suffix: "",
        answer: "clouds",
        answers: ["clouds", "cloud"]
      },
      {
        number: 7,
        type: "fill_table",
        section: "Feedback to Dan",
        prefix: "The ",
        suffix: " was wrong.",
        answer: "timing",
        answers: ["timing"]
      },
      {
        number: 8,
        type: "fill_table",
        section: "Title of competition",
        prefix: "'",
        suffix: "'",
        answer: "Animal Magic",
        answers: ["Animal Magic"]
      },
      {
        number: 9,
        type: "fill_table",
        section: "Instructions",
        prefix: "Scene must show ",
        suffix: "",
        answer: "movement",
        answers: ["movement", "animal movement"]
      },
      {
        number: 10,
        type: "fill_table",
        section: "Feedback to Dan",
        prefix: "The photograph was too ",
        suffix: ".",
        answer: "dark",
        answers: ["dark"]
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Picking wild mushrooms",
    instructions: "Questions 11 and 12: Choose TWO letters, A–E.\nQuestions 13 and 14: Choose TWO letters, A–E.\nQuestions 15–20: Choose the correct letter, A, B or C.",
    questionsRange: [11, 20],
    items: [
      {
        number: 11,
        type: "choose_two",
        pairNumber: 12,
        groupHeader: "Questions 11 and 12: Choose TWO letters, A–E.",
        question: "Which TWO warnings does Dan give about picking mushrooms?",
        options: [
          "A Don't pick more than one variety of mushroom at a time.",
          "B Don't pick mushrooms near busy roads.",
          "C Don't eat mushrooms given to you.",
          "D Don't eat mushrooms while picking them.",
          "E Don't pick old mushrooms."
        ],
        answer: "B",
        acceptedAnswers: ["B", "D"],
        answers: ["B", "D"]
      },
      {
        number: 12,
        type: "choose_two",
        pairNumber: 11,
        question: "Which TWO warnings does Dan give about picking mushrooms? (Second choice)",
        options: [
          "A Don't pick more than one variety of mushroom at a time.",
          "B Don't pick mushrooms near busy roads.",
          "C Don't eat mushrooms given to you.",
          "D Don't eat mushrooms while picking them.",
          "E Don't pick old mushrooms."
        ],
        answer: "D",
        acceptedAnswers: ["B", "D"],
        answers: ["B", "D"]
      },
      {
        number: 13,
        type: "choose_two",
        pairNumber: 14,
        groupHeader: "Questions 13 and 14: Choose TWO letters, A–E.",
        question: "Which TWO ideas about wild mushrooms does Dan say are correct?",
        options: [
          "A Mushrooms should always be peeled before eating.",
          "B Mushrooms eaten by animals may be unsafe.",
          "C Cooking destroys toxins in mushrooms.",
          "D Brightly coloured mushrooms can be edible.",
          "E All poisonous mushrooms have a bad smell."
        ],
        answer: "B",
        acceptedAnswers: ["B", "D"],
        answers: ["B", "D"]
      },
      {
        number: 14,
        type: "choose_two",
        pairNumber: 13,
        question: "Which TWO ideas about wild mushrooms does Dan say are correct? (Second choice)",
        options: [
          "A Mushrooms should always be peeled before eating.",
          "B Mushrooms eaten by animals may be unsafe.",
          "C Cooking destroys toxins in mushrooms.",
          "D Brightly coloured mushrooms can be edible.",
          "E All poisonous mushrooms have a bad smell."
        ],
        answer: "D",
        acceptedAnswers: ["B", "D"],
        answers: ["B", "D"]
      },
      {
        number: 15,
        type: "multiple_choice",
        groupHeader: "Questions 15–20: Choose the correct letter, A, B or C.",
        question: "What advice does Dan give about picking mushrooms in parks?",
        options: [
          "A Choose wooded areas.",
          "B Don't disturb wildlife.",
          "C Get there early."
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 16,
        type: "multiple_choice",
        question: "Dan says it is a good idea for beginners to",
        options: [
          "A use a mushroom app.",
          "B join a group.",
          "C take a reference book."
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 17,
        type: "multiple_choice",
        question: "What does Dan say is important for conservation?",
        options: [
          "A selecting only fully grown mushrooms",
          "B picking a limited amount of mushrooms",
          "C avoiding areas where rare mushroom species grow"
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 18,
        type: "multiple_choice",
        question: "According to Dan, some varieties of wild mushrooms are in decline because there is",
        options: [
          "A a huge demand for them from restaurants.",
          "B a lack of rain in this part of the country.",
          "C a rise in building developments locally."
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 19,
        type: "multiple_choice",
        question: "Dan says that when storing mushrooms, people should",
        options: [
          "A keep them in the fridge for no more than two days.",
          "B keep them in a brown bag in a dark room.",
          "C leave them for a period after washing them."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 20,
        type: "multiple_choice",
        question: "What does Dan say about trying new varieties of mushrooms?",
        options: [
          "A Experiment with different recipes.",
          "B Expect some to have a strong taste.",
          "C Cook them for a long time."
        ],
        answer: "A",
        answers: ["A"]
      }
    ]
  }
];

