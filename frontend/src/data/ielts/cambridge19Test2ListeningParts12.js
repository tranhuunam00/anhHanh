// Cambridge IELTS 19 Test 2 - Listening Parts 1 & 2 Data
// 100% Authentic Text and Questions from Cambridge 19.pdf (Pages 33-36)

export const cambridge19Test2ListeningPart1 = {
  partNumber: 1,
  title: "Part 1: Guitar Group",
  instructions: "Questions 1–6: Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.\nQuestions 7–10: Complete the table below. Write ONE WORD ONLY for each answer.",
  questionsRange: [1, 10],
  contentBlocks: [
    {
      type: "form",
      groupTitle: "Questions 1–6",
      instructions: "Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.",
      title: "Guitar Group",
      fields: [
        { label: "Coordinator: Gary", number: 1, prefix: "", suffix: "" },
        { label: "Level:", number: 2, prefix: "", suffix: "" },
        { label: "Place: the", number: 3, prefix: "", suffix: "" },
        { label: "Address:", number: 4, prefix: "", suffix: " Street, First floor, Room T347" },
        { label: "Time: Thursday morning at", number: 5, prefix: "", suffix: "" },
        { label: "Recommended website: 'The perfect", number: 6, prefix: "", suffix: "'" }
      ]
    },
    {
      type: "table",
      groupTitle: "Questions 7–10",
      instructions: "Complete the table below. Write ONE WORD ONLY for each answer.",
      title: "A typical 45-minute guitar lesson",
      headers: ["Time", "Activity", "Notes"],
      rows: [
        ["5 minutes", "tuning guitars", { prefix: "using an app or by ", number: 7, suffix: "" }],
        ["10 minutes", "strumming chords using our thumbs", { prefix: "keeping time while the teacher is ", number: 8, suffix: "" }],
        ["15 minutes", "playing songs", { prefix: "often listening to a ", number: 9, suffix: " of a song" }],
        ["10 minutes", "playing single notes and simple tunes", { prefix: "playing together, then playing ", number: 10, suffix: "" }],
        ["5 minutes", "noting things to practise at home", "-"]
      ]
    }
  ],
  items: [
    {
      number: 1,
      type: "fill_notes",
      prefix: "Guitar Group Coordinator: Gary ",
      suffix: "",
      answers: ["Mathieson", "mathieson"]
    },
    {
      number: 2,
      type: "fill_notes",
      prefix: "Level: ",
      suffix: "",
      answers: ["beginners", "beginner"]
    },
    {
      number: 3,
      type: "fill_notes",
      prefix: "Place: the ",
      suffix: ",",
      answers: ["college"]
    },
    {
      number: 4,
      type: "fill_notes",
      prefix: "Address: ",
      suffix: " Street, First floor, Room T347",
      answers: ["New", "new"]
    },
    {
      number: 5,
      type: "fill_notes",
      prefix: "Time: Thursday morning at ",
      suffix: "",
      answers: ["11", "eleven", "11am", "11 a.m."]
    },
    {
      number: 6,
      type: "fill_notes",
      prefix: "Recommended website: 'The perfect ",
      suffix: "'",
      answer: "instrument",
      acceptedAnswers: ["instrument"],
      answers: ["instrument"]
    },
    {
      number: 7,
      type: "fill_table",
      prefix: "A typical 45-minute guitar lesson (5 mins - Tuning guitars): using an app or by ",
      suffix: "",
      answers: ["ear"]
    },
    {
      number: 8,
      type: "fill_table",
      prefix: "10 mins - Strumming chords using our thumbs: keeping time while the teacher is ",
      suffix: "",
      answers: ["clapping"]
    },
    {
      number: 9,
      type: "fill_table",
      prefix: "15 mins - Playing songs: often listening to a ",
      suffix: " of a song",
      answers: ["recording"]
    },
    {
      number: 10,
      type: "fill_table",
      prefix: "10 mins - Playing single notes and simple tunes: playing together, then playing ",
      suffix: "",
      answers: ["alone"]
    }
  ]
};

