// Cambridge IELTS 18 Test 1 - Listening Parts 3 & 4
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: Talk on jobs in fashion design",
    instructions: "Questions 21–26: Choose the correct letter, A, B or C.\nQuestions 27 and 28: Choose TWO letters, A–E.\nQuestions 29 and 30: Choose TWO letters, A–E.",
    questionsRange: [21, 30],
    items: [
      {
        number: 21,
        type: "multiple_choice",
        question: "What problem did Chantal have at the start of the talk?",
        options: [
          "A Her view of the speaker was blocked.",
          "B She was unable to find an empty seat.",
          "C The students next to her were talking."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 22,
        type: "multiple_choice",
        question: "What were Hugo and Chantal surprised to hear about the job market?",
        options: [
          "A It has become more competitive than it used to be.",
          "B There is more variety in it than they had realised.",
          "C Some areas of it are more exciting than others."
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 23,
        type: "multiple_choice",
        question: "Hugo and Chantal agree that the speaker's message was",
        options: [
          "A unfair to them at times.",
          "B hard for them to follow.",
          "C critical of the industry."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 24,
        type: "multiple_choice",
        question: "What do Hugo and Chantal criticise about their school careers advice?",
        options: [
          "A when they received the advice",
          "B how much advice was given",
          "C who gave the advice"
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 25,
        type: "multiple_choice",
        question: "When discussing their future, Hugo and Chantal disagree on",
        options: [
          "A which is the best career in fashion.",
          "B when to choose a career in fashion.",
          "C why they would like a career in fashion."
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 26,
        type: "multiple_choice",
        question: "How does Hugo feel about being an unpaid assistant?",
        options: [
          "A He is realistic about the practice.",
          "B He feels the practice is dishonest.",
          "C He thinks others want to change the practice."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 27,
        type: "choose_two",
        pairNumber: 28,
        question: "Which TWO mistakes did the speaker admit she made in her first job?",
        options: [
          "A being dishonest to her employer",
          "B paying too much attention to how she looked",
          "C expecting to become well known",
          "D trying to earn a lot of money",
          "E openly disliking her client"
        ],
        answer: "B",
        acceptedAnswers: ["B", "E"],
        answers: ["B", "E"]
      },
      {
        number: 28,
        type: "choose_two",
        pairNumber: 27,
        question: "Which TWO mistakes did the speaker admit she made in her first job? (Second choice)",
        options: [
          "A being dishonest to her employer",
          "B paying too much attention to how she looked",
          "C expecting to become well known",
          "D trying to earn a lot of money",
          "E openly disliking her client"
        ],
        answer: "E",
        acceptedAnswers: ["B", "E"],
        answers: ["B", "E"]
      },
      {
        number: 29,
        type: "choose_two",
        pairNumber: 30,
        question: "Which TWO pieces of retail information do Hugo and Chantal agree would be useful?",
        options: [
          "A the reasons people return fashion items",
          "B how much time people have to shop for clothes",
          "C fashion designs people want but can't find",
          "D the best time of year for fashion buying",
          "E the most popular fashion sizes"
        ],
        answer: "A",
        acceptedAnswers: ["A", "C"],
        answers: ["A", "C"]
      },
      {
        number: 30,
        type: "choose_two",
        pairNumber: 29,
        question: "Which TWO pieces of retail information do Hugo and Chantal agree would be useful? (Second choice)",
        options: [
          "A the reasons people return fashion items",
          "B how much time people have to shop for clothes",
          "C fashion designs people want but can't find",
          "D the best time of year for fashion buying",
          "E the most popular fashion sizes"
        ],
        answer: "C",
        acceptedAnswers: ["A", "C"],
        answers: ["A", "C"]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: Elephant translocation",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    noteBlock: {
      title: "Elephant translocation",
      sections: [
        {
          heading: "Reasons for overpopulation at Majete National Park",
          lines: [
            { text: "- strict enforcement of anti-poaching laws" },
            { text: "- successful breeding" }
          ]
        },
        {
          heading: "Problems caused by elephant overpopulation",
          lines: [
            { text: "- greater competition, causing hunger for elephants" },
            { prefix: "- damage to ", number: 31, suffix: " in the park" }
          ]
        },
        {
          heading: "The translocation process",
          lines: [
            { prefix: "- a suitable group of elephants from the same ", number: 32, suffix: " was selected" },
            { prefix: "- vets and park staff made use of ", number: 33, suffix: " to help guide the elephants into an open plain" },
            { text: "- elephants were immobilised with tranquilisers" },
            { prefix: "  - this process had to be completed quickly to reduce ", number: 34, suffix: "" },
            { prefix: "  - elephants had to be turned on their ", number: 35, suffix: " to avoid damage to their lungs" },
            { prefix: "  - elephants' ", number: 36, suffix: " had to be monitored constantly" },
            { text: "  - tracking devices were fitted to the matriarchs" },
            { prefix: "  - data including the size of their tusks and ", number: 37, suffix: " was taken" },
            { text: "- elephants were taken by truck to their new reserve" }
          ]
        },
        {
          heading: "Advantages of translocation at Nkhotakota Wildlife Park",
          lines: [
            { prefix: "- ", number: 38, suffix: " opportunities" },
            { prefix: "- a reduction in the number of poachers and ", number: 39, suffix: "" },
            { prefix: "- an increase in ", number: 40, suffix: " as a contributor to GDP" },
            { text: "- an example of conservation that other parks can follow" }
          ]
        }
      ]
    },
    items: [
      {
        number: 31,
        type: "fill_notes",
        section: "Problems caused by elephant overpopulation",
        prefix: "- damage to ",
        suffix: " in the park",
        answer: "fences",
        answers: ["fences"]
      },
      {
        number: 32,
        type: "fill_notes",
        section: "The translocation process",
        prefix: "- a suitable group of elephants from the same ",
        suffix: " was selected",
        answer: "family",
        answers: ["family"]
      },
      {
        number: 33,
        type: "fill_notes",
        section: "The translocation process",
        prefix: "- vets and park staff made use of ",
        suffix: " to help guide the elephants into an open plain",
        answer: "helicopters",
        answers: ["helicopters"]
      },
      {
        number: 34,
        type: "fill_notes",
        section: "The translocation process",
        prefix: "this process had to be completed quickly to reduce ",
        suffix: "",
        answer: "stress",
        answers: ["stress"]
      },
      {
        number: 35,
        type: "fill_notes",
        section: "The translocation process",
        prefix: "elephants had to be turned on their ",
        suffix: " to avoid damage to their lungs",
        answer: "sides",
        answers: ["sides"]
      },
      {
        number: 36,
        type: "fill_notes",
        section: "The translocation process",
        prefix: "elephants' ",
        suffix: " had to be monitored constantly",
        answer: "breathing",
        answers: ["breathing"]
      },
      {
        number: 37,
        type: "fill_notes",
        section: "The translocation process",
        prefix: "data including the size of their tusks and ",
        suffix: " was taken",
        answer: "feet",
        answers: ["feet"]
      },
      {
        number: 38,
        type: "fill_notes",
        section: "Advantages of translocation at Nkhotakota Wildlife Park",
        prefix: "",
        suffix: " opportunities",
        answer: "employment",
        answers: ["employment"]
      },
      {
        number: 39,
        type: "fill_notes",
        section: "Advantages of translocation at Nkhotakota Wildlife Park",
        prefix: "a reduction in the number of poachers and ",
        suffix: "",
        answer: "weapons",
        answers: ["weapons"]
      },
      {
        number: 40,
        type: "fill_notes",
        section: "Advantages of translocation at Nkhotakota Wildlife Park",
        prefix: "an increase in ",
        suffix: " as a contributor to GDP",
        answer: "tourism",
        answers: ["tourism"]
      }
    ]
  }
];

