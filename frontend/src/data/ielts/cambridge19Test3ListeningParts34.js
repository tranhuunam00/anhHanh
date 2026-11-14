// Cambridge IELTS 19 Test 3 - Listening Parts 3 & 4 Data
// 100% Authentic Text and Questions from Cambridge 19.pdf (Pages 59-61)

export const cambridge19Test3ListeningPart3 = {
  partNumber: 3,
  title: "Part 3: Science Experiment for Year 12 Students",
  instructions: "Questions 21–25: Choose the correct letter, A, B or C.\nQuestions 26–30: Complete the flowchart below. Choose FIVE answers from the box and write the correct letter, A–H.",
  questionsRange: [21, 30],
  boxTitle: "Flowchart Options (Questions 26–30)",
  boxOptions: [
    "A size",
    "B escape",
    "C age",
    "D water",
    "E cereal",
    "F calculations",
    "G changes",
    "H colour"
  ],
  items: [
    {
      number: 21,
      type: "multiple_choice",
      question: "How does Clare feel about the students in her Year 12 science class?",
      options: [
        "A. worried that they are not making progress",
        "B. challenged by their poor behaviour in class",
        "C. frustrated at their lack of interest in the subject"
      ],
      answers: ["C"]
    },
    {
      number: 22,
      type: "multiple_choice",
      question: "How does Jake react to Clare's suggestion about an experiment based on children's diet?",
      options: [
        "A. He is concerned that the results might not be meaningful.",
        "B. He feels some of the data might be difficult to obtain.",
        "C. He suspects that the conclusions might be upsetting."
      ],
      answers: ["B"]
    },
    {
      number: 23,
      type: "multiple_choice",
      question: "What problem do they agree may be involved in an experiment involving animals?",
      options: [
        "A. Any results may not apply to humans.",
        "B. It may be complicated to get permission.",
        "C. Students may not be happy about animal experiments."
      ],
      answers: ["A"]
    },
    {
      number: 24,
      type: "multiple_choice",
      question: "What question do they decide the experiment should address?",
      options: [
        "A. Are mice capable of controlling their food intake?",
        "B. Does an increase in sugar lead to health problems?",
        "C. How much do supplements of different kinds affect health?"
      ],
      answers: ["A"]
    },
    {
      number: 25,
      type: "multiple_choice",
      question: "Clare might also consider doing another experiment involving",
      options: [
        "A. other types of food supplement.",
        "B. different genetic strains of mice.",
        "C. varying amounts of exercise."
      ],
      answers: ["C"]
    },
    {
      number: 26,
      type: "matching",
      groupHeader: "Questions 26–30: Complete the flowchart below. Choose FIVE answers from the box and write the correct letter, A–H, next to Questions 26–30.",
      question: "Choose mice which are all the same ...",
      options: [
        "A size",
        "B escape",
        "C age",
        "D water",
        "E cereal",
        "F calculations",
        "G changes",
        "H colour"
      ],
      answers: ["C"]
    },
    {
      number: 27,
      type: "matching",
      question: "Divide the mice into two groups, each with a different ...",
      options: [
        "A size",
        "B escape",
        "C age",
        "D water",
        "E cereal",
        "F calculations",
        "G changes",
        "H colour"
      ],
      answers: ["H"]
    },
    {
      number: 28,
      type: "matching",
      question: "Feed group B commercial food, but also sugar contained in ...",
      options: [
        "A size",
        "B escape",
        "C age",
        "D water",
        "E cereal",
        "F calculations",
        "G changes",
        "H colour"
      ],
      answers: ["E"]
    },
    {
      number: 29,
      type: "matching",
      question: "Take measurements using an electronic scale. Place them in a weighing chamber to prevent ...",
      options: [
        "A size",
        "B escape",
        "C age",
        "D water",
        "E cereal",
        "F calculations",
        "G changes",
        "H colour"
      ],
      answers: ["B"]
    },
    {
      number: 30,
      type: "matching",
      question: "Do all necessary ...",
      options: [
        "A size",
        "B escape",
        "C age",
        "D water",
        "E cereal",
        "F calculations",
        "G changes",
        "H colour"
      ],
      answers: ["F"]
    }
  ]
};

