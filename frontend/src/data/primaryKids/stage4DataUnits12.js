/**
 * Global English 4 (Stage 4) - Units 1 & 2
 * Unit 1: Our community & Unit 2: Earth and beyond
 */

export const STAGE4_MASCOTS = [
  {
    id: "fox",
    name: "Felix the Fox",
    role: "Chuyên gia Ngữ pháp & Trật tự từ",
    avatar: "🦊",
    badge: "Fox Grammar Master",
    color: "#f97316",
    quote: "Nhảy qua từng viên đá cùng tớ để ghép câu siêu chuẩn nhé!"
  },
  {
    id: "panda",
    name: "Bao the Panda",
    role: "Bếp trưởng Thức ăn & Lượng từ",
    avatar: "🐼",
    badge: "Panda Food Master",
    color: "#10b981",
    quote: "Tớ đang đói bụng quá, hãy phân loại đồ ăn và đố vui lượng từ cho tớ nha!"
  },
  {
    id: "lion",
    name: "Leo the Lion",
    role: "Phi hành gia Thám hiểm Vũ trụ",
    avatar: "🦁",
    badge: "Space Astro King",
    color: "#eab308",
    quote: "Cùng tớ du hành 8 hành tinh và so sánh các kì quan vũ trụ nào!"
  },
  {
    id: "bunny",
    name: "Ruby the Bunny",
    role: "Vận động viên Thể thao & Nghề nghiệp",
    avatar: "🐰",
    badge: "Speedy Word Champion",
    color: "#ec4899",
    quote: "Chạy thật nhanh và ghi nhớ từ vựng cộng đồng cùng tớ nhé!"
  },
  {
    id: "owl",
    name: "Oliver the Owl",
    role: "Cú Thông Thái - Giám khảo Đấu trường Cuối kì",
    avatar: "🦉",
    badge: "Grand Term Trophy",
    color: "#6366f1",
    quote: "Chúc mừng các con! Hãy cùng làm bài thi tổng hợp để rinh cúp vàng 100 điểm!"
  }
];

