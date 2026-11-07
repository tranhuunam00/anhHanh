/**
 * Stage 4 Game Quizzes & Interactive Challenges
 * Tailored for Global English 4 End of Term Test 1 revision
 */

export const PANDA_FOOD_ITEMS = [
  { id: "f1", name: "apples", nameVi: "những quả táo", type: "countable", icon: "🍎", hint: "Bé có thể đếm 1 apple, 2 apples!" },
  { id: "f2", name: "oranges", nameVi: "những quả cam", type: "countable", icon: "🍊", hint: "Có dạng số nhiều đuôi -s" },
  { id: "f3", name: "cupcakes", nameVi: "bánh cupcake", type: "countable", icon: "🧁", hint: "Đếm từng chiếc bánh được" },
  { id: "f4", name: "carrots", nameVi: "củ cà rốt", type: "countable", icon: "🥕", hint: "1 carrot, 2 carrots..." },
  { id: "f5", name: "bananas", nameVi: "những quả chuối", type: "countable", icon: "🍌", hint: "Đếm từng quả chuối ngon ngọt" },
  { id: "f6", name: "eggs", nameVi: "trứng gà", type: "countable", icon: "🥚", hint: "1 egg, 2 eggs..." },
  { id: "f7", name: "sugar", nameVi: "đường ăn", type: "uncountable", icon: "🧂", hint: "Hạt nhỏ li ti, không đếm từng hạt" },
  { id: "f8", name: "rice", nameVi: "gạo / cơm", type: "uncountable", icon: "🍚", hint: "Không có dạng rices" },
  { id: "f9", name: "chocolate", nameVi: "sô-cô-la", type: "uncountable", icon: "🍫", hint: "Khối chất ngọt thơm" },
  { id: "f10", name: "water", nameVi: "nước lọc", type: "uncountable", icon: "💧", hint: "Chất lỏng không đếm được" },
  { id: "f11", name: "flour", nameVi: "bột mì", type: "uncountable", icon: "🌾", hint: "Bột mịn để làm bánh" },
  { id: "f12", name: "milk", nameVi: "sữa tươi", type: "uncountable", icon: "🥛", hint: "Chất lỏng giàu dinh dưỡng" },
  { id: "f13", name: "cheese", nameVi: "phô mai béo", type: "uncountable", icon: "🧀", hint: "Khối phô mai thơm ngon" },
  { id: "f14", name: "salt", nameVi: "muối ăn", type: "uncountable", icon: "🧂", hint: "Gia vị mặn mà" }
];

export const PANDA_QUANTIFIER_DRILLS = [
  {
    id: "q1",
    question: "Are there ___ students in the classroom?",
    options: ["any", "some", "much", "little"],
    correct: "any",
    explanation: "Trong câu hỏi nghi vấn (?), ta dùng 'any'."
  },
  {
    id: "q2",
    question: "Yes, there are ___ students in the classroom.",
    options: ["some", "any", "much", "little"],
    correct: "some",
    explanation: "Trong câu khẳng định (+), ta dùng 'some'."
  },
  {
    id: "q3",
    question: "How ___ soda did you drink yesterday?",
    options: ["much", "many", "a few", "any"],
    correct: "much",
    explanation: "'soda' là danh từ không đếm được, dùng 'How much'."
  },
  {
    id: "q4",
    question: "How ___ apples did you buy at the market?",
    options: ["many", "much", "little", "a little"],
    correct: "many",
    explanation: "'apples' là danh từ số nhiều đếm được, dùng 'How many'."
  },
  {
    id: "q5",
    question: "There are ___ sweets in my pocket. You can take two.",
    options: ["a few", "little", "much", "any"],
    correct: "a few",
    explanation: "'sweets' đếm được nên dùng 'a few' (một vài chiếc kẹo)."
  },
  {
    id: "q6",
    question: "There is ___ water left in the bottle. I need more.",
    options: ["little", "a few", "many", "any"],
    correct: "little",
    explanation: "'water' không đếm được, 'little water' nghĩa là còn rất ít nước."
  },
  {
    id: "q7",
    question: "Would you like ___ milk with your cookies?",
    options: ["some", "any", "many", "a few"],
    correct: "some",
    explanation: "Khi đưa ra lời mời lịch sự 'Would you like...?', ta dùng 'some'."
  }
];

