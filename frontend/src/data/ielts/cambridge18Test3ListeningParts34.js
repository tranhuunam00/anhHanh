// Cambridge IELTS 18 Test 3 - Listening Parts 3 & 4
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: The Luddites & Future of work",
    instructions: "Questions 21 and 22: Choose TWO letters, A–E.\nQuestions 23 and 24: Choose TWO letters, A–E.\nQuestions 25–30: What comment do the students make about each of the following jobs? Choose SIX answers from the box and write the correct letter, A–G, next to Questions 25–30.",
    questionsRange: [21, 30],
    boxTitle: "Comments on jobs and automation",
    boxOptions: [
      "A These jobs are likely to be at risk.",
      "B Their role has become more interesting in recent years.",
      "C The number of people working in this sector has fallen dramatically.",
      "D This job will require more qualifications.",
      "E Higher disposable income has led to a huge increase in jobs.",
      "F There is likely to be a significant rise in demand for this service.",
      "G Both employment and productivity have risen."
    ],
    items: [
      {
        number: 21,
        type: "choose_two",
        pairNumber: 22,
        question: "Which TWO opinions about the Luddites do the students express?",
        options: [
          "A Their actions were ineffective.",
          "B They are still influential today.",
          "C They have received unfair criticism.",
          "D They were proved right.",
          "E Their attitude is understandable."
        ],
        answer: "C",
        acceptedAnswers: ["C", "E"],
        answers: ["C", "E"]
      },
      {
        number: 22,
        type: "choose_two",
        pairNumber: 21,
        question: "Which TWO opinions about the Luddites do the students express? (Second choice)",
        options: [
          "A Their actions were ineffective.",
          "B They are still influential today.",
          "C They have received unfair criticism.",
          "D They were proved right.",
          "E Their attitude is understandable."
        ],
        answer: "E",
        acceptedAnswers: ["C", "E"],
        answers: ["C", "E"]
      },
      {
        number: 23,
        type: "choose_two",
        pairNumber: 24,
        question: "Which TWO predictions about the future of work are the students doubtful about?",
        options: [
          "A Work will be more rewarding.",
          "B Unemployment will fall.",
          "C People will want to delay retiring.",
          "D Working hours will be shorter.",
          "E People will change jobs more frequently."
        ],
        answer: "B",
        acceptedAnswers: ["B", "D"],
        answers: ["B", "D"]
      },
      {
        number: 24,
        type: "choose_two",
        pairNumber: 23,
        question: "Which TWO predictions about the future of work are the students doubtful about? (Second choice)",
        options: [
          "A Work will be more rewarding.",
          "B Unemployment will fall.",
          "C People will want to delay retiring.",
          "D Working hours will be shorter.",
          "E People will change jobs more frequently."
        ],
        answer: "D",
        acceptedAnswers: ["B", "D"],
        answers: ["B", "D"]
      },
      {
        number: 25,
        type: "matching",
        question: "Accountants",
        answer: "A",
        answers: ["A"]
      },
      {
        number: 26,
        type: "matching",
        question: "Hairdressers",
        answer: "F",
        answers: ["F"]
      },
      {
        number: 27,
        type: "matching",
        question: "Administrative staff",
        answer: "A",
        answers: ["A"]
      },
      {
        number: 28,
        type: "matching",
        question: "Agricultural workers",
        answer: "C",
        answers: ["C"]
      },
      {
        number: 29,
        type: "matching",
        question: "Care workers",
        answer: "G",
        answers: ["G"]
      },
      {
        number: 30,
        type: "matching",
        question: "Bank clerks",
        answer: "A",
        answers: ["A"]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: Space Traffic Management",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    noteBlock: {
      title: "Space Traffic Management",
      sections: [
        {
          heading: "Overview",
          lines: [
            { text: "A Space Traffic Management system is a concept similar to Air Traffic Control, but for satellites rather than planes." },
            { prefix: "- would aim to set up legal and ", number: 31, suffix: " ways of improving safety." },
            { text: "- does not actually exist at present." }
          ]
        },
        {
          heading: "Problems in developing effective Space Traffic Management",
          lines: [
            { prefix: "- Satellites are now quite ", number: 32, suffix: " and therefore more widespread." },
            { prefix: "  (e.g. there are constellations made up of ", number: 33, suffix: " of satellites)." },
            { prefix: "- At present, satellites are not required to transmit information to help with their ", number: 34, suffix: "." },
            { prefix: "- There are few systems for ", number: 35, suffix: " satellites." },
            { text: "- Small pieces of debris may be difficult to identify." },
            { prefix: "- Operators may be unwilling to share details of satellites used for ", number: 36, suffix: " or commercial reasons." },
            { prefix: "- It may be hard to collect details of the object's ", number: 37, suffix: " at a given time." },
            { prefix: "- Scientists can only make a ", number: 38, suffix: " about where the satellite will go." }
          ]
        },
        {
          heading: "Solutions",
          lines: [
            { text: "- Common standards should be agreed on for the presentation of information." },
            { prefix: "- The information should be combined in one ", number: 39, suffix: "." },
            { prefix: "- A coordinated system must be designed to create ", number: 40, suffix: " in its users." }
          ]
        }
      ]
    },
    items: [
      {
        number: 31,
        type: "fill_notes",
        section: "Overview",
        prefix: "- would aim to set up legal and ",
        suffix: " ways of improving safety.",
        answer: "technical",
        answers: ["technical"]
      },
      {
        number: 32,
        type: "fill_notes",
        section: "Problems in developing effective Space Traffic Management",
        prefix: "- Satellites are now quite ",
        suffix: " and therefore more widespread.",
        answer: "cheap",
        answers: ["cheap"]
      },
      {
        number: 33,
        type: "fill_notes",
        section: "Problems in developing effective Space Traffic Management",
        prefix: "(e.g. there are constellations made up of ",
        suffix: " of satellites).",
        answer: "thousands",
        answers: ["thousands"]
      },
      {
        number: 34,
        type: "fill_notes",
        section: "Problems in developing effective Space Traffic Management",
        prefix: "- At present, satellites are not required to transmit information to help with their ",
        suffix: ".",
        answer: "identification",
        answers: ["identification"]
      },
      {
        number: 35,
        type: "fill_notes",
        section: "Problems in developing effective Space Traffic Management",
        prefix: "- There are few systems for ",
        suffix: " satellites.",
        answer: "tracking",
        answers: ["tracking"]
      },
      {
        number: 36,
        type: "fill_notes",
        section: "Problems in developing effective Space Traffic Management",
        prefix: "- Operators may be unwilling to share details of satellites used for ",
        suffix: " or commercial reasons.",
        answer: "military",
        answers: ["military"]
      },
      {
        number: 37,
        type: "fill_notes",
        section: "Problems in developing effective Space Traffic Management",
        prefix: "- It may be hard to collect details of the object's ",
        suffix: " at a given time.",
        answer: "location",
        answers: ["location"]
      },
      {
        number: 38,
        type: "fill_notes",
        section: "Problems in developing effective Space Traffic Management",
        prefix: "- Scientists can only make a ",
        suffix: " about where the satellite will go.",
        answer: "prediction",
        answers: ["prediction"]
      },
      {
        number: 39,
        type: "fill_notes",
        section: "Solutions",
        prefix: "- The information should be combined in one ",
        suffix: ".",
        answer: "database",
        answers: ["database"]
      },
      {
        number: 40,
        type: "fill_notes",
        section: "Solutions",
        prefix: "- A coordinated system must be designed to create ",
        suffix: " in its users.",
        answer: "trust",
        answers: ["trust"]
      }
    ]
  }
];

