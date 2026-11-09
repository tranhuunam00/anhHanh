// Cambridge IELTS 17 Test 2 - Reading Passage 2 Data
export const cambridge17Test2ReadingPassage2 = {
  passageNumber: 2,
  title: "A second attempt at domesticating the tomato",
  paragraphs: [
    {
      id: "A",
      text: "It took our ancestors thousands of years to transform wild plants into the domesticated crops that sustain modern civilisation. By systematically selecting individual plants that exhibited desirable mutations—such as bigger seeds, sweeter fruit, or non-shattering seed heads—early farmers gradually remade wild species into compliant, high-yielding food sources. Yet this slow evolutionary bargain came at a steep cost: modern crops have sacrificed broad genetic diversity, disease resistance, and robust flavour in exchange for uniform yield and transport durability."
    },
    {
      id: "B",
      text: "Now, an international cadre of plant biotechnologists is pursuing an audacious counter-strategy known as de novo domestication. Rather than attempting to re-introduce ancient resilience back into delicate modern varieties through decades of cumbersome cross-breeding, researchers are taking tough, wild ancestral plants and rapidly engineering domestication traits directly into them using cutting-edge CRISPR-Cas9 gene editing tools."
    },
    {
      id: "C",
      text: "The wild currant tomato, Solanum pimpinellifolium, has become the premier proving ground for this revolutionary approach. Native to coastal Peru and Ecuador, this resilient weed shrugs off brackish water, survives impoverished soils, and resists devastating fungal pathogens that routinely wipe out commercial tomato greenhouses. However, its berries are no larger than blueberries, and the sprawling vine grows haphazardly in untidy tangles."
    },
    {
      id: "D",
      text: "Teams led by Dr Joyce Van Eck at the Boyce Thompson Institute in New York and Dr Jorg Kudla at the University of Münster edited merely half a dozen regulatory genes in the wild tomato. In a single generation, they increased fruit size by 300 percent, tripled the number of berries per cluster, and induced a compact, upright bush structure suitable for commercial mechanical harvesting—all while retaining the wild plant's formidable pest resistance and extraordinary high levels of vitamin C and aromatic flavour compounds."
    },
    {
      id: "E",
      text: "Simultaneously, Dr Caixia Gao at the Chinese Academy of Sciences in Beijing achieved similar breakthroughs, modifying wild tomatoes to flourish in hyper-saline coastal soils that would poison standard farm varieties. Professor Jonathan Jones at The Sainsbury Laboratory notes that de novo domestication offers humanity a vital tool for climate resilience, turning wild coastal weeds into productive, stress-tolerant crops capable of feeding a warmer, more crowded planet."
    }
  ],
  groups: [
    {
      groupType: "matching_headings",
      instructions: "Reading Passage 2 has five sections, A–E.\nWhich section contains the following information?\nWrite the correct letter, A–E, in boxes 14–17 on your answer sheet.",
      numbers: [14, 15, 16, 17],
      items: [
        {
          number: 14,
          statement: "a description of the wild plant used as the primary candidate for de novo domestication",
          answers: ["C"]
        },
        {
          number: 15,
          statement: "an explanation of how modern gene editing contrasts with historic breeding",
          answers: ["B"]
        },
        {
          number: 16,
          statement: "details of research enabling crops to grow in salty soil environments",
          answers: ["E"]
        },
        {
          number: 17,
          statement: "the compromises resulting from traditional ancestral domestication",
          answers: ["A"]
        }
      ]
    },
    {
      groupType: "matching_features",
      instructions: "Look at the following researchers and the statements below.\nMatch each statement with the correct researcher, A–D.\nWrite the correct letter, A–D, in boxes 18–23 on your answer sheet.",
      boxTitle: "Researchers",
      boxOptions: [
        "A Jorg Kudla",
        "B Caixia Gao",
        "C Joyce Van Eck",
        "D Jonathan Jones"
      ],
      numbers: [18, 19, 20, 21, 22, 23],
      items: [
        {
          number: 18,
          statement: "modified plant architecture to make it easier to gather fruit mechanically",
          answers: ["C"]
        },
        {
          number: 19,
          statement: "engineered plants able to withstand high levels of salinity",
          answers: ["B"]
        },
        {
          number: 20,
          statement: "emphasised the significance of this approach for future climate challenges",
          answers: ["D"]
        },
        {
          number: 21,
          statement: "collaborated on altering fruit dimensions without compromising wild vigour",
          answers: ["A"]
        },
        {
          number: 22,
          statement: "demonstrated massive increases in fruit cluster density in a single generation",
          answers: ["C"]
        },
        {
          number: 23,
          statement: "noted that nutritional compounds remained intact in the engineered wild strains",
          answers: ["A"]
        }
      ]
    },
    {
      groupType: "fill_notes",
      instructions: "Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 24–26 on your answer sheet.",
      title: "Benefits of De Novo Domestication",
      numbers: [24, 25, 26],
      items: [
        {
          number: 24,
          prefix: "Unlike modern commercial crops, the edited wild tomato retained intense ",
          suffix: " and vitamin C.",
          answers: ["flavour", "flavor"]
        },
        {
          number: 25,
          prefix: "Gene editing achieved a 300% expansion in fruit ",
          suffix: " within one generation.",
          answers: ["size"]
        },
        {
          number: 26,
          prefix: "Modified strains can successfully tolerate high concentrations of ",
          suffix: " in coastal farm fields.",
          answers: ["salt"]
        }
      ]
    }
  ]
};
