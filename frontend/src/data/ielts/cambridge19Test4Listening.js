// Cambridge IELTS 19 Test 4 - Listening Module Data
export const cambridge19Test4Listening = {
  testId: "cambridge-19-test-4",
  title: "Cambridge IELTS 19 - Test 4 - Listening",
  audioUrl: "/audio/Cambridge 19 - Test 4.mp3",
  fallbackAudioUrl: "/audio/cambridge19/IELTS 19 Audio/Test4 Part1.mp3",
  parts: [
    {
      partNumber: 1,
      title: "Part 1: First Day at Supermarket Job",
      instructions: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
      questionsRange: [1, 10],
      items: [
        { number: 1, type: "fill_notes", prefix: "Manager's first name: ", suffix: "", answers: ["Kaeden", "kaeden"] },
        { number: 2, type: "fill_notes", prefix: "Staff facilities: Personal belongings kept in staff ", suffix: "", answers: ["locker", "lockers"] },
        { number: 3, type: "fill_notes", prefix: "Documentation to bring: Proof of identity, e.g. ", suffix: "", answers: ["passport"] },
        { number: 4, type: "fill_notes", prefix: "Dress code: Clean black trousers and provided store ", suffix: "", answers: ["uniform"] },
        { number: 5, type: "fill_notes", prefix: "Staff canteen located on the ", suffix: " floor", answers: ["third", "3rd", "3"] },
        { number: 6, type: "fill_notes", prefix: "Emergency attendance telephone: ", suffix: "", answers: ["0412 665 903", "0412665903"] },
        { number: 7, type: "fill_notes", prefix: "Safety sign colour for wet floor hazard: bright ", suffix: "", answers: ["yellow"] },
        { number: 8, type: "fill_notes", prefix: "Recycling area: Separate cardboard from hard ", suffix: "", answers: ["plastic"] },
        { number: 9, type: "fill_notes", prefix: "Freezer section: Watch out for slippery spilled ", suffix: "", answers: ["ice"] },
        { number: 10, type: "fill_notes", prefix: "Heavy crate handling: Always wear protective rubber ", suffix: "", answers: ["gloves"] }
      ]
    },
    {
      partNumber: 2,
      title: "Part 2: Compton Park Runners Club",
      instructions: "Questions 11-14: Choose TWO letters, A-E. Questions 15-20: Multiple choice.",
      questionsRange: [11, 20],
      items: [
        {
          number: 11,
          type: "choose_two",
          question: "Which TWO club sessions are recommended for absolute beginners?",
          pairNumber: 12,
          options: ["A. Tuesday interval sprints", "B. Thursday hill climbing", "C. Wednesday couch to 5K", "D. Friday track tempo", "E. Saturday morning park jog"],
          answers: ["C", "E"]
        },
        {
          number: 12,
          type: "choose_two",
          question: "Which TWO club sessions are recommended for absolute beginners? (Second choice)",
          pairNumber: 11,
          options: ["A. Tuesday interval sprints", "B. Thursday hill climbing", "C. Wednesday couch to 5K", "D. Friday track tempo", "E. Saturday morning park jog"],
          answers: ["C", "E"]
        },
        {
          number: 13,
          type: "choose_two",
          question: "Which TWO items of running kit are provided free with annual membership?",
          pairNumber: 14,
          options: ["A. Hi-vis reflective vest", "B. Trail running shoes", "C. GPS wrist watch", "D. Branded water bottle", "E. Compression socks"],
          answers: ["A", "D"]
        },
        {
          number: 14,
          type: "choose_two",
          question: "Which TWO items of running kit are provided free with annual membership? (Second choice)",
          pairNumber: 13,
          options: ["A. Hi-vis reflective vest", "B. Trail running shoes", "C. GPS wrist watch", "D. Branded water bottle", "E. Compression socks"],
          answers: ["A", "D"]
        },
        {
          number: 15,
          type: "multiple_choice",
          question: "Where do members meet for evening group runs?",
          options: ["A. Outside the park pavilion café", "B. At the municipal leisure centre car park", "C. Near the main entrance gates"],
          answers: ["A"]
        },
        {
          number: 16,
          type: "multiple_choice",
          question: "What is the policy regarding severe rain or snow?",
          options: ["A. Runs proceed regardless of weather", "B. An indoor treadmill alternative is organized", "C. Cancellation notice is posted on the mobile app"],
          answers: ["B"]
        },
        {
          number: 17,
          type: "multiple_choice",
          question: "Annual club race entry fees",
          options: ["A. must be paid separately in cash", "B. are discounted for registered club runners", "C. are included free in premium membership"],
          answers: ["C"]
        },
        {
          number: 18,
          type: "multiple_choice",
          question: "Who leads the junior running division?",
          options: ["A. Fully accredited athletics coaches", "B. Parent volunteers on rotation", "C. High school PE teachers"],
          answers: ["A"]
        },
        {
          number: 19,
          type: "multiple_choice",
          question: "What is the club's primary social event of the year?",
          options: ["A. Midsummer barbecue", "B. New Year charity half marathon", "C. Annual awards banquet"],
          answers: ["C"]
        },
        {
          number: 20,
          type: "multiple_choice",
          question: "Prospective new members can attend",
          options: ["A. only after medical clearance", "B. two trial sessions free of charge", "C. if accompanied by a current member"],
          answers: ["B"]
        }
      ]
    },
    {
      partNumber: 3,
      title: "Part 3: Books & Bookshop Work Placement",
      instructions: "Questions 21-24: Multiple choice. Questions 25-30: Matching genres.",
      questionsRange: [21, 30],
      items: [
        {
          number: 21,
          type: "multiple_choice",
          question: "Why did Oliver choose a bookshop for his vocational placement?",
          options: ["A. He aspires to work in commercial publishing", "B. The bookshop was located near his residence", "C. It offered the highest hourly wage"],
          answers: ["A"]
        },
        {
          number: 22,
          type: "multiple_choice",
          question: "What surprised Chloe about inventory management?",
          options: ["A. The prevalence of book theft", "B. The high proportion of titles sold online", "C. The large volume of publisher returns"],
          answers: ["C"]
        },
        {
          number: 23,
          type: "multiple_choice",
          question: "How does the independent store compete with online retailers?",
          options: ["A. By curating personalized staff recommendations", "B. By undercutting discount prices", "C. By offering overnight free shipping"],
          answers: ["A"]
        },
        {
          number: 24,
          type: "multiple_choice",
          question: "What project will they undertake during the second week?",
          options: ["A. Redesigning window display lighting", "B. Organizing a local poetry author reading", "C. Conducting a customer demographic survey"],
          answers: ["B"]
        },
        { number: 25, type: "matching", question: "Biography & Memoir", answers: ["C"] },
        { number: 26, type: "matching", question: "Travel Writing", answers: ["D"] },
        { number: 27, type: "matching", question: "Science & Nature", answers: ["F"] },
        { number: 28, type: "matching", question: "Historical Fiction", answers: ["A"] },
        { number: 29, type: "matching", question: "Young Adult Fantasy", answers: ["C"] },
        { number: 30, type: "matching", question: "Art & Architecture", answers: ["G"] }
      ]
    },
    {
      partNumber: 4,
      title: "Part 4: Tree Planting & Forest Restoration",
      instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
      questionsRange: [31, 40],
      items: [
        { number: 31, type: "fill_notes", prefix: "Seedling spacing: planted densely to create healthy root ", suffix: " for sunlight", answers: ["competition"] },
        { number: 32, type: "fill_notes", prefix: "Pioneer species yield fruit and seeds that provide essential ", suffix: " for wildlife", answers: ["food"] },
        { number: 33, type: "fill_notes", prefix: "Monoculture risks: single-species plantations are highly vulnerable to ", suffix: "", answers: ["disease"] },
        { number: 34, type: "fill_notes", prefix: "Historic deforestation driven primarily by expanding commercial ", suffix: "", answers: ["agriculture"] },
        { number: 35, type: "fill_notes", prefix: "Drone technology used to produce precise 3D canopy ", suffix: "", answers: ["maps", "map"] },
        { number: 36, type: "fill_notes", prefix: "Protective fencing prevents saplings from being browsed by grazing ", suffix: "", answers: ["cattle"] },
        { number: 37, type: "fill_notes", prefix: "Fast-growing indigenous hardwoods increase canopy recovery ", suffix: "", answers: ["speed"] },
        { number: 38, type: "fill_notes", prefix: "Canopy corridors allow arboreal animals like endangered ", suffix: " to migrate safely", answers: ["monkeys", "monkey"] },
        { number: 39, type: "fill_notes", prefix: "Riparian buffer trees filter silt, protecting downstream freshwater ", suffix: "", answers: ["fishing"] },
        { number: 40, type: "fill_notes", prefix: "Deep root networks stabilize topsoil, significantly curbing flash ", suffix: " risks", answers: ["flooding", "flood"] }
      ]
    }
  ]
};

