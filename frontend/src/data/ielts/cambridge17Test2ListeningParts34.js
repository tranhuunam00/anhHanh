// Cambridge IELTS 17 Test 2 - Listening Parts 3 & 4
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: Romeo and Juliet production reviews",
    instructions: "Questions 21 and 22: Choose TWO letters, A–E.\nQuestions 23–27: Which opinion do the speakers give about each of the following aspects of The Emporium's production of Romeo and Juliet? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 23–27.\nQuestions 28–30: Choose the correct letter, A, B or C.",
    questionsRange: [21, 30],
    boxTitle: "Opinions",
    boxOptions: [
      "A They both expected this to be more traditional.",
      "B They both thought this was original.",
      "C They agree this created the right atmosphere.",
      "D They agree this was a major strength.",
      "E They were both disappointed by this.",
      "F They disagree about why this was an issue.",
      "G They disagree about how this could be improved."
    ],
    items: [
      {
        number: 21,
        type: "choose_two",
        pairNumber: 22,
        question: "Which TWO things do the students agree they need to include in their reviews of Romeo and Juliet?",
        options: [
          "A analysis of the text",
          "B a summary of the plot",
          "C a description of the theatre",
          "D a personal reaction",
          "E a reference to particular scenes"
        ],
        answer: "D",
        acceptedAnswers: ["D", "E"],
        answers: ["D", "E"]
      },
      {
        number: 22,
        type: "choose_two",
        pairNumber: 21,
        question: "Which TWO things do the students agree they need to include in their reviews of Romeo and Juliet? (Second choice)",
        options: [
          "A analysis of the text",
          "B a summary of the plot",
          "C a description of the theatre",
          "D a personal reaction",
          "E a reference to particular scenes"
        ],
        answer: "E",
        acceptedAnswers: ["D", "E"],
        answers: ["D", "E"]
      },
      {
        number: 23,
        type: "matching",
        question: "the set",
        answer: "D",
        answers: ["D"]
      },
      {
        number: 24,
        type: "matching",
        question: "the lighting",
        answer: "C",
        answers: ["C"]
      },
      {
        number: 25,
        type: "matching",
        question: "the costume design",
        answer: "A",
        answers: ["A"]
      },
      {
        number: 26,
        type: "matching",
        question: "the music",
        answer: "E",
        answers: ["E"]
      },
      {
        number: 27,
        type: "matching",
        question: "the actors' delivery",
        answer: "F",
        answers: ["F"]
      },
      {
        number: 28,
        type: "multiple_choice",
        question: "The students think the story of Romeo and Juliet is still relevant for young people today because",
        options: [
          "A it illustrates how easily conflict can start.",
          "B it deals with problems that families experience.",
          "C it teaches them about relationships."
        ],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 29,
        type: "multiple_choice",
        question: "The students found watching Romeo and Juliet in another language",
        options: [
          "A frustrating.",
          "B demanding.",
          "C moving."
        ],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 30,
        type: "multiple_choice",
        question: "Why do the students think Shakespeare's plays have such international appeal?",
        options: [
          "A The stories are exciting.",
          "B There are recognisable characters.",
          "C They can be interpreted in many ways."
        ],
        answer: "C",
        answers: ["C"]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: Digital Technology and the Icelandic Language",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [31, 40],
    noteBlock: {
      title: "The impact of digital technology on the Icelandic language",
      sections: [
        {
          heading: "The Icelandic language",
          lines: [
            { prefix: "• has approximately ", number: 31, suffix: " speakers" },
            { prefix: "• has a ", number: 32, suffix: " that is still growing" },
            { text: "• has not changed a lot over the last thousand years" },
            { prefix: "• has its own words for computer-based concepts, such as web browser and ", number: 33, suffix: "" }
          ]
        },
        {
          heading: "Young speakers",
          lines: [
            { prefix: "• are big users of digital technology, such as ", number: 34, suffix: "" },
            { prefix: "• are becoming ", number: 35, suffix: " very quickly" },
            { prefix: "• are having discussions using only English while they are in the ", number: 36, suffix: " at school" },
            { prefix: "• are better able to identify the content of a ", number: 37, suffix: " in English than Icelandic" }
          ]
        },
        {
          heading: "Technology and internet companies",
          lines: [
            { prefix: "• write very little in Icelandic because of the small number of speakers and because of how complicated its ", number: 38, suffix: " is" }
          ]
        },
        {
          heading: "The Icelandic government",
          lines: [
            { text: "• has set up a fund to support the production of more digital content in the language" },
            { text: "• believes that Icelandic has a secure future" },
            { prefix: "• is worried that young Icelanders may lose their ", number: 39, suffix: " as Icelanders" },
            { prefix: "• is worried about the consequences of children not being ", number: 40, suffix: " in either Icelandic or English" }
          ]
        }
      ]
    },
    items: [
      {
        number: 31,
        type: "fill_notes",
        section: "The Icelandic language",
        prefix: "has approximately ",
        suffix: " speakers",
        answer: "321,000",
        answers: ["321,000", "321000"]
      },
      {
        number: 32,
        type: "fill_notes",
        section: "The Icelandic language",
        prefix: "has a ",
        suffix: " that is still growing",
        answer: "vocabulary",
        answers: ["vocabulary"]
      },
      {
        number: 33,
        type: "fill_notes",
        section: "The Icelandic language",
        prefix: "such as web browser and ",
        suffix: "",
        answer: "podcast",
        answers: ["podcast"]
      },
      {
        number: 34,
        type: "fill_notes",
        section: "Young speakers",
        prefix: "are big users of digital technology, such as ",
        suffix: "",
        answer: "smartphones",
        answers: ["smartphones", "smart phones"]
      },
      {
        number: 35,
        type: "fill_notes",
        section: "Young speakers",
        prefix: "are becoming ",
        suffix: " very quickly",
        answer: "bilingual",
        answers: ["bilingual"]
      },
      {
        number: 36,
        type: "fill_notes",
        section: "Young speakers",
        prefix: "while they are in the ",
        suffix: " at school",
        answer: "playground",
        answers: ["playground"]
      },
      {
        number: 37,
        type: "fill_notes",
        section: "Young speakers",
        prefix: "better able to identify the content of a ",
        suffix: " in English than Icelandic",
        answer: "picture",
        answers: ["picture"]
      },
      {
        number: 38,
        type: "fill_notes",
        section: "Technology and internet companies",
        prefix: "because of how complicated its ",
        suffix: " is",
        answer: "grammar",
        answers: ["grammar"]
      },
      {
        number: 39,
        type: "fill_notes",
        section: "The Icelandic government",
        prefix: "worried that young Icelanders may lose their ",
        suffix: " as Icelanders",
        answer: "identity",
        answers: ["identity"]
      },
      {
        number: 40,
        type: "fill_notes",
        section: "The Icelandic government",
        prefix: "consequences of children not being ",
        suffix: " in either Icelandic or English",
        answer: "fluent",
        answers: ["fluent"]
      }
    ]
  }
];
