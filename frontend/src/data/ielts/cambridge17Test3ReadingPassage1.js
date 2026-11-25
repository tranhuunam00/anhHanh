// Cambridge IELTS 17 Test 3 - Reading Passage 1
// Text, questions and answers checked against Cambridge 17.pdf (pages 59–62).

export const cambridge17Test3ReadingPassage1 = {
  passageNumber: 1,
  title: "The thylacine",
  paragraphs: [
    { id: "P1", text: "The extinct thylacine, also known as the Tasmanian tiger, was a marsupial* that bore a superficial resemblance to a dog. Its most distinguishing feature was the 13–19 dark brown stripes over its back, beginning at the rear of the body and extending onto the tail. The thylacine's average nose-to-tail length for adult males was 162.6 cm, compared to 153.7 cm for females." },
    { id: "P2", text: "The thylacine appeared to occupy most types of terrain except dense rainforest, with open eucalyptus forest thought to be its prime habitat. In terms of feeding, it was exclusively carnivorous, and its stomach was muscular with an ability to distend so that it could eat large amounts of food at one time, probably an adaptation to compensate for long periods when hunting was unsuccessful and food scarce. The thylacine was not a fast runner and probably caught its prey by exhausting it during a long pursuit. During long-distance chases, thylacines were likely to have relied more on scent than any other sense. They emerged to hunt during the evening, night and early morning and tended to retreat to the hills and forest for shelter during the day. Despite the common name 'tiger', the thylacine had a shy, nervous temperament. Although mainly nocturnal, it was sighted moving during the day and some individuals were even recorded basking in the sun." },
    { id: "P3", text: "The thylacine had an extended breeding season from winter to spring, with indications that some breeding took place throughout the year. The thylacine, like all marsupials, was tiny and hairless when born. Newborns crawled into the pouch on the belly of their mother, and attached themselves to one of the four teats, remaining there for up to three months. When old enough to leave the pouch, the young stayed in a lair such as a deep rocky cave, well-hidden nest or hollow log, whilst the mother hunted." },
    { id: "P4", text: "Approximately 4,000 years ago, the thylacine was widespread throughout New Guinea and most of mainland Australia, as well as the island of Tasmania. The most recent, well-dated occurrence of a thylacine on the mainland is a carbon-dated fossil from Murray Cave in Western Australia, which is around 3,100 years old. Its extinction coincided closely with the arrival of wild dogs called dingoes in Australia and a similar predator in New Guinea. Dingoes never reached Tasmania, and most scientists see this as the main reason for the thylacine's survival there. The dramatic decline of the thylacine in Tasmania, which began in the 1830s and continued for a century, is generally attributed to the relentless efforts of sheep farmers and bounty hunters** with shotguns. While this determined campaign undoubtedly played a large part, it is likely that various other factors also contributed to the decline and eventual extinction of the species. These include competition with wild dogs introduced by European settlers, loss of habitat along with the disappearance of prey species, and a distemper-like disease which may also have affected the thylacine." },
    { id: "P5", text: "There was only one successful attempt to breed a thylacine in captivity, at Melbourne Zoo in 1899. This was despite the large numbers that went through some zoos, particularly London Zoo and Tasmania's Hobart Zoo. The famous naturalist John Gould foresaw the thylacine's demise when he published his Mammals of Australia between 1848 and 1863, writing, 'The numbers of this singular animal will speedily diminish, extermination will have its full sway, and it will then, like the wolf of England and Scotland, be recorded as an animal of the past.'" },
    { id: "P6", text: "However, there seems to have been little public pressure to preserve the thylacine, nor was much concern expressed by scientists at the decline of this species in the decades that followed. A notable exception was T.T. Flynn, Professor of Biology at the University of Tasmania. In 1914, he was sufficiently concerned about the scarcity of the thylacine to suggest that some should be captured and placed on a small island. But it was not until 1929, with the species on the very edge of extinction, that Tasmania's Animals and Birds Protection Board passed a motion protecting thylacines only for the month of December, which was thought to be their prime breeding season. The last known wild thylacine to be killed was shot by a farmer in the north-east ofTasmania in 1930, leaving just captive specimens. Official protection of the species by the Tasmanian government was introduced in July 1936, 59 days before the last known individual died in Hobart Zoo on 7th September, 1936." },
    { id: "P7", text: "There have been numerous expeditions and searches for the thylacine over the years, none of which has produced definitive evidence that thylacines still exist. The species was declared extinct by the Tasmanian government in 1986." }
  ],
  footnotes: [
    "* marsupial: a mammal, such as a kangaroo, whose young are born incompletely developed and are typically carried and suckled in a pouch on the mother's belly",
    "** bounty hunters: people who are paid a reward for killing a wild animal"
  ],
  groups: [
    {
      groupType: "notes_completion",
      instructions: "Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–5 on your answer sheet.",
      numbers: [1, 2, 3, 4, 5],
      notes: {
        title: "The thylacine",
        sections: [
          {
            heading: "Appearance and behaviour",
            lines: [
              "• looked rather like a dog",
              "• had a series of stripes along its body and tail",
              "• ate an entirely {1} diet",
              "• probably depended mainly on {2} when hunting",
              "• young spent first months of life inside its mother's {3}"
            ]
          },
          {
            heading: "Decline and extinction",
            lines: [
              "• last evidence in mainland Australia is a 3,100-year-old {4}",
              "• probably went extinct in mainland Australia due to animals known as dingoes",
              "• reduction in {5} and available sources of food were partly responsible for decline in Tasmania"
            ]
          }
        ]
      },
      items: [
        { number: 1, answers: ["carnivorous"] },
        { number: 2, answers: ["scent"] },
        { number: 3, answers: ["pouch"] },
        { number: 4, answers: ["fossil"] },
        { number: 5, answers: ["habitat"] }
      ]
    },
    {
      groupType: "true_false_not_given",
      instructions: "Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 6–13 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      numbers: [6, 7, 8, 9, 10, 11, 12, 13],
      items: [
        { number: 6, statement: "Significant numbers of thylacines were killed by humans from the 1830s onwards.", answers: ["TRUE"] },
        { number: 7, statement: "Several thylacines were born in zoos during the late 1800s.", answers: ["FALSE"] },
        { number: 8, statement: "John Gould's prediction about the thylacine surprised some biologists.", answers: ["NOT GIVEN"] },
        { number: 9, statement: "In the early 1900s, many scientists became worried about the possible extinction of the thylacine.", answers: ["FALSE"] },
        { number: 10, statement: "T. T. Flynn's proposal to rehome captive thylacines on an island proved to be impractical.", answers: ["NOT GIVEN"] },
        { number: 11, statement: "There were still reasonable numbers of thylacines in existence when a piece of legislation protecting the species during their breeding season was passed.", answers: ["FALSE"] },
        { number: 12, statement: "From 1930 to 1936, the only known living thylacines were all in captivity.", answers: ["TRUE"] },
        { number: 13, statement: "Attempts to find living thylacines are now rarely made.", answers: ["NOT GIVEN"] }
      ]
    }
  ]
};
