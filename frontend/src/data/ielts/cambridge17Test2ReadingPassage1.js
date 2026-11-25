// Cambridge IELTS 17 Test 2 - Reading Passage 1
// Text, questions and answers checked against Cambridge 17.pdf (pages 37–40).

export const cambridge17Test2ReadingPassage1 = {
  passageNumber: 1,
  title: "The Dead Sea Scrolls",
  paragraphs: [
    { id: "P1", text: "In late 1946 or early 1947, three Bedouin teenagers were tending their goats and sheep near the ancient settlement of Qumran, located on the northwest shore of the Dead Sea in what is now known as the West Bank. One of these young shepherds tossed a rock into an opening on the side of a cliff and was surprised to hear a shattering sound. He and his companions later entered the cave and stumbled across a collection of large clay jars, seven of which contained scrolls with writing on them. The teenagers took the seven scrolls to a nearby town where they were sold for a small sum to a local antiquities dealer. Word of the find spread, and Bedouins and archaeologists eventually unearthed tens of thousands of additional scroll fragments from 10 nearby caves; together they make up between 800 and 900 manuscripts. It soon became clear that this was one of the greatest archaeological discoveries ever made." },
    { id: "P2", text: "The origin of the Dead Sea Scrolls, which were written around 2,000 years ago between 150 BCE and 70 CE, is still the subject of scholarly debate even today. According to the prevailing theory, they are the work of a population that inhabited the area until Roman troops destroyed the settlement around 70 CE. The area was known as Judea at that time, and the people are thought to have belonged to a group called the Essenes, a devout Jewish sect." },
    { id: "P3", text: "The majority of the texts on the Dead Sea Scrolls are in Hebrew, with some fragments written in an ancient version of its alphabet thought to have fallen out of use in the fifth century BCE. But there are other languages as well. Some scrolls are in Aramaic, the language spoken by many inhabitants of the region from the sixth century BCE to the siege of Jerusalem in 70 CE. In addition, several texts feature translations of the Hebrew Bible into Greek." },
    { id: "P4", text: "The Dead Sea Scrolls include fragments from every book of the Old Testament of the Bible except for the Book of Esther. The only entire book of the Hebrew Bible preserved among the manuscripts from Qumran is Isaiah; this copy, dated to the first century BCE, is considered the earliest biblical manuscript still in existence. Along with biblical texts, the scrolls include documents about sectarian regulations and religious writings that do not appear in the Old Testament." },
    { id: "P5", text: "The writing on the Dead Sea Scrolls is mostly in black or occasionally red ink, and the scrolls themselves are nearly all made of either parchment (animal skin) or an early form of paper called 'papyrus'. The only exception is the scroll numbered 3Q15, which was created out of a combination of copper and tin. Known as the Copper Scroll, this curious document features letters chiselled onto metal – perhaps, as some have theorized, to better withstand the passage of time. One of the most intriguing manuscripts from Qumran, this is a sort of ancient treasure map that lists dozens of gold and silver caches. Using an unconventional vocabulary and odd spelling, it describes 64 underground hiding places that supposedly contain riches buried for safekeeping. None of these hoards have been recovered, possibly because the Romans pillaged Judea during the first century CE. According to various hypotheses, the treasure belonged to local people, or was rescued from the Second Temple before its destruction or never existed to begin with." },
    { id: "P6", text: "Some of the Dead Sea Scrolls have been on interesting journeys. In 1948, a Syrian Orthodox archbishop known as Mar Samuel acquired four of the original seven scrolls from a Jerusalem shoemaker and part-time antiquity dealer, paying less than $100 for them. He then travelled to the United States and unsuccessfully offered them to a number of universities, including Yale. Finally, in 1954, he placed an advertisement in the business newspaper The Wall Street Journal – under the category 'Miscellaneous Items for Sale' – that read: 'Biblical Manuscripts dating back to at least 200 B.C. are for sale. This would be an ideal gift to an educational or religious institution by an individual or group.' Fortunately, Israeli archaeologist and statesman Yigael Yadin negotiated their purchase and brought the scrolls back to Jerusalem, where they remain to this day." },
    { id: "P7", text: "In 2017, researchers from the University of Haifa restored and deciphered one of the last untranslated scrolls. The university's Eshbal Ratson and Jonathan Ben-Dov spent one year reassembling the 60 fragments that make up the scroll. Deciphered from a band of coded text on parchment, the find provides insight into the community of people who wrote it and the 364-day calendar they would have used. The scroll names celebrations that indicate shifts in seasons and details two yearly religious events known from another Dead Sea Scroll. Only one more known scroll remains untranslated." }
  ],
  groups: [
    {
      groupType: "notes_completion",
      instructions: "Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–5 on your answer sheet.",
      numbers: [1, 2, 3, 4, 5],
      notes: {
        title: "The Dead Sea Scrolls",
        sections: [
          {
            heading: "Discovery",
            lines: [
              "Qumran, 1946/7",
              "• three Bedouin shepherds in their teens were near an opening on side of cliff",
              "• heard a noise of breaking when one teenager threw a {1}",
              "• teenagers went into the {2} and found a number of containers made of {3}"
            ]
          },
          {
            heading: "The scrolls",
            lines: [
              "• date from between 150 BCE and 70 CE",
              "• thought to have been written by group of people known as the {4}",
              "• written mainly in the {5} language",
              "• most are on religious topics, written using ink on parchment or papyrus"
            ]
          }
        ]
      },
      items: [
        { number: 1, answers: ["rock"] },
        { number: 2, answers: ["cave"] },
        { number: 3, answers: ["clay"] },
        { number: 4, answers: ["Essenes"] },
        { number: 5, answers: ["Hebrew"] }
      ]
    },
    {
      groupType: "true_false_not_given",
      instructions: "Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 6–13 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      numbers: [6, 7, 8, 9, 10, 11, 12, 13],
      items: [
        { number: 6, statement: "The Bedouin teenagers who found the scrolls were disappointed by how little money they received for them.", answers: ["NOT GIVEN"] },
        { number: 7, statement: "There is agreement among academics about the origin of the Dead Sea Scrolls.", answers: ["FALSE"] },
        { number: 8, statement: "Most of the books of the Bible written on the scrolls are incomplete.", answers: ["TRUE"] },
        { number: 9, statement: "The information on the Copper Scroll is written in an unusual way.", answers: ["TRUE"] },
        { number: 10, statement: "Mar Samuel was given some of the scrolls as a gift.", answers: ["FALSE"] },
        { number: 11, statement: "In the early 1950s, a number of educational establishments in the US were keen to buy scrolls from Mar Samuel.", answers: ["FALSE"] },
        { number: 12, statement: "The scroll that was pieced together in 2017 contains information about annual occasions in the Qumran area 2,000 years ago.", answers: ["TRUE"] },
        { number: 13, statement: "Academics at the University of Haifa are currently researching how to decipher the final scroll.", answers: ["NOT GIVEN"] }
      ]
    }
  ]
};
