// Cambridge IELTS 16 Test 3 - Reading Passage 1 Data
export const cambridge16Test3ReadingPassage1 = {
  passageNumber: 1,
  title: "Roman shipbuilding and navigation",
  paragraphs: [
    {
      id: "P1",
      text: "Shipbuilding today is based on science and ships are built using computers and sophisticated tools. Shipbuilding in ancient Rome, however, was more of an art relying on estimation, inherited techniques and personal experience. The Romans were not traditionally sailors but mostly land-based people, who learned to build ships from the people that they conquered, namely the Greeks and the Egyptians."
    },
    {
      id: "P2",
      text: "There are a few surviving written documents that give descriptions and representations of ancient Roman ships, including the sails and rigging. Excavated vessels also provide some clues about ancient shipbuilding techniques. Studies of these have taught us that ancient Roman shipbuilders built the outer hull first, then proceeded with the frame and the rest of the ship. Planks used to build the outer hull were initially sewn together. Starting from the 6th century BCE, they were fixed using a method called mortise and tenon, whereby one plank locked into another without the need for stitching. Then in the first centuries of the current era, Mediterranean shipbuilders shifted to another shipbuilding method, still in use today, which consisted of building the frame first and then proceeding with the hull and the other components of the ship. This method was more systematic and dramatically shortened ship construction time."
    },
    {
      id: "P3",
      text: "Ancient Roman ships were built for different purposes and can be broadly categorized into warships and merchant ships. Warships were designed so that they were lightweight and moved quickly. They often remained afloat after battles and were able to sail close to land as they lacked any additional weight such as ballast or cargo. They were built with long and narrow hulls, propelled by oars as well as sails, and equipped with a battering ram made of bronze at the bow, designed to pierce enemy hulls. Many warships had multiple levels of oarsmen, ranging from triremes with three rows to large quinqueremes."
    },
    {
      id: "P4",
      text: "Merchant ships were built to transport lots of cargo over long distances and at a reasonable cost. They had a wider hull, double planking and a solid interior for added stability. Unlike warships, their V-shaped hull was deep underwater, meaning that they could not sail too close to the coast. They usually had two huge side rudders located off the stern for steering. Merchant ships were mainly propelled by a large square sail on a main mast, often complemented by a smaller triangular sail called a supparum at the top, and a small bow sail called an artemon. To coordinate the rowers and keep morale high during long voyages, Roman ships employed musicians who played the flute or other instruments to keep the rhythm."
    },
    {
      id: "P5",
      text: "Rome's huge population required vast quantities of food supplies, particularly grain imported from Egypt and North Africa. When merchant ships arrived at the mouth of the River Tiber at Ostia or Portus, their cargo was transferred to smaller river vessels or towboats, which were pulled upstream along the Tiber by teams of oxen to reach the heart of Rome."
    }
  ],
  groups: [
    {
      groupType: "true_false_not_given",
      instructions: "Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–5 on your answer sheet, write:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      numbers: [1, 2, 3, 4, 5],
      items: [
        { number: 1, statement: "The Romans' shipbuilding skills were passed on to the Greeks and the Egyptians.", answers: ["FALSE"] },
        { number: 2, statement: "Skilled craftsmen were needed to make both rowed ships and merchant ships.", answers: ["NOT GIVEN"] },
        { number: 3, statement: "The Romans used ships on the River Tiber to transport merchandise into Rome.", answers: ["FALSE"] },
        { number: 4, statement: "The modern method of building ships in Europe is based on an ancient Roman approach.", answers: ["TRUE"] },
        { number: 5, statement: "The Romans built longer ships than modern shipbuilders.", answers: ["TRUE"] }
      ]
    },
    {
      groupType: "summary_completion",
      instructions: "Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 6–13 on your answer sheet.",
      title: "Warships and merchant ships",
      sections: [
        {
          heading: "Warships",
          lines: [
            { prefix: "Warships were designed so that they were ", number: 6, suffix: " and moved quickly." },
            { prefix: "They were equipped with a battering ram made of ", number: 7, suffix: " at the bow." },
            { prefix: "Many warships had multiple ", number: 8, suffix: " of oarsmen." },
            { prefix: "The ram was designed to pierce enemy ", number: 9, suffix: "." }
          ]
        },
        {
          heading: "Merchant ships",
          lines: [
            { prefix: "Merchant ships carried a smaller ", number: 10, suffix: " sail called a supparum." },
            { prefix: "Roman ships used ", number: 11, suffix: " to keep the rhythm for rowers." },
            { prefix: "Rome imported huge quantities of ", number: 12, suffix: " from overseas." },
            { prefix: "Goods were transferred to smaller vessels or ", number: 13, suffix: " to be pulled upstream to Rome." }
          ]
        }
      ],
      items: [
        { number: 6, answers: ["lightweight"] },
        { number: 7, answers: ["bronze"] },
        { number: 8, answers: ["levels"] },
        { number: 9, answers: ["hull"] },
        { number: 10, answers: ["triangular"] },
        { number: 11, answers: ["music"] },
        { number: 12, answers: ["grain"] },
        { number: 13, answers: ["towboats"] }
      ]
    }
  ]
};
