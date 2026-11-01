// Parts 1 and 2 for Cambridge 21 Test 1 Listening
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Oyster Bay Sailing Club Courses",
    instructions: "Complete the table below.\nWrite ONE WORD AND/OR A NUMBER for each answer.\n\nQuestions 7-10: Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [1, 10],
    items: [
      {
        number: 1,
        type: "fill_table",
        course: "Taster day",
        field: "Other information",
        prefix: "small groups (max ",
        suffix: " people)",
        answers: ["10", "ten"],
        notes: "Cost: £120 if booking one place"
      },
      {
        number: 2,
        type: "fill_table",
        course: "Level 1",
        field: "What you learn",
        prefix: "basic theory e.g. understanding the ",
        suffix: " and tides",
        answers: ["weather"],
        notes: "Cost: £200"
      },
      {
        number: 3,
        type: "fill_table",
        course: "Level 1",
        field: "What you learn",
        prefix: "basic sailing skills including ",
        suffix: " information",
        answers: ["safety"],
        notes: "Cost: £200"
      },
      {
        number: 4,
        type: "fill_table",
        course: "Level 1",
        field: "Cost",
        prefix: "",
        suffix: " available for club members",
        answers: ["discount"],
        notes: "Level 1 course fee"
      },
      {
        number: 5,
        type: "fill_table",
        course: "Level 1",
        field: "Cost",
        prefix: "all inclusive (plus a useful ",
        suffix: ")",
        answers: ["dictionary"],
        notes: "Level 1 course material"
      },
      {
        number: 6,
        type: "fill_table",
        course: "Level 1",
        field: "Other information",
        prefix: "a ",
        suffix: " at the end of the course for all participants",
        answers: ["certificate"],
        notes: "End of course award"
      },
      {
        number: 7,
        type: "fill_notes",
        prefix: "Bring suitable clothing, a ",
        suffix: " and toiletries (e.g. shampoo).",
        answers: ["towel"],
        notes: "General information"
      },
      {
        number: 8,
        type: "fill_notes",
        prefix: "There is a ",
        suffix: " at the club.",
        answers: ["cafe", "café"],
        notes: "General information"
      },
      {
        number: 9,
        type: "fill_notes",
        prefix: "Online training ",
        suffix: " are recommended.",
        answers: ["videos"],
        notes: "General information"
      },
      {
        number: 10,
        type: "fill_notes",
        prefix: "",
        suffix: " are available for course participants.",
        answers: ["lockers", "Lockers"],
        notes: "General information"
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Working as a makeup trainee",
    instructions: "Questions 11-16: Choose the correct letter, A, B or C.\nQuestions 17-20: What ability is required for each of the following duties? Write the correct letter, A, B, or C, next to Questions 17-20.",
    questionsRange: [11, 20],
    groups: [
      {
        groupType: "multiple_choice",
        instructions: "Choose the correct letter, A, B or C.",
        numbers: [11, 12, 13, 14, 15, 16],
        items: [
          {
            number: 11,
            question: "What should trainees always expect to get when working on low budget short films?",
            options: [
              { letter: "A", text: "travel expenses" },
              { letter: "B", text: "a minimum wage" },
              { letter: "C", text: "meals" }
            ],
            answer: "A",
            answers: ["A"]
          },
          {
            number: 12,
            question: "According to the speaker, on big budget films trainees may get experience of",
            options: [
              { letter: "A", text: "makeup for special effects." },
              { letter: "B", text: "working with different ethnicities." },
              { letter: "C", text: "creating a variety of hair styles." }
            ],
            answer: "B",
            answers: ["B"]
          },
          {
            number: 13,
            question: "The speaker says a problem for makeup artists is",
            options: [
              { letter: "A", text: "dealing with difficult directors." },
              { letter: "B", text: "being shouted at by their supervisor." },
              { letter: "C", text: "waiting around for hours doing nothing." }
            ],
            answer: "A",
            answers: ["A"]
          },
          {
            number: 14,
            question: "How did the speaker feel when she met famous actors for the first time?",
            options: [
              { letter: "A", text: "very shy" },
              { letter: "B", text: "very proud" },
              { letter: "C", text: "very disappointed" }
            ],
            answer: "A",
            answers: ["A"]
          },
          {
            number: 15,
            question: "What advice does the speaker give about makeup kits?",
            options: [
              { letter: "A", text: "Always carry a basic kit with you." },
              { letter: "B", text: "Only buy the best products for a makeup kit." },
              { letter: "C", text: "Ask other makeup artists to check your kit." }
            ],
            answer: "A",
            answers: ["A"]
          },
          {
            number: 16,
            question: "What advice does the speaker give about creating a portfolio?",
            options: [
              { letter: "A", text: "Keep print and digital photos." },
              { letter: "B", text: "Only include a small selection of photos." },
              { letter: "C", text: "Get permission to use photos." }
            ],
            answer: "C",
            answers: ["C"]
          }
        ]
      },
      {
        groupType: "matching_options",
        instructions: "What ability is required for each of the following duties?\nWrite the correct letter, A, B, or C, next to Questions 17-20.",
        numbers: [17, 18, 19, 20],
        optionsList: [
          { letter: "A", text: "being well-organised" },
          { letter: "B", text: "being flexible" },
          { letter: "C", text: "working quickly" }
        ],
        items: [
          {
            number: 17,
            duty: "Prepping an actor",
            answer: "C",
            answers: ["C"]
          },
          {
            number: 18,
            duty: "Continuity",
            answer: "A",
            answers: ["A"]
          },
          {
            number: 19,
            duty: "General",
            answer: "B",
            answers: ["B"]
          },
          {
            number: 20,
            duty: "Applying makeup",
            answer: "C",
            answers: ["C"]
          }
        ]
      }
    ]
  }
];

