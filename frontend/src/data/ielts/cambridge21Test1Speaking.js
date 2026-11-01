export const cambridge21Test1Speaking = {
  testId: "cambridge-21-test-1",
  title: "Cambridge IELTS 21 - Test 1 - Speaking",
  parts: [
    {
      partNumber: 1,
      title: "Part 1: Introduction & Interview",
      duration: "4 - 5 minutes",
      description: "The examiner asks you about yourself, your home, work or studies and other familiar topics.",
      topic: "Hairstyles",
      questions: [
        { id: 1, text: "Where do you go to get a haircut?" },
        { id: 2, text: "Have you changed your hairstyle recently?" },
        { id: 3, text: "Would you ever change the colour of your hair?" },
        { id: 4, text: "Do you enjoy going to the hairdresser/barber?" }
      ]
    },
    {
      partNumber: 2,
      title: "Part 2: Individual Long Turn",
      duration: "3 - 4 minutes (1 min preparation + 1-2 min speaking)",
      description: "You will have to talk about the topic for 1 to 2 minutes. You have 1 minute to think about what you are going to say. You can make some notes to help you.",
      cueCard: {
        topic: "Describe a time when you used information for tourists, for example from a guidebook or online.",
        prompts: [
          "where you got this information",
          "what place this information was about",
          "what information you got",
          "and explain whether this information was very helpful for you."
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
          theme: "Different types of holidays",
          questions: [
            { id: 1, text: "What are the most popular kinds of holidays for people from your country to go on?" },
            { id: 2, text: "Do you think most people prefer to have a holiday abroad rather than in their own country?" },
            { id: 3, text: "Why do some people want to do absolutely nothing when they go away on holiday?" }
          ]
        },
        {
          theme: "Tourist attractions",
          questions: [
            { id: 4, text: "What are the kinds of tourist attraction that visitors to your country like to see?" },
            { id: 5, text: "Do you think tourist attractions such as museums should be free for local people to visit?" },
            { id: 6, text: "What can make a tourist attraction disappointing for visitors?" }
          ]
        }
      ]
    }
  ]
};

