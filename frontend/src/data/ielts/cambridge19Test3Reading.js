// Cambridge IELTS 19 Test 3 - Reading Module Data
export const cambridge19Test3Reading = {
  testId: "cambridge-19-test-3",
  title: "Cambridge IELTS 19 - Test 3 - Reading",
  passages: [
    {
      passageNumber: 1,
      title: "Archaeologists discover evidence of prehistoric island settlers",
      subtitle: "Maritime voyagers on Obi Island in Wallacea date back over 18,000 years",
      paragraphs: [
        { id: "P1", text: "Recent excavations on Obi Island, an isolated volcanic outcrop in the Wallacean archipelago of eastern Indonesia, have unearthed the oldest evidence of human occupation in the region. Archaeological teams uncovered flaked stone tools, ochre pigments, and marine shells in Kelo Cave, dating back roughly 18,000 years to the Last Glacial Maximum." },
        { id: "P2", text: "The findings demonstrate remarkable maritime sophistication. Even during periods of lowest sea levels, Obi remained separated from neighboring landmasses by deep oceanic trenches. Reaching the island required deliberate seafaring across open ocean passages, dispelling the antiquated notion that early humans only colonized offshore islands through accidental drift." }
      ],
      groups: [
        {
          groupType: "true_false_not_given",
          instructions: "Do the following statements agree with the information in Reading Passage 1?\nWrite TRUE, FALSE, or NOT GIVEN.",
          numbers: [1, 2, 3, 4, 5, 6],
          items: [
            { number: 1, statement: "Obi Island was continuously connected to mainland Asia during the ice age.", answers: ["FALSE"] },
            { number: 2, statement: "Artifacts discovered in Kelo Cave date to approximately 18,000 years ago.", answers: ["TRUE"] },
            { number: 3, statement: "The island's early settlers survived exclusively on agricultural crops.", answers: ["FALSE"] },
            { number: 4, statement: "Researchers found complete wooden canoes preserved in the cave sediment.", answers: ["NOT GIVEN"] },
            { number: 5, statement: "Reaching Obi required crossing deep maritime channels.", answers: ["TRUE"] },
            { number: 6, statement: "The discoveries support the hypothesis of intentional open-water voyaging.", answers: ["TRUE"] }
          ]
        },
        {
          groupType: "fill_notes",
          instructions: "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.",
          numbers: [7, 8, 9, 10, 11, 12, 13],
          items: [
            { number: 7, prefix: "Obi is an isolated ", suffix: " island.", answers: ["volcanic"] },
            { number: 8, prefix: "The key archaeological site is named ", suffix: " Cave.", answers: ["Kelo"] },
            { number: 9, prefix: "Discoveries included red ochre ", suffix: " used for art.", answers: ["pigments"] },
            { number: 10, prefix: "Artifacts included flaked stone ", suffix: "", answers: ["tools"] },
            { number: 11, prefix: "Occupation coincided with the Last Glacial ", suffix: "", answers: ["Maximum"] },
            { number: 12, prefix: "Obi was separated by deep oceanic ", suffix: "", answers: ["trenches"] },
            { number: 13, prefix: "The evidence refutes the theory of accidental ", suffix: "", answers: ["drift"] }
          ]
        }
      ]
    },
    {
      passageNumber: 2,
      title: "The global importance of wetlands",
      subtitle: "Vital ecosystems at the intersection of carbon sequestration, flood prevention and biodiversity",
      paragraphs: [
        { id: "P1", text: "Wetlands - encompassing marshes, swamps, bogs, and peatlands - cover only six percent of the Earth's terrestrial surface, yet they play a disproportionate role in regulating the global biosphere. Often described as the 'kidneys of the landscape', wetlands filter pollutants, absorb heavy metals, and trap agricultural runoff before toxic chemicals reach groundwater aquifers or ocean estuaries." },
        { id: "P2", text: "In addition to their water purification role, peatlands are the planet's most effective terrestrial carbon sinks. Storing more carbon than all the world's forests combined, waterlogged soils prevent plant matter from decomposing, locking carbon away for millennia. When wetlands are drained for commercial development, this stored carbon oxidizes, transforming natural sinks into massive carbon emitters." }
      ],
      groups: [
        {
          groupType: "matching_headings",
          instructions: "Choose the correct heading for each paragraph from the list below.",
          numbers: [14, 15, 16, 17],
          items: [
            { number: 14, question: "Paragraph 1 (The natural filtration mechanism of wetlands)", answers: ["ii"] },
            { number: 15, question: "Paragraph 2 (Carbon storage capacity of waterlogged soils)", answers: ["v"] },
            { number: 16, question: "Paragraph 3 (Biodiversity refuges and migratory stopovers)", answers: ["i"] },
            { number: 17, question: "Paragraph 4 (Economic imperatives for global preservation treaties)", answers: ["iv"] }
          ]
        },
        {
          groupType: "multiple_choice",
          instructions: "Choose the correct letter, A, B, C or D.",
          numbers: [18, 19, 20, 21, 22],
          items: [
            { number: 18, question: "Why are wetlands compared to human kidneys?", options: ["A. They regulate bodily temperature", "B. They filter toxins and clean water supplies", "C. They can be surgically transplanted", "D. They produce hormone secretions"], answers: ["B"] },
            { number: 19, question: "How much terrestrial land do wetlands occupy globally?", options: ["A. 6%", "B. 16%", "C. 26%", "D. 36%"], answers: ["A"] },
            { number: 20, question: "How does peatland carbon storage compare with global forests?", options: ["A. Peatlands store negligible amounts", "B. Peatlands store more carbon than all forests combined", "C. Forest biomass exceeds peat by ten times", "D. Both hold identical percentages"], answers: ["B"] },
            { number: 21, question: "What occurs when peatlands are drained for agriculture?", options: ["A. Water salinity drops to zero", "B. Stored carbon oxidizes and enters the atmosphere", "C. Soil becomes permanently frozen", "D. Tree growth accelerates drastically"], answers: ["B"] },
            { number: 22, question: "Which international treaty protects globally significant wetlands?", options: ["A. The Kyoto Protocol", "B. The Ramsar Convention", "C. The Geneva Accord", "D. The Paris Agreement"], answers: ["B"] }
          ]
        },
        {
          groupType: "summary_completion",
          instructions: "Complete the summary below using words from the passage.",
          numbers: [23, 24, 25, 26],
          items: [
            { number: 23, prefix: "Wetlands mitigate severe flooding by acting as natural ", suffix: " reservoirs.", answers: ["sponge"] },
            { number: 24, prefix: "Anaerobic conditions in bogs halt organic ", suffix: "", answers: ["decomposition"] },
            { number: 25, prefix: "Coastal salt marshes act as physical barriers against tidal ", suffix: " surges.", answers: ["storm"] },
            { number: 26, prefix: "Conservation requires urgent restoration of natural ", suffix: " regimes.", answers: ["water"] }
          ]
        }
      ]
    },
    {
      passageNumber: 3,
      title: "Is the era of artificial speech translation upon us?",
      subtitle: "Breakthroughs in neural machine translation and speech synthesis",
      paragraphs: [
        { id: "P1", text: "The dream of a universal translator - capable of listening to spoken dialogue in one language and vocalizing it instantaneously in another - is steadily transitioning from science fiction into engineering reality. Advances in deep neural networks and end-to-end speech translation models have dramatically narrowed the latency gap." },
        { id: "P2", text: "However, formidable technical hurdles remain. Human spoken communication is laden with idioms, sarcasm, cultural nuances, and conversational interruptions. Current models still struggle to capture speaker intonation, regional dialectal variations, and context-dependent humor." }
      ],
      groups: [
        {
          groupType: "yes_no_not_given",
          instructions: "Do the following statements agree with the claims of the writer? Write YES, NO, or NOT GIVEN.",
          numbers: [27, 28, 29, 30, 31, 32],
          items: [
            { number: 27, statement: "Real-time speech translation has completely superseded human interpreters in diplomacy.", answers: ["NO"] },
            { number: 28, statement: "Deep neural networks have substantially diminished speech translation latency.", answers: ["YES"] },
            { number: 29, statement: "Automated systems decipher contextual sarcasm with flawless precision.", answers: ["NO"] },
            { number: 30, statement: "Voice cloning technologies can replicate the original speaker's vocal timbre.", answers: ["YES"] },
            { number: 31, statement: "All commercial speech translators require high-speed cloud connections.", answers: ["NOT GIVEN"] },
            { number: 32, statement: "Low-resource indigenous languages pose the greatest challenge for neural models.", answers: ["YES"] }
          ]
        },
        {
          groupType: "multiple_choice",
          instructions: "Choose the correct letter, A, B, C or D.",
          numbers: [33, 34, 35, 36],
          items: [
            { number: 33, question: "What is an end-to-end speech translation model?", options: ["A. A system translating directly from audio waveform to target speech", "B. A two-step process converting audio to written text first", "C. A dictionary look-up table software", "D. A mechanical phonograph transducer"], answers: ["A"] },
            { number: 34, question: "Conversational subtleties like sarcasm present difficulties because they", options: ["A. use non-standard grammatical structures", "B. rely on prosodic inflection and shared cultural context", "C. cannot be transmitted through digital microphones", "D. are restricted to European languages"], answers: ["B"] },
            { number: 35, question: "What ethical dilemma is associated with synthetic voice cloning?", options: ["A. Increased hardware electricity consumption", "B. Potential misuse for unauthorized impersonation", "C. Slower speech processing speeds", "D. High licensing fees for microphone manufacturers"], answers: ["B"] },
            { number: 36, question: "The writer concludes that artificial speech translation will", options: ["A. soon render second-language education obsolete", "B. augment human communication while requiring human oversight in sensitive domains", "C. be banned by international telecommunication treaties", "D. fail to progress beyond current mobile phone applications"], answers: ["B"] }
          ]
        },
        {
          groupType: "matching_features",
          instructions: "Match each translation challenge with its corresponding technical domain.",
          numbers: [37, 38, 39, 40],
          items: [
            { number: 37, question: "Acoustic background noise suppression", answers: ["A"] },
            { number: 38, question: "Idiomatic semantic disambiguation", answers: ["C"] },
            { number: 39, question: "Low-latency streaming segmentation", answers: ["D"] },
            { number: 40, question: "Synthetic prosodic pitch matching", answers: ["B"] }
          ]
        }
      ]
    }
  ]
};

