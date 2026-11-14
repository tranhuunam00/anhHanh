// Cambridge IELTS 18 Test 4 - Listening Parts 3 & 4
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: Origami in Education Project",
    instructions: "Questions 21 and 22: Choose TWO letters, A–E.\nQuestions 23–27: Which comment do the students make about each of the following children in the video? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 23–27.\nQuestions 28–30: Choose the correct letter, A, B or C.",
    questionsRange: [21, 30],
    boxTitle: "Comments on individual children",
    boxOptions: [
      "A demonstrated independence",
      "B asked for teacher support",
      "C developed a competitive attitude",
      "D seemed to find the activity calming",
      "E seemed pleased with the results",
      "F seemed confused",
      "G seemed to find the activity easy"
    ],
    items: [
      {
        number: 21,
        type: "choose_two",
        groupHeader: "Questions 21 and 22: Choose TWO letters, A–E.",
        pairNumber: 22,
        question: "Which TWO educational skills were shown in the video of children doing origami?",
        options: [
          "A solving problems",
          "B following instructions",
          "C working cooperatively",
          "D learning through play",
          "E developing hand-eye coordination"
        ],
        answer: "B",
        acceptedAnswers: ["B", "D", "E"],
        answers: ["B", "D", "E"]
      },
      {
        number: 22,
        type: "choose_two",
        pairNumber: 21,
        question: "Which TWO educational skills were shown in the video of children doing origami? (Second choice)",
        options: [
          "A solving problems",
          "B following instructions",
          "C working cooperatively",
          "D learning through play",
          "E developing hand-eye coordination"
        ],
        answer: "D",
        acceptedAnswers: ["B", "D", "E"],
        answers: ["B", "D", "E"]
      },
      {
        number: 23,
        type: "matching",
        groupHeader: "Questions 23–27: Which comment do the students make about each of the following children in the video?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 23–27.",
        question: "Sid",
        answer: "D",
        answers: ["D"]
      },
      {
        number: 24,
        type: "matching",
        question: "Jack",
        answer: "A",
        answers: ["A"]
      },
      {
        number: 25,
        type: "matching",
        question: "Naomi",
        answer: "C",
        answers: ["C"]
      },
      {
        number: 26,
        type: "matching",
        question: "Anya",
        answer: "G",
        answers: ["G"]
      },
      {
        number: 27,
        type: "matching",
        question: "Zara",
        answer: "F",
        answers: ["F"]
      },
      {
        number: 28,
        type: "multiple_choice",
        groupHeader: "Questions 28–30: Choose the correct letter, A, B or C.",
        question: "Before starting an origami activity in class, the students think it is important for the teacher to",
        options: [
          "A make models that demonstrate the different stages.",
          "B check children understand the terminology involved.",
          "C tell children not to worry if they find the activity difficult."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 29,
        type: "multiple_choice",
        question: "The students agree that some teachers might be unwilling to use origami in class because",
        options: [
          "A they may not think that crafts are important.",
          "B they may not have the necessary skills.",
          "C they may worry that it will take up too much time."
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 30,
        type: "multiple_choice",
        question: "Why do the students decide to use origami in their maths teaching practice?",
        options: [
          "A to correct a particular misunderstanding",
          "B to set a challenge",
          "C to introduce a new concept"
        ],
        answer: "C",
        answers: ["C"]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: Victor Hugo",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    noteBlock: {
      title: "Victor Hugo",
      sections: [
        {
          heading: "His novel, Les Misérables",
          lines: [
            { text: "- It has been adapted for theatre and cinema." },
            { prefix: "- We know more about its overall ", number: 31, suffix: " than about its author." }
          ]
        },
        {
          heading: "His early career",
          lines: [
            { text: "- In Paris, his career was successful and he led the Romantic movement." },
            { prefix: "- He spoke publicly about social issues, such as ", number: 32, suffix: " and education." },
            { text: "- Napoleon III disliked his views and exiled him." }
          ]
        },
        {
          heading: "His exile from France",
          lines: [
            { prefix: "- Victor Hugo had to live elsewhere in ", number: 33, suffix: "." },
            { prefix: "- He used his income from the sale of some ", number: 34, suffix: " he had written to buy a house on Guernsey." }
          ]
        },
        {
          heading: "His house on Guernsey",
          lines: [
            { text: "- Victor Hugo lived in this house until the end of the Empire in France." },
            { prefix: "- The ground floor contains portraits, ", number: 35, suffix: " and tapestries that he valued." },
            { prefix: "- He bought cheap ", number: 36, suffix: " made of wood and turned this into beautiful wall carvings." },
            { prefix: "- The first floor consists of furnished areas with wallpaper and ", number: 37, suffix: " that have a Chinese design." },
            { text: "- The library still contains many of his favourite books." },
            { prefix: "- He wrote in a room at the top of the house that had a view of the ", number: 38, suffix: "." },
            { prefix: "- He entertained other writers as well as poor ", number: 39, suffix: " in his house." },
            { prefix: "- Victor Hugo's ", number: 40, suffix: " gave ownership of the house to the city of Paris in 1927." }
          ]
        }
      ]
    },
    items: [
      {
        number: 31,
        type: "fill_notes",
        section: "His novel, Les Misérables",
        prefix: "- We know more about its overall ",
        suffix: " than about its author.",
        answer: "plot",
        answers: ["plot"]
      },
      {
        number: 32,
        type: "fill_notes",
        section: "His early career",
        prefix: "- He spoke publicly about social issues, such as ",
        suffix: " and education.",
        answer: "poverty",
        answers: ["poverty"]
      },
      {
        number: 33,
        type: "fill_notes",
        section: "His exile from France",
        prefix: "- Victor Hugo had to live elsewhere in ",
        suffix: ".",
        answer: "Europe",
        answers: ["Europe"]
      },
      {
        number: 34,
        type: "fill_notes",
        section: "His exile from France",
        prefix: "- He used his income from the sale of some ",
        suffix: " he had written to buy a house on Guernsey.",
        answer: "poetry",
        answers: ["poetry"]
      },
      {
        number: 35,
        type: "fill_notes",
        section: "His house on Guernsey",
        prefix: "- The ground floor contains portraits, ",
        suffix: " and tapestries that he valued.",
        answer: "drawings",
        answers: ["drawings"]
      },
      {
        number: 36,
        type: "fill_notes",
        section: "His house on Guernsey",
        prefix: "- He bought cheap ",
        suffix: " made of wood and turned this into beautiful wall carvings.",
        answer: "furniture",
        answers: ["furniture"]
      },
      {
        number: 37,
        type: "fill_notes",
        section: "His house on Guernsey",
        prefix: "- The first floor consists of furnished areas with wallpaper and ",
        suffix: " that have a Chinese design.",
        answer: "lamps",
        answers: ["lamps"]
      },
      {
        number: 38,
        type: "fill_notes",
        section: "His house on Guernsey",
        prefix: "- He wrote in a room at the top of the house that had a view of the ",
        suffix: ".",
        answer: "harbour",
        answers: ["harbour", "harbor"]
      },
      {
        number: 39,
        type: "fill_notes",
        section: "His house on Guernsey",
        prefix: "- He entertained other writers as well as poor ",
        suffix: " in his house.",
        answer: "children",
        answers: ["children"]
      },
      {
        number: 40,
        type: "fill_notes",
        section: "His house on Guernsey",
        prefix: "- Victor Hugo's ",
        suffix: " gave ownership of the house to the city of Paris in 1927.",
        answer: "relatives",
        answers: ["relatives"]
      }
    ]
  }
];

