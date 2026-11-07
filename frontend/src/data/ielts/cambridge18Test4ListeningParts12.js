// Cambridge IELTS 18 Test 4 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Job details from employment agency",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Job details from employment agency",
      sections: [
        {
          heading: "Role and location",
          lines: [
            { prefix: "Role: ", number: 1, suffix: "" },
            { text: "Location:" },
            { prefix: "- Fordham ", number: 2, suffix: " Centre" },
            { prefix: "- ", number: 3, suffix: " Road, Fordham" }
          ]
        },
        {
          heading: "Work involves",
          lines: [
            { text: "- dealing with enquiries" },
            { prefix: "- making ", number: 4, suffix: " and reorganising them" },
            { prefix: "- maintaining the internal ", number: 5, suffix: "" },
            { text: "- general administration" }
          ]
        },
        {
          heading: "Requirements",
          lines: [
            { prefix: "- ", number: 6, suffix: " (essential)" },
            { prefix: "- a calm and ", number: 7, suffix: " manner" },
            { text: "- good IT skills" }
          ]
        },
        {
          heading: "Other information",
          lines: [
            { prefix: "- ", number: 8, suffix: " job — further opportunities may be available" },
            { prefix: "- hours: 7.45 a.m. to ", number: 9, suffix: " p.m. Monday to Friday" },
            { prefix: "- ", number: 10, suffix: " is available onsite" }
          ]
        }
      ]
    },
    items: [
      {
        number: 1,
        type: "fill_notes",
        section: "Role and location",
        prefix: "Role: ",
        suffix: "",
        answer: "receptionist",
        answers: ["receptionist"]
      },
      {
        number: 2,
        type: "fill_notes",
        section: "Role and location",
        prefix: "- Fordham ",
        suffix: " Centre",
        answer: "Medical",
        answers: ["Medical", "medical"]
      },
      {
        number: 3,
        type: "fill_notes",
        section: "Role and location",
        prefix: "- ",
        suffix: " Road, Fordham",
        answer: "Chastons",
        answers: ["Chastons", "chastons"]
      },
      {
        number: 4,
        type: "fill_notes",
        section: "Work involves",
        prefix: "- making ",
        suffix: " and reorganising them",
        answer: "appointments",
        answers: ["appointments", "appointment"]
      },
      {
        number: 5,
        type: "fill_notes",
        section: "Work involves",
        prefix: "- maintaining the internal ",
        suffix: "",
        answer: "database",
        answers: ["database"]
      },
      {
        number: 6,
        type: "fill_notes",
        section: "Requirements",
        prefix: "- ",
        suffix: " (essential)",
        answer: "experience",
        answers: ["experience"]
      },
      {
        number: 7,
        type: "fill_notes",
        section: "Requirements",
        prefix: "- a calm and ",
        suffix: " manner",
        answer: "confident",
        answers: ["confident"]
      },
      {
        number: 8,
        type: "fill_notes",
        section: "Other information",
        prefix: "- ",
        suffix: " job — further opportunities may be available",
        answer: "temporary",
        answers: ["temporary"]
      },
      {
        number: 9,
        type: "fill_notes",
        section: "Other information",
        prefix: "- hours: 7.45 a.m. to ",
        suffix: " p.m. Monday to Friday",
        answer: "1.15",
        answers: ["1.15", "1:15"]
      },
      {
        number: 10,
        type: "fill_notes",
        section: "Other information",
        prefix: "- ",
        suffix: " is available onsite",
        answer: "parking",
        answers: ["parking"]
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Museum of Farming Life",
    instructions: "Questions 11–14: Choose the correct letter, A, B or C.\nQuestions 15–20: What information does the speaker give about each of the following areas of the museum? Choose SIX answers from the box and write the correct letter, A–H, next to Questions 15–20.",
    questionsRange: [11, 20],
    boxTitle: "Information on museum areas",
    boxOptions: [
      "A Parents must supervise their children.",
      "B There are new things to see.",
      "C It is closed today.",
      "D This is only for school groups.",
      "E There is a quiz for visitors.",
      "F It features something created by students.",
      "G An expert is here today.",
      "H There is a one-way system."
    ],
    items: [
      {
        number: 11,
        type: "multiple_choice",
        question: "The museum building was originally",
        options: [
          "A a factory.",
          "B a private home.",
          "C a hall of residence."
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 12,
        type: "multiple_choice",
        question: "The university uses part of the museum building as",
        options: [
          "A teaching rooms.",
          "B a research library.",
          "C administration offices."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 13,
        type: "multiple_choice",
        question: "What does the guide say about the entrance fee?",
        options: [
          "A Visitors decide whether or not they wish to pay.",
          "B Only children and students receive a discount.",
          "C The museum charges extra for special exhibitions."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 14,
        type: "multiple_choice",
        question: "What are visitors advised to leave in the cloakroom?",
        options: [
          "A cameras",
          "B coats",
          "C bags"
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 15,
        type: "matching",
        question: "Four Seasons",
        answer: "F",
        answers: ["F"]
      },
      {
        number: 16,
        type: "matching",
        question: "Farmhouse Kitchen",
        answer: "G",
        answers: ["G"]
      },
      {
        number: 17,
        type: "matching",
        question: "A Year on the Farm",
        answer: "E",
        answers: ["E"]
      },
      {
        number: 18,
        type: "matching",
        question: "Wagon Walk",
        answer: "A",
        answers: ["A"]
      },
      {
        number: 19,
        type: "matching",
        question: "Bees are Magic",
        answer: "C",
        answers: ["C"]
      },
      {
        number: 20,
        type: "matching",
        question: "The Pond",
        answer: "B",
        answers: ["B"]
      }
    ]
  }
];