export const UNIT_1 = {
  id: 1,
  unitNumber: "Unit 1",
  title: "Our Community",
  titleVi: "Cộng Đồng Của Chúng Em",
  icon: "🏘️",
  mascot: "bunny",
  color: "#3b82f6",
  lessons: [
    {
      id: "1.1",
      title: "Chủ đề Cộng đồng",
      vocab: [
        { word: "my neighborhood", ipa: "/maɪ ˈneɪbəhʊd/", meaning: "khu phố / xóm của em", animal: "🐰", example: "I love walking around my neighborhood with my friends." },
        { word: "my block", ipa: "/maɪ blɒk/", meaning: "khối nhà / dãy phố của em", animal: "🦊", example: "There is a small park right behind my block." },
        { word: "my sports club", ipa: "/maɪ spɔːts klʌb/", meaning: "câu lạc bộ thể thao của em", animal: "🦁", example: "I go to my sports club every Saturday morning." },
        { word: "my country", ipa: "/maɪ ˈkʌntri/", meaning: "đất nước của em", animal: "🐼", example: "Vietnam is my beloved country." },
        { word: "my continent", ipa: "/maɪ ˈkɒntɪnənt/", meaning: "châu lục của em", animal: "🦉", example: "Asia is the largest continent in the world." }
      ]
    },
    {
      id: "1.2",
      title: "Chủ đề Thể thao",
      vocab: [
        { word: "long jump", ipa: "/ˈlɒŋ dʒʌmp/", meaning: "môn nhảy xa", animal: "🐰", example: "She won a gold medal in the long jump." },
        { word: "football", ipa: "/ˈfʊtbɔːl/", meaning: "bóng đá", animal: "🦁", example: "We play football on the school field." },
        { word: "skateboarding", ipa: "/ˈskeɪtbɔːdɪŋ/", meaning: "môn trượt ván", animal: "🦊", example: "Skateboarding is very exciting." },
        { word: "rugby", ipa: "/ˈrʌɡbi/", meaning: "bóng bầu dục", animal: "🐼", example: "Rugby is a popular team sport." },
        { word: "basketball", ipa: "/ˈbɑːskɪtbɔːl/", meaning: "bóng rổ", animal: "🐰", example: "He can shoot the basketball into the hoop." },
        { word: "snowboarding", ipa: "/ˈsnəʊbɔːdɪŋ/", meaning: "trượt tuyết bằng ván", animal: "🦉", example: "Snowboarding is fun in winter mountains." },
        { word: "karate", ipa: "/kəˈrɑːti/", meaning: "võ karate", animal: "🦁", example: "She has a black belt in karate." },
        { word: "running", ipa: "/ˈrʌnɪŋ/", meaning: "chạy bộ", animal: "🐰", example: "Running every day keeps you healthy." },
        { word: "surfing", ipa: "/ˈsɜːfɪŋ/", meaning: "lướt sóng", animal: "🦊", example: "They enjoy surfing on the sunny beach." }
      ]
    },
    {
      id: "1.3",
      title: "Nghề nghiệp trong nhà trường",
      vocab: [
        { word: "cook", ipa: "/kʊk/", meaning: "nhân viên nấu ăn", animal: "🐼", example: "The school cook prepares delicious lunch." },
        { word: "headmistress", ipa: "/ˌhedˈmɪstrəs/", meaning: "cô hiệu trưởng", animal: "🦉", example: "Our headmistress gave an inspiring speech." },
        { word: "class teacher", ipa: "/klɑːs ˈtiːtʃə/", meaning: "giáo viên chủ nhiệm", animal: "🐰", example: "My class teacher is very caring and kind." },
        { word: "caretaker", ipa: "/ˈkeəteɪkə/", meaning: "bác bảo vệ / nhân viên quản lý", animal: "🦁", example: "The caretaker keeps the school clean and safe." },
        { word: "school nurse", ipa: "/skuːl nɜːs/", meaning: "nhân viên y tế học đường", animal: "🦊", example: "Visit the school nurse if you have a fever." },
        { word: "librarian", ipa: "/laɪˈbreəriən/", meaning: "thủ thư", animal: "🦉", example: "The librarian helps us find fascinating books." },
        { word: "P.E. teacher", ipa: "/ˌpiː ˈiː ˈtiːtʃə/", meaning: "giáo viên thể dục", animal: "🐰", example: "Our P.E. teacher teaches us how to sprint fast." }
      ]
    },
    {
      id: "1.4",
      title: "Chủ đề Sự kiện & Hoạt động",
      vocab: [
        { word: "leaflet", ipa: "/ˈliːflət/", meaning: "tờ rơi giới thiệu", animal: "🦊", example: "We handed out leaflets for the charity event." },
        { word: "event", ipa: "/ɪˈvent/", meaning: "sự kiện", animal: "🦁", example: "The sports day is a big school event." },
        { word: "raising money", ipa: "/ˈreɪzɪŋ ˈmʌni/", meaning: "gây quỹ từ thiện", animal: "🐼", example: "We are raising money to support poor children." },
        { word: "craft activities", ipa: "/krɑːft ækˈtɪvətiz/", meaning: "hoạt động làm đồ thủ công", animal: "🐰", example: "Children made paper flowers in craft activities." },
        { word: "charity slogan", ipa: "/ˈtʃærəti ˈsləʊɡən/", meaning: "khẩu hiệu từ thiện", animal: "🦉", example: "Our charity slogan is 'Sharing is Caring'." }
      ]
    }
  ],
  grammarFocus: [
    {
      rule: "Verbs of interest (Động từ chỉ sở thích)",
      formula: "S + be into + N/V-ing | S + be keen on + N/V-ing | S + really like + V-ing",
      examples: [
        "He is into animals.",
        "They are keen on music.",
        "I really like playing sports."
      ]
    },
    {
      rule: "Infinitive with 'to' & Gerunds (Động từ nguyên mẫu & Danh động từ)",
      formula: "hope / want / learn + to V-inf | like / enjoy / love + V-ing",
      examples: [
        "I hope to become a doctor.",
        "I want to have pizza for lunch.",
        "I learn to play football.",
        "I like riding my bike at weekends.",
        "I enjoy watching films.",
        "I love swimming with my mom."
      ]
    },
    {
      rule: "Imperatives (Câu mệnh lệnh)",
      formula: "V-inf...! (Khẳng định) | Don't + V-inf...! (Phủ định)",
      examples: [
        "Come and join us!",
        "Don’t run in the classroom."
      ]
    },
    {
      rule: "Adverbs of frequency (Trạng từ chỉ tần suất)",
      formula: "always > usually > sometimes > hardly ever > never (Trước V thường, sau To be)",
      examples: [
        "She always gets up early. (Trước động từ thường)",
        "He is always late. (Sau động từ to be)"
      ]
    },
    {
      rule: "Comparative & Superlative of Adverbs (So sánh trạng từ)",
      formula: "S1 + V + adv-er / more adv + than + S2 | S + V + the adv-est / the most adv",
      examples: [
        "She runs faster than her brother.",
        "She sings more beautifully than her friend.",
        "Tom runs the fastest in my class.",
        "She sings the most beautifully in my class."
      ]
    },
    {
      rule: "Use 'about' to denote topic (Giới từ 'about')",
      formula: "S + V + N + about + Topic",
      examples: [
        "I’m reading a book about space and planets.",
        "We are learning about the Solar System."
      ]
    }
  ]
};

