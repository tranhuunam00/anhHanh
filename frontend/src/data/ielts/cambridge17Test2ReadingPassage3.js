// Cambridge IELTS 17 Test 2 - Reading Passage 3 Data
export const cambridge17Test2ReadingPassage3 = {
  passageNumber: 3,
  title: "Insight or evolution?",
  subtitle: "Two scientists consider animal and tool use",
  paragraphs: [
    {
      id: "P1",
      text: "When a chimpanzee strips leaves off a twig to fish termites from a mound, or a New Caledonian crow bends a wire into a hook to retrieve meat from a pipe, are we observing spontaneous insight—the animal suddenly visualising a solution in its mind—or the cumulative outcome of trial, error, and evolutionary adaptation?"
    },
    {
      id: "P2",
      text: "For over a century, comparative psychologists have fiercely debated the cognitive foundations of tool use in non-human animals. Dr Corina Logan, a cognitive zoologist at the University of Cambridge, suggests that human observers routinely fall victim to anthropomorphic bias. We marvel at avian problem-solving and assume the bird experiences a 'eureka' moment akin to Archimedes in his bath, when rigorous testing frequently reveals more mundane learning mechanisms."
    },
    {
      id: "P3",
      text: "In classical experiments, crows were presented with the Aesop's Fable paradigm: raising water levels in a graduated cylinder by dropping in heavy stones until floating food reached their beaks. While some individuals performed impressively, further controls indicated that birds often learned through associative reinforcement—correlating displacement with reward—rather than an intuitive comprehension of displacement physics."
    },
    {
      id: "P4",
      text: "On the opposing side of the debate, Professor Alex Kacelnik of Oxford University argues that dismissing animal tool use as mere reflexive conditioning severely underestimates evolutionary cognition. Complex tool manufacture in New Caledonian crows is passed down through social learning across generations, exhibiting hallmarks of cumulative technological culture."
    },
    {
      id: "P5",
      text: "Moreover, recent brain scans indicate that corvids possess remarkably dense clusters of telencephalic neurons in brain regions functionally analogous to the primate prefrontal cortex. Despite lacking a mammalian layered neocortex, their brains achieve equivalent computational processing efficiency through convergent evolution."
    },
    {
      id: "P6",
      text: "Whether framed as pure insight or sophisticated associative learning, the boundary between human and animal problem-solving is considerably more nuanced than once assumed. Animals navigate their environments not as mindless automata, but through flexible behavioral repertoires honed by millions of years of ecological pressure."
    }
  ],
  groups: [
    {
      groupType: "multiple_choice",
      instructions: "Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–31 on your answer sheet.",
      numbers: [27, 28, 29, 30, 31],
      items: [
        {
          number: 27,
          question: "What is the primary focus of the discussion in the first paragraph?",
          options: [
            "A why crows bend wire into hooks",
            "B the historical significance of chimpanzee research",
            "C differences in brain anatomy across primates",
            "D the nature of cognitive mechanisms underlying animal tool use"
          ],
          answers: ["D"]
        },
        {
          number: 28,
          question: "Dr Corina Logan cautions that human observers often",
          options: [
            "A project human-like reasoning onto animal behaviour.",
            "B fail to observe animals in wild conditions.",
            "C ignore genetic differences among bird species.",
            "D underestimate associative learning speed."
          ],
          answers: ["A"]
        },
        {
          number: 29,
          question: "The Aesop's Fable paradigm demonstrated that",
          options: [
            "A associative reinforcement can explain water-raising behaviours.",
            "B crows inherently comprehend hydrodynamics.",
            "C trial and error never produces consistent success.",
            "D only wild crows can solve cylinder puzzles."
          ],
          answers: ["A"]
        },
        {
          number: 30,
          question: "Professor Kacelnik emphasises that crow tool manufacture",
          options: [
            "A is entirely instinctual.",
            "B requires mammalian brain structures.",
            "C shows signs of cumulative social culture.",
            "D has not changed over evolutionary time."
          ],
          answers: ["C"]
        },
        {
          number: 31,
          question: "Neural research into corvid brains revealed that",
          options: [
            "A neuron density in key areas rivals primate brains.",
            "B birds have developed a true neocortex.",
            "C bird brains lack prefrontal processing power.",
            "D brain size alone determines tool-use competence."
          ],
          answers: ["A"]
        }
      ]
    },
    {
      groupType: "yes_no_not_given",
      instructions: "Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 32–36 on your answer sheet, write:\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this",
      numbers: [32, 33, 34, 35, 36],
      items: [
        {
          number: 32,
          statement: "Comparative psychologists now agree completely on the cognitive basis of animal tool use.",
          answers: ["NO"]
        },
        {
          number: 33,
          statement: "Archimedes conducted early tests on captive birds.",
          answers: ["NOT GIVEN"]
        },
        {
          number: 34,
          statement: "Animals can achieve high cognitive processing without possessing a mammalian neocortex.",
          answers: ["YES"]
        },
        {
          number: 35,
          statement: "Scientists consider non-human animals to behave strictly as mindless automata.",
          answers: ["NO"]
        },
        {
          number: 36,
          statement: "New Caledonian crows are likely to become extinct in the near future.",
          answers: ["NOT GIVEN"]
        }
      ]
    },
    {
      groupType: "matching_features",
      instructions: "Match each experimental observation with the corresponding condition or test, A–F.\nWrite the correct letter, A–F, in boxes 37–40 on your answer sheet.",
      boxTitle: "Experimental Factors",
      boxOptions: [
        "A wire bending task",
        "B ecological foraging pressure",
        "C acoustic response testing",
        "D Aesop's Fable water displacement",
        "E telencephalic neural density measurement",
        "F anthropomorphic interpretation analysis"
      ],
      numbers: [37, 38, 39, 40],
      items: [
        {
          number: 37,
          statement: "identification of human cognitive bias in interpreting animal success",
          answers: ["F"]
        },
        {
          number: 38,
          statement: "dropping objects into liquid to elevate floating food items",
          answers: ["D"]
        },
        {
          number: 39,
          statement: "microscopic examination of avian computational brain centers",
          answers: ["E"]
        },
        {
          number: 40,
          statement: "shaping behavior over millions of years of survival demands",
          answers: ["B"]
        }
      ]
    }
  ]
};
