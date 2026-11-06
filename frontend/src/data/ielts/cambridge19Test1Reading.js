// Cambridge IELTS 19 Test 1 - Reading Module Data
export const cambridge19Test1Reading = {
  testId: "cambridge-19-test-1",
  title: "Cambridge IELTS 19 - Test 1 - Reading",
  passages: [
    {
      passageNumber: 1,
      title: "How tennis rackets have changed",
      subtitle: "The evolution of materials and engineering in modern tennis",
      paragraphs: [
        { id: "P1", text: "In 1874, Major Walter Wingfield patented the game of lawn tennis in Great Britain. The original rackets were fashioned entirely from solid wood, primarily ash or hickory, and strung with natural gut. These early implements were heavy and had exceptionally small heads, usually less than 65 square inches. Players required considerable wrist strength to maneuver them, and off-centre hits produced harsh vibrations that caused frequent injuries." },
        { id: "P2", text: "The introduction of laminated wood in the 1930s allowed manufacturers to create stronger, lighter frames by bonding thin strips of wood under heat and pressure. However, it was not until the late 1960s that the real revolution began. In 1967, Wilson introduced the T2000, a tubular steel racket popularized by Jimmy Connors. Metal frames offered greater durability, but they were still stiff and transmitted substantial shock to the player's arm." },
        { id: "P3", text: "The major breakthrough arrived in the mid-1970s with the invention of the oversized racket by Howard Head, an aerospace engineer. By utilizing lightweight aluminum and later carbon-fibre composites, Head enlarged the racket head to 100 square inches or more. This expanded the sweet spot - the area of the string bed that delivers maximum power with minimal vibration - making the game far more forgiving for beginners." },
        { id: "P4", text: "Today, elite tennis rackets are masterpieces of high-tech materials science. Modern frames combine ultra-high modulus graphite, Kevlar, and nanotechnology-enhanced polymers. These materials allow engineers to tune frame stiffness and flexibility precisely, maximizing ball speed while protecting athletes from repetitive strain injuries like tennis elbow." }
      ],
      groups: [
        {
          groupType: "true_false_not_given",
          instructions: "Do the following statements agree with the information given in Reading Passage 1?\nWrite TRUE, FALSE, or NOT GIVEN.",
          numbers: [1, 2, 3, 4, 5, 6],
          items: [
            { number: 1, statement: "The earliest tennis rackets were manufactured from single blocks of wood.", answers: ["TRUE"] },
            { number: 2, statement: "Laminated wood rackets were cheaper to produce than solid wood ones.", answers: ["NOT GIVEN"] },
            { number: 3, statement: "Steel rackets eliminated the problem of shock transmission to players' arms.", answers: ["FALSE"] },
            { number: 4, statement: "Howard Head had previously worked in the aircraft design industry.", answers: ["TRUE"] },
            { number: 5, statement: "Oversized racket heads reduced the effective size of the sweet spot.", answers: ["FALSE"] },
            { number: 6, statement: "Contemporary professional rackets frequently incorporate advanced nanomaterials.", answers: ["TRUE"] }
          ]
        },
        {
          groupType: "fill_notes",
          instructions: "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.",
          numbers: [7, 8, 9, 10, 11, 12, 13],
          items: [
            { number: 7, prefix: "Natural ", suffix: " was originally used for strings.", answers: ["gut"] },
            { number: 8, prefix: "Laminated frames bonded strips using heat and ", suffix: "", answers: ["pressure"] },
            { number: 9, prefix: "The metal racket was widely popularized by Jimmy ", suffix: "", answers: ["Connors", "connors"] },
            { number: 10, prefix: "Oversized frames were initially made possible with ", suffix: "", answers: ["aluminum", "aluminium"] },
            { number: 11, prefix: "The area delivering optimal power is known as the ", suffix: " spot", answers: ["sweet"] },
            { number: 12, prefix: "Modern engineers adjust frame ", suffix: " and flexibility.", answers: ["stiffness"] },
            { number: 13, prefix: "Athletes are shielded against tennis ", suffix: " injury.", answers: ["elbow"] }
          ]
        }
      ]
    },
    {
      passageNumber: 2,
      title: "The pirates of the ancient Mediterranean",
      subtitle: "Maritime raiders and the geopolitical struggle of antiquity",
      paragraphs: [
        { id: "P1", text: "Piracy has troubled maritime trade routes since humanity first took to the open seas. In the ancient Mediterranean, the rugged coastlines of Cilicia, Illyria, and Crete provided ideal hideouts for sea raiders. Fast galleys known as hemiolia could dart out from hidden coves, overpower merchant vessels laden with olive oil, wine, and grain, and retreat into labyrinthine bays before navies could respond." },
        { id: "P2", text: "By the second century BCE, pirate bands had organized into formidable nautical confederations. Cilician pirates boasted hundreds of ships, maintained fortified havens with signal towers, and terrorized coastal settlements. They did not merely plunder goods; their most lucrative trade was human captives, who were sold into the ravenous slave markets of the Roman Republic, particularly on the Aegean island of Delos." },
        { id: "P3", text: "Rome initially tolerated piracy because it provided a steady influx of enslaved labour essential for expanding Italian estates. However, when pirates disrupted the vital grain supply to the capital and even kidnapped high-ranking Roman officials - including the young Julius Caesar in 75 BCE - the Senate was forced to take decisive action." },
        { id: "P4", text: "In 67 BCE, the Roman Tribune Gabinius proposed unprecedented emergency powers for Pompey the Great. The Lex Gabinia granted Pompey supreme command across the entire Mediterranean basin and up to fifty miles inland. Dividing the sea into thirteen operational zones with dedicated subordinate commanders, Pompey systematically swept the Mediterranean in just three months, clearing the seas and establishing Roman naval hegemony." }
      ],
      groups: [
        {
          groupType: "matching_headings",
          instructions: "Choose the correct heading for each paragraph from the list of headings below.",
          numbers: [14, 15, 16, 17],
          items: [
            { number: 14, question: "Paragraph 1 (Geographical advantages of ancient raiders)", answers: ["iv"] },
            { number: 15, question: "Paragraph 2 (The rise of organized slave raiding networks)", answers: ["vi"] },
            { number: 16, question: "Paragraph 3 (The shifting Roman attitude toward piracy)", answers: ["ii"] },
            { number: 17, question: "Paragraph 4 (Pompey's swift naval campaign and tactical division)", answers: ["vii"] }
          ]
        },
        {
          groupType: "multiple_choice",
          instructions: "Choose the correct letter, A, B, C or D.",
          numbers: [18, 19, 20, 21, 22],
          items: [
            { number: 18, question: "Why were hemiolia galleys particularly effective?", options: ["A. They carried heavy catapults", "B. They were fast and easily concealed", "C. They operated under official state flags", "D. They could survive deep oceanic storms"], answers: ["B"] },
            { number: 19, question: "Where was the principal slave market in the Aegean located?", options: ["A. Crete", "B. Cilicia", "C. Delos", "D. Rome"], answers: ["C"] },
            { number: 20, question: "What prominent Roman leader was kidnapped by Cilician pirates?", options: ["A. Julius Caesar", "B. Pompey the Great", "C. Gabinius", "D. Walter Wingfield"], answers: ["A"] },
            { number: 21, question: "The Lex Gabinia authorized Pompey to operate within how many miles inland?", options: ["A. 13 miles", "B. 50 miles", "C. 67 miles", "D. 75 miles"], answers: ["B"] },
            { number: 22, question: "How long did Pompey's campaign take to complete?", options: ["A. Three weeks", "B. Three months", "C. Three years", "D. Five years"], answers: ["B"] }
          ]
        },
        {
          groupType: "summary_completion",
          instructions: "Complete the summary below using words from the passage.",
          numbers: [23, 24, 25, 26],
          items: [
            { number: 23, prefix: "Pirates posed a direct danger to Rome by threatening the capital's ", suffix: " supply.", answers: ["grain"] },
            { number: 24, prefix: "Pompey divided the maritime theatre into ", suffix: " sectors.", answers: ["thirteen", "13"] },
            { number: 25, prefix: "Coastal havens were fortified with ", suffix: " towers.", answers: ["signal"] },
            { number: 26, prefix: "The campaign firmly established Roman ", suffix: " over the sea.", answers: ["hegemony"] }
          ]
        }
      ]
    },
    {
      passageNumber: 3,
      title: "The persistence and peril of misinformation",
      subtitle: "Cognitive biases and the challenge of debunking false beliefs",
      paragraphs: [
        { id: "P1", text: "Why do false beliefs linger in the human mind long after they have been thoroughly debunked? Psychological research has revealed the 'continued influence effect' - a phenomenon whereby retracted information continues to shape reasoning and inferences. When people construct mental models of complex events, they prefer a coherent narrative containing false details over an incomplete model with unanswered gaps." },
        { id: "P2", text: "Confirmation bias further cements inaccurate impressions. Individuals instinctively gravitate toward reports that corroborate preexisting ideological stances while aggressively scrutinizing or dismissing contradictory evidence. On contemporary digital platforms, automated recommendation algorithms capitalize on this cognitive vulnerability by creating 'echo chambers' that amplify sensationalist falsehoods." },
        { id: "P3", text: "Merely repeating a myth in order to refute it can unintentionally backfire through the 'familiarity heuristic'. The human brain often misinterprets ease of processing as truth; thus, hearing a myth reiterated makes it feel familiar and ironically more believable. Effective debunking requires offering a plausible alternative explanation that fills the narrative void left when false assertions are excised." }
      ],
      groups: [
        {
          groupType: "multiple_choice",
          instructions: "Choose the correct letter, A, B, C or D.",
          numbers: [27, 28, 29, 30],
          items: [
            { number: 27, question: "The continued influence effect occurs primarily because humans", options: ["A. lack basic logical comprehension skills", "B. prefer complete narratives over disjointed accounts", "C. deliberately reject empirical evidence", "D. cannot recall where they encountered claims"], answers: ["B"] },
            { number: 28, question: "Online recommendation algorithms exacerbate misinformation by", options: ["A. censoring verified scientific journals", "B. creating insular information bubbles", "C. slowing down internet transmission speeds", "D. charging users for access to fact-checking tools"], answers: ["B"] },
            { number: 29, question: "Why can refuting a myth sometimes strengthen belief in it?", options: ["A. Repetition increases cognitive familiarity", "B. Audiences distrust all fact-checkers", "C. Retractions are typically poorly written", "D. The alternative narrative is always too complex"], answers: ["A"] },
            { number: 30, question: "What is an indispensable component of successful debunking?", options: ["A. Mocking the originators of false claims", "B. Supplying a viable alternative explanation", "C. Deleting all social media accounts", "D. Repeating the myth multiple times"], answers: ["B"] }
          ]
        },
        {
          groupType: "yes_no_not_given",
          instructions: "Do the following statements agree with the views of the writer? Write YES, NO, or NOT GIVEN.",
          numbers: [31, 32, 33, 34, 35],
          items: [
            { number: 31, statement: "Confirmation bias affects all individuals regardless of their political convictions.", answers: ["YES"] },
            { number: 32, statement: "Recommendation algorithms prioritize factual accuracy over user engagement.", answers: ["NO"] },
            { number: 33, statement: "The familiarity heuristic causes people to equate ease of recall with veracity.", answers: ["YES"] },
            { number: 34, statement: "Older demographics are substantially more prone to digital echo chambers.", answers: ["NOT GIVEN"] },
            { number: 35, statement: "A narrative void is naturally accepted without psychological resistance.", answers: ["NO"] }
          ]
        },
        {
          groupType: "matching_features",
          instructions: "Match each psychological phenomenon with its defining characteristic.",
          numbers: [36, 37, 38, 39, 40],
          items: [
            { number: 36, question: "Continued influence effect", answers: ["C"] },
            { number: 37, question: "Confirmation bias", answers: ["A"] },
            { number: 38, question: "Echo chamber phenomenon", answers: ["E"] },
            { number: 39, question: "Familiarity heuristic", answers: ["B"] },
            { number: 40, question: "Alternative narrative replacement", answers: ["D"] }
          ]
        }
      ]
    }
  ]
};

