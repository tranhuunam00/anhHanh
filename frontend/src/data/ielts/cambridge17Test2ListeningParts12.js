// Cambridge IELTS 17 Test 2 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Opportunities for voluntary work in Southoe village",
    instructions: "Questions 1–7: Complete the notes below. Write ONE WORD ONLY for each answer.\nQuestions 8–10: Complete the table below. Write ONE WORD ONLY for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Opportunities for voluntary work in Southoe village",
      sections: [
        {
          heading: "Library",
          lines: [
            { prefix: "Help with ", number: 1, suffix: " books (times to be arranged)" },
            { prefix: "Help needed to keep ", number: 2, suffix: " of books up to date" },
            { prefix: "Library is in the ", number: 3, suffix: " Room in the village hall" }
          ]
        },
        {
          heading: "Lunch club",
          lines: [
            { prefix: "Help by providing ", number: 4, suffix: "" },
            { prefix: "Help with hobbies such as ", number: 5, suffix: "" }
          ]
        },
        {
          heading: "Help for individuals needed next week",
          lines: [
            { prefix: "Taking Mrs Carroll to ", number: 6, suffix: "" },
            { prefix: "Work in the ", number: 7, suffix: " at Mr Selsbury's house" }
          ]
        }
      ]
    },
    tableBlock: {
      title: "Village social events",
      headers: ["Date", "Event", "Location", "Help needed"],
      rows: [
        [
          { text: "19 Oct" },
          { prefix: "", number: 8, suffix: "" },
          { text: "Village hall" },
          { text: "providing refreshments" }
        ],
        [
          { text: "18 Nov" },
          { text: "dance" },
          { text: "Village hall" },
          { prefix: "checking ", number: 9, suffix: "" }
        ],
        [
          { text: "31 Dec" },
          { text: "New Year's Eve party" },
          { text: "Mountfort Hotel" },
          { prefix: "designing the ", number: 10, suffix: "" }
        ]
      ]
    },
    items: [
      {
        number: 1,
        type: "fill_notes",
        section: "Library",
        prefix: "Help with ",
        suffix: " books (times to be arranged)",
        answer: "collecting",
        answers: ["collecting"]
      },
      {
        number: 2,
        type: "fill_notes",
        section: "Library",
        prefix: "Help needed to keep ",
        suffix: " of books up to date",
        answer: "records",
        answers: ["records"]
      },
      {
        number: 3,
        type: "fill_notes",
        section: "Library",
        prefix: "Library is in the ",
        suffix: " Room in the village hall",
        answer: "West",
        answers: ["West", "west"]
      },
      {
        number: 4,
        type: "fill_notes",
        section: "Lunch club",
        prefix: "Help by providing ",
        suffix: "",
        answer: "transport",
        answers: ["transport"]
      },
      {
        number: 5,
        type: "fill_notes",
        section: "Lunch club",
        prefix: "Help with hobbies such as ",
        suffix: "",
        answer: "art",
        answers: ["art"]
      },
      {
        number: 6,
        type: "fill_notes",
        section: "Help for individuals needed next week",
        prefix: "Taking Mrs Carroll to ",
        suffix: "",
        answer: "hospital",
        answers: ["hospital"]
      },
      {
        number: 7,
        type: "fill_notes",
        section: "Help for individuals needed next week",
        prefix: "Work in the ",
        suffix: " at Mr Selsbury's house",
        answer: "garden",
        answers: ["garden"]
      },
      {
        number: 8,
        type: "fill_table",
        prefix: "Event on 19 Oct: ",
        suffix: "",
        answer: "quiz",
        answers: ["quiz"]
      },
      {
        number: 9,
        type: "fill_table",
        prefix: "Help needed for dance on 18 Nov: checking ",
        suffix: "",
        answer: "tickets",
        answers: ["tickets"]
      },
      {
        number: 10,
        type: "fill_table",
        prefix: "Help needed on 31 Dec: designing the ",
        suffix: "",
        answer: "poster",
        answers: ["poster"]
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Oniton Hall",
    instructions: "Questions 11–14: Choose the correct letter, A, B or C.\nQuestions 15–20: Which activity is offered at each of the following locations on the farm? Choose SIX answers from the box and write the correct letter, A–H, next to Questions 15–20.",
    questionsRange: [11, 20],
    boxTitle: "Activities",
    boxOptions: [
      "A shopping",
      "B watching cows being milked",
      "C seeing old farming equipment",
      "D eating and drinking",
      "E starting a trip",
      "F seeing rare breeds of animals",
      "G helping to look after animals",
      "H using farming tools"
    ],
    items: [
      {
        number: 11,
        type: "multiple_choice",
        groupHeader: "Questions 11–14: Choose the correct letter, A, B or C.",
        question: "Many past owners made changes to",
        options: [
          "A the gardens.",
          "B the house.",
          "C the farm."
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 12,
        type: "multiple_choice",
        question: "Sir Edward Downes built Oniton Hall because he wanted",
        options: [
          "A a place for discussing politics.",
          "B a place to display his wealth.",
          "C a place for artists and writers."
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 13,
        type: "multiple_choice",
        question: "Visitors can learn about the work of servants in the past from",
        options: [
          "A audio guides.",
          "B photographs.",
          "C people in costume."
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 14,
        type: "multiple_choice",
        question: "What is new for children at Oniton Hall?",
        options: [
          "A clothes for dressing up",
          "B mini tractors",
          "C the adventure playground"
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 15,
        type: "matching",
        groupHeader: "Questions 15–20: Which activity is offered at each of the following locations on the farm?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 15–20.",
        question: "dairy",
        answer: "D",
        answers: ["D"]
      },
      {
        number: 16,
        type: "matching",
        question: "large barn",
        answer: "C",
        answers: ["C"]
      },
      {
        number: 17,
        type: "matching",
        question: "small barn",
        answer: "G",
        answers: ["G"]
      },
      {
        number: 18,
        type: "matching",
        question: "stables",
        answer: "A",
        answers: ["A"]
      },
      {
        number: 19,
        type: "matching",
        question: "shed",
        answer: "E",
        answers: ["E"]
      },
      {
        number: 20,
        type: "matching",
        question: "parkland",
        answer: "F",
        answers: ["F"]
      }
    ]
  }
];
