// Parts 1 and 2 for Cambridge 20 Test 1 Listening
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Restaurant recommendations",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    items: [
      {
        number: 1,
        type: "fill_table",
        restaurant: "The Junction",
        location: "Greyson Street, near the station",
        field: "Reason for recommendation",
        prefix: "Good for people who are especially keen on ",
        suffix: "",
        answers: ["fish"],
        notes: "Quite expensive"
      },
      {
        number: 2,
        type: "fill_table",
        restaurant: "The Junction",
        location: "Greyson Street, near the station",
        field: "Other comments",
        prefix: "The ",
        suffix: " is a good place for a drink",
        answers: ["roof"],
        notes: "Quite expensive"
      },
      {
        number: 3,
        type: "fill_table",
        restaurant: "Paloma",
        location: "In Bow Street next to the cinema",
        field: "Reason for recommendation",
        prefix: "Food, good for sharing - ",
        suffix: "",
        answers: ["Spanish", "spanish"],
        notes: "A famous chef"
      },
      {
        number: 4,
        type: "fill_table",
        restaurant: "Paloma",
        location: "In Bow Street next to the cinema",
        field: "Other comments",
        prefix: "A limited selection of ",
        suffix: " food on the menu",
        answers: ["vegetarian"],
        notes: "Staff are very friendly; Need to pay £50 deposit"
      },
      {
        number: 5,
        type: "fill_table",
        restaurant: "The Audley",
        field: "Name of restaurant",
        prefix: "The ",
        suffix: "",
        answers: ["Audley", "audley"],
        notes: "Restaurant recommendation"
      },
      {
        number: 6,
        type: "fill_table",
        restaurant: "The Audley",
        field: "Location",
        prefix: "At the top of a ",
        suffix: "",
        answers: ["hotel"],
        notes: "Baxter Bridge area"
      },
      {
        number: 7,
        type: "fill_table",
        restaurant: "The Audley",
        field: "Reason for recommendation",
        prefix: "All the ",
        suffix: " are very good",
        answers: ["reviews"],
        notes: "Top class restaurant"
      },
      {
        number: 8,
        type: "fill_table",
        restaurant: "The Audley",
        field: "Reason for recommendation",
        prefix: "Only uses ",
        suffix: " ingredients",
        answers: ["local"],
        notes: "Top class restaurant"
      },
      {
        number: 9,
        type: "fill_table",
        restaurant: "The Audley",
        field: "Other comments",
        prefix: "Set lunch costs £",
        suffix: " per person",
        answers: ["30", "thirty"],
        notes: "Dinner is more expensive"
      },
      {
        number: 10,
        type: "fill_table",
        restaurant: "The Audley",
        field: "Other comments",
        prefix: "Portions probably of ",
        suffix: " size",
        answers: ["average"],
        notes: "Generous portions"
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: A visit to Edelman Pottery",
    instructions: "Questions 11-16: Choose the correct letter, A, B or C.\nQuestions 17-20: Choose TWO letters, A-E.",
    questionsRange: [11, 20],
    groups: [
      {
        groupType: "multiple_choice",
        instructions: "Choose the correct letter, A, B or C.",
        numbers: [11, 12, 13, 14, 15, 16],
        items: [
          {
            number: 11,
            question: "Heather says pottery differs from other art forms because",
            options: [
              { letter: "A", text: "it lasts longer in the ground." },
              { letter: "B", text: "it is practised by more people." },
              { letter: "C", text: "it can be repaired more easily." }
            ],
            answer: "A",
            answers: ["A"]
          },
          {
            number: 12,
            question: "Archaeologists sometimes identify the use of ancient pottery from",
            options: [
              { letter: "A", text: "the clay it was made with." },
              { letter: "B", text: "the marks that are on it." },
              { letter: "C", text: "the basic shape of it." }
            ],
            answer: "B",
            answers: ["B"]
          },
          {
            number: 13,
            question: "Some people join Heather's pottery class because they want to",
            options: [
              { letter: "A", text: "create an item that looks very old." },
              { letter: "B", text: "find something that they are good at." },
              { letter: "C", text: "make something that will outlive them." }
            ],
            answer: "C",
            answers: ["C"]
          },
          {
            number: 14,
            question: "What does Heather value most about being a potter?",
            options: [
              { letter: "A", text: "its calming effect" },
              { letter: "B", text: "its messy nature" },
              { letter: "C", text: "its physical benefits" }
            ],
            answer: "A",
            answers: ["A"]
          },
          {
            number: 15,
            question: "Most of the visitors to Edelman Pottery",
            options: [
              { letter: "A", text: "bring friends to join courses." },
              { letter: "B", text: "have never made a pot before." },
              { letter: "C", text: "try to learn techniques too quickly." }
            ],
            answer: "B",
            answers: ["B"]
          },
          {
            number: 16,
            question: "Heather reminds her visitors that they should",
            options: [
              { letter: "A", text: "put on their aprons." },
              { letter: "B", text: "change their clothes." },
              { letter: "C", text: "take off their jewellery." }
            ],
            answer: "C",
            answers: ["C"]
          }
        ]
      },
      {
        groupType: "choose_two",
        question: "Which TWO things does Heather explain about kilns?",
        instructions: "Choose TWO letters, A-E.",
        numbers: [17, 18],
        options: [
          { letter: "A", text: "what their function is" },
          { letter: "B", text: "when they were invented" },
          { letter: "C", text: "ways of keeping them safe" },
          { letter: "D", text: "where to put one in your home" },
          { letter: "E", text: "what some people use instead of one" }
        ],
        answers: ["A", "E"]
      },
      {
        groupType: "choose_two",
        question: "Which TWO points does Heather make about a potter's tools?",
        instructions: "Choose TWO letters, A-E.",
        numbers: [19, 20],
        options: [
          { letter: "A", text: "Some are hard to hold." },
          { letter: "B", text: "Some are worth buying." },
          { letter: "C", text: "Some are essential items." },
          { letter: "D", text: "Some have memorable names." },
          { letter: "E", text: "Some are available for use by participants." }
        ],
        answers: ["C", "E"]
      }
    ]
  }
];

