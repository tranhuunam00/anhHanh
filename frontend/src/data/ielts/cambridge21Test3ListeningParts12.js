// Parts 1 and 2 for Cambridge 21 Test 3 Listening
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Ferry to Shetland Islands",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    items: [
      {
        number: 1,
        type: "note_completion",
        prefix: "Name of ferry company: ",
        suffix: " Ferries",
        answers: ["Northern"],
        notes: "Name of ferry company"
      },
      {
        number: 2,
        type: "note_completion",
        prefix: "Ferries depart seven times per ",
        suffix: " in summer",
        answers: ["week"],
        notes: "Frequency of departures"
      },
      {
        number: 3,
        type: "note_completion",
        prefix: "Cost for four people with car: a little less than £ ",
        suffix: "",
        answers: ["250", "two hundred and fifty"],
        notes: "Cost for four people with car"
      },
      {
        number: 4,
        type: "note_completion",
        prefix: "Cancellation policy: receive a ",
        suffix: " (if cancelled a month in advance)",
        answers: ["voucher"],
        notes: "Cancellation refund type"
      },
      {
        number: 5,
        type: "note_completion",
        prefix: "Cabins: book one with a ",
        suffix: " (luxury cabins have a TV)",
        answers: ["window"],
        notes: "Recommended cabin feature"
      },
      {
        number: 6,
        type: "note_completion",
        prefix: "Bring snacks and ",
        suffix: " for the children",
        answers: ["books"],
        notes: "Items for children"
      },
      {
        number: 7,
        type: "note_completion",
        prefix: "A ",
        suffix: " is required for the dog kennels",
        answers: ["blanket"],
        notes: "Requirement for dog kennels"
      },
      {
        number: 8,
        type: "note_completion",
        prefix: "Try to see ",
        suffix: " in the morning",
        answers: ["dolphins"],
        notes: "Morning sightseeing"
      },
      {
        number: 9,
        type: "note_completion",
        prefix: "If time, visit ",
        suffix: " Castle",
        answers: ["Drum"],
        notes: "Castle visit"
      },
      {
        number: 10,
        type: "note_completion",
        prefix: "The ",
        suffix: " restaurant in a nearby village is recommended",
        answers: ["Italian"],
        notes: "Recommended restaurant type"
      }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Starting a Street Food Business",
    instructions: "Questions 11-14: Choose TWO letters, A-E.\nQuestions 15-16: Choose the correct letter, A, B or C.\nQuestions 17-20: Choose FOUR answers from the box and write the correct letter, A-F.",
    questionsRange: [11, 20],
    groups: [
      {
        groupType: "choose_two",
        title: "Questions 11 and 12",
        prompt: "Which TWO explanations for the popularity of street food are given?",
        numbers: [11, 12],
        options: [
          { letter: "A", text: "low price" },
          { letter: "B", text: "locally sourced" },
          { letter: "C", text: "freshly made" },
          { letter: "D", text: "convenience" },
          { letter: "E", text: "unusual food" }
        ],
        answers: ["C", "E"]
      },
      {
        groupType: "choose_two",
        title: "Questions 13 and 14",
        prompt: "Which TWO places are recommended for new street food businesses?",
        numbers: [13, 14],
        options: [
          { letter: "A", text: "music festivals" },
          { letter: "B", text: "food markets" },
          { letter: "C", text: "weddings" },
          { letter: "D", text: "parties" },
          { letter: "E", text: "parks" }
        ],
        answers: ["B", "E"]
      },
      {
        groupType: "multiple_choice",
        title: "Questions 15 and 16",
        instruction: "Choose the correct letter, A, B or C.",
        items: [
          {
            number: 15,
            prompt: "What does the speaker say about getting equipment for a street food business?",
            options: [
              { letter: "A", text: "High quality equipment is a good investment." },
              { letter: "B", text: "It's best to buy second-hand equipment." },
              { letter: "C", text: "Renting equipment can be cheap." }
            ],
            answer: "B",
            answers: ["B"]
          },
          {
            number: 16,
            prompt: "What advice is given about creating a product for a street food business?",
            options: [
              { letter: "A", text: "Provide information about the ingredients." },
              { letter: "B", text: "It is important to have an original product." },
              { letter: "C", text: "The presentation is an important factor." }
            ],
            answer: "C",
            answers: ["C"]
          }
        ]
      },
      {
        groupType: "matching_box",
        title: "Questions 17-20",
        prompt: "What problem did the owners of each of the following street food businesses experience?\nChoose FOUR answers from the box and write the correct letter, A-F, next to Questions 17-20.",
        boxTitle: "Problems",
        boxOptions: [
          { letter: "A", text: "Some ingredients were too expensive." },
          { letter: "B", text: "The meals took a long time to prepare." },
          { letter: "C", text: "They had no money for marketing." },
          { letter: "D", text: "It was difficult to get a permit to sell food." },
          { letter: "E", text: "A competitor was selling similar food in their area." },
          { letter: "F", text: "They worked very long hours." }
        ],
        items: [
          { number: 17, label: "Thai Basil", answer: "F", answers: ["F"] },
          { number: 18, label: "Basque", answer: "A", answers: ["A"] },
          { number: 19, label: "Lou's kitchen", answer: "B", answers: ["B"] },
          { number: 20, label: "Chip Chop", answer: "D", answers: ["D"] }
        ]
      }
    ]
  }
];

