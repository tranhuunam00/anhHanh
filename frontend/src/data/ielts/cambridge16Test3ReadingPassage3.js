// Cambridge IELTS 16 Test 3 - Reading Passage 3
// Text, questions and answers checked against Cambridge 16.pdf (pages 69–72).

export const cambridge16Test3ReadingPassage3 = {
  passageNumber: 3,
  title: "Plant 'thermometer' triggers springtime growth by measuring night-time heat",
  subtitle: "A photoreceptor molecule in plant cells has been found to have a second job as a thermometer after dark – allowing plants to read seasonal temperature changes. Scientists say the discovery could help breed crops that are more resilient to the temperatures expected to result from climate change",
  paragraphs: [
    { id: "A", text: "An international team of scientists led by the University of Cambridge has discovered that the 'thermometer' molecule in plants enables them to develop according to seasonal temperature changes. Researchers have revealed that molecules called phytochromes – used by plants to detect light during the day – actually change their function in darkness to become cellular temperature gauges that measure the heat of the night.\n\nThe new findings, published in the journal Science, show that phytochromes control genetic switches in response to temperature as well as light to dictate plant development." },
    { id: "B", text: "At night, these molecules change states, and the pace at which they change is 'directly proportional to temperature', say scientists, who compare phytochromes to mercury in a thermometer. The warmer it is, the faster the molecular change stimulating plant growth." },
    { id: "C", text: "Farmers and gardeners have known for hundreds of years how responsive plants are to temperature: warm winters cause many trees and flowers to bud early, something humans have long used to predict weather and harvest times for the coming year. The latest research pinpoints for the first time a molecular mechanism in plants that reacts to temperature – often triggering the buds of spring we long to see at the end of winter." },
    { id: "D", text: "With weather and temperatures set to become ever more unpredictable due to climate change, researchers say the discovery that this light-sensing molecule also functions as the internal thermometer in plant cells could help us breed tougher crops. 'It is estimated that agricultural yields will need to double by 2050, but climate change is a major threat to achieving this. Key crops such as wheat and rice are sensitive to high temperatures. Thermal stress reduces crop yields by around 10% for every one degree increase in temperature,' says lead researcher Dr Philip Wigge from Cambridge's Sainsbury Laboratory. 'Discovering the molecules that allow plants to sense temperature has the potential to accelerate the breeding of crops resilient to thermal stress and climate change.'" },
    { id: "E", text: "In their active state, phytochrome molecules bind themselves to DNA to restrict plant growth. During the day, sunlight activates the molecules, slowing down growth. If a plant finds itself in shade, phytochromes are quickly inactivated – enabling it to grow faster to find sunlight again. This is how plants compete to escape each other's shade. 'Light-driven changes to phytochrome activity occur very fast, in less than a second,' says Wigge.\n\nAt night, however, it's a different story. Instead of a rapid deactivation following sundown, the molecules gradually change from their active to inactive state. This is called 'dark reversion'. 'Just as mercury rises in a thermometer, the rate at which phytochromes revert to their inactive state during the night is a direct measure of temperature,' says Wigge." },
    { id: "F", text: "'The lower the temperature, the slower the rate at which phytochromes revert to inactivity, so the molecules spend more time in their active, growth-suppressing state. This is why plants are slower to grow in winter. Warm temperatures accelerate dark reversion, so that phytochromes rapidly reach an inactive state and detach themselves from the plant's DNA – allowing genes to be expressed and plant growth to resume.' Wigge believes phytochrome thermo-sensing evolved at a later stage, and co-opted the biological network already used for light-based growth during the downtime of night." },
    { id: "G", text: "Some plants mainly use day length as an indicator of the season. Other species, such as daffodils, have considerable temperature sensitivity, and can flower months in advance during a warm winter. In fact, the discovery of the dual role of phytochromes provides the science behind a well-known rhyme long used to predict the coming season: oak before ash we'll have a splash, ash before oak we're in for a soak. Wigge explains: 'Oak trees rely much more on temperature, likely using phytochromes as thermometers to dictate development, whereas ash trees rely on measuring day length to determine their seasonal timing. A warmer spring, and consequently a higher likeliness of a hot summer, will result in oak leafing before ash. A cold spring will see the opposite. As the British know only too well, a colder summer is likely to be a rain-soaked one.'" },
    { id: "H", text: "The new findings are the culmination of twelve years of research involving scientists from Germany, Argentina and the US, as well as the Cambridge team. The work was done in a model system, using a mustard plant called Arabidopsis, but Wigge says the phytochrome genes necessary for temperature sensing are found in crop plants as well. 'Recent advances in plant genetics now mean that scientists are able to rapidly identify the genes controlling these processes in crop plants, and even alter their activity using precise molecular \"scalpels\",' adds Wigge. 'Cambridge is uniquely well-positioned to do this kind of research as we have outstanding collaborators nearby who work on more applied aspects of plant biology, and can help us transfer this new knowledge into the field.'" }
  ],
  groups: [
    {
      groupType: "true_false_not_given",
      instructions: "Do the following statements agree with the information given in Reading Passage 3?\nIn boxes 27–32 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      numbers: [27, 28, 29, 30, 31, 32],
      items: [
        { number: 27, statement: "The Cambridge scientists' discovery of the 'thermometer molecule' caused surprise among other scientists.", answers: ["NOT GIVEN"] },
        { number: 28, statement: "The target for agricultural production by 2050 could be missed.", answers: ["TRUE"] },
        { number: 29, statement: "Wheat and rice suffer from a rise in temperatures.", answers: ["TRUE"] },
        { number: 30, statement: "It may be possible to develop crops that require less water.", answers: ["NOT GIVEN"] },
        { number: 31, statement: "Plants grow faster in sunlight than in shade.", answers: ["FALSE"] },
        { number: 32, statement: "Phytochromes change their state at the same speed day and night.", answers: ["FALSE"] }
      ]
    },
    {
      groupType: "matching_information",
      instructions: "Reading Passage 3 has eight sections, A–H.\nWhich section contains the following information?\nWrite the correct letter, A–H, in boxes 33–37 on your answer sheet.",
      options: ["A", "B", "C", "D", "E", "F", "G", "H"],
      numbers: [33, 34, 35, 36, 37],
      items: [
        { number: 33, statement: "mention of specialists who can make use of the research findings", answers: ["H"] },
        { number: 34, statement: "a reference to a potential benefit of the research findings", answers: ["D"] },
        { number: 35, statement: "scientific support for a traditional saying", answers: ["G"] },
        { number: 36, statement: "a reference to people traditionally making plans based on plant behaviour", answers: ["C"] },
        { number: 37, statement: "a reference to where the research has been reported", answers: ["A"] }
      ]
    },
    {
      groupType: "sentence_completion",
      instructions: "Complete the sentences below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 38–40 on your answer sheet.",
      numbers: [38, 39, 40],
      items: [
        { number: 38, prefix: "Daffodils are likely to flower early in response to ", suffix: " weather.", answers: ["warm", "warm winter"] },
        { number: 39, prefix: "If ash trees come into leaf before oak trees, the weather in ", suffix: " will probably be wet.", answers: ["summer"] },
        { number: 40, prefix: "The research was carried out using a particular species of ", suffix: ".", answers: ["mustard plant", "mustard plants", "mustard"] }
      ]
    }
  ]
};
