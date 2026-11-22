// Cambridge IELTS 16 Test 4 - Reading Passage 1 Data
export const cambridge16Test4ReadingPassage1 = {
  passageNumber: 1,
  title: "Roman tunnels",
  subtitle: "The Romans adopted the construction techniques of other civilizations to build tunnels in their territories",
  paragraphs: [
    {
      id: "P1",
      text: "The Romans, who once controlled areas of Europe, North Africa and Asia Minor, adopted the construction techniques of other civilizations to build tunnels in their territories. The Persians, who lived in present-day Iran, were one of the first civilizations to build tunnels that provided a reliable supply of water to human settlements in dry areas. In the early first millennium BCE, they introduced the qanat method of tunnel construction, which consisted of placing posts over a hill in a straight line, to ensure that the tunnel kept to its route, and then digging vertical shafts down into the ground at regular intervals. Underground, workers removed the earth from between the ends of the shafts, creating a tunnel. The excavated soil was taken up to the surface using the shafts, which also provided ventilation during the work. Once the tunnel was completed, it allowed water to flow from the top of a hillside down towards a canal, which supplied water for human use. Remarkably, some qanats built by the Persians 2,700 years ago are still in use today."
    },
    {
      id: "P2",
      text: "They later passed on their knowledge to the Romans, who also used the qanat method to construct water-supply tunnels for agriculture. Roman qanat tunnels were constructed with vertical shafts dug at intervals of between 30 and 60 meters. The shafts were equipped with handholds and footholds to facilitate climbing down and up, and covered with a wooden or stone lid to prevent accidents. Once a shaft had reached the required depth, workers dug horizontally in both directions until adjacent shafts connected. To check the alignment of the shafts, Roman engineers used plumb lines and hung a heavy weight from each line."
    },
    {
      id: "P3",
      text: "By the 6th century BCE, a second method called counter-excavation was introduced. Unlike the qanat method, which required multiple vertical shafts, counter-excavation was used to tunnel through high mountains where digging vertical shafts was impossible. Workers dug from both ends of the mountain simultaneously, hoping to meet in the middle. However, ensuring that both tunnels met accurately was extremely difficult. Large deviations could happen, and they could result in one end of the tunnel not being usable."
    },
    {
      id: "P4",
      text: "An inscription written on the side of a 428-meter tunnel, built by the Romans as part of the Saldae aqueduct system in modern-day Algeria, describes how the two teams of diggers missed each other completely. The project was saved only after the original architect, Nonius Datus, was recalled to correct the angle and reconnect the excavations. The Romans later learned from these mistakes and improved their surveying methods."
    },
    {
      id: "P5",
      text: "Roman tunnels were not only built for water supply; they were also used for road transport and military purposes, such as diverting rivers or sapping city walls during sieges. In some tunnels, gold mining operations were conducted, and in coastal areas, tunnels were constructed to connect cities with their harbour or supply military fortifications."
    }
  ],
  groups: [
    {
      groupType: "diagram_labelling",
      instructions: "Label the diagrams below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–6 on your answer sheet.",
      title: "The Persian Qanat Method & Cross-section of a Roman Qanat",
      imageUrl: "/images/ielts/cam16_test4_reading_diagram.png",
      items: [
        { number: 1, prefix: "to direct the tunnelling: ", suffix: "", answers: ["posts"] },
        { number: 2, prefix: "water runs into a ", suffix: " used by local people", answers: ["canal"] },
        { number: 3, prefix: "vertical shafts to remove earth and for ", suffix: "", answers: ["ventilation"] },
        { number: 4, prefix: "covered with a wooden or stone ", suffix: "", answers: ["lid"] },
        { number: 5, prefix: "plumb lines hung with a heavy ", suffix: "", answers: ["weight"] },
        { number: 6, prefix: "handholds and footholds used for ", suffix: "", answers: ["climbing"] }
      ]
    },
    {
      groupType: "true_false_not_given",
      instructions: "Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 7–10 on your answer sheet, write:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      numbers: [7, 8, 9, 10],
      items: [
        { number: 7, statement: "The counter-excavation method completely replaced the qanat method in the 6th century BCE.", answers: ["FALSE"] },
        { number: 8, statement: "Only experienced builders were employed on tunnel construction projects.", answers: ["NOT GIVEN"] },
        { number: 9, statement: "The information about a problem that occurred during the construction of the Saldae aqueduct system was found in ancient Roman books.", answers: ["FALSE"] },
        { number: 10, statement: "The mistake made by the builders of the Saldae aqueduct was avoided in later projects.", answers: ["TRUE"] }
      ]
    },
    {
      groupType: "notes_completion",
      instructions: "Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 11–13 on your answer sheet.",
      title: "Other uses of Roman tunnels",
      sections: [
        {
          heading: "Uses of tunnels",
          lines: [
            { prefix: "• In some tunnels, ", number: 11, suffix: " mining operations were conducted." },
            { prefix: "• Nonius Datus was the ", number: 12, suffix: " who resolved the problem at Saldae." },
            { prefix: "• Coastal tunnels connected cities with their ", number: 13, suffix: "." }
          ]
        }
      ],
      items: [
        { number: 11, answers: ["gold"] },
        { number: 12, answers: ["architect", "architect's", "architect's name", "(the) architect('s) (name)"] },
        { number: 13, answers: ["harbour", "harbor", "(the) harbour / harbor"] }
      ]
    }
  ]
};