export const cambridge19Test2ListeningPart2 = {
  partNumber: 2,
  title: "Part 2: Working as a Lifeboat Volunteer",
  instructions: "Questions 11–16: Choose the correct letter, A, B or C.\nQuestions 17–18: Choose TWO letters, A–E.\nQuestions 19–20: Choose TWO letters, A–E.",
  questionsRange: [11, 20],
  items: [
    {
      number: 11,
      type: "multiple_choice",
      question: "What made David leave London and move to Northsea?",
      options: [
        "A. He was eager to develop a hobby.",
        "B. He wanted to work shorter hours.",
        "C. He found his job in website design unsatisfying."
      ],
      answers: ["A"]
    },
    {
      number: 12,
      type: "multiple_choice",
      question: "The Lifeboat Institution in Northsea was built with money provided by",
      options: [
        "A. a local organisation.",
        "B. a local resident.",
        "C. the local council."
      ],
      answers: ["B"]
    },
    {
      number: 13,
      type: "multiple_choice",
      question: "In his health assessment, the doctor was concerned about the fact that David",
      options: [
        "A. might be colour blind.",
        "B. was rather short-sighted.",
        "C. had undergone eye surgery."
      ],
      answers: ["A"]
    },
    {
      number: 14,
      type: "multiple_choice",
      question: "After arriving at the lifeboat station, they aim to launch the boat within",
      options: [
        "A. five minutes.",
        "B. six to eight minutes.",
        "C. eight and a half minutes."
      ],
      answers: ["B"]
    },
    {
      number: 15,
      type: "multiple_choice",
      question: "As a 'helmsman', David has the responsibility of deciding",
      options: [
        "A. who will be the members of his crew.",
        "B. what equipment it will be necessary to take.",
        "C. if the lifeboat should be launched."
      ],
      answers: ["C"]
    },
    {
      number: 16,
      type: "multiple_choice",
      question: "As well as going out on the lifeboat, David",
      options: [
        "A. gives talks on safety at sea.",
        "B. helps with fundraising.",
        "C. recruits new volunteers."
      ],
      answers: ["A"]
    },
    {
      number: 17,
      type: "choose_two",
      pairNumber: 18,
      question: "Which TWO things does David say about the lifeboat volunteer training? (First selection):",
      options: [
        "A. The residential course developed his leadership skills.",
        "B. The training in use of ropes and knots was quite brief.",
        "C. The training exercises have built up his mental strength.",
        "D. The casualty care activities were particularly challenging for him.",
        "E. The wave tank activities provided practice in survival techniques."
      ],
      answers: ["C", "E"]
    },
    {
      number: 18,
      type: "choose_two",
      pairNumber: 17,
      question: "Which TWO things does David say about the lifeboat volunteer training? (Second selection):",
      options: [
        "A. The residential course developed his leadership skills.",
        "B. The training in use of ropes and knots was quite brief.",
        "C. The training exercises have built up his mental strength.",
        "D. The casualty care activities were particularly challenging for him.",
        "E. The wave tank activities provided practice in survival techniques."
      ],
      answers: ["C", "E"]
    },
    {
      number: 19,
      type: "choose_two",
      pairNumber: 20,
      question: "Which TWO things does David find most motivating about the work he does? (First selection):",
      options: [
        "A. working as part of a team",
        "B. experiences when working in winter",
        "C. being thanked by those he has helped",
        "D. the fact that it keeps him fit",
        "E. the chance to develop new equipment"
      ],
      answers: ["B", "D"]
    },
    {
      number: 20,
      type: "choose_two",
      pairNumber: 19,
      question: "Which TWO things does David find most motivating about the work he does? (Second selection):",
      options: [
        "A. working as part of a team",
        "B. experiences when working in winter",
        "C. being thanked by those he has helped",
        "D. the fact that it keeps him fit",
        "E. the chance to develop new equipment"
      ],
      answers: ["B", "D"]
    }
  ]
};

