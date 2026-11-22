// Cambridge IELTS 16 Test 1 - Listening Parts 3 & 4
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: Art projects and personal meanings",
    instructions: "Questions 21 and 22: Choose TWO letters, A–E.\nQuestions 23 and 24: Choose TWO letters, A–E.\nQuestions 25–30: Choose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.",
    questionsRange: [21, 30],
    matchingOptions: [
      { letter: "A", text: "a childhood memory" },
      { letter: "B", text: "hope for the future" },
      { letter: "C", text: "fast movement" },
      { letter: "D", text: "a potential threat" },
      { letter: "E", text: "the power of colour" },
      { letter: "F", text: "the continuity of life" },
      { letter: "G", text: "protection of nature" },
      { letter: "H", text: "a confused attitude to nature" }
    ],
    items: [
      {
        number: 21,
        type: "choose_two",
        pairNumber: 22,
        groupHeader: "Questions 21 and 22: Choose TWO letters, A–E.",
        question: "Which TWO parts of the introductory stage to their art projects do Jess and Tom agree were useful?",
        options: [
          "A the Bird Park visit",
          "B the workshop sessions",
          "C the Natural History Museum visit",
          "D the projects done in previous years",
          "E the handouts with research sources"
        ],
        answer: "C",
        acceptedAnswers: ["C", "E"],
        answers: ["C", "E"]
      },
      {
        number: 22,
        type: "choose_two",
        pairNumber: 21,
        question: "Which TWO parts of the introductory stage to their art projects do Jess and Tom agree were useful?",
        options: [
          "A the Bird Park visit",
          "B the workshop sessions",
          "C the Natural History Museum visit",
          "D the projects done in previous years",
          "E the handouts with research sources"
        ],
        answer: "E",
        acceptedAnswers: ["C", "E"],
        answers: ["C", "E"]
      },
      {
        number: 23,
        type: "choose_two",
        pairNumber: 24,
        groupHeader: "Questions 23 and 24: Choose TWO letters, A–E.",
        question: "In which TWO ways do both Jess and Tom decide to change their proposals?",
        options: [
          "A by giving a rationale for their action plans",
          "B by being less specific about the outcome",
          "C by adding a video diary presentation",
          "D by providing a timeline and a mind map",
          "E by making their notes more evaluative"
        ],
        answer: "B",
        acceptedAnswers: ["B", "E"],
        answers: ["B", "E"]
      },
      {
        number: 24,
        type: "choose_two",
        pairNumber: 23,
        question: "In which TWO ways do both Jess and Tom decide to change their proposals?",
        options: [
          "A by giving a rationale for their action plans",
          "B by being less specific about the outcome",
          "C by adding a video diary presentation",
          "D by providing a timeline and a mind map",
          "E by making their notes more evaluative"
        ],
        answer: "E",
        acceptedAnswers: ["B", "E"],
        answers: ["B", "E"]
      },
      {
        number: 25,
        type: "matching",
        groupHeader: "Questions 25–30: Which personal meaning do the students decide to give to each of the following pictures?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.",
        statement: "Falcon (Landseer)",
        answer: "D",
        answers: ["D"]
      },
      {
        number: 26,
        type: "matching",
        statement: "Fish hawk (Audubon)",
        answer: "C",
        answers: ["C"]
      },
      {
        number: 27,
        type: "matching",
        statement: "Kingfisher (van Gogh)",
        answer: "A",
        answers: ["A"]
      },
      {
        number: 28,
        type: "matching",
        statement: "Portrait of William Wells",
        answer: "H",
        answers: ["H"]
      },
      {
        number: 29,
        type: "matching",
        statement: "Vairumati (Gauguin)",
        answer: "F",
        answers: ["F"]
      },
      {
        number: 30,
        type: "matching",
        statement: "Portrait of Giovanni de Medici",
        answer: "G",
        answers: ["G"]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: Stoicism",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    noteBlock: {
      title: "Stoicism",
      sections: [
        {
          heading: "Introduction",
          lines: [
            { prefix: "Stoicism is still relevant today because of its ", number: 31, suffix: " appeal." }
          ]
        },
        {
          heading: "Ancient Stoics",
          lines: [
            { text: "Stoicism was founded over 2,000 years ago in Greece." },
            { prefix: "The Stoics' ideas are surprisingly well known, despite not being intended for ", number: 32, suffix: "." }
          ]
        },
        {
          heading: "Stoic principles",
          lines: [
            { text: "Happiness could be achieved by leading a virtuous life." },
            { text: "Controlling emotions was essential." },
            { prefix: "Epictetus said that external events cannot be controlled but the ", number: 33, suffix: " people make in response can be controlled." },
            { prefix: "A Stoic is someone who has a different view on experiences which others would consider as ", number: 34, suffix: "." }
          ]
        },
        {
          heading: "The influence of Stoicism",
          lines: [
            { prefix: "George Washington organised a ", number: 35, suffix: " about Cato to motivate his men." },
            { text: "The French artist Delacroix was a Stoic." },
            { prefix: "Adam Smith's ideas on ", number: 36, suffix: " were influenced by Stoicism." },
            { text: "Some of today's political leaders are inspired by the Stoics." }
          ]
        },
        {
          heading: "Cognitive Behaviour Therapy (CBT)",
          lines: [
            { text: "is based on ideas from Stoicism" },
            { prefix: "the treatment for ", number: 37, suffix: "" },
            { prefix: "people learn to base their thinking on ", number: 38, suffix: "" }
          ]
        },
        {
          heading: "In business",
          lines: [
            { prefix: "people benefit from Stoicism by identifying obstacles as ", number: 39, suffix: "" }
          ]
        },
        {
          heading: "Relevance of Stoicism",
          lines: [
            { prefix: "It requires a lot of ", number: 40, suffix: " but Stoicism can help people to lead a good life." },
            { text: "It teaches people that having a strong character is more important than anything else." }
          ]
        }
      ]
    },
    items: [
      { number: 31, type: "fill_notes", prefix: "Stoicism is still relevant today because of its ", suffix: " appeal.", answer: "practical", answers: ["practical"] },
      { number: 32, type: "fill_notes", prefix: "The Stoics' ideas are surprisingly well known, despite not being intended for ", suffix: ".", answer: "publication", answers: ["publication"] },
      { number: 33, type: "fill_notes", prefix: "Epictetus said that external events cannot be controlled but the ", suffix: " people make in response can be controlled.", answer: "choices", answers: ["choices"] },
      { number: 34, type: "fill_notes", prefix: "A Stoic is someone who has a different view on experiences which others would consider as ", suffix: ".", answer: "negative", answers: ["negative"] },
      { number: 35, type: "fill_notes", prefix: "George Washington organised a ", suffix: " about Cato to motivate his men.", answer: "play", answers: ["play"] },
      { number: 36, type: "fill_notes", prefix: "Adam Smith's ideas on ", suffix: " were influenced by Stoicism.", answer: "capitalism", answers: ["capitalism"] },
      { number: 37, type: "fill_notes", prefix: "the treatment for ", suffix: "", answer: "depression", answers: ["depression"] },
      { number: 38, type: "fill_notes", prefix: "people learn to base their thinking on ", suffix: "", answer: "logic", answers: ["logic"] },
      { number: 39, type: "fill_notes", prefix: "people benefit from Stoicism by identifying obstacles as ", suffix: "", answer: "opportunity", answers: ["opportunity"] },
      { number: 40, type: "fill_notes", prefix: "It requires a lot of ", suffix: " but Stoicism can help people to lead a good life.", answer: "practice / practise", answers: ["practice / practise", "practice", "practise"] }
    ]
  }
];
