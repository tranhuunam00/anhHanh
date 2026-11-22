// Cambridge IELTS 16 Test 4 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Holiday rental",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Holiday rental",
      sections: [
        {
          heading: "Owners' names: Jack Fitzgerald and Shirley Fitzgerald",
          lines: []
        },
        {
          heading: "Granary Cottage",
          lines: [
            { prefix: "• Available for week beginning ", number: 1, suffix: " May" },
            { prefix: "• Cost for the week: £", number: 2, suffix: "" }
          ]
        },
        {
          heading: "Chervil Cottage",
          lines: [
            { prefix: "• Name of cottage: ", number: 3, suffix: " Cottage" },
            { text: "• Cost for the week: £480" },
            { prefix: "• Building was originally a ", number: 4, suffix: "" },
            { prefix: "• Walk through doors from living room into a ", number: 5, suffix: "" },
            { prefix: "• Several ", number: 6, suffix: " spaces at the front" },
            { text: "• Bathroom has a shower" },
            { prefix: "• Central heating and stove that burns ", number: 7, suffix: "" },
            { prefix: "• Views of old stone ", number: 8, suffix: " from terrace" },
            { prefix: "• View of hilltop ", number: 9, suffix: " from the dining room" }
          ]
        },
        {
          heading: "Payment",
          lines: [
            { text: "• Deposit: £100" },
            { prefix: "• Deadline for final payment: end of ", number: 10, suffix: "" }
          ]
        }
      ]
    },
    items: [
      { number: 1, answers: ["28th", "28th May", "28"] },
      { number: 2, answers: ["550", "£550"] },
      { number: 3, answers: ["Chervil"] },
      { number: 4, answers: ["garage"] },
      { number: 5, answers: ["garden"] },
      { number: 6, answers: ["parking"] },
      { number: 7, answers: ["wood"] },
      { number: 8, answers: ["bridge"] },
      { number: 9, answers: ["monument"] },
      { number: 10, answers: ["March"] }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Local council report on traffic and highways",
    questionsRange: [11, 20],
    groups: [
      {
        groupType: "multiple_choice",
        instructions: "Choose the correct letter, A, B or C.",
        numbers: [11, 12, 13, 14],
        items: [
          {
            number: 11,
            question: "A survey found people's main concern about traffic in the area was",
            options: [
              "A cuts to public transport.",
              "B poor maintenance of roads.",
              "C changes in the type of traffic."
            ],
            answers: ["C"]
          },
          {
            number: 12,
            question: "Which change will shortly be made to the cycle path next to the river?",
            options: [
              "A It will be widened.",
              "B It will be extended.",
              "C It will be resurfaced."
            ],
            answers: ["A"]
          },
          {
            number: 13,
            question: "Plans for a pedestrian crossing near the railway station have been put on hold because",
            options: [
              "A residents preferred an alternative location.",
              "B the council has other spending priorities.",
              "C there were concerns about pedestrian safety."
            ],
            answers: ["B"]
          },
          {
            number: 14,
            question: "What will happen to the bus service next year?",
            options: [
              "A Buses will run more frequently.",
              "B A new route will be introduced.",
              "C Fares will be reduced during off-peak hours."
            ],
            answers: ["B"]
          }
        ]
      },
      {
        groupType: "matching_map",
        instructions: "Label the map below.\nWrite the correct letter, A–I, next to Questions 15–20.",
        title: "Recreation ground after proposed changes",
        imageUrl: "/images/ielts/cam16_test4_listening_map.png",
        numbers: [15, 16, 17, 18, 19, 20],
        items: [
          { number: 15, statement: "New car park", answers: ["C"] },
          { number: 16, statement: "New cricket pitch", answers: ["F"] },
          { number: 17, statement: "Children's playground", answers: ["A"] },
          { number: 18, statement: "Skateboard ramp", answers: ["I"] },
          { number: 19, statement: "Pavilion", answers: ["E"] },
          { number: 20, statement: "Notice board", answers: ["H"] }
        ]
      }
    ]
  }
];