export const FOX_SENTENCE_DRILLS = [
  {
    id: "s1",
    target: "She always gets up early.",
    words: ["always", "She", "gets", "early.", "up"],
    unit: 1,
    ruleVi: "Trạng từ tần suất 'always' đứng trước động từ thường 'gets up'."
  },
  {
    id: "s2",
    target: "He is always late for class.",
    words: ["late", "is", "always", "He", "class.", "for"],
    unit: 1,
    ruleVi: "Trạng từ tần suất 'always' đứng sau động từ to be 'is'."
  },
  {
    id: "s3",
    target: "He is into animals.",
    words: ["into", "is", "He", "animals."],
    unit: 1,
    ruleVi: "Cấu trúc sở thích: 'be into + Noun' (Rất thích động vật)."
  },
  {
    id: "s4",
    target: "They are keen on music.",
    words: ["keen", "They", "on", "are", "music."],
    unit: 1,
    ruleVi: "Cấu trúc sở thích: 'be keen on + Noun' (Đam mê âm nhạc)."
  },
  {
    id: "s5",
    target: "I hope to become a doctor.",
    words: ["to", "hope", "I", "a", "become", "doctor."],
    unit: 1,
    ruleVi: "Động từ 'hope' đi với nguyên thể có to: 'hope to become'."
  },
  {
    id: "s6",
    target: "Don’t run in the classroom.",
    words: ["run", "Don’t", "in", "classroom.", "the"],
    unit: 1,
    ruleVi: "Câu mệnh lệnh phủ định: 'Don’t + V-inf'."
  },
  {
    id: "s7",
    target: "We are great, aren’t we?",
    words: ["aren’t", "are", "great,", "We", "we?"],
    unit: 2,
    ruleVi: "Câu hỏi đuôi: Mệnh đề khẳng định 'We are' -> đuôi phủ định 'aren’t we?'."
  },
  {
    id: "s8",
    target: "Mercury is the nearest planet to the Sun.",
    words: ["the", "Mercury", "is", "planet", "nearest", "the", "to", "Sun."],
    unit: 2,
    ruleVi: "So sánh nhất tính từ ngắn: 'the nearest planet to the Sun'."
  },
  {
    id: "s9",
    target: "They have big windows to let in natural lights.",
    words: ["windows", "big", "They", "have", "to", "let", "in", "natural", "lights."],
    unit: 3,
    ruleVi: "Động từ nguyên mẫu chỉ mục đích: 'to let in natural lights'."
  },
  {
    id: "s10",
    target: "Before you eat, rinse your hands with soap.",
    words: ["Before", "you", "rinse", "eat,", "hands", "with", "your", "soap."],
    unit: 4,
    ruleVi: "Từ nối trình tự: 'Before you eat,...' (Trước khi ăn)."
  }
];

