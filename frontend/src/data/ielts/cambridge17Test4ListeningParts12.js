// Cambridge IELTS 17 Test 4 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Easy Life Cleaning Services",
    instructions: "Complete the notes below.\nWrite ONE WORD for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Easy Life Cleaning Services",
      sections: [
        {
          heading: "Basic cleaning package offered",
          lines: [
            { text: "Cleaning all surfaces" },
            { prefix: "Cleaning the ", number: 1, suffix: " throughout the apartment" },
            { text: "Cleaning shower, sinks, toilet etc." }
          ]
        },
        {
          heading: "Additional services agreed",
          lines: [
            { text: "Every week", isSubheading: true },
            { prefix: "Cleaning the ", number: 2, suffix: "" },
            { prefix: "Ironing clothes – ", number: 3, suffix: " only" },
            { text: "Every month", isSubheading: true },
            { prefix: "Cleaning all the ", number: 4, suffix: " from the inside" },
            { prefix: "Washing down the ", number: 5, suffix: "" }
          ]
        },
        {
          heading: "Other possibilities & Information on the cleaners",
          lines: [
            { prefix: "They can organise a plumber or an ", number: 6, suffix: " if necessary." },
            { prefix: "A special cleaning service is available for customers who are allergic to ", number: 7, suffix: "." },
            { text: "Information on the cleaners", isSubheading: true },
            { prefix: "Before being hired, all cleaners have a background check carried out by the ", number: 8, suffix: "." },
            { text: "References are required." },
            { prefix: "All cleaners are given ", number: 9, suffix: " for two weeks." },
            { prefix: "Customers send a ", number: 10, suffix: " after each visit." },
            { text: "Usually, each customer has one regular cleaner." }
          ]
        }
      ]
    },
    items: [
      {
        number: 1,
        type: "fill_notes",
        section: "Basic cleaning package offered",
        prefix: "Cleaning the ",
        suffix: " throughout the apartment",
        answer: "floors",
        answers: ["floor", "floors"]
      },
      {
        number: 2,
        type: "fill_notes",
        section: "Additional services agreed",
        prefix: "Cleaning the ",
        suffix: "",
        answer: "fridge",
        answers: ["fridge"]
      },
      {
        number: 3,
        type: "fill_notes",
        section: "Additional services agreed",
        prefix: "Ironing clothes – ",
        suffix: " only",
        answer: "shirts",
        answers: ["shirts"]
      },
      {
        number: 4,
        type: "fill_notes",
        section: "Additional services agreed",
        prefix: "Cleaning all the ",
        suffix: " from the inside",
        answer: "windows",
        answers: ["windows"]
      },
      {
        number: 5,
        type: "fill_notes",
        section: "Additional services agreed",
        prefix: "Washing down the ",
        suffix: "",
        answer: "balcony",
        answers: ["balcony"]
      },
      {
        number: 6,
        type: "fill_notes",
        section: "Other possibilities",
        prefix: "They can organise a plumber or an ",
        suffix: " if necessary",
        answer: "electrician",
        answers: ["electrician"]
      },
      {
        number: 7,
        type: "fill_notes",
        section: "Other possibilities",
        prefix: "special cleaning service for customers allergic to ",
        suffix: "",
        answer: "dust",
        answers: ["dust"]
      },
      {
        number: 8,
        type: "fill_notes",
        section: "Information on the cleaners",
        prefix: "background check carried out by the ",
        suffix: "",
        answer: "police",
        answers: ["police"]
      },
      {
        number: 9,
        type: "fill_notes",
        section: "Information on the cleaners",
        prefix: "All cleaners are given ",
        suffix: " for two weeks",
        answer: "training",
        answers: ["training"]
      },
      {
        number: 10,
        type: "fill_notes",
        section: "Information on the cleaners",
        prefix: "Customers send a ",
        suffix: " after each visit",
        answer: "review",
        answers: ["review"]
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Managing Hotel Staff Turnover",
    instructions: "Questions 11–14: Choose the correct letter, A, B or C.\nQuestions 15–20: Which way of reducing staff turnover was used in each of the following hotels? Write the correct letter, A, B or C, next to Questions 15–20.",
    questionsRange: [11, 20],
    boxTitle: "Ways of reducing staff turnover",
    boxOptions: [
      "A improving relationships and teamwork",
      "B offering incentives and financial benefits",
      "C providing career opportunities"
    ],
    items: [
      {
        number: 11,
        type: "multiple_choice",
        groupHeader: "Questions 11–14: Choose the correct letter, A, B or C.",
        question: "Many hotel managers are unaware that their staff often leave because of",
        options: [
          "A a lack of training.",
          "B long hours.",
          "C low pay."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 12,
        type: "multiple_choice",
        question: "What is the impact of high staff turnover on managers?",
        options: [
          "A an increased workload",
          "B low morale",
          "C an inability to meet targets"
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 13,
        type: "multiple_choice",
        question: "What mistake should managers always avoid?",
        options: [
          "A failing to treat staff equally",
          "B reorganising shifts without warning",
          "C neglecting to have enough staff during busy periods"
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 14,
        type: "multiple_choice",
        question: "What unexpected benefit did Dunwich Hotel notice after improving staff retention rates?",
        options: [
          "A a fall in customer complaints",
          "B an increase in loyalty club membership",
          "C a rise in spending per customer"
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 15,
        type: "matching",
        groupHeader: "Questions 15–20: Which way of reducing staff turnover was used in each of the following hotels?\nWrite the correct letter, A, B or C, next to Questions 15–20.",
        question: "The Sun Club",
        answer: "A",
        answers: ["A"]
      },
      {
        number: 16,
        type: "matching",
        question: "The Portland",
        answer: "C",
        answers: ["C"]
      },
      {
        number: 17,
        type: "matching",
        question: "Bluewater Hotels",
        answer: "B",
        answers: ["B"]
      },
      {
        number: 18,
        type: "matching",
        question: "Pentlow Hotels",
        answer: "C",
        answers: ["C"]
      },
      {
        number: 19,
        type: "matching",
        question: "Green Planet",
        answer: "B",
        answers: ["B"]
      },
      {
        number: 20,
        type: "matching",
        question: "The Amesbury",
        answer: "A",
        answers: ["A"]
      }
    ]
  }
];
