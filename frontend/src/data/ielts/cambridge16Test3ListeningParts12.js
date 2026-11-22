// Cambridge IELTS 16 Test 3 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Junior Cycle Camp",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "JUNIOR CYCLE CAMP",
      sections: [
        {
          heading: "Course details",
          lines: [
            { text: "• The course focuses on skills and safety." },
            { text: "• Charlie would be placed in Level 5." },
            { prefix: "• First of all, children at this level are taken to practise in a ", number: 1, suffix: "." }
          ]
        },
        {
          heading: "Instructors",
          lines: [
            { prefix: "• Instructors wear ", number: 2, suffix: " shirts." },
            { prefix: "• A ", number: 3, suffix: " is required and training is given." }
          ]
        },
        {
          heading: "Classes",
          lines: [
            { text: "• The size of the classes is limited." },
            { prefix: "• There are quiet times during the morning for a ", number: 4, suffix: "." },
            { prefix: "• Classes are held even if there is ", number: 5, suffix: "." }
          ]
        },
        {
          heading: "What to bring",
          lines: [
            { text: "• A change of clothing" },
            { prefix: "• A ", number: 6, suffix: "" },
            { text: "• Shoes (not sandals)" },
            { prefix: "• Charlie's ", number: 7, suffix: "" }
          ]
        },
        {
          heading: "Day 1",
          lines: [
            { prefix: "• Charlie should arrive with a bike in good condition and a ", number: 8, suffix: "." },
            { prefix: "• Meet at the ", number: 9, suffix: "." }
          ]
        },
        {
          heading: "Cost",
          lines: [
            { prefix: "• Cost of course: £", number: 10, suffix: "" }
          ]
        }
      ]
    },
    items: [
      { number: 1, answers: ["park"] },
      { number: 2, answers: ["blue"] },
      { number: 3, answers: ["reference"] },
      { number: 4, answers: ["story"] },
      { number: 5, answers: ["rain"] },
      { number: 6, answers: ["snack"] },
      { number: 7, answers: ["medication"] },
      { number: 8, answers: ["helmet"] },
      { number: 9, answers: ["tent"] },
      { number: 10, answers: ["199", "£199"] }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Working in Agriculture & Horticulture",
    questionsRange: [11, 20],
    groups: [
      {
        groupType: "pick_multiple",
        instructions: "Choose TWO letters, A–E.\nAccording to Megan, what are the TWO main advantages of working in the agriculture and horticulture sectors?",
        numbers: [11, 12],
        options: [
          "A the active lifestyle",
          "B the above-average salaries",
          "C the flexible working opportunities",
          "D the opportunities for overseas travel",
          "E the chance to be in a natural environment"
        ],
        items: [
          { number: 11, question: "TWO main advantages of working in agriculture & horticulture (1 of 2)", answers: ["A", "C"] },
          { number: 12, question: "TWO main advantages of working in agriculture & horticulture (2 of 2)", answers: ["A", "C"] }
        ]
      },
      {
        groupType: "pick_multiple",
        instructions: "Choose TWO letters, A–E.\nWhich TWO of the following are likely to be disadvantages of the employment relations sector?",
        numbers: [13, 14],
        options: [
          "A poor job security",
          "B long working hours",
          "C lack of career progression",
          "D low starting pay",
          "E limited variety of work"
        ],
        items: [
          { number: 13, question: "TWO disadvantages of employment relations sector (1 of 2)", answers: ["B", "C"] },
          { number: 14, question: "TWO disadvantages of employment relations sector (2 of 2)", answers: ["B", "C"] }
        ]
      },
      {
        groupType: "matching",
        instructions: "What information does Megan give about each of the following job opportunities?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 15–20.\n\nInformation:\nA not a permanent job\nB involves leading a team\nC experience not essential\nD intensive work but also fun\nE chance to earn more through overtime\nF chance for rapid promotion\nG accommodation available\nH local travel involved",
        numbers: [15, 16, 17, 18, 19, 20],
        items: [
          { number: 15, statement: "Fresh produce manager", answers: ["D"] },
          { number: 16, statement: "Tree surgeon", answers: ["F"] },
          { number: 17, statement: "Farm worker", answers: ["A"] },
          { number: 18, statement: "Landscape gardener", answers: ["H"] },
          { number: 19, statement: "Machinery operator", answers: ["C"] },
          { number: 20, statement: "Agricultural engineer", answers: ["G"] }
        ]
      }
    ]
  }
];
