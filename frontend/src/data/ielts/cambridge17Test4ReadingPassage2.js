// Cambridge IELTS 17 Test 4 - Reading Passage 2 Data
export const cambridge17Test4ReadingPassage2 = {
  passageNumber: 2,
  title: "Does education fuel economic growth?",
  paragraphs: [
    {
      id: "A",
      text: "For generations, international development agencies, policymakers, and mainstream economists have treated education as the undisputed golden key to national prosperity. The conventional wisdom is straightforward: invest aggressively in schooling, expand university enrollments, and an educated workforce will inevitably drive higher economic productivity, technological innovation, and rising national income."
    },
    {
      id: "B",
      text: "Yet when economic historians scrutinize empirical historical records, this neat, intuitive narrative rapidly unravels. Consider Great Britain, the birthplace of the Industrial Revolution. In the late 18th and early 19th centuries, Britain was arguably the most technologically inventive and economically dynamic society on Earth, yet its formal educational system was notoriously rudimentary and literacy rates lagged behind those of continental competitors like France and Prussia."
    },
    {
      id: "C",
      text: "Remarkable historical evidence from 16th- and 17th-century Switzerland tells a similar cautionary tale. During the Protestant Reformation, church authorities in Zurich mandated universal primary schooling so that all parish descendants could read scripture and follow the weekly sermon. Parents who failed to send children to class faced a stiff financial fine. Yet despite achieving near-total universal literacy centuries before its neighbors, Switzerland remained an impoverished agricultural land until late industrialisation."
    },
    {
      id: "D",
      text: "Modern cross-country statistical studies further complicate the equation. Economic historian Professor Lant Pritchett analyzed data from dozens of developing nations from 1960 to 2000. While educational attainment skyrocketed globally, economic growth in many sub-Saharan African and Latin American countries stagnated or declined. Merely multiplying school years without functional institutional quality, property rights, and competitive market demand produces educated unemployment rather than economic dynamism."
    },
    {
      id: "E",
      text: "This does not mean education is devoid of economic value, but rather that schooling operates as a facilitating condition rather than an autonomous growth engine. What truly drives economic transformation is technological innovation and institutional infrastructure that creates productive commercial roles for skilled labor."
    },
    {
      id: "F",
      text: "Education must therefore be valued for its broader civic, moral, and cultural enrichment, rather than narrowly justified as a simplistic monetary investment mechanism."
    }
  ],
  groups: [
    {
      groupType: "matching_information",
      instructions: "Reading Passage 2 has six sections, A–F.\nWhich section contains the following information?\nWrite the correct letter, A–F, in boxes 14–18 on your answer sheet.",
      options: ["A", "B", "C", "D", "E", "F"],
      numbers: [14, 15, 16, 17, 18],
      items: [
        {
          number: 14,
          statement: "an analysis of education operating as a complementary factor rather than a prime mover",
          answers: ["E"]
        },
        {
          number: 15,
          statement: "the widely held political assumption regarding schooling and economic wealth",
          answers: ["A"]
        },
        {
          number: 16,
          statement: "statistical evidence showing expanding schooling accompanied by economic stagnation",
          answers: ["D"]
        },
        {
          number: 17,
          statement: "the importance of valuing education for humanistic and societal reasons",
          answers: ["F"]
        },
        {
          number: 18,
          statement: "a historical example of a highly literate population experiencing prolonged poverty",
          answers: ["C"]
        }
      ]
    },
    {
      groupType: "fill_notes",
      instructions: "Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 19–22 on your answer sheet.",
      title: "Education in 16th-century Zurich",
      numbers: [19, 20, 21, 22],
      items: [
        {
          number: 19,
          prefix: "Reformation leaders insisted that all young ",
          suffix: " must learn to read religious texts.",
          answers: ["descendants"]
        },
        {
          number: 20,
          prefix: "Children were expected to understand and follow the priest's weekly ",
          suffix: ".",
          answers: ["sermon"]
        },
        {
          number: 21,
          prefix: "Families who kept their offspring away from school were punished with a monetary ",
          suffix: ".",
          answers: ["fine"]
        },
        {
          number: 22,
          prefix: "Widespread literacy failed to trigger rapid commercial ",
          suffix: " for generations.",
          answers: ["innovation"]
        }
      ]
    },
    {
      groupType: "choose_two",
      instructions: "Questions 23 and 24: Choose TWO letters, A–E.\nWrite the correct letters in boxes 23 and 24 on your answer sheet.",
      numbers: [23, 24],
      items: [
        {
          number: 23,
          pairNumber: 24,
          question: "Which TWO points does the writer make about Britain during the Industrial Revolution?",
          options: [
            "A Its universities led the world in scientific research.",
            "B It achieved economic dominance despite having lower literacy than rivals.",
            "C School attendance was strictly enforced by Parliament.",
            "D Workers received extensive state vocational training.",
            "E Industrial invention flourished under a rudimentary educational system."
          ],
          answers: ["B", "E"],
          acceptedAnswers: ["B", "E"]
        },
        {
          number: 24,
          pairNumber: 23,
          question: "Which TWO points does the writer make about Britain during the Industrial Revolution? (Second choice)",
          options: [
            "A Its universities led the world in scientific research.",
            "B It achieved economic dominance despite having lower literacy than rivals.",
            "C School attendance was strictly enforced by Parliament.",
            "D Workers received extensive state vocational training.",
            "E Industrial invention flourished under a rudimentary educational system."
          ],
          answers: ["B", "E"],
          acceptedAnswers: ["B", "E"]
        }
      ]
    },
    {
      groupType: "choose_two",
      instructions: "Questions 25 and 26: Choose TWO letters, A–E.\nWrite the correct letters in boxes 25 and 26 on your answer sheet.",
      numbers: [25, 26],
      items: [
        {
          number: 25,
          pairNumber: 26,
          question: "Which TWO factors does Lant Pritchett identify as essential for education to translate into economic gains?",
          options: [
            "A heavy subsidies for overseas university degrees",
            "B robust institutional quality and governance",
            "C universal secondary school graduation targets",
            "D competitive commercial demand for educated workers",
            "E government price controls on agricultural goods"
          ],
          answers: ["B", "D"],
          acceptedAnswers: ["B", "D"]
        },
        {
          number: 26,
          pairNumber: 25,
          question: "Which TWO factors does Lant Pritchett identify as essential for education to translate into economic gains? (Second choice)",
          options: [
            "A heavy subsidies for overseas university degrees",
            "B robust institutional quality and governance",
            "C universal secondary school graduation targets",
            "D competitive commercial demand for educated workers",
            "E government price controls on agricultural goods"
          ],
          answers: ["B", "D"],
          acceptedAnswers: ["B", "D"]
        }
      ]
    }
  ]
};
