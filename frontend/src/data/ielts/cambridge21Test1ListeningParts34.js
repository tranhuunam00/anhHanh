// Parts 3 and 4 for Cambridge 21 Test 1 Listening
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: Ocean biodiversity",
    instructions: "Questions 21-24: Choose TWO letters, A-E.\nQuestions 25-30: Choose SIX answers from the box and write the correct letter, A-H, next to Questions 25-30.",
    questionsRange: [21, 30],
    groups: [
      {
        groupType: "choose_two",
        question: "Which TWO features of the lecture on ocean biodiversity had the greatest impact on the students?",
        instructions: "Choose TWO letters, A-E.",
        numbers: [21, 22],
        options: [
          { letter: "A", text: "the references to local problems" },
          { letter: "B", text: "the broad focus of the examples" },
          { letter: "C", text: "the practical suggestions for solutions" },
          { letter: "D", text: "the type of issues discussed" },
          { letter: "E", text: "the implications for government policy" }
        ],
        answers: ["B", "D"]
      },
      {
        groupType: "choose_two",
        question: "Which TWO details about the research project particularly impressed the students?",
        instructions: "Choose TWO letters, A-E.",
        numbers: [23, 24],
        options: [
          { letter: "A", text: "the team's previous successes" },
          { letter: "B", text: "its wide geographical scale" },
          { letter: "C", text: "the use of new technology" },
          { letter: "D", text: "the extensive statistical evidence" },
          { letter: "E", text: "the large range of specialists involved" }
        ],
        answers: ["C", "E"]
      },
      {
        groupType: "matching_opinions",
        question: "What is the students' opinion of each of the following resources related to ocean biodiversity?",
        instructions: "Choose SIX answers from the box and write the correct letter, A-H, next to Questions 25-30.",
        numbers: [25, 26, 27, 28, 29, 30],
        optionsList: [
          { letter: "A", text: "This is aimed at a very specialist audience." },
          { letter: "B", text: "This is now rather outdated." },
          { letter: "C", text: "This was an effective description of a new danger." },
          { letter: "D", text: "This suggests possible ways to improve the situation." },
          { letter: "E", text: "This does not give a balanced account." },
          { letter: "F", text: "This is too predictable to be useful." },
          { letter: "G", text: "This gives insufficient evidence for its claims." },
          { letter: "H", text: "This gives a clear explanation of the problems." }
        ],
        items: [
          { number: 25, title: "Article on invasive lionfish", answer: "G", answers: ["G"] },
          { number: 26, title: "Documentary on microplastics", answer: "B", answers: ["B"] },
          { number: 27, title: "Podcast on ocean pollution", answer: "F", answers: ["F"] },
          { number: 28, title: "Book on coastal ecosystems", answer: "H", answers: ["H"] },
          { number: 29, title: "Article on metal toxicity", answer: "A", answers: ["A"] },
          { number: 30, title: "Podcast on floating marine cities", answer: "E", answers: ["E"] }
        ]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: Sources of rubber",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    items: [
      {
        number: 31,
        type: "fill_notes",
        section: "Three resources which are essential for industrial civilisation",
        prefix: "",
        suffix: "",
        answers: ["metal", "metals"]
      },
      {
        number: 32,
        type: "fill_notes",
        section: "Natural rubber - The supply is limited because",
        prefix: "the growth of the tree is ",
        suffix: ".",
        answers: ["slow"]
      },
      {
        number: 33,
        type: "fill_notes",
        section: "Natural rubber - The supply is limited because",
        prefix: "production cannot easily be adjusted because of increasing or decreasing ",
        suffix: ".",
        answers: ["demand"]
      },
      {
        number: 34,
        type: "fill_notes",
        section: "Natural rubber - The supply is limited because",
        prefix: "the tree only grows near the ",
        suffix: ".",
        answers: ["equator"]
      },
      {
        number: 35,
        type: "fill_notes",
        section: "Natural rubber - The supply is limited because",
        prefix: "it is very difficult to ",
        suffix: " rubber after production.",
        answers: ["recycle"]
      },
      {
        number: 36,
        type: "fill_notes",
        section: "New threats include",
        prefix: "lack of genetic diversity, leading to danger of disease caused by a ",
        suffix: ".",
        answers: ["fungus"]
      },
      {
        number: 37,
        type: "fill_notes",
        section: "New threats include",
        prefix: "extreme ",
        suffix: " events.",
        answers: ["weather"]
      },
      {
        number: 38,
        type: "fill_notes",
        section: "Synthetic rubber",
        prefix: "is less ",
        suffix: " than natural rubber",
        answers: ["strong"]
      },
      {
        number: 39,
        type: "fill_notes",
        section: "An alternative source of natural rubber",
        prefix: "A wild flower (a type of dandelion) has rubber in its ",
        suffix: ".",
        answers: ["roots"]
      },
      {
        number: 40,
        type: "fill_notes",
        section: "An alternative source of natural rubber",
        prefix: "It can be grown in many locations and does not require good ",
        suffix: ".",
        answers: ["soil"]
      }
    ]
  }
];

