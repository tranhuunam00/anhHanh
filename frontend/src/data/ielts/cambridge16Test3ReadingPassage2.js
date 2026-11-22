// Cambridge IELTS 16 Test 3 - Reading Passage 2 Data
export const cambridge16Test3ReadingPassage2 = {
  passageNumber: 2,
  title: "Climate change reveals ancient artefacts in Norway's glaciers",
  paragraphs: [
    {
      id: "A",
      text: "Well above the treeline in Norway's highest mountains, ancient fields of ice are shrinking as Earth's climate warms. As the ice has vanished, it has been giving up the treasures it has preserved in cold storage for the last 6,000 years — items such as ancient arrows and skis from Viking Age traders. And those artefacts have provided archaeologists with some surprising insights into how ancient Norwegians made their livings."
    },
    {
      id: "B",
      text: "Organic materials like textiles and hides are relatively rare finds at archaeological sites. This is because unless they're protected from the microorganisms that cause decay, they tend not to last long. Extreme cold is one reliable way to keep artefacts relatively fresh for a few thousand years, but once thawed out, these materials experience degradation relatively swiftly. With climate change shrinking ice cover around the world, glacial archaeologists need to race the clock to find newly revealed artefacts, preserve them, and study them. If something fragile dries and is windblown it might very soon be lost to science, or an arrow might be exposed and then covered again by the next snow and remain well-preserved. The unpredictability means that glacial archaeologists have to be systematic in their approach to fieldwork."
    },
    {
      id: "C",
      text: "Fieldwork in glacial archaeology is harsh, demanding physical work. Researchers must hike for hours across rugged boulders, pitch tents amidst freezing gales, and endure sudden blizzards. They often have only a narrow window of late summer weeks before new snow blankets the ground again."
    },
    {
      id: "D",
      text: "At the edges of the contracting ice patches, archaeologists found more than 2,000 artefacts, which formed a material record that ran from 4,000 BCE to the beginnings of the Renaissance in the 14th century. Many of the artefacts are associated with hunting. Hunters would have easily misplaced arrows in snowdrifts, and they often discarded broken bows rather than carry useless burdens down treacherous mountain slopes."
    },
    {
      id: "E",
      text: "During hot summer days, wild reindeer gathered on the high ice patches to escape biting insects and seek relief from the heat. Ancient hunters knew this animal behavior well and climbed high into the crags to ambush the herds, leaving behind arrows, scaring sticks and stone blinds."
    },
    {
      id: "F",
      text: "Archaeologist James Barrett and his team analyzed the dates of the finds and uncovered striking patterns. Between the 8th and 10th centuries CE — during the Viking Age — discoveries surged. This surge coincided with the rapid expansion of towns and trade across Scandinavia and Europe, creating strong demand for mountain products like reindeer antler for combs and pelts for clothing."
    },
    {
      id: "G",
      text: "Remarkably, archaeological evidence showed that hunters venture into high-altitude passes even during periods of extreme climatic cooling, such as the Late Antique Little Ice Age in the 6th century. When crop failures struck lowland farms, mountain hunting and trade became an indispensable buffer against starvation."
    },
    {
      id: "H",
      text: "However, during the 14th century, the number of artefacts dropped dramatically. Barrett attributes this decline to the arrival of the Black Death, which wiped out up to half of Norway's population, as well as shifts in trade towards cheaper sea fisheries and agricultural recovery in the lowlands."
    }
  ],
  groups: [
    {
      groupType: "matching_paragraphs",
      instructions: "Reading Passage 2 has eight sections, A–H.\nWhich section contains the following information?\nWrite the correct letter, A–H, in boxes 14–19 on your answer sheet.",
      numbers: [14, 15, 16, 17, 18, 19],
      items: [
        { number: 14, statement: "an explanation for weapons being left behind in the mountains", answers: ["D"] },
        { number: 15, statement: "a reference to the physical difficulties involved in an archaeological expedition", answers: ["C"] },
        { number: 16, statement: "an explanation of how trade contributed to the growth of mountain hunting", answers: ["F"] },
        { number: 17, statement: "an explanation of why the number of artefacts found in the ice patches declined", answers: ["H"] },
        { number: 18, statement: "a reference to the survival of hunting during severe weather crises", answers: ["G"] },
        { number: 19, statement: "a description of the threats faced by organic artefacts once they are exposed", answers: ["B"] }
      ]
    },
    {
      groupType: "summary_completion",
      instructions: "Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 20–22 on your answer sheet.",
      title: "Ancient hunting in Norway's glaciers",
      sections: [
        {
          heading: "Preservation and wildlife",
          lines: [
            { prefix: "Organic artefacts survive in ice because they are protected from ", number: 20, suffix: "." },
            { prefix: "During warm weather, herds of wild ", number: 21, suffix: " gathered on ice patches." },
            { prefix: "They moved to the ice to escape attacks by ", number: 22, suffix: "." }
          ]
        }
      ],
      items: [
        { number: 20, answers: ["microorganisms", "micro-organisms"] },
        { number: 21, answers: ["reindeer"] },
        { number: 22, answers: ["insects"] }
      ]
    },
    {
      groupType: "pick_multiple",
      instructions: "Choose TWO letters, A–E.\nWrite the correct letters in boxes 23 and 24 on your answer sheet.\nWhich TWO of the following statements does the writer make about the discoveries of Barrett's team?",
      numbers: [23, 24],
      options: [
        "A Artefacts found in the higher mountain passes were limited to skiing equipment.",
        "B Hunters went into the mountains even during periods of extreme cold.",
        "C Artefact numbers increased significantly during the Viking Age.",
        "D Mountain trade completely stopped after the Black Death.",
        "E Most preserved arrows were made of metal."
      ],
      items: [
        { number: 23, question: "Statements about discoveries of Barrett's team (1 of 2)", answers: ["B", "C"] },
        { number: 24, question: "Statements about discoveries of Barrett's team (2 of 2)", answers: ["B", "C"] }
      ]
    },
    {
      groupType: "pick_multiple",
      instructions: "Choose TWO letters, A–E.\nWrite the correct letters in boxes 25 and 26 on your answer sheet.\nWhich TWO factors contributed to the dramatic decline of high-altitude artefacts in the 14th century?",
      numbers: [25, 26],
      options: [
        "A the devastating impact of epidemic disease",
        "B changes in European religious practices",
        "C greater reliance on maritime resources",
        "D the exhaustion of wild reindeer populations",
        "E new legislation banning mountain hunting"
      ],
      items: [
        { number: 25, question: "Factors contributing to 14th century decline (1 of 2)", answers: ["A", "C"] },
        { number: 26, question: "Factors contributing to 14th century decline (2 of 2)", answers: ["A", "C"] }
      ]
    }
  ]
};