export const UNIT_2 = {
  id: 2,
  unitNumber: "Unit 2",
  title: "Earth and Beyond",
  titleVi: "Trái Đất Và Vũ Trụ",
  icon: "🪐",
  mascot: "lion",
  color: "#8b5cf6",
  lessons: [
    {
      id: "2.1",
      title: "Tính từ miêu tả thời tiết & Không gian",
      vocab: [
        { word: "freezing", ipa: "/ˈfriːzɪŋ/", meaning: "băng giá, cực lạnh", animal: "🦉", example: "It is freezing outside in winter." },
        { word: "icy", ipa: "/ˈaɪsi/", meaning: "đóng băng, trơn trượt", animal: "🐼", example: "Be careful on the icy pavement." },
        { word: "dry", ipa: "/draɪ/", meaning: "khô hạn, ráo", animal: "🦁", example: "Deserts are very hot and dry places." },
        { word: "huge", ipa: "/hjuːdʒ/", meaning: "khổng lồ, to lớn", animal: "🐰", example: "Jupiter is a huge gas giant planet." },
        { word: "wide", ipa: "/waɪd/", meaning: "rộng lớn, bao la", animal: "🦊", example: "The river is very wide." },
        { word: "wet", ipa: "/wet/", meaning: "ẩm ướt, sũng nước", animal: "🐼", example: "My shoes got wet in the heavy rain." },
        { word: "beautiful", ipa: "/ˈbjuːtɪfl/", meaning: "xinh đẹp, tuyệt mĩ", animal: "🐰", example: "Saturn has beautiful sparkling rings." },
        { word: "humid", ipa: "/ˈhjuːmɪd/", meaning: "ẩm thấp, oi ả", animal: "🦉", example: "Tropical rainforests are warm and humid." },
        { word: "cool", ipa: "/kuːl/", meaning: "mát mẻ, dễ chịu", animal: "🦊", example: "Autumn evenings are nicely cool." },
        { word: "warm", ipa: "/wɔːm/", meaning: "ấm áp", animal: "🦁", example: "The sunshine makes the morning warm." }
      ]
    },
    {
      id: "2.2",
      title: "Hệ Mặt Trời & 8 Hành Tinh",
      vocab: [
        { word: "explore", ipa: "/ɪkˈsplɔː/", meaning: "thám hiểm, khám phá", animal: "🦁", example: "Astronauts explore outer space." },
        { word: "orbit", ipa: "/ˈɔːbɪt/", meaning: "quay quanh quỹ đạo", animal: "🦊", example: "The Earth orbits the Sun once a year." },
        { word: "support", ipa: "/səˈpɔːt/", meaning: "hỗ trợ, duy trì sự sống", animal: "🐼", example: "Earth supports water, air and human life." },
        { word: "discover", ipa: "/dɪˈskʌvə/", meaning: "phát hiện, tìm ra", animal: "🦉", example: "Scientists discover new distant stars." },
        { word: "poisonous", ipa: "/ˈpɔɪzənəs/", meaning: "độc hại, có khí độc", animal: "🐰", example: "Venus has a poisonous atmosphere of acid." },
        { word: "Mercury", ipa: "/ˈmɜːkjəri/", meaning: "Sao Thủy (gần Mặt trời nhất)", animal: "🦁", example: "Mercury is the nearest planet to the Sun." },
        { word: "Venus", ipa: "/ˈviːnəs/", meaning: "Sao Kim (hành tinh nóng nhất)", animal: "🦊", example: "Venus is the hottest planet in our system." },
        { word: "Earth", ipa: "/ɜːθ/", meaning: "Trái Đất (hành tinh xanh)", animal: "🐼", example: "Earth is our beautiful home." },
        { word: "Mars", ipa: "/mɑːz/", meaning: "Sao Hỏa (hành tinh Đỏ)", animal: "🐰", example: "Mars is often called the Red Planet." },
        { word: "Jupiter", ipa: "/ˈdʒuːpɪtə/", meaning: "Sao Mộc (hành tinh lớn nhất)", animal: "🦁", example: "Jupiter is the biggest planet in the solar system." },
        { word: "Saturn", ipa: "/ˈsætɜːn/", meaning: "Sao Thổ (vành đai đẹp nhất)", animal: "🦉", example: "Saturn is famous for its bright icy rings." },
        { word: "Uranus", ipa: "/ˈjʊərənəs/", meaning: "Sao Thiên Vương (hành tinh băng)", animal: "🦊", example: "Uranus is a cold ice giant." },
        { word: "Neptune", ipa: "/ˈneptjuːn/", meaning: "Sao Hải Vương (xa Mặt trời nhất)", animal: "🐼", example: "Neptune is the farthest planet from the Sun." }
      ]
    },
    {
      id: "2.3",
      title: "Hiện tượng thiên nhiên kì thú",
      vocab: [
        { word: "natural event", ipa: "/ˈnætʃrəl ɪˈvent/", meaning: "hiện tượng tự nhiên", animal: "🦉", example: "A solar eclipse is an amazing natural event." },
        { word: "lightning", ipa: "/ˈlaɪtnɪŋ/", meaning: "tia sét, sấm sét", animal: "🦁", example: "Bright lightning flashed across the dark sky." },
        { word: "sunset", ipa: "/ˈsʌnset/", meaning: "hoàng hôn", animal: "🦊", example: "The sunset painted the sky in shades of orange." },
        { word: "northern lights", ipa: "/ˌnɔːðən ˈlaɪts/", meaning: "cực quang phương Bắc (Aurora)", animal: "🐼", example: "The northern lights dance in green and violet." },
        { word: "constellation", ipa: "/ˌkɒnstəˈleɪʃn/", meaning: "chòm sao", animal: "🦉", example: "We looked for the Great Bear constellation." },
        { word: "rainbow", ipa: "/ˈreɪnbəʊ/", meaning: "cầu vồng 7 sắc", animal: "🐰", example: "A colorful rainbow appeared after the shower." }
      ]
    },
    {
      id: "2.4",
      title: "Thiết bị công nghệ vũ trụ",
      vocab: [
        { word: "satellite", ipa: "/ˈsætəlaɪt/", meaning: "vệ tinh nhân tạo", animal: "🦊", example: "Weather satellites send photos back to Earth." },
        { word: "telescope", ipa: "/ˈtelɪskəʊp/", meaning: "kính thiên văn", animal: "🦉", example: "We look through the telescope to see the Moon's craters." },
        { word: "space shuttle", ipa: "/ˈspeɪs ʃʌtl/", meaning: "tàu con thoi", animal: "🦁", example: "The space shuttle launched with tremendous power." },
        { word: "rover", ipa: "/ˈrəʊvə/", meaning: "xe tự hành thám hiểm", animal: "🐼", example: "The Mars rover travels across red rocks." }
      ]
    },
    {
      id: "2.6",
      title: "Vũ trụ và Du hành không gian",
      vocab: [
        { word: "sparkling", ipa: "/ˈspɑːklɪŋ/", meaning: "lấp lánh, sáng ngời", animal: "🐰", example: "The stars are sparkling brightly tonight." },
        { word: "mysterious", ipa: "/mɪˈstɪəriəs/", meaning: "huyền bí, bí ẩn", animal: "🦉", example: "Deep space is full of mysterious wonders." },
        { word: "astronaut", ipa: "/ˈæstrənɔːt/", meaning: "phi hành gia", animal: "🦁", example: "Astronauts float weightlessly in space." },
        { word: "journey", ipa: "/ˈdʒɜːni/", meaning: "chuyến hành trình", animal: "🦊", example: "A journey to Mars takes many months." },
        { word: "equipment", ipa: "/ɪˈkwɪpmənt/", meaning: "trang thiết bị", animal: "🐼", example: "Astronauts wear high-tech space equipment." },
        { word: "space travel", ipa: "/ˈspeɪs trævl/", meaning: "du hành không gian", animal: "🦉", example: "Space travel is getting more advanced every year." }
      ]
    }
  ],
  grammarFocus: [
    {
      rule: "Comparative & Superlative Adjectives (So sánh tính từ)",
      formula: "Ngắn: adj-er than | the adj-est. Dài: more adj than | the most adj.",
      examples: [
        "Antarctica is colder than Gobi Desert.",
        "Are lakes more beautiful than rivers?",
        "Mercury is the nearest planet to the Sun.",
        "Saturn is one of the most beautiful planets."
      ]
    },
    {
      rule: "Present Simple for scientific facts (Hiện tại đơn diễn tả sự thật)",
      formula: "S + V(s/es) để nói về quy luật khoa học vũ trụ",
      examples: [
        "The space shuttle takes astronauts into space to discover new information.",
        "Satellites orbit other planets to collect information."
      ]
    },
    {
      rule: "Present Continuous (Hiện tại tiếp diễn)",
      formula: "S + am/is/are + V-ing",
      examples: [
        "I am standing and looking at the sky.",
        "The lights are moving and shaking!",
        "He is driving in the countryside to see constellations."
      ]
    },
    {
      rule: "Question tags (Câu hỏi đuôi)",
      formula: "Khẳng định (+), phủ định (-)? | Phủ định (-), khẳng định (+)?",
      examples: [
        "We are great, aren’t we?",
        "She bakes the cake, doesn’t she?",
        "He went on a zip wire, didn’t he?",
        "They will bake a cake, won’t they?"
      ]
    }
  ]
};

