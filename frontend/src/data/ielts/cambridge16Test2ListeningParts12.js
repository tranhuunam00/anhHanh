// Cambridge IELTS 16 Test 2 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Copying photos to digital format",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Copying photos to digital format",
      sections: [
        {
          heading: "Name of company: Picturerep",
          lines: []
        },
        {
          heading: "Requirements",
          lines: [
            { text: "• Maximum size of photos is 30 cm, minimum size 4 cm." },
            { prefix: "• Photos must not be in a ", number: 1, suffix: " or an album." }
          ]
        },
        {
          heading: "Cost",
          lines: [
            { prefix: "• The cost for 360 photos is £", number: 2, suffix: " (including one disk)." },
            { prefix: "• Before the completed order is sent, ", number: 3, suffix: " is required." }
          ]
        },
        {
          heading: "Services included in the price",
          lines: [
            { prefix: "• Photos can be placed in a folder, e.g. with the name '", number: 4, suffix: "'." },
            { prefix: "• The ", number: 5, suffix: " and contrast can be improved if necessary." },
            { prefix: "• Photos which are very fragile will be scanned by ", number: 6, suffix: "." }
          ]
        },
        {
          heading: "Special restore service (costs extra)",
          lines: [
            { prefix: "• It may be possible to remove an object from a photo, or change the ", number: 7, suffix: "." },
            { prefix: "• A photo which is not correctly in ", number: 8, suffix: " cannot be fixed." }
          ]
        },
        {
          heading: "Other information",
          lines: [
            { prefix: "• Orders are completed within ", number: 9, suffix: "." },
            { prefix: "• Send the photos in a box (not ", number: 10, suffix: ")." }
          ]
        }
      ]
    },
    items: [
      { number: 1, answers: ["frame"] },
      { number: 2, answers: ["195", "£195"] },
      { number: 3, answers: ["payment"] },
      { number: 4, answers: ["Grandparents", "grandparents"] },
      { number: 5, answers: ["colour", "color", "colour / color"] },
      { number: 6, answers: ["hand"] },
      { number: 7, answers: ["background"] },
      { number: 8, answers: ["focus"] },
      { number: 9, answers: ["ten days", "10 days", "ten / 10 days"] },
      { number: 10, answers: ["plastic"] }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Dartfield House School Catering & Facilities",
    questionsRange: [11, 20],
    groups: [
      {
        groupType: "multiple_choice",
        instructions: "Choose the correct letter, A, B or C.",
        numbers: [11, 12, 13, 14, 15],
        items: [
          {
            number: 11,
            question: "Dartfield House school used to be",
            options: [
              "A a tourist information centre.",
              "B a private home.",
              "C a local council building."
            ],
            answers: ["C"]
          },
          {
            number: 12,
            question: "What is planned with regard to the lower school?",
            options: [
              "A All buildings on the main site will be improved.",
              "B The lower school site will be used for new homes.",
              "C Additional school buildings will be constructed on the lower school site."
            ],
            answers: ["B"]
          },
          {
            number: 13,
            question: "The catering has been changed because of",
            options: [
              "A long queuing times.",
              "B changes to the school timetable.",
              "C dissatisfaction with the menus."
            ],
            answers: ["A"]
          },
          {
            number: 14,
            question: "Parents are asked to",
            options: [
              "A help their children to decide in advance which serving point to use.",
              "B make sure their children have enough money for food.",
              "C advise their children on healthy food to eat."
            ],
            answers: ["A"]
          },
          {
            number: 15,
            question: "What does the speaker say about the existing canteen?",
            options: [
              "A Food will still be served there.",
              "B Only staff will have access to it.",
              "C Pupils can take their food into it."
            ],
            answers: ["C"]
          }
        ]
      },
      {
        groupType: "matching",
        instructions: "What comment does the speaker make about each of the following serving points in the Food Hall?\nChoose THREE answers from the box and write the correct letter, A–D, next to Questions 16–18.\n\nComments:\nA pupils help to plan menus\nB only vegetarian food\nC different food every week\nD daily change in menu",
        numbers: [16, 17, 18],
        items: [
          { number: 16, statement: "World Adventures", answers: ["D"] },
          { number: 17, statement: "Street Life", answers: ["A"] },
          { number: 18, statement: "Speedy Italian", answers: ["B"] }
        ]
      },
      {
        groupType: "pick_multiple",
        instructions: "Choose TWO letters, A–E.\nWhich TWO optional after-school lessons are new?",
        numbers: [19, 20],
        options: [
          "A swimming",
          "B piano",
          "C acting",
          "D cycling",
          "E theatre sound and lighting"
        ],
        items: [
          { number: 19, question: "Which TWO optional after-school lessons are new? (1 of 2)", answers: ["B", "C"] },
          { number: 20, question: "Which TWO optional after-school lessons are new? (2 of 2)", answers: ["B", "C"] }
        ]
      }
    ]
  }
];
