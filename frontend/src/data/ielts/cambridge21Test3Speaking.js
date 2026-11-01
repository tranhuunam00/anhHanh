export const cambridge21Test3Speaking = {
  testId: "cambridge-21-test-3",
  title: "Cambridge IELTS 21 - Test 3 - Speaking",
  parts: [
    {
      partNumber: 1,
      title: "Part 1: Introduction & Interview",
      duration: "4 - 5 minutes",
      description: "The examiner asks you about yourself, your home, work or studies and other familiar topics.",
      topic: "Spending and saving money",
      questions: [
        { id: 1, text: "When you go shopping, do you usually pay for things by cash or by card?" },
        { id: 2, text: "Are you generally careful about how much money you spend?" },
        { id: 3, text: "Have you ever spent money on something you didn't need?" },
        { id: 4, text: "How important is it to you to save money for the future?" }
      ]
    },
    {
      partNumber: 2,
      title: "Part 2: Individual Long Turn",
      duration: "3 - 4 minutes (1 min preparation + 1-2 min speaking)",
      description: "You will have to talk about the topic for 1 to 2 minutes. You have 1 minute to think about what you are going to say. You can make some notes to help you if you wish.",
      cueCard: {
        topic: "Describe an interesting garden or park you have seen.",
        prompts: [
          "where this garden or park is",
          "how big it is",
          "what you saw in this garden/park",
          "and explain why you think this garden/park is interesting."
        ]
      },
      prepTimeSeconds: 60,
      speakingTimeSeconds: 120
    },
    {
      partNumber: 3,
      title: "Part 3: Two-way Discussion",
      duration: "4 - 5 minutes",
      description: "The examiner discusses with you more abstract issues related to the topic of Part 2.",
      sections: [
        {
          theme: "Homes and gardens",
          questions: [
            { id: 1, text: "What are the advantages of having a home with a garden?" },
            { id: 2, text: "How could people living in apartment blocks grow plants and vegetables?" },
            { id: 3, text: "How interested are people in your country in TV shows and magazines about gardens?" }
          ]
        },
        {
          theme: "Gardening as a hobby",
          questions: [
            { id: 4, text: "Do you think that gardening is a hobby mainly for older people?" },
            { id: 5, text: "What are the benefits for people of gardening as a hobby?" },
            { id: 6, text: "Will gardening be a more popular hobby in the future?" }
          ]
        }
      ]
    }
  ]
};

