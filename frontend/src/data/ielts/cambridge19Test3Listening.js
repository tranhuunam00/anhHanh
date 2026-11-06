// Cambridge IELTS 19 Test 3 - Listening Module Data
export const cambridge19Test3Listening = {
  testId: "cambridge-19-test-3",
  title: "Cambridge IELTS 19 - Test 3 - Listening",
  audioUrl: "/audio/Cambridge 19 - Test 3.mp3",
  fallbackAudioUrl: "/audio/cambridge19/IELTS 19 Audio/Test3 Part1.mp3",
  parts: [
    {
      partNumber: 1,
      title: "Part 1: Local Food Shops & Produce",
      instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
      questionsRange: [1, 10],
      items: [
        { number: 1, type: "fill_notes", prefix: "Fish market location: down by the old ", suffix: "", answers: ["harbour", "harbor"] },
        { number: 2, type: "fill_notes", prefix: "Take the footway crossing over the wooden ", suffix: "", answers: ["bridge"] },
        { number: 3, type: "fill_notes", prefix: "Fresh fish arrives daily at ", suffix: "", answers: ["3.30", "3:30", "three thirty", "half past three"] },
        { number: 4, type: "fill_notes", prefix: "Specialty bakery name: ", suffix: " Cottage Bakery", answers: ["Rose", "rose"] },
        { number: 5, type: "fill_notes", prefix: "Look for a large painted wooden ", suffix: " above the door", answers: ["sign"] },
        { number: 6, type: "fill_notes", prefix: "Building colour: painted distinctive ", suffix: "", answers: ["purple"] },
        { number: 7, type: "fill_notes", prefix: "Edible coastal plant sold at the farm stall: fresh ", suffix: "", answers: ["samphire"] },
        { number: 8, type: "fill_notes", prefix: "Seasonal organic fruit available: ripe honeydew ", suffix: "", answers: ["melon"] },
        { number: 9, type: "fill_notes", prefix: "Artisanal dairy: yogurt made with ", suffix: " milk", answers: ["coconut"] },
        { number: 10, type: "fill_notes", prefix: "Most popular homemade jam flavour: wild ", suffix: "", answers: ["strawberry"] }
      ]
    },
    {
      partNumber: 2,
      title: "Part 2: Children's Book Festival Workshops",
      instructions: "Questions 11-16: Choose the correct letter, A-H. Questions 17-20: Choose TWO letters, A-E.",
      questionsRange: [11, 20],
      items: [
        { number: 11, type: "matching", question: "Illustrating fantasy creatures", answers: ["C"] },
        { number: 12, type: "matching", question: "Creating pop-up books", answers: ["D"] },
        { number: 13, type: "matching", question: "Poetry for young readers", answers: ["F"] },
        { number: 14, type: "matching", question: "Historical fiction writing", answers: ["G"] },
        { number: 15, type: "matching", question: "Audio drama voice acting", answers: ["B"] },
        { number: 16, type: "matching", question: "Graphic novel storytelling", answers: ["H"] },
        {
          number: 17,
          type: "choose_two",
          question: "Which TWO reading strategies does the speaker suggest for reluctant readers?",
          pairNumber: 18,
          options: ["A. Setting strict daily time limits", "B. Rewarding completed chapters with money", "C. Choosing books based on movies they like", "D. Reading alternating pages together", "E. Subscribing to graphic magazines"],
          answers: ["D", "E"]
        },
        {
          number: 18,
          type: "choose_two",
          question: "Which TWO reading strategies does the speaker suggest for reluctant readers? (Second choice)",
          pairNumber: 17,
          options: ["A. Setting strict daily time limits", "B. Rewarding completed chapters with money", "C. Choosing books based on movies they like", "D. Reading alternating pages together", "E. Subscribing to graphic magazines"],
          answers: ["D", "E"]
        },
        {
          number: 19,
          type: "choose_two",
          question: "Which TWO festival venues require tickets in advance?",
          pairNumber: 20,
          options: ["A. Open air amphitheatre", "B. Municipal library auditorium", "C. The Old Town Hall gallery", "D. Festival marquee in the park", "E. Riverside café reading corner"],
          answers: ["B", "C"]
        },
        {
          number: 20,
          type: "choose_two",
          question: "Which TWO festival venues require tickets in advance? (Second choice)",
          pairNumber: 19,
          options: ["A. Open air amphitheatre", "B. Municipal library auditorium", "C. The Old Town Hall gallery", "D. Festival marquee in the park", "E. Riverside café reading corner"],
          answers: ["B", "C"]
        }
      ]
    },
    {
      partNumber: 3,
      title: "Part 3: Year 12 Science Experiment Plan",
      instructions: "Questions 21-26: Multiple choice. Questions 27-30: Matching roles.",
      questionsRange: [21, 30],
      items: [
        {
          number: 21,
          type: "multiple_choice",
          question: "What is the primary hypothesis of the students' experiment?",
          options: ["A. Temperature has no effect on bacterial growth", "B. Light frequency alters enzyme production", "C. Soil salinity retards seedling germination rates"],
          answers: ["C"]
        },
        {
          number: 22,
          type: "multiple_choice",
          question: "Why did they choose mung beans as the test specimen?",
          options: ["A. They are resilient to fungal infections", "B. They germinate rapidly under laboratory conditions", "C. They are genetically identical across batches"],
          answers: ["B"]
        },
        {
          number: 23,
          type: "multiple_choice",
          question: "What equipment limitation did they encounter?",
          options: ["A. A shortage of calibrated micropipettes", "B. Insufficient incubator space", "C. Faulty digital spectrophotometer"],
          answers: ["A"]
        },
        {
          number: 24,
          type: "multiple_choice",
          question: "How will they control environmental temperature?",
          options: ["A. Using a climate-controlled growth chamber", "B. Leaving pots near a sunlit window", "C. Placing heating pads underneath the trays"],
          answers: ["A"]
        },
        {
          number: 25,
          type: "multiple_choice",
          question: "What safety concern did their teacher emphasize?",
          options: ["A. Flammable reagent storage", "B. Sharp scalpel handling", "C. Disposal of concentrated saline solutions"],
          answers: ["C"]
        },
        {
          number: 26,
          type: "multiple_choice",
          question: "How often will root length measurements be recorded?",
          options: ["A. Every six hours", "B. Once every 48 hours", "C. Daily at a consistent hour"],
          answers: ["C"]
        },
        { number: 27, type: "matching", question: "Statistical data plotting", answers: ["H"] },
        { number: 28, type: "matching", question: "Photographic progress log", answers: ["E"] },
        { number: 29, type: "matching", question: "Literature review synthesis", answers: ["B"] },
        { number: 30, type: "matching", question: "Poster board layout design", answers: ["F"] }
      ]
    },
    {
      partNumber: 4,
      title: "Part 4: Microplastics in the Environment",
      instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
      questionsRange: [31, 40],
      items: [
        { number: 31, type: "fill_notes", prefix: "Major source: synthetic fibres released when washing domestic ", suffix: "", answers: ["clothing", "clothes"] },
        { number: 32, type: "fill_notes", prefix: "Ingestion: easily swallowed by marine organisms with filter-feeding ", suffix: "", answers: ["mouths", "mouth"] },
        { number: 33, type: "fill_notes", prefix: "Human ingestion: particles detected in commercially harvested sea ", suffix: "", answers: ["salt"] },
        { number: 34, type: "fill_notes", prefix: "Microbeads historically added as abrasives in exfoliating ", suffix: "", answers: ["toothpaste"] },
        { number: 35, type: "fill_notes", prefix: "Agricultural contamination from wastewater sludge used as ", suffix: "", answers: ["fertilizers", "fertilizer"] },
        { number: 36, type: "fill_notes", prefix: "Block the absorption of vital organic ", suffix: " in plant root tips", answers: ["nutrients", "nutrient"] },
        { number: 37, type: "fill_notes", prefix: "Experimental crops exhibited stunted root ", suffix: " and development", answers: ["growth"] },
        { number: 38, type: "fill_notes", prefix: "Earthworms exposed to contaminated soil lost substantial body ", suffix: "", answers: ["weight"] },
        { number: 39, type: "fill_notes", prefix: "Chemical leaching: plastics absorb toxic industrial ", suffix: " pollutants", answers: ["acid"] },
        { number: 40, type: "fill_notes", prefix: "Comprehensive solutions require systemic reform across global industrial ", suffix: "", answers: ["society"] }
      ]
    }
  ]
};

