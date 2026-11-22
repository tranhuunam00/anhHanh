// Cambridge IELTS 16 Test 1 - Listening Parts 1 & 2
export const listeningParts12 = [
  {
    partNumber: 1,
    title: "Part 1: Children's Engineering Workshops",
    instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
    questionsRange: [1, 10],
    noteBlock: {
      title: "Children's Engineering Workshops",
      sections: [
        {
          heading: "Tiny Engineers (ages 4–5)",
          lines: [
            { text: "Activities", isSubheading: true },
            { prefix: "Create a cover for an ", number: 1, suffix: " — so they can drop it from a height without breaking it." },
            { prefix: "Take part in a competition to build the tallest ", number: 2, suffix: "." },
            { prefix: "Make a ", number: 3, suffix: " powered by a balloon." }
          ]
        },
        {
          heading: "Junior Engineers (ages 6–8)",
          lines: [
            { text: "Activities", isSubheading: true },
            { prefix: "Build model cars, trucks and ", number: 4, suffix: " and learn how to program them so they can move." },
            { prefix: "Take part in a competition to build the longest ", number: 5, suffix: " using card and wood." },
            { prefix: "Create a short ", number: 6, suffix: " with special software." },
            { prefix: "Build, ", number: 7, suffix: " and program a humanoid robot." }
          ]
        },
        {
          heading: "Workshop details",
          lines: [
            { text: "Cost for a five-week block: £50" },
            { prefix: "Held on ", number: 8, suffix: " from 10 am to 11 am." },
            { prefix: "Location: Building 10A, ", number: 9, suffix: " Industrial Estate, Grasford." },
            { prefix: "Plenty of ", number: 10, suffix: " is available." }
          ]
        }
      ]
    },
    items: [
      { number: 1, type: "fill_notes", prefix: "Create a cover for an ", suffix: " — so they can drop it from a height without breaking it.", answer: "egg", answers: ["egg"] },
      { number: 2, type: "fill_notes", prefix: "Take part in a competition to build the tallest ", suffix: ".", answer: "tower", answers: ["tower"] },
      { number: 3, type: "fill_notes", prefix: "Make a ", suffix: " powered by a balloon.", answer: "car", answers: ["car"] },
      { number: 4, type: "fill_notes", prefix: "Build model cars, trucks and ", suffix: " and learn how to program them so they can move.", answer: "animals", answers: ["animals"] },
      { number: 5, type: "fill_notes", prefix: "Take part in a competition to build the longest ", suffix: " using card and wood.", answer: "bridge", answers: ["bridge"] },
      { number: 6, type: "fill_notes", prefix: "Create a short ", suffix: " with special software.", answer: "movie / film", answers: ["movie / film", "movie", "film"] },
      { number: 7, type: "fill_notes", prefix: "Build, ", suffix: " and program a humanoid robot.", answer: "decorate", answers: ["decorate"] },
      { number: 8, type: "fill_notes", prefix: "Held on ", suffix: " from 10 am to 11 am.", answer: "Wednesdays", answers: ["Wednesdays"] },
      { number: 9, type: "fill_notes", prefix: "Location: Building 10A, ", suffix: " Industrial Estate, Grasford.", answer: "Fradstone", answers: ["Fradstone"] },
      { number: 10, type: "fill_notes", prefix: "Plenty of ", suffix: " is available.", answer: "parking", answers: ["parking"] }
    ]
  },
  {
    partNumber: 2,
    title: "Part 2: Stevenson's site plan",
    instructions: "Questions 11–14: Choose the correct letter, A, B or C.\nQuestions 15–20: Label the map below. Write the correct letter, A–J, next to Questions 15–20.",
    questionsRange: [11, 20],
    mapImage: "/images/ielts/cam16_test1_listening_map.png",
    mapLetters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    items: [
      {
        number: 11,
        type: "multiple_choice",
        groupHeader: "Questions 11–14: Choose the correct letter, A, B or C.",
        question: "Stevenson's was founded in",
        options: ["A 1923.", "B 1924.", "C 1926."],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 12,
        type: "multiple_choice",
        question: "Originally, Stevenson's manufactured goods for",
        options: ["A the healthcare industry.", "B the automotive industry.", "C the machine tools industry."],
        answer: "A",
        answers: ["A"]
      },
      {
        number: 13,
        type: "multiple_choice",
        question: "What does the speaker say about the company premises?",
        options: ["A The company has recently moved.", "B The company has no plans to move.", "C The company is going to move shortly."],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 14,
        type: "multiple_choice",
        question: "The programme for the work experience group includes",
        options: ["A time to do research.", "B meetings with a teacher.", "C talks by staff."],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 15,
        type: "map_labeling",
        groupHeader: "Questions 15–20: Label the map below. Write the correct letter, A–J, next to Questions 15–20.",
        statement: "coffee room",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        answer: "H",
        answers: ["H"]
      },
      {
        number: 16,
        type: "map_labeling",
        statement: "warehouse",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        answer: "C",
        answers: ["C"]
      },
      {
        number: 17,
        type: "map_labeling",
        statement: "staff canteen",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        answer: "G",
        answers: ["G"]
      },
      {
        number: 18,
        type: "map_labeling",
        statement: "meeting room",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        answer: "B",
        answers: ["B"]
      },
      {
        number: 19,
        type: "map_labeling",
        statement: "human resources",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        answer: "I",
        answers: ["I"]
      },
      {
        number: 20,
        type: "map_labeling",
        statement: "boardroom",
        options: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        answer: "A",
        answers: ["A"]
      }
    ]
  }
];
