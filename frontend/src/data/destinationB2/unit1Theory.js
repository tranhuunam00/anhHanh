/**
 * Destination B2 - Unit 1 Grammar Theory
 * Source: Destination B2 (Grammar & Vocabulary), Pages 8 & 9.
 * Rule 4: File strictly under 500 lines.
 */

export const UNIT_1_THEORY = {
  unit_number: 1,
  unit_type: "grammar",
  cefr_level: "B2",
  title: "Present time: present simple, present continuous, present perfect simple, present perfect continuous, stative verbs",
  summary: "Comprehensive guide to all present tenses and stative verbs according to Destination B2.",
  sections: [
    {
      id: "present_simple",
      title: "Present simple",
      forms: {
        statement: "I/you/we/they travel... | He/she/it travels...",
        negative: "I/you/we/they don't travel... | He/she/it doesn't travel...",
        question: "Do I/you/we/they travel...? | Does he/she/it travel...?",
      },
      rules: [
        { use: "Current habits", example: "Toby walks to work." },
        { use: "To talk about how often things happen", example: "Angela doesn't visit us very often." },
        { use: "Permanent situations", example: "Carlo works in a travel agent's." },
        { use: "States", example: "Do you have an up-to-date passport?" },
        { use: "General truths and facts", example: "Poland is in the European Union." },
      ],
      watch_out: [
        "We can also use do/does in present simple statements for emphasis:\n• 'You don't like going by bus, do you?' 'Actually, I do like going by bus for short distances.'\n• The bus isn't quicker than the train but it does stop right outside the factory.",
      ],
    },
    {
      id: "present_continuous",
      title: "Present continuous",
      forms: {
        statement: "I am driving... | You/we/they are driving... | He/she/it is driving...",
        negative: "I'm not driving... | You/we/they aren't driving... (or You're/we're/they're not driving...) | He/she/it isn't driving... (or He's/she's/it's not driving...)",
        question: "Am I driving...? | Are you/we/they driving...? | Is he/she/it driving...?",
      },
      rules: [
        { use: "Actions happening now", example: "Mike is driving to work at the moment." },
        { use: "Temporary series of actions", example: "Taxi drivers aren't stopping at the train station because of the roadworks." },
        { use: "Temporary situations", example: "Are they staying in a hotel near the Olympic stadium?" },
        { use: "Changing and developing situations", example: "Holidays abroad are becoming increasingly popular." },
        { use: "Annoying habits (usually with always)", example: "Dad is always cleaning the car when I want to use it!" },
      ],
      watch_out: [],
    },
    {
      id: "present_perfect_simple",
      title: "Present perfect simple",
      forms: {
        statement: "I/you/we/they have flown... | He/she/it has flown...",
        negative: "I/you/we/they haven't flown... | He/she/it hasn't flown...",
        question: "Have I/you/we/they flown...? | Has he/she/it flown...?",
      },
      rules: [
        { use: "Situations and states that started in the past and are still true", example: "She's had her motorbike for over six years." },
        { use: "A series of actions continuing up to now", example: "We've travelled by taxi, bus, plane and train - all in the last twenty-four hours!" },
        { use: "Completed actions at a time in the past which is not mentioned", example: "Have you ever flown in a helicopter?" },
        { use: "Completed actions where the important thing is the present result", example: "I've booked the coach tickets." },
      ],
      watch_out: [
        "Phrases such as It's the first/second/etc time... are followed by the present perfect simple:\n• It's the second time I've been on a plane.",
        "Speakers of American English often use the past simple in situations where speakers of British English would use the present perfect simple:\n• US: We already saw the Sphinx.\n• UK: We've already seen the Sphinx.",
        "Speakers of American English use gotten as the past participle of the verb 'get', except when 'get' means 'have' or 'possess'. Speakers of British English only ever use got:\n• US: We've already gotten Dan a new backpack for his summer vacation.\n• UK: We've already got Dan a new rucksack for his summer holiday.",
      ],
    },
    {
      id: "present_perfect_continuous",
      title: "Present perfect continuous",
      forms: {
        statement: "I/you/we/they have been travelling... | He/she/it has been travelling...",
        negative: "I/you/we/they haven't been travelling... | He/she/it hasn't been travelling...",
        question: "Have I/you/we/they been travelling...? | Has he/she/it been travelling...?",
      },
      rules: [
        { use: "Actions continuing up to the present moment", example: "We have been driving for hours. Can't we have a break soon?" },
        { use: "Actions stopping just before the present moment", example: "I'm out of breath because I've been running to get here in time." },
      ],
      watch_out: [
        "The present perfect continuous is often used with words and phrases like all day/week/year/etc, for, since, just, etc.:\n• We've been walking for hours and I need a rest.",
        "The present perfect continuous is not normally used with the words ever and never:\n• Have you ever flown in a helicopter before? (NOT: Have you ever been flying in a helicopter before?)",
        "Sometimes there is very little difference in meaning between the present perfect simple and the present perfect continuous:\n• I have worked at the airport for four years. = I have been working at the airport for four years.",
        "And sometimes there is a difference in meaning:\n• I have read that book about cruise ships. (I have finished it.)\n• I have been reading that book about cruise ships. (I have not finished it.)",
      ],
    },
    {
      id: "stative_verbs",
      title: "Stative verbs",
      forms: {
        statement: "Stative verbs are not normally used in continuous tenses because they don't describe actions:\n• I see what you mean. (NOT: I am seeing what you mean.)",
      },
      rules: [
        { use: "Thinking", example: "believe, imagine, know, mean, think, understand" },
        { use: "Existence", example: "be, exist" },
        { use: "Emotions", example: "hate, like, love, need, prefer, satisfy, want" },
        { use: "The human senses", example: "hear, see, smell, sound, taste" },
        { use: "Appearance", example: "appear, look, resemble, seem" },
        { use: "Possession and relationships between things", example: "belong to, consist of, have, include, involve, own" },
      ],
      watch_out: [
        "Some verbs (such as be, have, imagine, look, see, smell, taste, think) are stative with one meaning and non-stative with another meaning:\n• Do you have your plane ticket with you? (state: possession)\n• Are you having lunch at the moment? (action: eating)",
      ],
    },
  ],
};
