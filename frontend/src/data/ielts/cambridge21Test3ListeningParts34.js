// Parts 3 and 4 for Cambridge 21 Test 3 Listening
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: Ethical and Sustainable Fashion",
    instructions: "Questions 21-24: Choose TWO letters, A-E.\nQuestions 25-30: Choose SIX answers from the box and write the correct letter, A-H, next to Questions 25-30.",
    questionsRange: [21, 30],
    groups: [
      {
        groupType: "choose_two",
        title: "Questions 21 and 22",
        prompt: "Which TWO points do the speakers make about the terms 'ethical' and 'sustainable' fashion?",
        numbers: [21, 22],
        options: [
          { letter: "A", text: "Their definitions keep changing." },
          { letter: "B", text: "People think they mean the same thing." },
          { letter: "C", text: "The term 'eco-friendly' is preferable." },
          { letter: "D", text: "They are often used imprecisely." },
          { letter: "E", text: "Companies should avoid using them on clothing labels." }
        ],
        answers: ["B", "D"]
      },
      {
        groupType: "choose_two",
        title: "Questions 23 and 24",
        prompt: "Which TWO claims about wool production do the speakers disagree with?",
        numbers: [23, 24],
        options: [
          { letter: "A", text: "Sheep are generally well-treated." },
          { letter: "B", text: "Wool is easy to recycle." },
          { letter: "C", text: "Wool is a long-lasting fabric." },
          { letter: "D", text: "Wool production involves few chemicals." },
          { letter: "E", text: "Sheep do less environmental damage than other livestock." }
        ],
        answers: ["D", "E"]
      },
      {
        groupType: "matching_box",
        title: "Questions 25-30",
        prompt: "What comment do the speakers make about each of the following semi-synthetic fabrics?\nChoose SIX answers from the box and write the correct letter, A-H, next to Questions 25-30.",
        boxTitle: "Comments",
        boxOptions: [
          { letter: "A", text: "The production process is fuel efficient." },
          { letter: "B", text: "It is the least sustainable of alternative fabrics." },
          { letter: "C", text: "Production costs are high." },
          { letter: "D", text: "It provides additional health benefits." },
          { letter: "E", text: "It is not durable in the long-term." },
          { letter: "F", text: "It needs to be produced in a certain way to be sustainable." },
          { letter: "G", text: "Chemicals required for production can be reused." },
          { letter: "H", text: "This is from a wholly sustainable source." }
        ],
        items: [
          { number: 25, label: "Lyocell", answer: "G", answers: ["G"] },
          { number: 26, label: "Cupro", answer: "B", answers: ["B"] },
          { number: 27, label: "Bamboo", answer: "F", answers: ["F"] },
          { number: 28, label: "EcoVero", answer: "A", answers: ["A"] },
          { number: 29, label: "Cork", answer: "H", answers: ["H"] },
          { number: 30, label: "Hemp", answer: "D", answers: ["D"] }
        ]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: Invasive Species",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    items: [
      {
        number: 31,
        type: "note_completion",
        section: "An invasive species can be a problem when it",
        prefix: "introduces a new ",
        suffix: ".",
        answers: ["disease"],
        notes: "Problem caused by invasive species"
      },
      {
        number: 32,
        type: "note_completion",
        section: "An invasive species can be a problem when it",
        prefix: "threatens an entire ",
        suffix: ".",
        answers: ["ecosystem"],
        notes: "Impact on habitat/system"
      },
      {
        number: 33,
        type: "note_completion",
        section: "How invasive species spread",
        prefix: "accidentally e.g. via people returning from their ",
        suffix: " or on cargo ships",
        answers: ["holiday", "holidays"],
        notes: "Accidental spread route"
      },
      {
        number: 34,
        type: "note_completion",
        section: "How invasive species spread",
        prefix: "intentionally e.g. for pest control, or as ",
        suffix: ".",
        answers: ["pets"],
        notes: "Intentional spread reason"
      },
      {
        number: 35,
        type: "note_completion",
        section: "Examples of invasive species - Rhinella marina (toads)",
        prefix: "were introduced to Australia from Hawaii in 1935 to eat a type of insect that was damaging the ",
        suffix: " plantations.",
        answers: ["sugar"],
        notes: "Target plantation crop"
      },
      {
        number: 36,
        type: "note_completion",
        section: "Examples of invasive species - Plants & animals",
        prefix: "Rhododendron plants prevent ",
        suffix: " from reaching native plants.",
        answers: ["light"],
        notes: "Blocked natural resource"
      },
      {
        number: 37,
        type: "note_completion",
        section: "Examples of invasive species - Grey squirrels",
        prefix: "Grey squirrels from N. America reduce sources of food for the UK's native red squirrels and spread a ",
        suffix: " that kills red squirrels.",
        answers: ["virus"],
        notes: "Transmitted agent"
      },
      {
        number: 38,
        type: "note_completion",
        section: "Tackling invasive species",
        prefix: "Monitoring helps us to understand the ",
        suffix: " of invasive species and the impact they have.",
        answers: ["behaviour", "behavior"],
        notes: "Key characteristic monitored"
      },
      {
        number: 39,
        type: "note_completion",
        section: "Tackling invasive species",
        prefix: "Setting up a national ",
        suffix: " makes it easier to track them.",
        answers: ["database"],
        notes: "National system"
      },
      {
        number: 40,
        type: "note_completion",
        section: "Tackling invasive species",
        prefix: "Asking the public to ",
        suffix: " and report them helps with monitoring.",
        answers: ["photograph"],
        notes: "Public action requested"
      }
    ]
  }
];