export const cambridge19Test3ListeningPart4 = {
  partNumber: 4,
  title: "Part 4: Microplastics",
  instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
  questionsRange: [31, 40],
  noteBlock: {
    title: "Microplastics",
    sections: [
      {
        heading: "Where microplastics come from",
        lines: [
          { prefix: "fibres from some ", number: 31, suffix: " during washing" },
          { text: "the breakdown of large pieces of plastic waste" },
          { text: "waste from industry" },
          { text: "the action of vehicle tyres on roads" }
        ]
      },
      {
        heading: "Effects of microplastics",
        lines: [
          { prefix: "They cause injuries to the ", number: 32, suffix: " of wildlife and affect their digestive systems." },
          { prefix: "They enter the food chain, e.g., in bottled and tap water, ", number: 33, suffix: " and seafood." },
          { prefix: "They may not affect human health, but they are already banned in skin cleaning products and ", number: 34, suffix: " in some countries." },
          { prefix: "Microplastics enter the soil through the air, rain and ", number: 35, suffix: " in the soil." }
        ]
      },
      {
        heading: "Microplastics in the soil — a study by Anglia Ruskin University",
        lines: [
          { prefix: "Earthworms are important because they add ", number: 36, suffix: " to the soil." },
          { prefix: "The study aimed to find whether microplastics in earthworms affect the ", number: 37, suffix: " of plants." },
          { text: "The study found that microplastics caused:" },
          { prefix: "— ", number: 38, suffix: " loss in earthworms" },
          { text: "— fewer seeds to germinate" },
          { prefix: "— a rise in the level of ", number: 39, suffix: "" },
          { text: "The study concluded:" },
          { text: "— soil should be seen as an important natural process." },
          { prefix: "— changes to soil damage both ecosystems and ", number: 40, suffix: "" }
        ]
      }
    ]
  },
  items: [
    {
      number: 31,
      type: "fill_notes",
      prefix: "Where microplastics come from: fibres from some ",
      suffix: " during washing",
      answers: ["clothing"]
    },
    {
      number: 32,
      type: "fill_notes",
      prefix: "Effects: They cause injuries to the ",
      suffix: " of wildlife and affect their digestive systems.",
      answers: ["mouths"]
    },
    {
      number: 33,
      type: "fill_notes",
      prefix: "They enter the food chain, e.g., in bottled and tap water, ",
      suffix: " and seafood.",
      answers: ["salt"]
    },
    {
      number: 34,
      type: "fill_notes",
      prefix: "They are already banned in skin cleaning products and ",
      suffix: " in some countries.",
      answers: ["toothpaste"]
    },
    {
      number: 35,
      type: "fill_notes",
      prefix: "Microplastics enter the soil through the air, rain and ",
      suffix: " in the soil.",
      answers: ["fertilisers", "fertilizers"]
    },
    {
      number: 36,
      type: "fill_notes",
      prefix: "Study by Anglia Ruskin University: Earthworms are important because they add ",
      suffix: " to the soil.",
      answers: ["nutrients"]
    },
    {
      number: 37,
      type: "fill_notes",
      prefix: "The study aimed to find whether microplastics in earthworms affect the ",
      suffix: " of plants.",
      answers: ["growth"]
    },
    {
      number: 38,
      type: "fill_notes",
      prefix: "The study found that microplastics caused: ",
      suffix: " loss in earthworms",
      answers: ["weight"]
    },
    {
      number: 39,
      type: "fill_notes",
      prefix: "a rise in the level of ",
      suffix: "",
      answers: ["acid"]
    },
    {
      number: 40,
      type: "fill_notes",
      prefix: "The study concluded: changes to soil damage both ecosystems and ",
      suffix: "",
      answers: ["society"]
    }
  ]
};

