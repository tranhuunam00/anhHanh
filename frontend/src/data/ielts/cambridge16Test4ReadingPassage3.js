// Cambridge IELTS 16 Test 4 - Reading Passage 3 Data
export const cambridge16Test4ReadingPassage3 = {
  passageNumber: 3,
  title: "Attitudes towards Artificial Intelligence",
  paragraphs: [
    {
      id: "A",
      text: "Artificial intelligence (AI) can already predict the future. Police forces are using it to map when and where crime is likely to occur. Doctors can use it to predict when a patient is most likely to have a heart attack or stroke. Researchers are even trying to give AI imagination so it can plan for unexpected consequences. Many decisions in our lives require a good forecast, and AI is almost always better at forecasting than we are. Yet for all these technological achievements, we are often reluctant to trust algorithm-driven predictions."
    },
    {
      id: "B",
      text: "This phenomenon is known as algorithm aversion. While people readily tolerate human error, they react with extreme skepticism and rejection when an automated system makes even a slight mistake. For example, in experiments where participants could choose between human advisors and algorithmic models, seeing the algorithm err caused confidence in the machine to plummet far more sharply than seeing a human make an identical mistake."
    },
    {
      id: "C",
      text: "Why do we have more faith in human judgement than in AI? One key reason is that human decisions come with explanations, intuition, and relatable empathy. Humans can communicate their thought processes and justify their choices. An AI system, by contrast, operates as an opaque 'black box', outputting conclusions without intuitive explanations that everyday people can grasp."
    },
    {
      id: "D",
      text: "Attitudes towards AI are also increasingly diverging across different segments of society. While tech enthusiasts embrace algorithmic automation across personal finance, healthcare, and navigation, skeptics express growing alarm over algorithmic bias, loss of personal autonomy, and privacy intrusion."
    },
    {
      id: "E",
      text: "To overcome public skepticism, experts recommend increasing algorithmic transparency. If algorithms explain the underlying rationale of their recommendations in clear human terms, people are significantly more willing to follow machine advice."
    },
    {
      id: "F",
      text: "Another highly effective strategy is allowing users to have some degree of control over the AI's output. Research shows that even when people can only adjust an algorithm's forecast by a tiny margin, their satisfaction and willingness to adopt the system rise dramatically. Giving users a voice creates a sense of agency and bridges the trust divide."
    }
  ],
  groups: [
    {
      groupType: "matching_headings",
      instructions: "Reading Passage 3 has six sections, A–F.\nChoose the correct heading for each section from the list of headings below.\nWrite the correct number, i–viii, in boxes 27–32 on your answer sheet.\n\nList of Headings:\ni An increasing divergence of attitudes towards AI\nii Reasons why we have more faith in human judgement than in AI\niii The superiority of AI projections over those made by humans\niv The process by which AI can help us make good decisions\nv The advantages of involving users in AI processes\nvi Widespread distrust of an AI innovation\nvii Encouraging openness about how AI functions\nviii A surprisingly successful AI application",
      numbers: [27, 28, 29, 30, 31, 32],
      items: [
        { number: 27, statement: "Section A", answers: ["iii"] },
        { number: 28, statement: "Section B", answers: ["vi"] },
        { number: 29, statement: "Section C", answers: ["ii"] },
        { number: 30, statement: "Section D", answers: ["i"] },
        { number: 31, statement: "Section E", answers: ["vii"] },
        { number: 32, statement: "Section F", answers: ["v"] }
      ]
    },
    {
      groupType: "multiple_choice",
      instructions: "Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 33–35 on your answer sheet.",
      numbers: [33, 34, 35],
      items: [
        {
          number: 33,
          question: "What is the writer doing in Section A?",
          options: [
            "A providing a solution to a concern",
            "B justifying an opinion about an issue",
            "C highlighting the existence of a problem",
            "D explaining the reasons for a phenomenon"
          ],
          answers: ["C"]
        },
        {
          number: 34,
          question: "According to Section C, why do people prefer human judgement to AI?",
          options: [
            "A Humans have broader general knowledge.",
            "B Human decisions can be clearly explained.",
            "C AI models lack access to real-time data.",
            "D Human advisors have greater professional experience."
          ],
          answers: ["B"]
        },
        {
          number: 35,
          question: "In Section F, what does the writer suggest about user involvement?",
          options: [
            "A Even minimal control increases trust in AI systems.",
            "B Users should program their own algorithmic filters.",
            "C AI developers must survey user opinions regularly.",
            "D Only expert users should be permitted to alter AI outputs."
          ],
          answers: ["A"]
        }
      ]
    },
    {
      groupType: "yes_no_not_given",
      instructions: "Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 36–40 on your answer sheet, write:\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this",
      numbers: [36, 37, 38, 39, 40],
      items: [
        { number: 36, statement: "People are equally forgiving of mistakes made by humans and AI.", answers: ["NO"] },
        { number: 37, statement: "Medical algorithms make fewer diagnostic errors than veteran doctors.", answers: ["NOT GIVEN"] },
        { number: 38, statement: "A lack of explainability makes algorithms appear untrustworthy.", answers: ["YES"] },
        { number: 39, statement: "Public consensus on the benefits of AI has grown stronger recently.", answers: ["NO"] },
        { number: 40, statement: "Allowing users to modify recommendations fosters AI adoption.", answers: ["YES"] }
      ]
    }
  ]
};
