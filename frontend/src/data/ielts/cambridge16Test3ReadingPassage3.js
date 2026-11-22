// Cambridge IELTS 16 Test 3 - Reading Passage 3 Data
export const cambridge16Test3ReadingPassage3 = {
  passageNumber: 3,
  title: "Plant 'thermometer' triggers springtime growth by measuring night-time heat",
  paragraphs: [
    {
      id: "P1",
      text: "A photoreceptor molecule in plant cells has been found to have a second job as a thermometer after dark — allowing plants to read seasonal temperature changes. Scientists say the discovery could help breed crops that are more resilient to the temperatures expected to result from climate change."
    },
    {
      id: "P2",
      text: "An international team of scientists led by the University of Cambridge has discovered that the 'thermometer' molecule in plants enables them to develop according to seasonal temperature changes. Researchers have revealed that molecules called phytochromes — used by plants to detect light during the day — actually change their function in darkness to become cellular temperature gauges that measure the heat of the night."
    },
    {
      id: "P3",
      text: "The new findings, published in the journal Science, show that phytochromes control genetic switches in response to temperature as well as light to dictate plant development. At night, these molecules change states, and the pace at which they change is 'directly proportional to temperature', say scientists, who compare phytochromes to mercury in a thermometer. The warmer it is, the faster the molecular change stimulating plant growth."
    },
    {
      id: "P4",
      text: "Farmers and gardeners have known for hundreds of years how responsive plants are to temperature: daffodils are likely to flower early in response to a warm winter, and if ash trees come into leaf before oak trees, the weather in summer will probably be wet. But the underlying cellular mechanism that allows plants to respond to seasonal changes has remained a mystery until now."
    },
    {
      id: "P5",
      text: "In their active state, phytochrome molecules bind themselves to DNA to restrict plant growth. During the day, sunlight activates the molecules, slowing down growth. If a plant finds itself in shade, phytochromes are quickly inactivated — enabling it to grow faster to find sunlight again. This is how plants compete to escape each other's shade."
    },
    {
      id: "P6",
      text: "At night, however, phytochromes slowly revert from their active state back to an inactive state. The rate of this reversion depends entirely on nocturnal warmth. In warmer nights, the reversion happens much more rapidly, releasing the brakes on plant growth and triggering cells to divide and expand."
    },
    {
      id: "P7",
      text: "The research was carried out using Arabidopsis thaliana, a small flowering mustard plant commonly used as a model organism in plant biology. Because Arabidopsis shares key molecular pathways with many staple crops, this breakthrough paves the way for genetic modification or targeted breeding of crops that can withstand unpredictable shifts in global temperature."
    }
  ],
  groups: [
    {
      groupType: "true_false_not_given",
      instructions: "Do the following statements agree with the information given in Reading Passage 3?\nIn boxes 27–32 on your answer sheet, write:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      numbers: [27, 28, 29, 30, 31, 32],
      items: [
        { number: 27, statement: "The Cambridge scientists' discovery of the 'thermometer' molecule was accidental.", answers: ["NOT GIVEN"] },
        { number: 28, statement: "Phytochromes detect both light and temperature.", answers: ["TRUE"] },
        { number: 29, statement: "The speed at which phytochromes change state is related to temperature.", answers: ["TRUE"] },
        { number: 30, statement: "Traditional sayings about plant behaviour and the seasons have proven completely inaccurate.", answers: ["NOT GIVEN"] },
        { number: 31, statement: "Active phytochromes encourage rapid stem elongation in plants.", answers: ["FALSE"] },
        { number: 32, statement: "Plants in shade convert phytochromes to their active state more quickly.", answers: ["FALSE"] }
      ]
    },
    {
      groupType: "summary_with_box",
      instructions: "Complete the summary using the list of words, A–H, below.\nWrite the correct letter, A–H, in boxes 33–37 on your answer sheet.",
      title: "How phytochromes function",
      boxOptions: [
        { letter: "A", text: "expand" },
        { letter: "B", text: "protect" },
        { letter: "C", text: "brakes" },
        { letter: "D", text: "sunlight" },
        { letter: "E", text: "darkness" },
        { letter: "F", text: "heat" },
        { letter: "G", text: "shade" },
        { letter: "H", text: "DNA" }
      ],
      paragraphs: [
        {
          text: "When phytochromes are in their active state, they bind to [33] to inhibit growth. During daylight, exposure to [34] keeps these molecules activated. However, if a plant is overshadowed in [35], the molecules inactivate rapidly. At night, warmth causes active phytochromes to revert to an inactive state, releasing the [36] on growth and enabling plant cells to [37]."
        }
      ],
      items: [
        { number: 33, answers: ["H"] },
        { number: 34, answers: ["D"] },
        { number: 35, answers: ["G"] },
        { number: 36, answers: ["C"] },
        { number: 37, answers: ["A"] }
      ]
    },
    {
      groupType: "sentence_completion",
      instructions: "Complete the sentences below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 38–40 on your answer sheet.",
      items: [
        {
          number: 38,
          prefix: "Daffodils are likely to flower early in response to a ",
          suffix: ".",
          answers: ["warm winter", "warm (winter)"]
        },
        {
          number: 39,
          prefix: "If ash trees come into leaf before oak trees, the weather in ",
          suffix: " will probably be wet.",
          answers: ["summer"]
        },
        {
          number: 40,
          prefix: "The research was carried out using a type of ",
          suffix: " known as Arabidopsis thaliana.",
          answers: ["mustard plant", "mustard plants", "mustard", "mustard plant(s)"]
        }
      ]
    }
  ]
};
