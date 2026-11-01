// Parts 3 and 4 for Cambridge 21 Test 4 Listening
export const listeningParts34 = [
  {
    partNumber: 3,
    title: "Part 3: Presentation on Houses of the Future",
    instructions: "Questions 21-23: Choose the correct letter, A, B or C.\nQuestions 24-30: Choose SEVEN answers from the box and write the correct letter, A-I, next to Questions 24-30.",
    questionsRange: [21, 30],
    groups: [
      {
        groupType: "multiple_choice",
        title: "Questions 21-23",
        instruction: "Choose the correct letter, A, B or C.",
        items: [
          {
            number: 21,
            prompt: "Which aspect of their presentation are Mia and Leo both concerned about?",
            options: [
              { letter: "A", text: "meeting the deadline" },
              { letter: "B", text: "finding suitable examples" },
              { letter: "C", text: "including original ideas" }
            ],
            answer: "B",
            answers: ["B"]
          },
          {
            number: 22,
            prompt: "The students decide to focus their assignment on housing for",
            options: [
              { letter: "A", text: "family groups." },
              { letter: "B", text: "old people." },
              { letter: "C", text: "single people." }
            ],
            answer: "A",
            answers: ["A"]
          },
          {
            number: 23,
            prompt: "The students agree that demand for accommodation in urban areas should be met by",
            options: [
              { letter: "A", text: "repurposing offices and factories." },
              { letter: "B", text: "constructing tall buildings." },
              { letter: "C", text: "developing creative ideas for smaller homes." }
            ],
            answer: "B",
            answers: ["B"]
          }
        ]
      },
      {
        groupType: "matching_box",
        title: "Questions 24-30",
        prompt: "What opinion is given about each of the following developments?\nChoose SEVEN answers from the box and write the correct letter, A-I, next to Questions 24-30.",
        boxTitle: "Opinions",
        boxOptions: [
          { letter: "A", text: "This could cause unnecessary anxiety." },
          { letter: "B", text: "This would be especially beneficial for city residents." },
          { letter: "C", text: "This would be challenging for young people." },
          { letter: "D", text: "This would have environmental benefits." },
          { letter: "E", text: "This could encourage creativity." },
          { letter: "F", text: "This could lead to social problems." },
          { letter: "G", text: "This could enable retired people to share a project." },
          { letter: "H", text: "This would help some people but cause problems for others." },
          { letter: "I", text: "This would suit both existing and new members of a household." }
        ],
        items: [
          { number: 24, label: "use of roof space for gardens", answer: "B", answers: ["B"] },
          { number: 25, label: "shared working spaces", answer: "E", answers: ["E"] },
          { number: 26, label: "moveable internal walls", answer: "I", answers: ["I"] },
          { number: 27, label: "smart mirrors in bathrooms", answer: "A", answers: ["A"] },
          { number: 28, label: "bike sheds with charging points", answer: "D", answers: ["D"] },
          { number: 29, label: "restriction of cars to certain areas", answer: "H", answers: ["H"] },
          { number: 30, label: "communal vegetable plots", answer: "G", answers: ["G"] }
        ]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Part 4: Music Therapy for Surgical Patients",
    instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
    questionsRange: [31, 40],
    items: [
      {
        number: 31,
        type: "note_completion",
        section: "Background",
        prefix: "Surgery impacts patients because they may experience discomfort or unwelcome changes to their ",
        suffix: ".",
        answers: ["routine"],
        notes: "Impact on patients"
      },
      {
        number: 32,
        type: "note_completion",
        section: "Recent research",
        prefix: "A study reviewed data from about 100 ",
        suffix: " and found that listening to music improved hospital patients' sense of wellbeing and reduced the length of their stay.",
        answers: ["trials"],
        notes: "Source data count"
      },
      {
        number: 33,
        type: "note_completion",
        section: "Recent research",
        prefix: "The patients in the study all listened to music with a ",
        suffix: " effect.",
        answers: ["calming"],
        notes: "Music effect type"
      },
      {
        number: 34,
        type: "note_completion",
        section: "Recent research",
        prefix: "The music was mostly played through music ",
        suffix: ".",
        answers: ["pillows"],
        notes: "Device medium"
      },
      {
        number: 35,
        type: "note_completion",
        section: "Recent research",
        prefix: "Patients reported an absence or low levels of ",
        suffix: ".",
        answers: ["anxiety"],
        notes: "Emotional state"
      },
      {
        number: 36,
        type: "note_completion",
        section: "Recent research",
        prefix: "Medical records confirmed that patients who were played music in hospital needed less ",
        suffix: " than those who weren't played music.",
        answers: ["medication"],
        notes: "Reduced requirement"
      },
      {
        number: 37,
        type: "note_completion",
        section: "Recent research",
        prefix: "The best results were achieved when patients were played music while they were ",
        suffix: ".",
        answers: ["awake"],
        notes: "Consciousness state"
      },
      {
        number: 38,
        type: "note_completion",
        section: "Recent research",
        prefix: "The study concluded that playing music was effective because it served as a ",
        suffix: ".",
        answers: ["distraction"],
        notes: "Cognitive mechanism"
      },
      {
        number: 39,
        type: "note_completion",
        section: "Recent research",
        prefix: "The researchers recommend playing either music or sounds from ",
        suffix: " to all surgical patients.",
        answers: ["nature"],
        notes: "Alternative sound source"
      },
      {
        number: 40,
        type: "note_completion",
        section: "Recent research",
        prefix: "A future study will investigate the best ",
        suffix: " for the music.",
        answers: ["volume"],
        notes: "Target parameter"
      }
    ]
  }
];

