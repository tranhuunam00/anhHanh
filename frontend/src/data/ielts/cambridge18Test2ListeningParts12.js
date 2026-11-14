// Cambridge IELTS 18 Test 2 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Working at Milo's Restaurants",
    instructions: "Questions 1–5: Complete the notes below. Write ONE WORD ONLY for each answer.\nQuestions 6–10: Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Working at Milo's Restaurants",
      sections: [
        {
          heading: "Benefits",
          lines: [
            { prefix: "- ", number: 1, suffix: " provided for all staff" },
            { prefix: "- ", number: 2, suffix: " during weekdays at all Milo's Restaurants" },
            { prefix: "- ", number: 3, suffix: " provided after midnight" }
          ]
        },
        {
          heading: "Person specification",
          lines: [
            { text: "- must be prepared to work well in a team" },
            { prefix: "- must care about maintaining a high standard of ", number: 4, suffix: "" },
            { prefix: "- must have a qualification in ", number: 5, suffix: "" }
          ]
        }
      ]
    },
    tableBlock: {
      title: "Job Vacancies at Milo's Restaurants",
      headers: ["Location", "Job title", "Responsibilities include", "Pay and conditions"],
      rows: [
        {
          cols: [
            { prefix: "", number: 6, suffix: " Street" },
            { text: "Breakfast supervisor" },
            { prefix: "Checking portions, etc. are correct; Making sure ", number: 7, suffix: " is clean" },
            { prefix: "Starting salary £", number: 8, suffix: " per hour; Start work at 5.30 a.m." }
          ]
        },
        {
          cols: [
            { text: "City Road" },
            { text: "Junior chef" },
            { prefix: "Supporting senior chefs; Maintaining stock and organising ", number: 9, suffix: "" },
            { prefix: "Annual salary £23,000; No work on a ", number: 10, suffix: " — once a month" }
          ]
        }
      ]
    },
    items: [
      {
        number: 1,
        type: "fill_notes",
        section: "Benefits",
        prefix: "",
        suffix: " provided for all staff",
        answer: "training",
        answers: ["training"]
      },
      {
        number: 2,
        type: "fill_notes",
        section: "Benefits",
        prefix: "",
        suffix: " during weekdays at all Milo's Restaurants",
        answer: "discount",
        answers: ["discount"]
      },
      {
        number: 3,
        type: "fill_notes",
        section: "Benefits",
        prefix: "",
        suffix: " provided after midnight",
        answer: "taxi",
        answers: ["taxi"]
      },
      {
        number: 4,
        type: "fill_notes",
        section: "Person specification",
        prefix: "must care about maintaining a high standard of ",
        suffix: "",
        answer: "service",
        answers: ["service"]
      },
      {
        number: 5,
        type: "fill_notes",
        section: "Person specification",
        prefix: "must have a qualification in ",
        suffix: "",
        answer: "English",
        answers: ["English", "english"]
      },
      {
        number: 6,
        type: "fill_table",
        section: "Location",
        prefix: "",
        suffix: " Street",
        answer: "Wivenhoe",
        answers: ["Wivenhoe"]
      },
      {
        number: 7,
        type: "fill_table",
        section: "Responsibilities",
        prefix: "Making sure ",
        suffix: " is clean",
        answer: "equipment",
        answers: ["equipment"]
      },
      {
        number: 8,
        type: "fill_table",
        section: "Pay and conditions",
        prefix: "Starting salary £",
        suffix: " per hour",
        answer: "9.75",
        answers: ["9.75", "9,75"]
      },
      {
        number: 9,
        type: "fill_table",
        section: "Responsibilities",
        prefix: "Maintaining stock and organising ",
        suffix: "",
        answer: "deliveries",
        answers: ["deliveries", "delivery"]
      },
      {
        number: 10,
        type: "fill_table",
        section: "Pay and conditions",
        prefix: "No work on a ",
        suffix: " — once a month",
        answer: "Sunday",
        answers: ["Sunday", "sunday"]
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Planned housing development",
    instructions: "Questions 11 and 12: Choose TWO letters, A–E.\nQuestions 13 and 14: Choose TWO letters, A–E.\nQuestions 15–20: Label the map below. Write the correct letter, A–I, next to Questions 15–20.",
    questionsRange: [11, 20],
    mapImage: "/images/ielts/cam18_test2_listening_map.png",
    mapLetters: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    items: [
      {
        number: 11,
        type: "choose_two",
        pairNumber: 12,
        groupHeader: "Questions 11 and 12: Choose TWO letters, A–E.",
        question: "What are the TWO main reasons why this site has been chosen for the housing development?",
        options: [
          "A It has suitable geographical features.",
          "B There is easy access to local facilities.",
          "C It has good connections with the airport.",
          "D The land is of little agricultural value.",
          "E It will be convenient for workers."
        ],
        answer: "B",
        acceptedAnswers: ["B", "E"],
        answers: ["B", "E"]
      },
      {
        number: 12,
        type: "choose_two",
        pairNumber: 11,
        question: "What are the TWO main reasons why this site has been chosen for the housing development? (Second choice)",
        options: [
          "A It has suitable geographical features.",
          "B There is easy access to local facilities.",
          "C It has good connections with the airport.",
          "D The land is of little agricultural value.",
          "E It will be convenient for workers."
        ],
        answer: "E",
        acceptedAnswers: ["B", "E"],
        answers: ["B", "E"]
      },
      {
        number: 13,
        type: "choose_two",
        pairNumber: 14,
        groupHeader: "Questions 13 and 14: Choose TWO letters, A–E.",
        question: "Which TWO aspects of the planned housing development have people given positive feedback about?",
        options: [
          "A the facilities for cyclists",
          "B the impact on the environment",
          "C the encouragement of good relations between residents",
          "D the low cost of all the accommodation",
          "E the rural location"
        ],
        answer: "B",
        acceptedAnswers: ["B", "C"],
        answers: ["B", "C"]
      },
      {
        number: 14,
        type: "choose_two",
        pairNumber: 13,
        question: "Which TWO aspects of the planned housing development have people given positive feedback about? (Second choice)",
        options: [
          "A the facilities for cyclists",
          "B the impact on the environment",
          "C the encouragement of good relations between residents",
          "D the low cost of all the accommodation",
          "E the rural location"
        ],
        answer: "C",
        acceptedAnswers: ["B", "C"],
        answers: ["B", "C"]
      },
      {
        number: 15,
        type: "map_labeling",
        question: "School",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        answer: "H",
        answers: ["H"]
      },
      {
        number: 16,
        type: "map_labeling",
        question: "Sports centre",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 17,
        type: "map_labeling",
        question: "Clinic",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        answer: "D",
        answers: ["D"]
      },
      {
        number: 18,
        type: "map_labeling",
        question: "Community centre",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 19,
        type: "map_labeling",
        question: "Supermarket",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 20,
        type: "map_labeling",
        question: "Playground",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        answer: "I",
        answers: ["I", "E"]
      }
    ]
  }
];

