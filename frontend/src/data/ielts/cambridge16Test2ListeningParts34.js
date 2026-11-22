// Cambridge IELTS 16 Test 2 - Listening Parts 3 & 4
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: Assignment on sleep and dreams",
    questionsRange: [21, 30],
    groups: [
      {
        groupType: "multiple_choice",
        instructions: "Choose the correct letter, A, B or C.",
        numbers: [21, 22, 23, 24],
        items: [
          {
            number: 21,
            question: "Luke read that one reason why we often forget dreams is that",
            options: [
              "A our memories cannot cope with too much information.",
              "B we might otherwise be confused about what is real.",
              "C we do not think they are important."
            ],
            answers: ["B"]
          },
          {
            number: 22,
            question: "What do Luke and Susie agree about dreams predicting the future?",
            options: [
              "A It may just be due to chance.",
              "B It only happens with certain types of event.",
              "C It happens more often than some people think."
            ],
            answers: ["A"]
          },
          {
            number: 23,
            question: "Susie says that a study on pre-school children having a short nap in the day",
            options: [
              "A had controversial results.",
              "B used faulty research methodology.",
              "C failed to reach any clear conclusions."
            ],
            answers: ["C"]
          },
          {
            number: 24,
            question: "In their last assignment, both students had problems with",
            options: [
              "A statistical analysis.",
              "B making an action plan.",
              "C self-assessment."
            ],
            answers: ["C"]
          }
        ]
      },
      {
        groupType: "flowchart",
        instructions: "Complete the flow chart below.\nWrite ONE WORD ONLY for each answer.",
        title: "Assignment plan",
        steps: [
          { text: "Decide on research question: Is there a relationship between hours of sleep and number of dreams?" },
          { prefix: "Decide on sample: Twelve students from the ", number: 25, suffix: " department", answers: ["history"] },
          { text: "Decide on methodology: Self-reporting" },
          { prefix: "Decide on procedure: Answers on ", number: 26, suffix: "", answers: ["paper"] },
          { prefix: "Check ethical guidelines for working with ", number: 27, suffix: "", answers: ["humans", "people", "humans / people"] },
          { prefix: "Ensure that risk is assessed and ", number: 28, suffix: " is kept to a minimum", answers: ["stress"] },
          { prefix: "Analyse the results: Calculate the correlation and make a ", number: 29, suffix: "", answers: ["graph"] },
          { prefix: "", number: 30, suffix: " the research", answers: ["evaluate", "Evaluate"] }
        ],
        items: [
          { number: 25, answers: ["history"] },
          { number: 26, answers: ["paper"] },
          { number: 27, answers: ["humans", "people", "humans / people"] },
          { number: 28, answers: ["stress"] },
          { number: 29, answers: ["graph"] },
          { number: 30, answers: ["evaluate", "Evaluate"] }
        ]
      }
    ],
    items: [
      { number: 21, answers: ["B"] },
      { number: 22, answers: ["A"] },
      { number: 23, answers: ["C"] },
      { number: 24, answers: ["C"] },
      { number: 25, answers: ["history"] },
      { number: 26, answers: ["paper"] },
      { number: 27, answers: ["humans", "people", "humans / people"] },
      { number: 28, answers: ["stress"] },
      { number: 29, answers: ["graph"] },
      { number: 30, answers: ["evaluate", "Evaluate"] }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: Health benefits of dance",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    noteBlock: {
      title: "Health benefits of dance",
      sections: [
        {
          heading: "Recent findings",
          lines: [
            { text: "• All forms of dance produce various hormones associated with feelings of happiness." },
            { text: "• Dancing with others has a more positive impact than dancing alone." },
            { prefix: "• An experiment on university students suggested that dance increases ", number: 31, suffix: "." },
            { prefix: "• For those with mental illness, dance could be used as a form of ", number: 32, suffix: "." }
          ]
        },
        {
          heading: "Benefits of dance for older people",
          lines: [
            { prefix: "• Accessible for people with low levels of ", number: 33, suffix: "." },
            { text: "• Reduces the risk of heart disease." },
            { prefix: "• Better ", number: 34, suffix: " reduces the risk of accidents." },
            { prefix: "• Improves ", number: 35, suffix: " function by making you think about postures and movements." },
            { prefix: "• Motivate people to take more exercise, helping with ", number: 36, suffix: "." }
          ]
        },
        {
          heading: "Benefits of dance for children",
          lines: [
            { prefix: "• Helps children who are experiencing feelings of ", number: 37, suffix: "." },
            { prefix: "• Dancing burns about the same number of ", number: 38, suffix: " as other sports like cycling." },
            { prefix: "• Can be an effective way to help children prevent ", number: 39, suffix: "." },
            { prefix: "• Children who dance regular classes develop it into a lifelong ", number: 40, suffix: "." }
          ]
        }
      ]
    },
    items: [
      { number: 31, answers: ["creativity"] },
      { number: 32, answers: ["therapy"] },
      { number: 33, answers: ["fitness"] },
      { number: 34, answers: ["balance"] },
      { number: 35, answers: ["brain"] },
      { number: 36, answers: ["motivation"] },
      { number: 37, answers: ["isolation"] },
      { number: 38, answers: ["calories"] },
      { number: 39, answers: ["obesity"] },
      { number: 40, answers: ["habit"] }
    ]
  }
];
