// Cambridge IELTS 16 Test 3 - Reading Passage 1
// Text, questions and answers checked against Cambridge 16.pdf (pages 61–64).

export const cambridge16Test3ReadingPassage1 = {
  passageNumber: 1,
  title: "Roman shipbuilding and navigation",
  paragraphs: [
    { id: "P1", text: "Shipbuilding today is based on science and ships are built using computers and sophisticated tools. Shipbuilding in ancient Rome, however, was more of an art relying on estimation, inherited techniques and personal experience. The Romans were not traditionally sailors but mostly land-based people, who learned to build ships from the people that they conquered, namely the Greeks and the Egyptians." },
    { id: "P2", text: "There are a few surviving written documents that give descriptions and representations of ancient Roman ships, including the sails and rigging. Excavated vessels also provide some clues about ancient shipbuilding techniques. Studies of these have taught us that ancient Roman shipbuilders built the outer hull first, then proceeded with the frame and the rest of the ship. Planks used to build the outer hull were initially sewn together. Starting from the 6th century BCE, they were fixed using a method called mortise and tenon, whereby one plank locked into another without the need for stitching. Then in the first centuries of the current era, Mediterranean shipbuilders shifted to another shipbuilding method, still in use today, which consisted of building the frame first and then proceeding with the hull and the other components of the ship. This method was more systematic and dramatically shortened ship construction times. The ancient Romans built large merchant ships and warships whose size and technology were unequalled until the 16th century CE." },
    { id: "P3", text: "Warships were built to be lightweight and very speedy. They had to be able to sail near the coast, which is why they had no ballast or excess load and were built with a long, narrow hull. They did not sink when damaged and often would lie crippled on the sea's surface following naval battles. They had a bronze battering ram, which was used to pierce the timber hulls or break the oars of enemy vessels. Warships used both wind (sails) and human power (oarsmen) and were therefore very fast. Eventually, Rome's navy became the largest and most powerful in the Mediterranean, and the Romans had control over what they therefore called Mare Nostrum meaning 'our sea'." },
    { id: "P4", text: "There were many kinds of warship. The 'trireme' was the dominant warship from the 7th to 4th century BCE. It had rowers in the top, middle and lower levels, and approximately 50 rowers in each bank. The rowers at the bottom had the most uncomfortable position as they were under the other rowers and were exposed to the water entering through the oar-holes. It is worth noting that contrary to popular perception, rowers were not slaves but mostly Roman citizens enrolled in the military. The trireme was superseded by larger ships with even more rowers." },
    { id: "P5", text: "Merchant ships were built to transport lots of cargo over long distances and at a reasonable cost. They had a wider hull, double planking and a solid interior for added stability. Unlike warships, their V-shaped hull was deep underwater, meaning that they could not sail too close to the coast. They usually had two huge side rudders located off the stern and controlled by a small tiller bar connected to a system of cables. They had from one to three masts with large square sails and a small triangular sail at the bow. Just like warships, merchant ships used oarsmen, but coordinating the hundreds of rowers in both types of ship was not an easy task. In order to assist them, music would be played on an instrument, and oars would then keep time with this." },
    { id: "P6", text: "The cargo on merchant ships included raw materials (e.g. iron bars, copper, marble and granite), and agricultural products (e.g. grain from Egypt's Nile valley). During the Empire, Rome was a huge city by ancient standards of about one million inhabitants. Goods from all over the world would come to the city through the port of Pozzuoli situated west of the bay of Naples in Italy and through the gigantic port of Ostia situated at the mouth of the Tiber River. Large merchant ships would approach the destination port and, just like today, be intercepted by a number of towboats that would drag them to the quay." },
    { id: "P7", text: "The time of travel along the many sailing routes could vary widely. Navigation in ancient Rome did not rely on sophisticated instruments such as compasses but on experience, local knowledge and observation of natural phenomena. In conditions of good visibility, seamen in the Mediterranean often had the mainland or islands in sight, which greatly facilitated navigation. They sailed by noting their position relative to a succession of recognisable landmarks. When weather conditions were not good or where land was no longer visible, Roman mariners estimated directions from the pole star or, with less accuracy, from the Sun at noon. They also estimated directions relative to the wind and swell. Overall, shipping in ancient Roman times resembled shipping today with large vessels regularly crossing the seas and bringing supplies from their Empire." }
  ],
  groups: [
    {
      groupType: "true_false_not_given",
      instructions: "Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–5 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      numbers: [1, 2, 3, 4, 5],
      items: [
        { number: 1, statement: "The Romans' shipbuilding skills were passed on to the Greeks and the Egyptians.", answers: ["FALSE"] },
        { number: 2, statement: "Skilled craftsmen were needed for the mortise and tenon method of fixing planks.", answers: ["NOT GIVEN"] },
        { number: 3, statement: "The later practice used by Mediterranean shipbuilders involved building the hull before the frame.", answers: ["FALSE"] },
        { number: 4, statement: "The Romans called the Mediterranean Sea Mare Nostrum because they dominated its use.", answers: ["TRUE"] },
        { number: 5, statement: "Most rowers on ships were people from the Roman army.", answers: ["TRUE"] }
      ]
    },
    {
      groupType: "summary_completion",
      instructions: "Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 6–13 on your answer sheet.",
      numbers: [6, 7, 8, 9, 10, 11, 12, 13],
      summary: {
        title: "Warships and merchant ships",
        paragraphs: [
          "Warships were designed so that they were {6} and moved quickly. They often remained afloat after battles and were able to sail close to land as they lacked any additional weight. A battering ram made of {7} was included in the design for attacking and damaging the timber and oars of enemy ships. Warships, such as the 'trireme', had rowers on three different {8}.",
          "Unlike warships, merchant ships had a broad {9} that lay far below the surface of the sea. Merchant ships were steered through the water with the help of large rudders and a tiller bar. They had both square and {10} sails. On merchant ships and warships, {11} was used to ensure rowers moved their oars in and out of the water at the same time.",
          "Quantities of agricultural goods such as {12} were transported by merchant ships to two main ports in Italy. The ships were pulled to the shore by {13}. When the weather was clear and they could see islands or land, sailors used landmarks that they knew to help them navigate their route."
        ]
      },
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
