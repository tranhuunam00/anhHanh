// Cambridge IELTS 16 Test 4 - Reading Passage 2 Data
export const cambridge16Test4ReadingPassage2 = {
  passageNumber: 2,
  title: "Changes in reading habits",
  subtitle: "What are the implications of the way we read today?",
  paragraphs: [
    {
      id: "P1",
      text: "Look around on your next plane trip. The iPad is the new pacifier for babies and toddlers. Younger school-aged children read stories on smartphones; older kids don't read at all, but hunch over video games. Parents and other passengers read on tablets or skim a flotilla of email and news feeds. Unbeknown to most of us, an invisible, game-changing transformation links everyone in this picture: the neuronal circuit that underlies the brain's ability to read is subtly, rapidly changing and this has implications for everyone from the pre-reading toddler to the expert adult."
    },
    {
      id: "P2",
      text: "As work in neurosciences indicates, the acquisition of literacy necessitated a new circuit in our species' brain more than 6,000 years ago. That circuit evolved from a very simple mechanism for decoding basic information to the present, highly elaborated reading brain. My research depicts how the present reading brain enables the development of some of our most important intellectual processes: internalized knowledge, analogical reasoning, inference, perspective-taking, empathy, and critical analysis."
    },
    {
      id: "P3",
      text: "Multiple studies show that digital screen use may be causing a variety of troubling downstream effects on reading comprehension. When reading on digital screens, people tend to browse, skim, and dart across pages, seeking immediate stimulation rather than engaging in sustained deep reading. This cognitive impatience compromises our ability to follow complex narrative arguments and ponder nuanced subtleties."
    },
    {
      id: "P4",
      text: "Psychologist Anne Mangen and her colleagues conducted experiments comparing how students read literary stories on paper versus e-readers. Readers on paper were significantly better at reconstructing the chronological sequence of events than those using screens. Zimmerman's work similarly indicates that screen readers tend to overestimate their understanding, skimming texts with superficial confidence."
    },
    {
      id: "P5",
      text: "We must therefore teach our children to develop a 'bi-literate' reading brain — capable of reading both on digital screens for rapid information retrieval and on paper for deep, reflective comprehension. Only by consciously nurturing deep reading habits can we safeguard the nuanced intellectual capabilities that make us fully human."
    }
  ],
  groups: [
    {
      groupType: "multiple_choice",
      instructions: "Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 14–17 on your answer sheet.",
      numbers: [14, 15, 16, 17],
      items: [
        {
          number: 14,
          question: "What is the writer's main point in the first paragraph?",
          options: [
            "A Our use of technology is having a hidden effect on us.",
            "B Technology can be used to help youngsters to read.",
            "C Travellers should be encouraged to use technology on planes.",
            "D Digital devices are replacing books in the classroom."
          ],
          answers: ["A"]
        },
        {
          number: 15,
          question: "What does the writer suggest about the reading brain in the second paragraph?",
          options: [
            "A It developed much earlier than scientists previously believed.",
            "B It took a long time to develop complex intellectual abilities.",
            "C It has changed little over the last few centuries.",
            "D It depends primarily on inherited genetic characteristics."
          ],
          answers: ["B"]
        },
        {
          number: 16,
          question: "What does the writer say about deep reading in the third paragraph?",
          options: [
            "A It is rarely required in modern educational systems.",
            "B It is more difficult to master than basic decoding skills.",
            "C It requires less mental effort than digital browsing.",
            "D It is undermined by our habit of reading on digital screens."
          ],
          answers: ["D"]
        },
        {
          number: 17,
          question: "In the final paragraph, what does the writer recommend?",
          options: [
            "A limiting children's exposure to all forms of digital media",
            "B cultivating both digital and print reading abilities in children",
            "C replacing digital textbooks with traditional print editions",
            "D testing children's reading comprehension more frequently"
          ],
          answers: ["B"]
        }
      ]
    },
    {
      groupType: "summary_with_box",
      instructions: "Complete the summary using the list of words, A–H, below.\nWrite the correct letter, A–H, in boxes 18–22 on your answer sheet.",
      title: "Studies on digital screen use",
      boxOptions: [
        { letter: "A", text: "pleasurable" },
        { letter: "B", text: "sequence" },
        { letter: "C", text: "confidence" },
        { letter: "D", text: "worrying" },
        { letter: "E", text: "efficient" },
        { letter: "F", text: "paper" },
        { letter: "G", text: "unreliable" },
        { letter: "H", text: "screens" }
      ],
      paragraphs: [
        {
          text: "There have been many studies on digital screen use, showing some [18] trends. When individuals read on [19], they tend to skim rather than immerse themselves. Experiments demonstrate that subjects who read texts on [20] had a much better recall of the chronological [21] of events. Furthermore, researchers noted that screen readers frequently display excessive [22] regarding their level of comprehension."
        }
      ],
      items: [
        { number: 18, answers: ["D"] },
        { number: 19, answers: ["H"] },
        { number: 20, answers: ["F"] },
        { number: 21, answers: ["B"] },
        { number: 22, answers: ["C"] }
      ]
    },
    {
      groupType: "yes_no_not_given",
      instructions: "Do the following statements agree with the claims of the writer in Reading Passage 2?\nIn boxes 23–26 on your answer sheet, write:\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this",
      numbers: [23, 24, 25, 26],
      items: [
        { number: 23, statement: "The brain's reading circuit changes in response to the medium being read.", answers: ["YES"] },
        { number: 24, statement: "Reading printed books promotes faster cognitive multitasking.", answers: ["NO"] },
        { number: 25, statement: "Teachers are well-trained to spot cognitive impatience in pupils.", answers: ["NOT GIVEN"] },
        { number: 26, statement: "Developing bi-literacy helps preserve deep analytical faculties.", answers: ["YES"] }
      ]
    }
  ]
};
