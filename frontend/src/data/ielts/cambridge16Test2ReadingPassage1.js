// Cambridge IELTS 16 Test 2 - Reading Passage 1 Data
export const cambridge16Test2ReadingPassage1 = {
  passageNumber: 1,
  title: "The White Horse of Uffington",
  paragraphs: [
    {
      id: "P1",
      text: "The cutting of huge figures or 'geoglyphs' into the earth of English hillsides has taken place for more than 3,000 years. There are 56 hill figures scattered around England, with the vast majority on the chalk downlands of the country's southern counties. The figures include giants, horses, crosses and regimental badges. Although the majority of these geoglyphs date within the last 300 years or so, there are one or two that are much older."
    },
    {
      id: "P2",
      text: "The most famous of these figures is perhaps also the most mysterious — the Uffington White Horse in Oxfordshire. The White Horse has recently been re-dated and shown to be even older than its previously assigned ancient pre-Roman Iron Age date. More controversial is the date of the enigmatic Long Man of Wilmington in Sussex. While many historians are convinced the figure is prehistoric, others believe that it was the work of an artistic monk from a nearby priory and was created between the 11th and 15th centuries."
    },
    {
      id: "P3",
      text: "The method of cutting these huge figures was simply to remove the overlying grass to reveal the gleaming white chalk below. However, the grass would soon grow over the geoglyph again unless it was regularly cleaned or scoured by a fairly large team of people. One reason that the vast majority of hill figures have disappeared is that when the traditions associated with the figures faded, people no longer bothered or remembered to clear away the grass to outline the horse or person. An alien visitor looking down on England would therefore only see a fraction of the geoglyphs that once existed. Furthermore, over the hundreds of years that horses and other figures were scoured, their shape changed, as the people scouring them occasionally altered the lines."
    },
    {
      id: "P4",
      text: "The Uffington White Horse is a unique, stylised representation of a horse consisting of a long, sleek back, thin disjointed legs, a streaming tail, and a bird-like beaked head. The elegant creature almost melts into the landscape. The horse is situated 2.5 km from Uffington village on a steep slope close to the Late Bronze Age (c. 7th century BCE) hillfort of Uffington Castle and below the Ridgeway, a long-distance Neolithic track."
    },
    {
      id: "P5",
      text: "The Uffington White Horse is also surrounded by bronze mounds or barrows, including one that covers a Neolithic chambered tomb, and near an Iron Age cemetery that has a number of burial mounds. The site is further enhanced by its proximity to Dragon Hill, a natural mound with a flat top, which according to local legend is the place where St George killed the dragon."
    },
    {
      id: "P6",
      text: "The earliest reference to a horse at Uffington is from the 1070s CE in documents from the cartulary of Abingdon Abbey, and the first reference to the horse itself is in 1190. However, the carving had always been considered to be pre-Roman in origin. Some thought it was a symbol of the Celtic goddess Epona, who was worshipped as a protector of horses, and was believed to have a personification of fertility. Others associated it with a local tribal leader or a military triumph. In addition, the style of the horse is similar to images of horses shown on coins from the period 100 BCE – 1 BCE."
    },
    {
      id: "P7",
      text: "In 1995, however, the Oxford Archaeological Unit carried out a major re-evaluation of the horse. Using a modern technique called Optically Stimulated Luminescence (OSL) testing on soil samples from beneath the horse's body, they revealed that it was constructed between 1400 and 600 BCE, placing it firmly in the Late Bronze Age or Early Iron Age, rather than the later Iron Age as previously thought."
    },
    {
      id: "P8",
      text: "The re-dating also sheds new light on the purpose of the White Horse. It is now believed to have been a tribal emblem to indicate land ownership, or formed part of an ancient ritual. Alternatively, it was a representation of goddess Epona — associated with protection of horses and fertility — or a representation of a Welsh goddess called Rhiannon. Whatever its original purpose, the Uffington White Horse remains an enduring monument to prehistoric British artistry."
    }
  ],
  groups: [
    {
      groupType: "true_false_not_given",
      instructions: "Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–8 on your answer sheet, write:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      numbers: [1, 2, 3, 4, 5, 6, 7, 8],
      items: [
        { number: 1, statement: "Most geoglyphs in England are located in a particular area of the country.", answers: ["TRUE"] },
        { number: 2, statement: "There are more geoglyphs in the shape of a horse than any other creature.", answers: ["NOT GIVEN"] },
        { number: 3, statement: "A recent dating of the Uffington White Horse indicates that people were mistaken about its age.", answers: ["TRUE"] },
        { number: 4, statement: "Historians have come to an agreement about the origins of the Long Man of Wilmington.", answers: ["FALSE"] },
        { number: 5, statement: "Geoglyphs were created by people placing white chalk on the hillside.", answers: ["FALSE"] },
        { number: 6, statement: "Many geoglyphs in England are no longer visible.", answers: ["TRUE"] },
        { number: 7, statement: "The shape of some geoglyphs has been altered over time.", answers: ["TRUE"] },
        { number: 8, statement: "The fame of the Uffington White Horse is due to its size.", answers: ["NOT GIVEN"] }
      ]
    },
    {
      groupType: "notes_completion",
      instructions: "Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 9–13 on your answer sheet.",
      title: "The Uffington White Horse",
      sections: [
        {
          heading: "The location of the Uffington White Horse",
          lines: [
            { text: "• a distance of 2.5 km from Uffington village" },
            { prefix: "• near an ancient road known as the ", number: 9, suffix: "" },
            { text: "• close to an ancient cemetery that has a number of burial mounds" }
          ]
        },
        {
          heading: "Dating the Uffington White Horse",
          lines: [
            { prefix: "• first reference to White Horse Hill appears in ", number: 10, suffix: " from the 1070s" },
            { text: "• horses shown on coins from the period 100 BCE – 1 BCE are similar in appearance" },
            { prefix: "• according to analysis of the surrounding ", number: 11, suffix: ", the Horse is Late Bronze Age / Early Iron Age" }
          ]
        },
        {
          heading: "Possible reasons for creation of the Uffington White Horse",
          lines: [
            { text: "• an emblem to indicate land ownership" },
            { text: "• formed part of an ancient ritual" },
            { prefix: "• was a representation of goddess Epona — associated with protection of horses and ", number: 12, suffix: "" },
            { prefix: "• was a representation of a Welsh goddess called ", number: 13, suffix: "" }
          ]
        }
      ],
      items: [
        { number: 9, answers: ["Ridgeway"] },
        { number: 10, answers: ["documents"] },
        { number: 11, answers: ["soil"] },
        { number: 12, answers: ["fertility"] },
        { number: 13, answers: ["Rhiannon"] }
      ]
    }
  ]
};
