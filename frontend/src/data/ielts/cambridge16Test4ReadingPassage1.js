// Cambridge IELTS 16 Test 4 - Reading Passage 1
// Text, questions and answers checked against Cambridge 16.pdf (pages 82–85).

export const cambridge16Test4ReadingPassage1 = {
  passageNumber: 1,
  title: "Roman tunnels",
  subtitle: "The Romans, who once controlled areas of Europe, North Africa and Asia Minor, adopted the construction techniques of other civilizations to build tunnels in their territories",
  paragraphs: [
    { id: "P1", text: "The Persians, who lived in present-day Iran, were one of the first civilizations to build tunnels that provided a reliable supply of water to human settlements in dry areas. In the early first millennium BCE, they introduced the qanat method of tunnel construction, which consisted of placing posts over a hill in a straight line, to ensure that the tunnel kept to its route, and then digging vertical shafts down into the ground at regular intervals. Underground, workers removed the earth from between the ends of the shafts, creating a tunnel. The excavated soil was taken up to the surface using the shafts, which also provided ventilation during the work. Once the tunnel was completed, it allowed water to flow from the top of a hillside down towards a canal, which supplied water for human use. Remarkably, some qanats built by the Persians 2,700 years ago are still in use today." },
    { id: "P2", text: "They later passed on their knowledge to the Romans, who also used the qanat method to construct water-supply tunnels for agriculture. Roman qanat tunnels were constructed with vertical shafts dug at intervals of between 30 and 60 meters. The shafts were equipped with handholds and footholds to help those climbing in and out of them and were covered with a wooden or stone lid. To ensure that the shafts were vertical, Romans hung a plumb line from a rod placed across the top of each shaft and made sure that the weight at the end of it hung in the center of the shaft. Plumb lines were also used to measure the depth of the shaft and to determine the slope of the tunnel. The 5.6-kilometer-long Claudius tunnel, built in 41 CE to drain the Fucine Lake in central Italy, had shafts that were up to 122 meters deep, took 11 years to build and involved approximately 30,000 workers." },
    { id: "P3", text: "By the 6th century BCE, a second method of tunnel construction appeared called the counter-excavation method, in which the tunnel was constructed from both ends. It was used to cut through high mountains when the qanat method was not a practical alternative. This method required greater planning and advanced knowledge of surveying, mathematics and geometry as both ends of a tunnel had to meet correctly at the center of the mountain. Adjustments to the direction of the tunnel also had to be made whenever builders encountered geological problems or when it deviated from its set path. They constantly checked the tunnel's advancing direction, for example, by looking back at the light that penetrated through the tunnel mouth, and made corrections whenever necessary. Large deviations could happen, and they could result in one end of the tunnel not being usable. An inscription written on the side of a 428-meter tunnel, built by the Romans as part of the Saldae aqueduct system in modern-day Algeria, describes how the two teams of builders missed each other in the mountain and how the later construction of a lateral link between both corridors corrected the initial error." },
    { id: "P4", text: "The Romans dug tunnels for their roads using the counter-excavation method, whenever they encountered obstacles such as hills or mountains that were too high for roads to pass over. An example is the 37-meter-long, 6-meter-high, Furlo Pass Tunnel built in Italy in 69–79 CE. Remarkably, a modern road still uses this tunnel today. Tunnels were also built for mineral extraction. Miners would locate a mineral vein and then pursue it with shafts and tunnels underground. Traces of such tunnels used to mine gold can still be found at the Dolaucothi mines in Wales. When the sole purpose of a tunnel was mineral extraction, construction required less planning, as the tunnel route was determined by the mineral vein." },
    { id: "P5", text: "Roman tunnel projects were carefully planned and carried out. The length of time it took to construct a tunnel depended on the method being used and the type of rock being excavated. The qanat construction method was usually faster than the counter-excavation method as it was more straightforward. This was because the mountain could be excavated not only from the tunnel mouths but also from shafts. The type of rock could also influence construction times. When the rock was hard, the Romans employed a technique called fire quenching which consisted of heating the rock with fire, and then suddenly cooling it with cold water so that it would crack. Progress through hard rock could be very slow, and it was not uncommon for tunnels to take years, if not decades, to be built. Construction marks left on a Roman tunnel in Bologna show that the rate of advance through solid rock was 30 centimeters per day. In contrast, the rate of advance of the Claudius tunnel can be calculated at 1.4 meters per day. Most tunnels had inscriptions showing the names of patrons who ordered construction and sometimes the name of the architect. For example, the 1.4-kilometer Çevlik tunnel in Turkey, built to divert the floodwater threatening the harbor of the ancient city of Seleuceia Pieria, had inscriptions on the entrance, still visible today, that also indicate that the tunnel was started in 69 CE and was completed in 81 CE." }
  ],
  groups: [
    {
      groupType: "diagram_labelling",
      instructions: "Label the diagrams below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–6 on your answer sheet.",
      imageUrl: "/images/ielts/cam16_test4_reading_diagram.png",
      numbers: [1, 2, 3, 4, 5, 6],
      notes: {
        sections: [
          {
            heading: "The Persian Qanat Method",
            lines: ["{1} to direct the tunnelling", "water runs into a {2} used by local people", "vertical shafts to remove earth and for {3}"]
          },
          {
            heading: "Cross-section of a Roman Qanat Shaft",
            lines: ["{4} made of wood or stone", "{5} attached to the plumb line", "handholds and footholds used for {6}"]
          }
        ]
      },
      items: [
        { number: 1, answers: ["posts"] },
        { number: 2, answers: ["canal"] },
        { number: 3, answers: ["ventilation"] },
        { number: 4, answers: ["lid"] },
        { number: 5, answers: ["weight"] },
        { number: 6, answers: ["climbing"] }
      ]
    },
    {
      groupType: "true_false_not_given",
      instructions: "Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 7–10 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      numbers: [7, 8, 9, 10],
      items: [
        { number: 7, statement: "The counter-excavation method completely replaced the qanat method in the 6th century BCE.", answers: ["FALSE"] },
        { number: 8, statement: "Only experienced builders were employed to construct a tunnel using the counter-excavation method.", answers: ["NOT GIVEN"] },
        { number: 9, statement: "The information about a problem that occurred during the construction of the Saldae aqueduct system was found in an ancient book.", answers: ["FALSE"] },
        { number: 10, statement: "The mistake made by the builders of the Saldae aqueduct system was that the two parts of the tunnel failed to meet.", answers: ["TRUE"] }
      ]
    },
    {
      groupType: "short_answer",
      instructions: "Answer the questions below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 11–13 on your answer sheet.",
      numbers: [11, 12, 13],
      items: [
        { number: 11, question: "What type of mineral were the Dolaucothi mines in Wales built to extract?", answers: ["gold"] },
        {
          number: 12,
          question: "In addition to the patron, whose name might be carved onto a tunnel?",
          answers: ["architect", "the architect", "architect's", "the architect's", "architect's name", "the architect's name", "architect name", "the architect name"]
        },
        { number: 13, question: "What part of Seleuceia Pieria was the Çevlik tunnel built to protect?", answers: ["harbour", "the harbour", "harbor", "the harbor"] }
      ]
    }
  ]
};
