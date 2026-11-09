// Cambridge IELTS 17 Test 4 - Listening Parts 3 & 4
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: Sports Science & Sporting Equipment Design",
    instructions: "Questions 21 and 22: Choose TWO letters, A–E.\nQuestions 23 and 24: Choose TWO letters, A–E.\nQuestions 25–30: What comment do the students make about the development of each of the following items of sporting equipment? Choose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.",
    questionsRange: [21, 30],
    boxTitle: "Comments about the development of the equipment",
    boxOptions: [
      "A It could cause excessive sweating.",
      "B The material was being mass produced for another purpose.",
      "C People often needed to make their own.",
      "D It often had to be replaced.",
      "E The material was expensive.",
      "F It was unpopular among spectators.",
      "G It caused injuries.",
      "H No one using it liked it at first."
    ],
    items: [
      {
        number: 21,
        type: "choose_two",
        pairNumber: 22,
        question: "Which TWO points do Thomas and Jeanne make about Thomas's sporting activities at school?",
        options: [
          "A He should have felt more positive about them.",
          "B The training was too challenging for him.",
          "C He could have worked harder at them.",
          "D His parents were disappointed in him.",
          "E His fellow students admired him."
        ],
        answer: "C",
        acceptedAnswers: ["C", "E"],
        answers: ["C", "E"]
      },
      {
        number: 22,
        type: "choose_two",
        pairNumber: 21,
        question: "Which TWO points do Thomas and Jeanne make about Thomas's sporting activities at school? (Second choice)",
        options: [
          "A He should have felt more positive about them.",
          "B The training was too challenging for him.",
          "C He could have worked harder at them.",
          "D His parents were disappointed in him.",
          "E His fellow students admired him."
        ],
        answer: "E",
        acceptedAnswers: ["C", "E"],
        answers: ["C", "E"]
      },
      {
        number: 23,
        type: "choose_two",
        pairNumber: 24,
        question: "Which TWO feelings did Thomas experience when he was in Kenya?",
        options: [
          "A disbelief",
          "B relief",
          "C stress",
          "D gratitude",
          "E homesickness"
        ],
        answer: "A",
        acceptedAnswers: ["A", "D"],
        answers: ["A", "D"]
      },
      {
        number: 24,
        type: "choose_two",
        pairNumber: 23,
        question: "Which TWO feelings did Thomas experience when he was in Kenya? (Second choice)",
        options: [
          "A disbelief",
          "B relief",
          "C stress",
          "D gratitude",
          "E homesickness"
        ],
        answer: "D",
        acceptedAnswers: ["A", "D"],
        answers: ["A", "D"]
      },
      {
        number: 25,
        type: "matching",
        question: "the table tennis bat",
        answer: "B",
        answers: ["B"]
      },
      {
        number: 26,
        type: "matching",
        question: "the cricket helmet",
        answer: "F",
        answers: ["F"]
      },
      {
        number: 27,
        type: "matching",
        question: "the cycle helmet",
        answer: "A",
        answers: ["A"]
      },
      {
        number: 28,
        type: "matching",
        question: "the golf club",
        answer: "D",
        answers: ["D"]
      },
      {
        number: 29,
        type: "matching",
        question: "the hockey stick",
        answer: "C",
        answers: ["C"]
      },
      {
        number: 30,
        type: "matching",
        question: "the football",
        answer: "G",
        answers: ["G"]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: The Production of Maple Syrup",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    noteBlock: {
      title: "Maple syrup",
      sections: [
        {
          heading: "What is maple syrup?",
          lines: [
            { text: "• made from the sap of the maple tree" },
            { prefix: "• colour described as ", number: 31, suffix: "" },
            { text: "• added to food or used in cooking" },
            { prefix: "• very ", number: 32, suffix: " compared to refined sugar" }
          ]
        },
        {
          heading: "The maple tree",
          lines: [
            { text: "• has many species; needs sunny days and cool nights" },
            { text: "• maple leaf has been on the Canadian flag since 1964" },
            { text: "• needs moist soil but does not need fertiliser" },
            { prefix: "• best growing conditions and ", number: 33, suffix: " are in Canada and North America" }
          ]
        },
        {
          heading: "Early maple sugar producers",
          lines: [
            { text: "• made holes in the tree trunks" },
            { prefix: "• used hot ", number: 34, suffix: " to heat the sap" },
            { text: "• used tree bark to make containers for collection" }
          ]
        },
        {
          heading: "Today's maple syrup production",
          lines: [
            { prefix: "• Tree trunks may not have the correct ", number: 35, suffix: " until growing for 40 years." },
            { prefix: "• A tap is drilled into the trunk and a ", number: 36, suffix: " carries the sap into a bucket." },
            { prefix: "• Large pans called evaporators are heated by means of a ", number: 37, suffix: "." },
            { prefix: "• A lot of ", number: 38, suffix: " is produced during the evaporation process." },
            { prefix: "• 'Sugar sand' is removed because it makes the syrup look ", number: 39, suffix: " and affects the taste." },
            { prefix: "• A huge quantity of sap is needed to make a ", number: 40, suffix: " of maple syrup." }
          ]
        }
      ]
    },
    items: [
      {
        number: 31,
        type: "fill_notes",
        section: "What is maple syrup?",
        prefix: "colour described as ",
        suffix: "",
        answer: "golden",
        answers: ["golden"]
      },
      {
        number: 32,
        type: "fill_notes",
        section: "What is maple syrup?",
        prefix: "very ",
        suffix: " compared to refined sugar",
        answer: "healthy",
        answers: ["healthy"]
      },
      {
        number: 33,
        type: "fill_notes",
        section: "The maple tree",
        prefix: "best growing conditions and ",
        suffix: " are in Canada and North America",
        answer: "climate",
        answers: ["climate"]
      },
      {
        number: 34,
        type: "fill_notes",
        section: "Early maple sugar producers",
        prefix: "used hot ",
        suffix: " to heat the sap",
        answer: "rocks",
        answers: ["rocks", "rock"]
      },
      {
        number: 35,
        type: "fill_notes",
        section: "Today's maple syrup production",
        prefix: "Tree trunks may not have the correct ",
        suffix: " until growing for 40 years",
        answer: "diameter",
        answers: ["diameter"]
      },
      {
        number: 36,
        type: "fill_notes",
        section: "Today's maple syrup production",
        prefix: "tap drilled into the trunk and a ",
        suffix: " carries the sap",
        answer: "tube",
        answers: ["tube"]
      },
      {
        number: 37,
        type: "fill_notes",
        section: "Today's maple syrup production",
        prefix: "heated by means of a ",
        suffix: "",
        answer: "fire",
        answers: ["fire"]
      },
      {
        number: 38,
        type: "fill_notes",
        section: "Today's maple syrup production",
        prefix: "A lot of ",
        suffix: " is produced during evaporation",
        answer: "steam",
        answers: ["steam"]
      },
      {
        number: 39,
        type: "fill_notes",
        section: "Today's maple syrup production",
        prefix: "removed because it makes the syrup look ",
        suffix: "",
        answer: "cloudy",
        answers: ["cloudy"]
      },
      {
        number: 40,
        type: "fill_notes",
        section: "Today's maple syrup production",
        prefix: "needed to make a ",
        suffix: " of maple syrup",
        answer: "litre",
        answers: ["litre", "liter"]
      }
    ]
  }
];
