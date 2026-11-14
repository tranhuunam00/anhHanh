// Cambridge IELTS 19 Test 3 - Listening Parts 1 & 2 Data
// 100% Authentic Text and Questions from Cambridge 19.pdf (Pages 55-58)

export const cambridge19Test3ListeningPart1 = {
  partNumber: 1,
  title: "Part 1: Local Food Shops",
  instructions: "Questions 1–6: Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.\nQuestions 7–10: Complete the table below. Write ONE WORD ONLY for each answer.",
  questionsRange: [1, 10],
  contentBlocks: [
    {
      type: "notes",
      groupTitle: "Questions 1–6",
      instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
      title: "Local food shops",
      sections: [
        {
          heading: "Where to go",
          lines: [
            { text: "Fish market" },
            { prefix: "Kite Place — near the ", number: 1, suffix: "" },
            { prefix: "cross the ", number: 2, suffix: " and turn right" },
            { prefix: "best to go before ", number: 3, suffix: " pm, earlier than closing time" },
            { text: "Organic shop" },
            { prefix: "called '", number: 4, suffix: "'" },
            { text: "below a restaurant in the large, grey building" },
            { prefix: "look for the large ", number: 5, suffix: " outside" },
            { text: "Supermarket" },
            { prefix: "take a ", number: 6, suffix: " minibus, number 289" }
          ]
        }
      ]
    },
    {
      type: "table",
      groupTitle: "Questions 7–10",
      instructions: "Complete the table below. Write ONE WORD ONLY for each answer.",
      title: "Shopping",
      headers: ["", "To buy", "Other ideas"],
      rows: [
        ["Fish market", "a dozen prawns", { prefix: "a handful of ", number: 7, suffix: " (type of seaweed)" }],
        ["Organic shop", { prefix: "beans and a ", number: 8, suffix: " for dessert" }, { prefix: "spices and ", number: 9, suffix: "" }],
        ["Bakery", "a brown loaf", { prefix: "a ", number: 10, suffix: " tart" }]
      ]
    }
  ],
  items: [
    {
      number: 1,
      type: "fill_notes",
      prefix: "Where to go - Fish market: Kite Place — near the ",
      suffix: "",
      answers: ["harbour", "harbor"]
    },
    {
      number: 2,
      type: "fill_notes",
      prefix: "cross the ",
      suffix: " and turn right",
      answers: ["bridge"]
    },
    {
      number: 3,
      type: "fill_notes",
      prefix: "best to go before ",
      suffix: " pm, earlier than closing time",
      answers: ["3.30", "three thirty", "half past 3", "half past three"]
    },
    {
      number: 4,
      type: "fill_notes",
      prefix: "Organic shop called '",
      suffix: "'",
      answers: ["Rose", "rose"]
    },
    {
      number: 5,
      type: "fill_notes",
      prefix: "below a restaurant in the large, grey building: look for the large ",
      suffix: " outside",
      answers: ["Sign", "sign"]
    },
    {
      number: 6,
      type: "fill_notes",
      prefix: "Supermarket: take a ",
      suffix: " minibus, number 289",
      answers: ["purple"]
    },
    {
      number: 7,
      type: "fill_table",
      prefix: "Shopping (Fish market - Other ideas): a handful of ",
      suffix: " (type of seaweed)",
      answers: ["samphire"]
    },
    {
      number: 8,
      type: "fill_table",
      prefix: "Organic shop (To buy): beans and a ",
      suffix: " for dessert",
      answers: ["melon"]
    },
    {
      number: 9,
      type: "fill_table",
      prefix: "Organic shop (Other ideas): spices and ",
      suffix: "",
      answers: ["coconut"]
    },
    {
      number: 10,
      type: "fill_table",
      prefix: "Bakery (Other ideas): a ",
      suffix: " tart",
      answers: ["strawberry"]
    }
  ]
};