export const SPACE_PLANET_DRILLS = [
  {
    id: "p1",
    planet: "Mercury",
    planetVi: "Sao Thủy",
    distanceOrder: 1,
    color: "#94a3b8",
    icon: "⚪",
    fact: "Nearest planet to the Sun and smallest of the eight planets.",
    question: "Which planet is the nearest to the Sun?",
    options: ["Mercury", "Mars", "Venus", "Neptune"],
    correct: "Mercury"
  },
  {
    id: "p2",
    planet: "Venus",
    planetVi: "Sao Kim",
    distanceOrder: 2,
    color: "#f59e0b",
    icon: "🟡",
    fact: "The hottest planet with thick, poisonous clouds of acid.",
    question: "Which planet is the hottest and has a poisonous atmosphere?",
    options: ["Venus", "Mercury", "Earth", "Saturn"],
    correct: "Venus"
  },
  {
    id: "p3",
    planet: "Earth",
    planetVi: "Trái Đất",
    distanceOrder: 3,
    color: "#3b82f6",
    icon: "🌍",
    fact: "Our home planet that supports water, air and living creatures.",
    question: "Which planet supports water and human life?",
    options: ["Earth", "Mars", "Jupiter", "Uranus"],
    correct: "Earth"
  },
  {
    id: "p4",
    planet: "Mars",
    planetVi: "Sao Hỏa",
    distanceOrder: 4,
    color: "#ef4444",
    icon: "🔴",
    fact: "Known as the Red Planet where robot rovers explore rocks.",
    question: "Mars is famous as the ___ Planet.",
    options: ["Red", "Blue", "Green", "Golden"],
    correct: "Red"
  },
  {
    id: "p5",
    planet: "Jupiter",
    planetVi: "Sao Mộc",
    distanceOrder: 5,
    color: "#ea580c",
    icon: "🟠",
    fact: "The biggest and most massive planet in our entire solar system.",
    question: "Jupiter is the ___ planet in the solar system.",
    options: ["biggest", "smallest", "nearest", "coldest"],
    correct: "biggest"
  },
  {
    id: "p6",
    planet: "Saturn",
    planetVi: "Sao Thổ",
    distanceOrder: 6,
    color: "#eab308",
    icon: "🪐",
    fact: "One of the most beautiful planets with thousands of sparkling rings.",
    question: "Saturn is one of the ___ planets because of its sparkling rings.",
    options: ["most beautiful", "more beautiful", "beautifulest", "beauty"],
    correct: "most beautiful"
  },
  {
    id: "p7",
    planet: "Uranus",
    planetVi: "Sao Thiên Vương",
    distanceOrder: 7,
    color: "#06b6d4",
    icon: "🔵",
    fact: "A freezing cold ice giant with a pale cyan glow.",
    question: "Uranus is a freezing ___ giant planet.",
    options: ["ice", "fire", "rock", "wood"],
    correct: "ice"
  },
  {
    id: "p8",
    planet: "Neptune",
    planetVi: "Sao Hải Vương",
    distanceOrder: 8,
    color: "#2563eb",
    icon: "🌐",
    fact: "The farthest planet from the Sun, dark and stormy blue.",
    question: "Which planet is the farthest from the Sun?",
    options: ["Neptune", "Mercury", "Earth", "Mars"],
    correct: "Neptune"
  }
];

