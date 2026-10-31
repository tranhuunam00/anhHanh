export const cambridge21Test2Speaking = {
  testId: "cambridge-21-test-2",
  title: "Cambridge IELTS 21 - Test 2 - Speaking",
  parts: [
    {
      partNumber: 1,
      title: "Part 1: Introduction & Interview",
      duration: "4 - 5 minutes",
      description: "The examiner asks you about yourself, your home, work or studies and other familiar topics.",
      topic: "Cities",
      questions: [
        { id: 1, text: "How well do you know the capital city of your country?" },
        { id: 2, text: "Do you think cities are exciting places to live?" },
        { id: 3, text: "Why do some people dislike living in a city?" },
        { id: 4, text: "If you could visit any city in the world, where would you go?" }
      ]
    },
    {
      partNumber: 2,
      title: "Part 2: Individual Long Turn",
      duration: "3 - 4 minutes (1 min preparation + 1-2 min speaking)",
      description: "You will have to talk about the topic for 1 to 2 minutes. You have 1 minute to think about what you are going to say. You can make some notes to help you.",
      cueCard: {
        topic: "Describe a time when you read or heard something that you thought was not true.",
        prompts: [
          "where you read/heard this",
          "what you read/heard",
          "why you thought it was not true",
          "and explain how you felt about reading/hearing this thing that you thought was not true."
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
          theme: "Honesty and children",
          questions: [
            { id: 1, text: "Do you think children are more honest than adults?" },
            { id: 2, text: "Why do adults tell children it's important to be honest?" },
            { id: 3, text: "Do you think there are sometimes good reasons for adults not to tell children the truth?" }
          ]
        },
        {
          theme: "Honesty and advertising",
          questions: [
            { id: 4, text: "Are there any claims in advertisements that are sometimes not true?" },
            { id: 5, text: "Why do people still buy things even when they know advertisements aren't completely accurate?" },
            { id: 6, text: "Do you think advertisements that are dishonest should be banned?" }
          ]
        }
      ]
    }
  ]
};

