// Cambridge IELTS 19 Test 4 - Reading Module Data
export const cambridge19Test4Reading = {
  testId: "cambridge-19-test-4",
  title: "Cambridge IELTS 19 - Test 4 - Reading",
  passages: [
    {
      passageNumber: 1,
      title: "The impact of climate change on butterflies in Britain",
      subtitle: "Shifting distributions, phenological mismatch, and habitat fragmentation",
      paragraphs: [
        { id: "P1", text: "Butterflies are among the most sensitive bio-indicators of environmental transformation. In Great Britain, four decades of systematic recording by the UK Butterfly Monitoring Scheme have revealed dramatic shifts in both geographical distribution and seasonal emergence timing driven by rising temperatures." },
        { id: "P2", text: "Warm-adapted generalist species, such as the Speckled Wood and Comma, have expanded their northern range boundaries by over 200 kilometres, capitalizing on milder winters. Conversely, cold-adapted northern specialists, notably the Mountain Ringlet, are retreating up mountain slopes as their suitable bioclimatic envelope contracts." }
      ],
      groups: [
        {
          groupType: "true_false_not_given",
          instructions: "Do the following statements agree with the information in Reading Passage 1?\nWrite TRUE, FALSE, or NOT GIVEN.",
          numbers: [1, 2, 3, 4, 5, 6],
          items: [
            { number: 1, statement: "The UK Butterfly Monitoring Scheme has operated continuously for over forty years.", answers: ["TRUE"] },
            { number: 2, statement: "All British butterfly species are expanding their ranges northward at identical rates.", answers: ["FALSE"] },
            { number: 3, statement: "The Mountain Ringlet is migrating toward higher altitudes due to warmer temperatures.", answers: ["TRUE"] },
            { number: 4, statement: "Severe drought in 1976 led to the complete extinction of the Comma butterfly.", answers: ["FALSE"] },
            { number: 5, statement: "Pesticide application has had a greater impact than global heating on northern species.", answers: ["NOT GIVEN"] },
            { number: 6, statement: "Phenological synchrony between caterpillars and host plants is being disrupted.", answers: ["TRUE"] }
          ]
        },
        {
          groupType: "fill_notes",
          instructions: "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.",
          numbers: [7, 8, 9, 10, 11, 12, 13],
          items: [
            { number: 7, prefix: "Butterflies serve as sensitive biological ", suffix: " of climate changes.", answers: ["indicators"] },
            { number: 8, prefix: "Warm-adapted species include the Speckled Wood and ", suffix: "", answers: ["Comma"] },
            { number: 9, prefix: "Generalists expanded northward by over 200 ", suffix: "", answers: ["kilometres", "kilometers"] },
            { number: 10, prefix: "Northern specialist retreating upwards: Mountain ", suffix: "", answers: ["Ringlet"] },
            { number: 11, prefix: "Rising temperatures cause milder ", suffix: " months.", answers: ["winters"] },
            { number: 12, prefix: "Specialists suffer from shrinking bioclimatic ", suffix: "", answers: ["envelope"] },
            { number: 13, prefix: "Habitat ", suffix: " exacerbates migration barriers.", answers: ["fragmentation"] }
          ]
        }
      ]
    },
    {
      passageNumber: 2,
      title: "Deep-sea mining",
      subtitle: "The promise of critical battery metals versus the perils of abyssal disruption",
      paragraphs: [
        { id: "P1", text: "Thousands of metres beneath the ocean surface lies the abyssal plain, home to vast expanses of polymetallic nodules. These potato-sized concretions, precipitated over millions of years, are extraordinarily rich in nickel, cobalt, copper, and manganese - the precise minerals deemed essential for the global transition to electric vehicles and renewable energy storage." },
        { id: "P2", text: "However, marine biologists warn that deep-sea extraction could inflict catastrophic and irreversible harm on fragile ecosystems. Abyssal communities develop in total darkness under crushing pressures and near-freezing temperatures; their metabolic and reproductive rates are exceptionally sluggish. Heavy scraping machinery would strip seabed strata, while underwater sediment plumes could smother filter-feeding fauna across thousands of square kilometres." }
      ],
      groups: [
        {
          groupType: "matching_headings",
          instructions: "Choose the correct heading for each paragraph from the list below.",
          numbers: [14, 15, 16, 17],
          items: [
            { number: 14, question: "Paragraph 1 (The mineral composition and commercial allure of abyssal nodules)", answers: ["iii"] },
            { number: 15, question: "Paragraph 2 (Ecological vulnerability of deep benthic organisms)", answers: ["vi"] },
            { number: 16, question: "Paragraph 3 (Sediment plume dynamics and pelagic food web disruptions)", answers: ["i"] },
            { number: 17, question: "Paragraph 4 (International Seabed Authority regulatory stalemate)", answers: ["v"] }
          ]
        },
        {
          groupType: "multiple_choice",
          instructions: "Choose the correct letter, A, B, C or D.",
          numbers: [18, 19, 20, 21, 22],
          items: [
            { number: 18, question: "What is a major component of polymetallic nodules?", options: ["A. Pure uranium", "B. Nickel and cobalt", "C. Solid mercury", "D. Compressed coal"], answers: ["B"] },
            { number: 19, question: "Why are nodule minerals in high commercial demand?", options: ["A. For architectural facade gilding", "B. For electric vehicle batteries and green tech", "C. For nuclear submarines armor", "D. For luxury jewelry manufacturing"], answers: ["B"] },
            { number: 20, question: "Deep-sea benthic organisms are uniquely vulnerable because", options: ["A. their reproduction and metabolic rates are extremely slow", "B. they lack any nervous system", "C. they only inhabit shallow coral reefs", "D. they rely on surface sunlight for navigation"], answers: ["A"] },
            { number: 21, question: "What physical by-product of mining threatens midwater marine life?", options: ["A. Toxic volcanic gas bubbles", "B. Suspended underwater sediment plumes", "C. Radioactive wastewater leakage", "D. High-frequency acoustic sonar pulses"], answers: ["B"] },
            { number: 22, question: "Which UN body governs mining in international waters?", options: ["A. The International Seabed Authority (ISA)", "B. The World Trade Organization", "C. The International Maritime Organization", "D. The UNESCO Heritage Committee"], answers: ["A"] }
          ]
        },
        {
          groupType: "summary_completion",
          instructions: "Complete the summary below using words from the passage.",
          numbers: [23, 24, 25, 26],
          items: [
            { number: 23, prefix: "Nodules take several ", suffix: " of years to precipitate.", answers: ["millions"] },
            { number: 24, prefix: "Mining crawlers risk obliterating fragile benthic ", suffix: "", answers: ["strata"] },
            { number: 25, prefix: "Suspended plumes could choke vulnerable ", suffix: "-feeding species.", answers: ["filter"] },
            { number: 26, prefix: "Scientific organizations advocate for an immediate precautionary ", suffix: "", answers: ["moratorium"] }
          ]
        }
      ]
    },
    {
      passageNumber: 3,
      title: "The Unselfish Gene",
      subtitle: "Rethinking the evolutionary biology of cooperation, altruism, and human nature",
      paragraphs: [
        { id: "P1", text: "For decades, popular interpretations of evolutionary biology have been dominated by the metaphor of the 'selfish gene'. In this view, organisms - including human beings - are fundamentally survival machines driven by ruthlessly self-interested competitive imperatives. Mutual aid was seen either as an illusion or merely as kin selection, strictly confined to genetic relatives." },
        { id: "P2", text: "However, a growing coalition of evolutionary anthropologists, primatologists, and game theorists argues that this grim paradigm is profoundly incomplete. Human evolutionary history was shaped not by solitary ruthless competition, but by obligate collaborative foraging. In prehistoric hunter-gatherer bands, survival was utterly contingent on sharing big-game meat, collaborative childcare, and mutual defence against predators." }
      ],
      groups: [
        {
          groupType: "yes_no_not_given",
          instructions: "Do the following statements agree with the claims of the writer? Write YES, NO, or NOT GIVEN.",
          numbers: [27, 28, 29, 30, 31, 32],
          items: [
            { number: 27, statement: "The metaphor of the selfish gene implies that all biological cooperation is driven by genetic self-interest.", answers: ["YES"] },
            { number: 28, statement: "Early human foragers survived predominantly as solitary hunters without group cooperation.", answers: ["NO"] },
            { number: 29, statement: "Collaborative childcare was a cornerstone of early human band survival.", answers: ["YES"] },
            { number: 30, statement: "Game theory experiments demonstrate that humans never punish unfair behaviour.", answers: ["NO"] },
            { number: 31, statement: "Chimpanzees exhibit identical levels of altruistic sharing as human hunter-gatherers.", answers: ["NOT GIVEN"] },
            { number: 32, statement: "Cultural group selection influenced the spread of egalitarian social norms.", answers: ["YES"] }
          ]
        },
        {
          groupType: "multiple_choice",
          instructions: "Choose the correct letter, A, B, C or D.",
          numbers: [33, 34, 35, 36],
          items: [
            { number: 33, question: "According to the passage, obligate collaborative foraging required early humans to", options: ["A. avoid consuming all animal protein", "B. cooperate closely in food sharing and predator defense", "C. abandon nomadic travel completely", "D. eliminate all leadership hierarchies"], answers: ["B"] },
            { number: 34, question: "What does experimental economics reveal about human participants in ultimatum games?", options: ["A. They consistently accept zero-sum payoffs", "B. They willingly sacrifice personal profit to penalize unfairness", "C. They always maximize immediate financial gain", "D. They refuse to play with strangers"], answers: ["B"] },
            { number: 35, question: "Prosocial emotions such as guilt, empathy, and moral outrage function to", options: ["A. weaken an individual's competitive edge", "B. police social contracts and sustain collective cohesion", "C. increase calorie expenditure during hunting", "D. confuse genetic relatives"], answers: ["B"] },
            { number: 36, question: "The writer concludes that human nature is best described as", options: ["A. irredeemably violent and selfish", "B. biologically primed for both competition and deep empathetic cooperation", "C. a blank slate with zero genetic predispositions", "D. entirely conditioned by digital media algorithms"], answers: ["B"] }
          ]
        },
        {
          groupType: "matching_features",
          instructions: "Match each evolutionary concept with its core premise.",
          numbers: [37, 38, 39, 40],
          items: [
            { number: 37, question: "Kin selection hypothesis", answers: ["A"] },
            { number: 38, question: "Obligate collaborative foraging", answers: ["C"] },
            { number: 39, question: "Altruistic punishment mechanism", answers: ["D"] },
            { number: 40, question: "Cultural group selection", answers: ["B"] }
          ]
        }
      ]
    }
  ]
};

