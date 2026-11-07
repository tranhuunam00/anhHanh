// Cambridge IELTS 18 Test 1 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Transport survey",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Transport survey",
      sections: [
        {
          heading: "Personal details",
          lines: [
            { text: "Name: Sadie Jones" },
            { text: "Year of birth: 1991" },
            { prefix: "Postcode: ", number: 1, suffix: "" }
          ]
        },
        {
          heading: "Travelling by bus",
          lines: [
            { prefix: "Date of bus journey: ", number: 2, suffix: "" },
            { prefix: "Reason for trip: shopping and visit to the ", number: 3, suffix: "" },
            { prefix: "Travelled by bus because cost of ", number: 4, suffix: " too high" },
            { prefix: "Got on bus at ", number: 5, suffix: " Street" },
            { text: "Complaints about bus service:" },
            { prefix: "- bus today was ", number: 6, suffix: "" },
            { prefix: "- frequency of buses in the ", number: 7, suffix: "" }
          ]
        },
        {
          heading: "Travelling by car",
          lines: [
            { prefix: "Goes to the ", number: 8, suffix: " by car" }
          ]
        },
        {
          heading: "Travelling by bicycle",
          lines: [
            { prefix: "Dislikes travelling by bike in the city centre because of the ", number: 9, suffix: "" },
            { prefix: "Doesn't own a bike because of a lack of ", number: 10, suffix: "" }
          ]
        }
      ]
    },
    items: [
      {
        number: 1,
        type: "fill_notes",
        section: "Personal details",
        prefix: "Postcode: ",
        suffix: "",
        answer: "DW30 7YZ",
        answers: ["DW30 7YZ", "DW307YZ"]
      },
      {
        number: 2,
        type: "fill_notes",
        section: "Travelling by bus",
        prefix: "Date of bus journey: ",
        suffix: "",
        answer: "24th April",
        answers: ["24th April", "24 April", "24th of April", "April 24", "April 24th"]
      },
      {
        number: 3,
        type: "fill_notes",
        section: "Travelling by bus",
        prefix: "Reason for trip: shopping and visit to the ",
        suffix: "",
        answer: "dentist",
        answers: ["dentist"]
      },
      {
        number: 4,
        type: "fill_notes",
        section: "Travelling by bus",
        prefix: "Travelled by bus because cost of ",
        suffix: " too high",
        answer: "parking",
        answers: ["parking"]
      },
      {
        number: 5,
        type: "fill_notes",
        section: "Travelling by bus",
        prefix: "Got on bus at ",
        suffix: " Street",
        answer: "Claxby",
        answers: ["Claxby"]
      },
      {
        number: 6,
        type: "fill_notes",
        section: "Travelling by bus",
        prefix: "- bus today was ",
        suffix: "",
        answer: "late",
        answers: ["late"]
      },
      {
        number: 7,
        type: "fill_notes",
        section: "Travelling by bus",
        prefix: "- frequency of buses in the ",
        suffix: "",
        answer: "evening",
        answers: ["evening"]
      },
      {
        number: 8,
        type: "fill_notes",
        section: "Travelling by car",
        prefix: "Goes to the ",
        suffix: " by car",
        answer: "supermarket",
        answers: ["supermarket"]
      },
      {
        number: 9,
        type: "fill_notes",
        section: "Travelling by bicycle",
        prefix: "Dislikes travelling by bike in the city centre because of the ",
        suffix: "",
        answer: "pollution",
        answers: ["pollution"]
      },
      {
        number: 10,
        type: "fill_notes",
        section: "Travelling by bicycle",
        prefix: "Doesn't own a bike because of a lack of ",
        suffix: "",
        answer: "storage",
        answers: ["storage"]
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Becoming a volunteer for ACE",
    instructions: "Questions 11–13: Choose the correct letter, A, B or C.\nQuestions 14 and 15: Choose TWO letters, A–E.\nQuestions 16–20: What does the speaker suggest would be helpful for each of the following areas of voluntary work? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.",
    questionsRange: [11, 20],
    boxTitle: "Helpful things volunteers might offer",
    boxOptions: [
      "A experience on stage",
      "B original, new ideas",
      "C parenting skills",
      "D an understanding of food and diet",
      "E retail experience",
      "F a good memory",
      "G a good level of fitness"
    ],
    items: [
      {
        number: 11,
        type: "multiple_choice",
        question: "Why does the speaker apologise about the seats?",
        options: [
          "A They are too small.",
          "B There are not enough of them.",
          "C Some of them are very close together."
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 12,
        type: "multiple_choice",
        question: "What does the speaker say about the age of volunteers?",
        options: [
          "A The age of volunteers is less important than other factors.",
          "B Young volunteers are less reliable than older ones.",
          "C Most volunteers are about 60 years old."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 13,
        type: "multiple_choice",
        question: "What does the speaker say about training?",
        options: [
          "A It is continuous.",
          "B It is conducted by a manager.",
          "C It takes place online."
        ],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 14,
        type: "choose_two",
        pairNumber: 15,
        question: "Which TWO issues does the speaker ask the audience to consider before they apply to be volunteers?",
        options: [
          "A their financial situation",
          "B their level of commitment",
          "C their work experience",
          "D their ambition",
          "E their availability"
        ],
        answer: "B",
        acceptedAnswers: ["B", "E"],
        answers: ["B", "E"]
      },
      {
        number: 15,
        type: "choose_two",
        pairNumber: 14,
        question: "Which TWO issues does the speaker ask the audience to consider before they apply to be volunteers? (Second choice)",
        options: [
          "A their financial situation",
          "B their level of commitment",
          "C their work experience",
          "D their ambition",
          "E their availability"
        ],
        answer: "E",
        acceptedAnswers: ["B", "E"],
        answers: ["B", "E"]
      },
      {
        number: 16,
        type: "matching",
        question: "Fundraising",
        answer: "B",
        answers: ["B"]
      },
      {
        number: 17,
        type: "matching",
        question: "Litter collection",
        answer: "G",
        answers: ["G"]
      },
      {
        number: 18,
        type: "matching",
        question: "'Playmates'",
        answer: "D",
        answers: ["D"]
      },
      {
        number: 19,
        type: "matching",
        question: "Story club",
        answer: "A",
        answers: ["A"]
      },
      {
        number: 20,
        type: "matching",
        question: "First aid",
        answer: "F",
        answers: ["F"]
      }
    ]
  }
];

