export const cambridge21Test4Speaking = {
  testId: "cambridge-21-test-4",
  title: "Cambridge IELTS 21 - Test 4 - Speaking",
  parts: [
    {
      partNumber: 1,
      title: "Part 1: Introduction & Interview",
      duration: "4 - 5 minutes",
      description: "The examiner asks you about yourself, your home, work or studies and other familiar topics.",
      topic: "Bread",
      questions: [
        { id: 1, text: "When do you usually eat bread?" },
        { id: 2, text: "How important is bread in your culture?" },
        { id: 3, text: "Have you tried any kinds of bread from other countries?" },
        { id: 4, text: "Would you be interested in learning how to make bread?" }
      ]
    },
    {
      partNumber: 2,
      title: "Part 2: Individual Long Turn",
      duration: "3 - 4 minutes (1 min preparation + 1-2 min speaking)",
      description: "You will have to talk about the topic for 1 to 2 minutes. You have 1 minute to think about what you are going to say. You can make some notes to help you if you wish.",
      cueCard: {
        topic: "Describe a person you know who is very competitive.",
        prompts: [
          "who this person is",
          "what this person is competitive about",
          "how successful this person is",
          "and explain why you think this person is so competitive."
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
          theme: "Competitions",
          questions: [
            { id: 1, text: "What kinds of competitions do people like to enter in your country?" },
            { id: 2, text: "What do you think is the best kind of prize to win in a competition?" },
            { id: 3, text: "Why do people like watching quiz shows and other competitions on TV?" }
          ]
        },
        {
          theme: "Being competitive in sports",
          questions: [
            { id: 4, text: "How important is it to be very competitive at sport?" },
            { id: 5, text: "Do you think sportspeople perform better when they play against competitors who are stronger than they are?" },
            { id: 6, text: "Why do some people think that taking part in sport is more important than winning?" }
          ]
        }
      ]
    }
  ]
};

