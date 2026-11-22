// Cambridge IELTS 16 Test 3 - Listening Parts 3 & 4
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: Artificial sweeteners & Calorie research",
    questionsRange: [21, 30],
    groups: [
      {
        groupType: "pick_multiple",
        instructions: "Choose TWO letters, A–E.\nWhich TWO points does Adam make about his experiment on artificial sweeteners?",
        numbers: [21, 22],
        options: [
          "A The results were what he had predicted.",
          "B The experiment was simple to set up.",
          "C A large sample of people was tested.",
          "D The subjects were unaware of what they were drinking.",
          "E The test was repeated several times for each person."
        ],
        items: [
          { number: 21, question: "Points Adam makes about experiment on artificial sweeteners (1 of 2)", answers: ["C", "D"] },
          { number: 22, question: "Points Adam makes about experiment on artificial sweeteners (2 of 2)", answers: ["C", "D"] }
        ]
      },
      {
        groupType: "pick_multiple",
        instructions: "Choose TWO letters, A–E.\nWhich TWO problems did Rosie have with her study on fruit drink consumption?",
        numbers: [23, 24],
        options: [
          "A Participants forgot to complete the dairy entries.",
          "B People miscalculated their serving sizes.",
          "C Some people dropped out of the study.",
          "D The drink was too expensive to provide.",
          "E The nutritional information on labels was inaccurate."
        ],
        items: [
          { number: 23, question: "Problems Rosie had with her study (1 of 2)", answers: ["C", "E"] },
          { number: 24, question: "Problems Rosie had with her study (2 of 2)", answers: ["C", "E"] }
        ]
      },
      {
        groupType: "multiple_choice",
        instructions: "Choose the correct letter, A, B or C.",
        numbers: [25, 26, 27, 28, 29, 30],
        items: [
          {
            number: 25,
            question: "Adam suggests that restaurants could reduce obesity if their menus",
            options: [
              "A offered fewer options.",
              "B had more low-calorie foods.",
              "C were organised in a particular way."
            ],
            answers: ["C"]
          },
          {
            number: 26,
            question: "The students agree that food manufacturers deliberately",
            options: [
              "A make calorie counts hard to understand.",
              "B fail to provide accurate calorie counts.",
              "C use ineffective methods to reduce calories."
            ],
            answers: ["A"]
          },
          {
            number: 27,
            question: "What does Rosie say about levels of exercise among teenagers?",
            options: [
              "A They do less exercise than previous generations.",
              "B Many teenagers get enough exercise through daily activities.",
              "C School sports programmes are not appealing enough."
            ],
            answers: ["B"]
          },
          {
            number: 28,
            question: "What point does Adam make about government food campaigns?",
            options: [
              "A They focus on the wrong target audience.",
              "B They underestimate the influence of advertising.",
              "C They do not produce long-term changes in behaviour."
            ],
            answers: ["A"]
          },
          {
            number: 29,
            question: "Rosie was surprised that in a study of university students,",
            options: [
              "A cooking skills had little influence on diet quality.",
              "B fast food consumption was lower than expected.",
              "C male students ate more healthily than female students."
            ],
            answers: ["A"]
          },
          {
            number: 30,
            question: "What advice do the students give about starting a healthy eating plan?",
            options: [
              "A Make changes very gradually.",
              "B Keep a detailed food diary.",
              "C Find someone to diet with."
            ],
            answers: ["C"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: Hand knitting",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    noteBlock: {
      title: "Hand knitting",
      sections: [
        {
          heading: "Interest in knitting",
          lines: [
            { text: "• Knitting has a long history around the world." },
            { prefix: "• We imagine someone like a ", number: 31, suffix: " knitting." },
            { prefix: "• A ", number: 32, suffix: " ago, knitting was expected to disappear." },
            { text: "• The number of knitting classes is now increasing." },
            { prefix: "• People are buying more ", number: 33, suffix: "." }
          ]
        },
        {
          heading: "Benefits of knitting",
          lines: [
            { prefix: "• Gives support in times of ", number: 34, suffix: " difficulty." },
            { prefix: "• Requires only ", number: 35, suffix: " skills." },
            { text: "• Reduces stress in a busy life." }
          ]
        },
        {
          heading: "Early knitting",
          lines: [
            { prefix: "• The first needles were ", number: 36, suffix: " in shape." },
            { prefix: "• Knitting needles were made of wood or ", number: 37, suffix: "." },
            { prefix: "• Knitters used yarn with a ", number: 38, suffix: " texture." }
          ]
        },
        {
          heading: "Later developments",
          lines: [
            { prefix: "• Knitted items were often a symbol of ", number: 39, suffix: "." },
            { prefix: "• Knitters supplied garments to people who tended ", number: 40, suffix: "." }
          ]
        }
      ]
    },
    items: [
      { number: 31, answers: ["grandmother"] },
      { number: 32, answers: ["decade"] },
      { number: 33, answers: ["equipment"] },
      { number: 34, answers: ["economic"] },
      { number: 35, answers: ["basic"] },
      { number: 36, answers: ["round"] },
      { number: 37, answers: ["bone"] },
      { number: 38, answers: ["rough"] },
      { number: 39, answers: ["style"] },
      { number: 40, answers: ["sheep"] }
    ]
  }
];
