// Cambridge IELTS 16 Test 4 - Listening Parts 3 & 4
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: City bike-sharing schemes",
    questionsRange: [21, 30],
    groups: [
      {
        groupType: "pick_multiple",
        instructions: "Choose TWO letters, A–E.\nWhich TWO benefits of city bike-sharing schemes do the students agree are the most important?",
        numbers: [21, 22],
        options: [
          "A reducing noise pollution",
          "B reducing traffic congestion",
          "C improving air quality",
          "D encouraging health and fitness",
          "E making cycling affordable"
        ],
        items: [
          { number: 21, question: "TWO most important benefits of bike-sharing schemes (1 of 2)", answers: ["B", "C"] },
          { number: 22, question: "TWO most important benefits of bike-sharing schemes (2 of 2)", answers: ["B", "C"] }
        ]
      },
      {
        groupType: "pick_multiple",
        instructions: "Choose TWO letters, A–E.\nWhich TWO things do the students think are necessary for successful bike-sharing schemes?",
        numbers: [23, 24],
        options: [
          "A Bikes should have a GPS tracking device.",
          "B Stations should be close to public transport hubs.",
          "C The scheme should be easy to join and pay for.",
          "D Helmets should be available at bike stations.",
          "E Bikes should be serviced frequently."
        ],
        items: [
          { number: 23, question: "TWO necessities for successful bike-sharing schemes (1 of 2)", answers: ["B", "C"] },
          { number: 24, question: "TWO necessities for successful bike-sharing schemes (2 of 2)", answers: ["B", "C"] }
        ]
      },
      {
        groupType: "matching",
        instructions: "What is the speakers' opinion of the bike-sharing schemes in each of the following cities?\nChoose SIX answers from the box and write the correct letter, A–G, next to Questions 25–30.\n\nOpinions:\nA They agree it has been disappointing.\nB They think it should be cheaper.\nC They are surprised it has been so successful.\nD They agree that more investment is needed.\nE They think it was introduced too quickly.\nF They think the bikes are poorly maintained.\nG They disagree about its future prospects.",
        numbers: [25, 26, 27, 28, 29, 30],
        items: [
          { number: 25, statement: "Amsterdam", answers: ["C"] },
          { number: 26, statement: "Dublin", answers: ["F"] },
          { number: 27, statement: "London", answers: ["D"] },
          { number: 28, statement: "Buenos Aires", answers: ["E"] },
          { number: 29, statement: "New York", answers: ["B"] },
          { number: 30, statement: "Sydney", answers: ["A"] }
        ]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: The extinction of the dodo bird",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    noteBlock: {
      title: "THE EXTINCTION OF THE DODO BIRD",
      sections: [
        {
          heading: "History",
          lines: [
            { prefix: "• 1507 — Portuguese ships transporting ", number: 31, suffix: " stopped at the island to collect food and water." },
            { prefix: "• 1638 — The Dutch established a ", number: 32, suffix: " on the island." },
            { text: "• They killed the dodo birds for their meat." },
            { text: "• The last one was killed in 1681." }
          ]
        },
        {
          heading: "Description and anatomy",
          lines: [
            { text: "• The dodo was a large flightless bird that used to inhabit Mauritius." },
            { prefix: "• It stored ", number: 33, suffix: " to survive seasonal shortages." },
            { prefix: "• It had a large ", number: 34, suffix: " and a hooked bill." },
            { prefix: "• Its small wings assisted in ", number: 35, suffix: " and" },
            { prefix: "", number: 36, suffix: "." },
            { prefix: "• It had a relatively large ", number: 37, suffix: " and" },
            { prefix: "a well-developed sense of ", number: 38, suffix: "." }
          ]
        },
        {
          heading: "Reasons for extinction",
          lines: [
            { text: "• Hunting by sailors and settlers." },
            { prefix: "• Introduction of predators: dogs, monkeys and ", number: 39, suffix: " which ate eggs." },
            { prefix: "• Destruction of the island's native ", number: 40, suffix: "." }
          ]
        }
      ]
    },
    items: [
      { number: 31, answers: ["spices", "spice", "spice(s)"] },
      { number: 32, answers: ["colony", "settlement", "colony / settlement"] },
      { number: 33, answers: ["fat"] },
      { number: 34, answers: ["head"] },
      { number: 35, answers: ["movement"] },
      { number: 36, answers: ["balance", "balancing", "balance / balancing"] },
      { number: 37, answers: ["brain"] },
      { number: 38, answers: ["smell"] },
      { number: 39, answers: ["rats"] },
      { number: 40, answers: ["forest"] }
    ]
  }
];
