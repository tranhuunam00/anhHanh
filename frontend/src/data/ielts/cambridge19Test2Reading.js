// Cambridge IELTS 19 Test 2 - Reading Module Data
export const cambridge19Test2Reading = {
  testId: "cambridge-19-test-2",
  title: "Cambridge IELTS 19 - Test 2 - Reading",
  passages: [
    {
      passageNumber: 1,
      title: "The Industrial Revolution in Britain",
      subtitle: "Why did the world's first great transformation occur in eighteenth-century Britain?",
      paragraphs: [
        { id: "P1", text: "The Industrial Revolution began in Great Britain in the mid-18th century and fundamentally altered human society. Prior to this transformation, manufacturing was artisan-based and powered by human muscle, draught animals, water mills, or wind. The breakthrough came with the convergence of abundant coal deposits, steam power innovations, and advanced iron metallurgy." },
        { id: "P2", text: "Geography gave Britain unique natural advantages. As an island nation with navigable rivers and extensive coastlines, transport costs for heavy bulk commodities like coal and iron ore were far lower than on the European continent. Furthermore, the development of an extensive turnpike road network and an intricate canal system during the 1760s and 1770s created a frictionless domestic market." },
        { id: "P3", text: "Institutional factors were equally vital. Britain enjoyed political stability under parliamentary rule, secure property rights, and an independent judiciary. A well-capitalized banking system centred on the Bank of England provided cheap credit for adventurous entrepreneurs, while the patent system legally protected technical innovations." }
      ],
      groups: [
        {
          groupType: "true_false_not_given",
          instructions: "Do the following statements agree with the information in Reading Passage 1?\nWrite TRUE, FALSE, or NOT GIVEN.",
          numbers: [1, 2, 3, 4, 5, 6],
          items: [
            { number: 1, statement: "Before the Industrial Revolution, water wheels provided power for some industrial production.", answers: ["TRUE"] },
            { number: 2, statement: "Britain had to import the majority of its coal from continental Europe.", answers: ["FALSE"] },
            { number: 3, statement: "Water transport was cheaper than land transport for moving bulky goods in 18th-century Britain.", answers: ["TRUE"] },
            { number: 4, statement: "Canal construction in Britain received heavy subsidies from the royal monarchy.", answers: ["NOT GIVEN"] },
            { number: 5, statement: "The Bank of England restricted commercial loans exclusively to agriculture.", answers: ["FALSE"] },
            { number: 6, statement: "British inventors benefited from legal protection for their original designs.", answers: ["TRUE"] }
          ]
        },
        {
          groupType: "fill_notes",
          instructions: "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.",
          numbers: [7, 8, 9, 10, 11, 12, 13],
          items: [
            { number: 7, prefix: "Traditional manufacturing was largely ", suffix: "-based.", answers: ["artisan"] },
            { number: 8, prefix: "Crucial raw material: extensive deposits of ", suffix: "", answers: ["coal"] },
            { number: 9, prefix: "Canal boom occurred during the ", suffix: " and 1770s.", answers: ["1760s"] },
            { number: 10, prefix: "Network of improved roads known as ", suffix: " roads.", answers: ["turnpike"] },
            { number: 11, prefix: "Parliamentary governance assured political ", suffix: "", answers: ["stability"] },
            { number: 12, prefix: "Entrepreneurs had access to low-cost ", suffix: " from banks.", answers: ["credit"] },
            { number: 13, prefix: "The legal framework included an established ", suffix: " system.", answers: ["patent"] }
          ]
        }
      ]
    },
    {
      passageNumber: 2,
      title: "Athletes and stress",
      subtitle: "The cognitive and physiological dimensions of peak sporting performance",
      paragraphs: [
        { id: "P1", text: "In high-stakes sports competitions, elite athletes frequently experience acute psychological stress. While moderate arousal sharpens focus and accelerates reaction times - a state known as the optimal zone of functioning - excessive pressure can precipitate 'choking under pressure', where automated motor skills disintegrate under conscious over-monitoring." },
        { id: "P2", text: "Physiologically, stress triggers the sympathetic nervous system, releasing cortisol and adrenaline. Heart rate spikes, peripheral vision narrows into 'tunnel vision', and muscle tension increases. Sports psychologists emphasize cognitive reframing: interpreting physiological arousal as excitement rather than debilitating anxiety enables competitors to channel energy constructively." }
      ],
      groups: [
        {
          groupType: "multiple_choice",
          instructions: "Choose the correct letter, A, B, C or D.",
          numbers: [14, 15, 16, 17, 18],
          items: [
            { number: 14, question: "What is 'choking under pressure' characterized by?", options: ["A. Total muscle paralysis", "B. Conscious interference with automated motor skills", "C. Deliberate underperformance", "D. Inability to hear crowd noise"], answers: ["B"] },
            { number: 15, question: "Moderate arousal in sports helps by", options: ["A. eliminating all pain perception", "B. sharpening concentration and reaction speed", "C. reducing oxygen consumption", "D. slowing heart rate to resting levels"], answers: ["B"] },
            { number: 16, question: "Which hormone is released during acute athletic stress?", options: ["A. Melatonin", "B. Cortisol", "C. Insulin", "D. Estrogen"], answers: ["B"] },
            { number: 17, question: "What visual distortion frequently accompanies acute competitive stress?", options: ["A. Double vision", "B. Tunnel vision", "C. Colour blindness", "D. Photophobia"], answers: ["B"] },
            { number: 18, question: "Cognitive reframing encourages athletes to", options: ["A. ignore all physiological signals", "B. view bodily arousal as positive excitement", "C. take sedative medication before events", "D. visualize competing against easier opponents"], answers: ["B"] }
          ]
        },
        {
          groupType: "summary_completion",
          instructions: "Complete the summary using words from the passage.",
          numbers: [19, 20, 21, 22, 23, 24, 25, 26],
          items: [
            { number: 19, prefix: "Athletes perform best within an ", suffix: " zone of functioning.", answers: ["optimal"] },
            { number: 20, prefix: "Over-monitoring disrupts ", suffix: " motor execution.", answers: ["automated"] },
            { number: 21, prefix: "Stress stimulates the ", suffix: " nervous system.", answers: ["sympathetic"] },
            { number: 22, prefix: "Along with cortisol, ", suffix: " is secreted.", answers: ["adrenaline"] },
            { number: 23, prefix: "Physical signs include increased muscle ", suffix: "", answers: ["tension"] },
            { number: 24, prefix: "Athletes can employ cognitive ", suffix: " to alter their mindset.", answers: ["reframing"] },
            { number: 25, prefix: "Arousal is reinterpreted as positive ", suffix: "", answers: ["excitement"] },
            { number: 26, prefix: "Constructive focus prevents performance ", suffix: "", answers: ["choking"] }
          ]
        }
      ]
    },
    {
      passageNumber: 3,
      title: "An inquiry into the existence of the gifted child",
      subtitle: "Debating the nature of exceptional talent and environmental cultivation",
      paragraphs: [
        { id: "P1", text: "For over a century, educational theorists and psychologists have fiercely debated the nature of exceptional intellectual ability in children. Is 'giftedness' an innate biological endowment, or is it predominantly the product of intensive early coaching, socioeconomic privilege, and deliberate practice?" },
        { id: "P2", text: "Traditional psychometrics relied heavily on IQ tests to identify prodigies. However, critics point out that standard cognitive batteries test narrow logical and linguistic faculties, entirely neglecting creative, social, and emotional domains. Furthermore, longitudinal studies reveal that many high-IQ children fail to achieve remarkable creative eminence as adults." }
      ],
      groups: [
        {
          groupType: "yes_no_not_given",
          instructions: "Do the following statements agree with the claims of the writer? Write YES, NO, or NOT GIVEN.",
          numbers: [27, 28, 29, 30, 31, 32],
          items: [
            { number: 27, statement: "Psychologists have reached a unanimous consensus regarding the definition of giftedness.", answers: ["NO"] },
            { number: 28, statement: "Early childhood environments significantly influence cognitive development.", answers: ["YES"] },
            { number: 29, statement: "Standard IQ tests provide a comprehensive assessment of artistic creativity.", answers: ["NO"] },
            { number: 30, statement: "Every child with an exceptional IQ achieves prominent career success in adulthood.", answers: ["NO"] },
            { number: 31, statement: "Musical prodigies require fewer hours of deliberate practice than average students.", answers: ["NOT GIVEN"] },
            { number: 32, statement: "Longitudinal research tracks developmental outcomes over extensive timeframes.", answers: ["YES"] }
          ]
        },
        {
          groupType: "matching_features",
          instructions: "Match each perspective with the correct educational theory.",
          numbers: [33, 34, 35, 36, 37, 38, 39, 40],
          items: [
            { number: 33, question: "Nativist viewpoint on inherited talent", answers: ["A"] },
            { number: 34, question: "Deliberate practice theory (Ericsson)", answers: ["B"] },
            { number: 35, question: "Multiple intelligences model (Gardner)", answers: ["C"] },
            { number: 36, question: "Psychometric IQ testing tradition", answers: ["D"] },
            { number: 37, question: "Environmental nurture and scaffolding", answers: ["B"] },
            { number: 38, question: "Domain-specific prodigy emergence", answers: ["C"] },
            { number: 39, question: "Longitudinal achievement tracking", answers: ["E"] },
            { number: 40, question: "Growth mindset cultivation (Dweck)", answers: ["F"] }
          ]
        }
      ]
    }
  ]
};