export const OLIVER_GRAND_EXAM_QUESTIONS = [
  {
    id: "g1",
    unit: 1,
    question: "Which word means 'khối nhà / dãy phố của em'?",
    options: ["my block", "my country", "my continent", "my sports club"],
    correct: 0,
    explanation: "'my block' là khối nhà / dãy nhà trong khu phố."
  },
  {
    id: "g2",
    unit: 1,
    question: "Choose the correct sentence with adverb of frequency:",
    options: [
      "She always gets up early.",
      "She gets always up early.",
      "She gets up always early.",
      "Always she gets up early."
    ],
    correct: 0,
    explanation: "Trạng từ tần suất đứng trước động từ thường: She always gets up early."
  },
  {
    id: "g3",
    unit: 1,
    question: "He is keen ___ learning about space.",
    options: ["on", "into", "at", "with"],
    correct: 0,
    explanation: "Cụm cố định: 'keen on + V-ing' (đam mê, thích thú)."
  },
  {
    id: "g4",
    unit: 1,
    question: "I hope ___ a pilot when I grow up.",
    options: ["to become", "becoming", "become", "became"],
    correct: 0,
    explanation: "Động từ 'hope' đi với 'to V': hope to become."
  },
  {
    id: "g5",
    unit: 1,
    question: "Choose the imperative sentence (Câu mệnh lệnh):",
    options: [
      "Come and join us!",
      "She comes to our club.",
      "They are joining us.",
      "Are you coming?"
    ],
    correct: 0,
    explanation: "'Come and join us!' là câu mệnh lệnh mời gọi tham gia."
  },
  {
    id: "g6",
    unit: 2,
    question: "Antarctica is ___ than Gobi Desert.",
    options: ["colder", "coldest", "more cold", "the coldest"],
    correct: 0,
    explanation: "So sánh hơn tính từ ngắn: cold -> colder than."
  },
  {
    id: "g7",
    unit: 2,
    question: "Which machine is used to explore rocky surfaces on Mars?",
    options: ["rover", "satellite", "telescope", "space shuttle"],
    correct: 0,
    explanation: "'rover' là xe tự hành thám hiểm bề mặt hành tinh."
  },
  {
    id: "g8",
    unit: 2,
    question: "She bakes the cake, ___ she?",
    options: ["doesn’t", "isn’t", "don’t", "won’t"],
    correct: 0,
    explanation: "Động từ 'bakes' (thì hiện tại đơn, ngôi thứ 3 số ít) -> đuôi 'doesn’t she?'."
  },
  {
    id: "g9",
    unit: 2,
    question: "Look! The northern lights ___ and shaking across the night sky!",
    options: ["are moving", "moves", "moved", "moving"],
    correct: 0,
    explanation: "Dấu hiệu 'Look!' dùng thì hiện tại tiếp diễn: 'are moving'."
  },
  {
    id: "g10",
    unit: 2,
    question: "What is a group of stars that forms a pattern called?",
    options: ["constellation", "lightning", "rainbow", "sunset"],
    correct: 0,
    explanation: "'constellation' là chòm sao trên bầu trời đêm."
  },
  {
    id: "g11",
    unit: 3,
    question: "A traditional circular tent made of wool and canvas is a ___.",
    options: ["yurt", "detached house", "stilt house", "bungalow"],
    correct: 0,
    explanation: "'yurt' là lều tròn du mục làm bằng len và vải bạt trắng."
  },
  {
    id: "g12",
    unit: 3,
    question: "They install solar panels on the roof ___ clean energy.",
    options: ["to provide", "providing", "provide", "provided"],
    correct: 0,
    explanation: "Động từ nguyên mẫu chỉ mục đích: 'to provide clean energy'."
  },
  {
    id: "g13",
    unit: 3,
    question: "It ___ be a library with all those shelves of books!",
    options: ["must", "can't", "should", "shall"],
    correct: 0,
    explanation: "Phỏng đoán chắc chắn đúng: 'must be a library'."
  },
  {
    id: "g14",
    unit: 3,
    question: "Last year, my family ___ in an eco-friendly bungalow.",
    options: ["lived", "lives", "living", "will live"],
    correct: 0,
    explanation: "'Last year' là dấu hiệu quá khứ đơn: lived."
  },
  {
    id: "g15",
    unit: 4,
    question: "Which of the following is an UNCOUNTABLE noun?",
    options: ["chocolate", "apple", "cupcake", "carrot"],
    correct: 0,
    explanation: "'chocolate' là danh từ không đếm được."
  },
  {
    id: "g16",
    unit: 4,
    question: "There isn’t ___ water left in the kettle.",
    options: ["any", "some", "a few", "many"],
    correct: 0,
    explanation: "Trong câu phủ định (isn't), dùng 'any'."
  },
  {
    id: "g17",
    unit: 4,
    question: "First, workers harvest cacao pods, then they ___ the beans.",
    options: ["roast", "rinse", "soil", "fold"],
    correct: 0,
    explanation: "Trong quy trình làm chocolate: roast (rang/nướng) hạt ca cao."
  },
  {
    id: "g18",
    unit: 4,
    question: "Lemons have a sour taste, but honey tastes ___.",
    options: ["sweet", "salty", "spiky", "smooth"],
    correct: 0,
    explanation: "'sweet' (vị ngọt ngào của mật ong)."
  },
  {
    id: "g19",
    unit: 4,
    question: "___ you eat, rinse your hands with clean water and soap.",
    options: ["Before", "After that", "Then", "Later"],
    correct: 0,
    explanation: "'Before you eat,...' (Trước khi con ăn)."
  },
  {
    id: "g20",
    unit: 4,
    question: "Would you like ___ orange juice?",
    options: ["some", "any", "many", "a few"],
    correct: 0,
    explanation: "Lời mời lịch sự 'Would you like...?' luôn dùng 'some'."
  }
];