export const cambridge19Test3ListeningPart2 = {
  partNumber: 2,
  title: "Part 2: Children's Book Festival",
  instructions: "Questions 11–16: Choose SIX answers from the box and write the correct letter, A–H, next to Questions 11–16.\nQuestions 17–18: Choose TWO letters, A–E.\nQuestions 19–20: Choose TWO letters, A–E.",
  questionsRange: [11, 20],
  boxTitle: "Information (Questions 11–16)",
  boxOptions: [
    "A involves painting and drawing",
    "B will be led by a prize-winning author",
    "C is aimed at children with a disability",
    "D involves a drama activity",
    "E focuses on new relationships",
    "F is aimed at a specific age group",
    "G explores an unhappy feeling",
    "H raises awareness of a particular culture"
  ],
  items: [
    {
      number: 11,
      type: "matching",
      groupHeader: "Questions 11–16: What information is given about each of the following festival workshops? Choose SIX answers from the box and write the correct letter, A–H, next to Questions 11–16.",
      question: "Superheroes",
      options: [
        "A involves painting and drawing",
        "B will be led by a prize-winning author",
        "C is aimed at children with a disability",
        "D involves a drama activity",
        "E focuses on new relationships",
        "F is aimed at a specific age group",
        "G explores an unhappy feeling",
        "H raises awareness of a particular culture"
      ],
      answers: ["C"]
    },
    {
      number: 12,
      type: "matching",
      question: "Just do it",
      options: [
        "A involves painting and drawing",
        "B will be led by a prize-winning author",
        "C is aimed at children with a disability",
        "D involves a drama activity",
        "E focuses on new relationships",
        "F is aimed at a specific age group",
        "G explores an unhappy feeling",
        "H raises awareness of a particular culture"
      ],
      answers: ["D"]
    },
    {
      number: 13,
      type: "matching",
      question: "Count on me",
      options: [
        "A involves painting and drawing",
        "B will be led by a prize-winning author",
        "C is aimed at children with a disability",
        "D involves a drama activity",
        "E focuses on new relationships",
        "F is aimed at a specific age group",
        "G explores an unhappy feeling",
        "H raises awareness of a particular culture"
      ],
      answers: ["F"]
    },
    {
      number: 14,
      type: "matching",
      question: "Speak up",
      options: [
        "A involves painting and drawing",
        "B will be led by a prize-winning author",
        "C is aimed at children with a disability",
        "D involves a drama activity",
        "E focuses on new relationships",
        "F is aimed at a specific age group",
        "G explores an unhappy feeling",
        "H raises awareness of a particular culture"
      ],
      answers: ["G"]
    },
    {
      number: 15,
      type: "matching",
      question: "Jump for joy",
      options: [
        "A involves painting and drawing",
        "B will be led by a prize-winning author",
        "C is aimed at children with a disability",
        "D involves a drama activity",
        "E focuses on new relationships",
        "F is aimed at a specific age group",
        "G explores an unhappy feeling",
        "H raises awareness of a particular culture"
      ],
      answers: ["B"]
    },
    {
      number: 16,
      type: "matching",
      question: "Sticks and stones",
      options: [
        "A involves painting and drawing",
        "B will be led by a prize-winning author",
        "C is aimed at children with a disability",
        "D involves a drama activity",
        "E focuses on new relationships",
        "F is aimed at a specific age group",
        "G explores an unhappy feeling",
        "H raises awareness of a particular culture"
      ],
      answers: ["H"]
    },
    {
      number: 17,
      type: "choose_two",
      pairNumber: 18,
      groupHeader: "Questions 17–18: Choose TWO letters, A–E.",
      question: "Which TWO reasons does the speaker give for recommending Alive and Kicking? (First selection):",
      options: [
        "A. It will appeal to both boys and girls.",
        "B. The author is well known.",
        "C. It has colourful illustrations.",
        "D. It is funny.",
        "E. It deals with an important topic."
      ],
      answers: ["C", "D"]
    },
    {
      number: 18,
      type: "choose_two",
      pairNumber: 17,
      question: "Which TWO reasons does the speaker give for recommending Alive and Kicking? (Second selection):",
      options: [
        "A. It will appeal to both boys and girls.",
        "B. The author is well known.",
        "C. It has colourful illustrations.",
        "D. It is funny.",
        "E. It deals with an important topic."
      ],
      answers: ["C", "D"]
    },
    {
      number: 19,
      type: "choose_two",
      pairNumber: 20,
      question: "Which TWO pieces of advice does the speaker give to parents about reading? (First selection):",
      options: [
        "A. Encourage children to write down new vocabulary.",
        "B. Allow children to listen to audio books.",
        "C. Get recommendations from librarians.",
        "D. Give children a choice about what they read.",
        "E. Only read aloud to children until they can read independently."
      ],
      answers: ["B", "D"]
    },
    {
      number: 20,
      type: "choose_two",
      pairNumber: 19,
      question: "Which TWO pieces of advice does the speaker give to parents about reading? (Second selection):",
      options: [
        "A. Encourage children to write down new vocabulary.",
        "B. Allow children to listen to audio books.",
        "C. Get recommendations from librarians.",
        "D. Give children a choice about what they read.",
        "E. Only read aloud to children until they can read independently."
      ],
      answers: ["B", "D"]
    }
  ]
};

