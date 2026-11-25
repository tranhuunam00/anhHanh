// Cambridge IELTS 16 Test 1 - Reading Passage 1
// Text, questions and answers checked against Cambridge 16.pdf (pages 16–19).

export const cambridge16Test1ReadingPassage1 = {
  passageNumber: 1,
  title: "Why we need to protect polar bears",
  paragraphs: [
    { id: "P1", text: "Polar bears are being increasingly threatened by the effects of climate change, but their disappearance could have far-reaching consequences. They are uniquely adapted to the extreme conditions of the Arctic Circle, where temperatures can reach −40°C. One reason for this is that they have up to 11 centimetres of fat underneath their skin. Humans with comparative levels of adipose tissue would be considered obese and would be likely to suffer from diabetes and heart disease. Yet the polar bear experiences no such consequences." },
    { id: "P2", text: "A 2014 study by Shi Ping Liu and colleagues sheds light on this mystery. They compared the genetic structure of polar bears with that of their closest relatives from a warmer climate, the brown bears. This allowed them to determine the genes that have allowed polar bears to survive in one of the toughest environments on Earth. Liu and his colleagues found the polar bears had a gene known as APoB, which reduces levels of low-density lipoproteins (LDLs) – a form of 'bad' cholesterol. In humans, mutations of this gene are associated with increased risk of heart disease. Polar bears may therefore be an important study model to understand heart disease in humans." },
    { id: "P3", text: "The genome of the polar bear may also provide the solution for another condition, one that particularly affects our older generation: osteoporosis. This is a disease where bones show reduced density, usually caused by insufficient exercise, reduced calcium intake or food starvation. Bone tissue is constantly being remodelled, meaning that bone is added or removed, depending on nutrient availability and the stress that the bone is under. Female polar bears, however, undergo extreme conditions during every pregnancy. Once autumn comes around, these females will dig maternity dens in the snow and will remain there throughout the winter, both before and after the birth of their cubs. This process results in about six months of fasting, where the female bears have to keep themselves and their cubs alive, depleting their own calcium and calorie reserves. Despite this, their bones remain strong and dense." },
    { id: "P4", text: "Physiologists Alanda Lennox and Allen Goodship found an explanation for this paradox in 2008. They discovered that pregnant bears were able to increase the density of their bones before they started to build their dens. In addition, six months later, when they finally emerged from the den with their cubs, there was no evidence of significant loss of bone density. Hibernating brown bears do not have this capacity and must therefore resort to major bone reformation in the following spring. If the mechanism of bone remodelling in polar bears can be understood, many bedridden humans, and even astronauts, could potentially benefit." },
    { id: "P5", text: "The medical benefits of the polar bear for humanity certainly have their importance in our conservation efforts, but these should not be the only factors taken into consideration. We tend to want to protect animals we think are intelligent and possess emotions, such as elephants and primates. Bears, on the other hand, seem to be perceived as stupid and in many cases violent. And yet anecdotal evidence from the field challenges those assumptions, suggesting for example that polar bears have good problem-solving abilities. A male bear called GoGo in Tennoji Zoo, Osaka, has even been observed making use of a tool to manipulate his environment. The bear used a tree branch on multiple occasions to dislodge a piece of meat hung out of his reach. Problem-solving ability has also been witnessed in wild polar bears, although not as obviously as with GoGo. A calculated move by a male bear involved running and jumping onto barrels in an attempt to get to a photographer standing on a platform four metres high." },
    { id: "P6", text: "In other studies, such as one by Alison Ames in 2008, polar bears showed deliberate and focussed manipulation. For example, Ames observed bears putting objects in piles and then knocking them over in what appeared to be a game. The study demonstrates that bears are capable of agile and thought-out behaviours. These examples suggest bears have greater creativity and problem-solving abilities than previously thought." },
    { id: "P7", text: "As for emotions, while the evidence is once again anecdotal, many bears have been seen to hit out at ice and snow – seemingly out of frustration – when they have just missed out on a kill. Moreover, polar bears can form unusual relationships with other species, including playing with the dogs used to pull sleds in the Arctic. Remarkably, one hand-raised polar bear called Agee has formed a close relationship with her owner Mark Dumas to the point where they even swim together. This is even more astonishing since polar bears are known to actively hunt humans in the wild." },
    { id: "P8", text: "If climate change were to lead to their extinction, this would mean not only the loss of potential breakthroughs in human medicine, but more importantly, the disappearance of an intelligent, majestic animal." }
  ],
  groups: [
    {
      groupType: "true_false_not_given",
      instructions: "Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–7 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      numbers: [1, 2, 3, 4, 5, 6, 7],
      items: [
        { number: 1, statement: "Polar bears suffer from various health problems due to the build-up of fat under their skin.", answers: ["FALSE"] },
        { number: 2, statement: "The study done by Liu and his colleagues compared different groups of polar bears.", answers: ["FALSE"] },
        { number: 3, statement: "Liu and colleagues were the first researchers to compare polar bears and brown bears genetically.", answers: ["NOT GIVEN"] },
        { number: 4, statement: "Polar bears are able to control their levels of 'bad' cholesterol by genetic means.", answers: ["TRUE"] },
        { number: 5, statement: "Female polar bears are able to survive for about six months without food.", answers: ["TRUE"] },
        { number: 6, statement: "It was found that the bones of female polar bears were very weak when they came out of their dens in spring.", answers: ["FALSE"] },
        { number: 7, statement: "The polar bear's mechanism for increasing bone density could also be used by people one day.", answers: ["TRUE"] }
      ]
    },
    {
      groupType: "table_completion",
      instructions: "Complete the table below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 8–13 on your answer sheet.",
      numbers: [8, 9, 10, 11, 12, 13],
      notes: {
        title: "Reasons why polar bears should be protected",
        sections: [
          {
            lines: [
              "People think of bears as unintelligent and {8}.",
              "However, this may not be correct. For example:",
              "• In Tennoji Zoo, a bear has been seen using a branch as a {9}. This allowed him to knock down some {10}.",
              "• A wild polar bear worked out a method of reaching a platform where a {11} was located.",
              "• Polar bears have displayed behaviour such as conscious manipulation of objects and activity similar to a {12}.",
              "Bears may also display emotions. For example:",
              "• They may make movements suggesting {13} if disappointed when hunting.",
              "• They may form relationships with other species."
            ]
          }
        ]
      },
      items: [
        { number: 8, answers: ["violent"] },
        { number: 9, answers: ["tool"] },
        { number: 10, answers: ["meat"] },
        { number: 11, answers: ["photographer"] },
        { number: 12, answers: ["game"] },
        { number: 13, answers: ["frustration"] }
      ]
    }
  ]
};
