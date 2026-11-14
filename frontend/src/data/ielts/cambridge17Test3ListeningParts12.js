// Cambridge IELTS 17 Test 3 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Advice on surfing holidays",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Advice on surfing holidays",
      sections: [
        {
          heading: "Jack's advice",
          lines: [
            { prefix: "Recommends surfing for ", number: 1, suffix: " holidays in the summer" },
            { prefix: "Need to be quite ", number: 2, suffix: "" }
          ]
        },
        {
          heading: "Irish surfing locations",
          lines: [
            { text: "County Clare", isSubheading: true },
            { prefix: "Lahinch has some good quality ", number: 3, suffix: " and surf schools" },
            { text: "There are famous cliffs nearby" },
            { text: "County Mayo", isSubheading: true },
            { prefix: "Good surf school at ", number: 4, suffix: " beach" },
            { prefix: "Surf camp lasts for one ", number: 5, suffix: "" },
            { prefix: "Can also explore the local ", number: 6, suffix: " by kayak" }
          ]
        },
        {
          heading: "Weather & Costs",
          lines: [
            { prefix: "Best month to go: ", number: 7, suffix: "" },
            { prefix: "Average temperature in summer: approx. ", number: 8, suffix: " degrees" },
            { text: "Costs", isSubheading: true },
            { prefix: "Wetsuit and surfboard: ", number: 9, suffix: " euros per day" },
            { prefix: "Also advisable to hire ", number: 10, suffix: " for warmth" }
          ]
        }
      ]
    },
    items: [
      {
        number: 1,
        type: "fill_notes",
        section: "Jack's advice",
        prefix: "Recommends surfing for ",
        suffix: " holidays in the summer",
        answer: "family",
        answers: ["family"]
      },
      {
        number: 2,
        type: "fill_notes",
        section: "Jack's advice",
        prefix: "Need to be quite ",
        suffix: "",
        answer: "fit",
        answers: ["fit"]
      },
      {
        number: 3,
        type: "fill_notes",
        section: "County Clare",
        prefix: "Lahinch has some good quality ",
        suffix: " and surf schools",
        answer: "hotels",
        answers: ["hotels"]
      },
      {
        number: 4,
        type: "fill_notes",
        section: "County Mayo",
        prefix: "Good surf school at ",
        suffix: " beach",
        answer: "Carrowniskey",
        answers: ["Carrowniskey"]
      },
      {
        number: 5,
        type: "fill_notes",
        section: "County Mayo",
        prefix: "Surf camp lasts for one ",
        suffix: "",
        answer: "week",
        answers: ["week"]
      },
      {
        number: 6,
        type: "fill_notes",
        section: "County Mayo",
        prefix: "Can also explore the local ",
        suffix: " by kayak",
        answer: "bay",
        answers: ["bay"]
      },
      {
        number: 7,
        type: "fill_notes",
        section: "Weather",
        prefix: "Best month to go: ",
        suffix: "",
        answer: "September",
        answers: ["September", "september"]
      },
      {
        number: 8,
        type: "fill_notes",
        section: "Weather",
        prefix: "Average temperature in summer: approx. ",
        suffix: " degrees",
        answer: "19",
        answers: ["19", "nineteen"]
      },
      {
        number: 9,
        type: "fill_notes",
        section: "Costs",
        prefix: "Wetsuit and surfboard: ",
        suffix: " euros per day",
        answer: "30",
        answers: ["30", "thirty"]
      },
      {
        number: 10,
        type: "fill_notes",
        section: "Costs",
        prefix: "Also advisable to hire ",
        suffix: " for warmth",
        answer: "boots",
        answers: ["boots"]
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Primary school extended hours childcare service",
    instructions: "Questions 11 and 12: Choose TWO letters, A–E.\nQuestions 13–15: Choose the correct letter, A, B or C.\nQuestions 16–20: What information is given about each of the following activities on offer? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.",
    questionsRange: [11, 20],
    boxTitle: "Information",
    boxOptions: [
      "A has limited availability",
      "B is no longer available",
      "C is for over 8s only",
      "D requires help from parents",
      "E involves an additional fee",
      "F is a new activity",
      "G was requested by children"
    ],
    items: [
      {
        number: 11,
        type: "choose_two",
        groupHeader: "Questions 11 and 12: Choose TWO letters, A–E.",
        pairNumber: 12,
        question: "Which TWO facts are given about the school's extended hours childcare service?",
        options: [
          "A It started recently.",
          "B More children attend after school than before school.",
          "C An average of 50 children attend in the mornings.",
          "D A child cannot attend both the before and after school sessions.",
          "E The maximum number of children who can attend is 70."
        ],
        answer: "B",
        acceptedAnswers: ["B", "E"],
        answers: ["B", "E"]
      },
      {
        number: 12,
        type: "choose_two",
        pairNumber: 11,
        question: "Which TWO facts are given about the school's extended hours childcare service? (Second choice)",
        options: [
          "A It started recently.",
          "B More children attend after school than before school.",
          "C An average of 50 children attend in the mornings.",
          "D A child cannot attend both the before and after school sessions.",
          "E The maximum number of children who can attend is 70."
        ],
        answer: "E",
        acceptedAnswers: ["B", "E"],
        answers: ["B", "E"]
      },
      {
        number: 13,
        type: "multiple_choice",
        groupHeader: "Questions 13–15: Choose the correct letter, A, B or C.",
        question: "How much does childcare cost for a complete afternoon session per child?",
        options: [
          "A £3.50",
          "B £5.70",
          "C £7.20"
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 14,
        type: "multiple_choice",
        question: "What does the manager say about food?",
        options: [
          "A Children with allergies should bring their own food.",
          "B Children may bring healthy snacks with them.",
          "C Children are given a proper meal at 5 p.m."
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 15,
        type: "multiple_choice",
        question: "What is different about arrangements in the school holidays?",
        options: [
          "A Children from other schools can attend.",
          "B Older children can attend.",
          "C A greater number of children can attend."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 16,
        type: "matching",
        groupHeader: "Questions 16–20: What information is given about each of the following activities on offer?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.",
        question: "Spanish",
        answer: "E",
        answers: ["E"]
      },
      {
        number: 17,
        type: "matching",
        question: "Music",
        answer: "D",
        answers: ["D"]
      },
      {
        number: 18,
        type: "matching",
        question: "Painting",
        answer: "G",
        answers: ["G"]
      },
      {
        number: 19,
        type: "matching",
        question: "Yoga",
        answer: "F",
        answers: ["F"]
      },
      {
        number: 20,
        type: "matching",
        question: "Cooking",
        answer: "C",
        answers: ["C"]
      }
    ]
  }
];
