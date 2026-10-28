/**
 * 100 Gốc Từ Tiếng Anh Cốt Lõi (Phần 3: Gốc 51 - 75)
 * Gồm các gốc về Không gian, Thời gian, Đo lường, Số đếm & Tự nhiên
 */

export const ROOT_WORDS_51_75 = [
  {
    id: 51,
    root: "chron",
    variants: [],
    origin: "Greek (chronos)",
    meaningVi: "thời gian",
    meaningEn: "time",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "synchronize",
        badge: "90 · CÙNG THỜI GIAN, ĐỒNG BỘ HÓA",
        prefix: "syn-",
        prefixMeaning: "cùng nhau",
        root: "chron",
        rootMeaning: "thời gian",
        suffix: "-ize",
        suffixMeaning: "làm cho",
        breakdownFormula: "syn- = cùng + chron = thời gian",
        meaningVi: "đồng bộ hóa thời gian",
        partOfSpeech: "v.",
        ipa: "/ˈsɪŋkrənaɪz/",
        exampleEn: "Synchronize your phone with your laptop.",
        exampleVi: "Đồng bộ hóa điện thoại của bạn với máy tính xách tay.",
        doodleKey: "synchronize"
      }
    ],
    exercises: [
      {
        id: "ex_51_1",
        type: "meaning",
        question: "Gốc 'chron' nghĩa là gì?",
        options: ["Thời gian", "Không gian", "Cát bụi", "Nhiệt độ"],
        correctIndex: 0,
        explanation: "chronos nghĩa là thời gian."
      }
    ]
  },
  {
    id: 52,
    root: "temp",
    variants: ["tempor"],
    origin: "Latin (tempus)",
    meaningVi: "thời gian, thời khắc",
    meaningEn: "time",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "temporary",
        badge: "91 · CHỈ TRONG MỘT THỜI GIAN, TẠM THỜI",
        prefix: "",
        prefixMeaning: "",
        root: "tempor",
        rootMeaning: "thời gian",
        suffix: "-ary",
        suffixMeaning: "thuộc",
        breakdownFormula: "tempor = thời gian + -ary = tính từ",
        meaningVi: "tạm thời, nhất thời",
        partOfSpeech: "adj.",
        ipa: "/ˈtemprəri/",
        exampleEn: "This is only a temporary solution.",
        exampleVi: "Đây chỉ là một giải pháp mang tính tạm thời.",
        doodleKey: "temporary"
      }
    ],
    exercises: [
      {
        id: "ex_52_1",
        type: "fill_blank",
        sentence: "The bridge closure is only ______, pending repairs.",
        correctWord: "temporary",
        options: ["temporary", "permanent", "durable", "eternal"],
        explanation: "temporary = tạm thời, không lâu dài."
      }
    ]
  },
  {
    id: 53,
    root: "geo",
    variants: [],
    origin: "Greek (ge)",
    meaningVi: "đất, trái đất",
    meaningEn: "earth, ground",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "geography",
        badge: "92 · MÔ TẢ TRÁI ĐẤT, ĐỊA LÝ HỌC",
        prefix: "",
        prefixMeaning: "",
        root: "geo",
        rootMeaning: "trái đất",
        suffix: "-graphy",
        suffixMeaning: "mô tả",
        breakdownFormula: "geo = đất + -graphy = ghi chép",
        meaningVi: "môn địa lý",
        partOfSpeech: "n.",
        ipa: "/dʒiˈɒɡrəfi/",
        exampleEn: "Geography teaches us about mountains and rivers.",
        exampleVi: "Môn địa lý dạy chúng ta về núi non và sông ngòi.",
        doodleKey: "geography"
      }
    ],
    exercises: [
      {
        id: "ex_53_1",
        type: "meaning",
        question: "Gốc 'geo' trong geology, geometry nghĩa là gì?",
        options: ["Trái đất, mặt đất", "Ngọn lửa", "Bầu trời", "Đại dương"],
        correctIndex: 0,
        explanation: "ge trong tiếng Hy Lạp nghĩa là mặt đất, trái đất."
      }
    ]
  },
  {
    id: 54,
    root: "terra",
    variants: ["terr"],
    origin: "Latin (terra)",
    meaningVi: "đất đai, vùng lãnh thổ",
    meaningEn: "land, earth",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "territory",
        badge: "93 · VÙNG ĐẤT THUỘC CHỦ QUYỀN, LÃNH THỔ",
        prefix: "",
        prefixMeaning: "",
        root: "territ",
        rootMeaning: "đất đai",
        suffix: "-ory",
        suffixMeaning: "khu vực",
        breakdownFormula: "terr = đất + -ory = vùng",
        meaningVi: "lãnh thổ, địa hạt",
        partOfSpeech: "n.",
        ipa: "/ˈterətri/",
        exampleEn: "Wolves protect their home territory.",
        exampleVi: "Đàn sói bảo vệ lãnh thổ nơi ở của chúng.",
        doodleKey: "territory"
      }
    ],
    exercises: [
      {
        id: "ex_54_1",
        type: "meaning",
        question: "Gốc Latin 'terra' nghĩa là gì?",
        options: ["Đất đai", "Mây trắng", "Kim loại", "Sóng biển"],
        correctIndex: 0,
        explanation: "terra nghĩa là đất đai, vùng đất."
      }
    ]
  },
  {
    id: 55,
    root: "hydr",
    variants: [],
    origin: "Greek (hydor)",
    meaningVi: "nước",
    meaningEn: "water",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "hydrate",
        badge: "94 · CẤP ĐỦ NƯỚC, UỐNG ĐỦ NƯỚC",
        prefix: "",
        prefixMeaning: "",
        root: "hydr",
        rootMeaning: "nước",
        suffix: "-ate",
        suffixMeaning: "cung cấp",
        breakdownFormula: "hydr = nước + -ate = cấp",
        meaningVi: "bổ sung nước cho cơ thể",
        partOfSpeech: "v.",
        ipa: "/ˈhaɪdreɪt/",
        exampleEn: "Remember to hydrate yourself during hot runs.",
        exampleVi: "Hãy nhớ uống đủ nước khi chạy bộ trời nắng.",
        doodleKey: "hydrate"
      }
    ],
    exercises: [
      {
        id: "ex_55_1",
        type: "meaning",
        question: "Gốc 'hydr' trong hydrogen, hydroelectric nghĩa là gì?",
        options: ["Nước", "Lửa", "Sắt", "Gỗ"],
        correctIndex: 0,
        explanation: "hydor nghĩa là nước."
      }
    ]
  },
  {
    id: 56,
    root: "aqua",
    variants: [],
    origin: "Latin (aqua)",
    meaningVi: "nước",
    meaningEn: "water",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "aquarium",
        badge: "95 · BỂ CHỨA NƯỚC VÀ CÁ, THỦY CUNG",
        prefix: "",
        prefixMeaning: "",
        root: "aqua",
        rootMeaning: "nước",
        suffix: "-rium",
        suffixMeaning: "nơi chứa",
        breakdownFormula: "aqua = nước + -rium = nơi chứa",
        meaningVi: "thủy cung, bể cá",
        partOfSpeech: "n.",
        ipa: "/əˈkweəriəm/",
        exampleEn: "Children loved watching sharks at the aquarium.",
        exampleVi: "Trẻ em thích thú ngắm cá mập tại thủy cung.",
        doodleKey: "aquarium"
      }
    ],
    exercises: [
      {
        id: "ex_56_1",
        type: "meaning",
        question: "Gốc Latin 'aqua' nghĩa là gì?",
        options: ["Nước", "Đá", "Cỏ", "Bụi"],
        correctIndex: 0,
        explanation: "aqua = nước."
      }
    ]
  },
  {
    id: 57,
    root: "aer",
    variants: [],
    origin: "Greek (aer)",
    meaningVi: "không khí, bầu trời",
    meaningEn: "air, atmosphere",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "aerospace",
        badge: "96 · KHÔNG GIAN BẦU TRỜI & VŨ TRỤ",
        prefix: "",
        prefixMeaning: "",
        root: "aero",
        rootMeaning: "không khí",
        suffix: "space",
        suffixMeaning: "không gian",
        breakdownFormula: "aero = khí quyển + space = không gian",
        meaningVi: "ngành hàng không vũ trụ",
        partOfSpeech: "n.",
        ipa: "/ˈeərəʊspeɪs/",
        exampleEn: "She works as an engineer in aerospace.",
        exampleVi: "Cô ấy làm kỹ sư trong ngành hàng không vũ trụ.",
        doodleKey: "aerospace"
      }
    ],
    exercises: [
      {
        id: "ex_57_1",
        type: "meaning",
        question: "Gốc 'aer' nghĩa là gì?",
        options: ["Không khí", "Đất sỏi", "Mạch nước", "Rễ cây"],
        correctIndex: 0,
        explanation: "aer nghĩa là không khí, khí quyển."
      }
    ]
  },
  {
    id: 58,
    root: "therm",
    variants: [],
    origin: "Greek (therme)",
    meaningVi: "nhiệt độ, hơi nóng",
    meaningEn: "heat",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "thermometer",
        badge: "97 · THƯỚC ĐO NHIỆT ĐỘ, NHIỆT KẾ",
        prefix: "",
        prefixMeaning: "",
        root: "thermo",
        rootMeaning: "nhiệt",
        suffix: "-meter",
        suffixMeaning: "đo lường",
        breakdownFormula: "thermo = nhiệt + -meter = đo",
        meaningVi: "nhiệt kế",
        partOfSpeech: "n.",
        ipa: "/θəˈmɒmɪtə/",
        exampleEn: "Check your fever using a thermometer.",
        exampleVi: "Hãy kiểm tra cơn sốt bằng nhiệt kế.",
        doodleKey: "thermometer"
      }
    ],
    exercises: [
      {
        id: "ex_58_1",
        type: "fill_blank",
        sentence: "A ______ measures body temperature accurately.",
        correctWord: "thermometer",
        options: ["thermometer", "speedometer", "barometer", "chronometer"],
        explanation: "thermometer = dụng cụ đo nhiệt độ."
      }
    ]
  },
  {
    id: 59,
    root: "meter",
    variants: ["metr"],
    origin: "Greek (metron)",
    meaningVi: "đo lường",
    meaningEn: "to measure",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "perimeter",
        badge: "98 · ĐO ĐỘ DÀI XUNG QUANH, CHU VI",
        prefix: "peri-",
        prefixMeaning: "xung quanh",
        root: "meter",
        rootMeaning: "đo lường",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "peri- = quanh + meter = đo",
        meaningVi: "chu vi",
        partOfSpeech: "n.",
        ipa: "/pəˈrɪmɪtə/",
        exampleEn: "Guards patrolled the security perimeter.",
        exampleVi: "Lực lượng bảo vệ tuần tra xung quanh chu vi an ninh.",
        doodleKey: "perimeter"
      }
    ],
    exercises: [
      {
        id: "ex_59_1",
        type: "meaning",
        question: "Gốc 'meter / metr' nghĩa là gì?",
        options: ["Đo lường", "Cháy sáng", "Chảy xiết", "Gấp khúc"],
        correctIndex: 0,
        explanation: "metron nghĩa là thước đo, đo lường."
      }
    ]
  },
  {
    id: 60,
    root: "magn",
    variants: [],
    origin: "Latin (magnus)",
    meaningVi: "lớn, vĩ đại, to lớn",
    meaningEn: "large, great",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "magnificent",
        badge: "99 · TẠO DỰNG NÊN SỰ VĨ ĐẠI, TUYỆT ĐẸP",
        prefix: "",
        prefixMeaning: "",
        root: "magni",
        rootMeaning: "vĩ đại",
        suffix: "-ficent",
        suffixMeaning: "làm nên",
        breakdownFormula: "magni = vĩ đại + -ficent = tạo nên",
        meaningVi: "tráng lệ, nguy nga",
        partOfSpeech: "adj.",
        ipa: "/mæɡˈnɪfɪsnt/",
        exampleEn: "The castle was truly magnificent at night.",
        exampleVi: "Lâu đài thực sự nguy nga tráng lệ vào ban đêm.",
        doodleKey: "magnificent"
      }
    ],
    exercises: [
      {
        id: "ex_60_1",
        type: "fill_blank",
        sentence: "The mountains looked ______ under the setting sun.",
        correctWord: "magnificent",
        options: ["magnificent", "insignificant", "minute", "fragile"],
        explanation: "magnificent = nguy nga, tuyệt mỹ."
      }
    ]
  },
  {
    id: 61,
    root: "min",
    variants: ["mini"],
    origin: "Latin (minor/minus)",
    meaningVi: "nhỏ, giảm bớt",
    meaningEn: "small, less",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "minimize",
        badge: "100 · LÀM CHO NHỎ NHẤT CÓ THỂ, GIẢM THIỂU",
        prefix: "",
        prefixMeaning: "",
        root: "minim",
        rootMeaning: "nhỏ nhất",
        suffix: "-ize",
        suffixMeaning: "làm cho",
        breakdownFormula: "minim = bé nhất + -ize = biến thành",
        meaningVi: "giảm thiểu tối đa",
        partOfSpeech: "v.",
        ipa: "/ˈmɪnɪmaɪz/",
        exampleEn: "Take precautions to minimize risks.",
        exampleVi: "Hãy phòng ngừa để giảm thiểu rủi ro.",
        doodleKey: "minimize"
      }
    ],
    exercises: [
      {
        id: "ex_61_1",
        type: "meaning",
        question: "Gốc 'min / mini' nghĩa là gì?",
        options: ["Nhỏ, giảm", "Khổng lồ", "Mềm dẻo", "Cứng rắn"],
        correctIndex: 0,
        explanation: "minus/minor nghĩa là nhỏ hơn, giảm bớt."
      }
    ]
  },
  {
    id: 62,
    root: "micro",
    variants: [],
    origin: "Greek (mikros)",
    meaningVi: "siêu nhỏ",
    meaningEn: "very small",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "microchip",
        badge: "101 · MẢNH MẠCH ĐIỆN SIÊU NHỎ",
        prefix: "micro-",
        prefixMeaning: "siêu nhỏ",
        root: "chip",
        rootMeaning: "mảnh chip",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "micro- = cực nhỏ + chip = vi mạch",
        meaningVi: "vi mạch bán dẫn",
        partOfSpeech: "n.",
        ipa: "/ˈmaɪkrəʊtʃɪp/",
        exampleEn: "Modern laptops use powerful microchips.",
        exampleVi: "Máy tính hiện đại sử dụng vi mạch mạnh mẽ.",
        doodleKey: "microchip"
      }
    ],
    exercises: [
      {
        id: "ex_62_1",
        type: "meaning",
        question: "Gốc 'micro' chỉ mức độ kích thước nào?",
        options: ["Rất nhỏ", "Khổng lồ", "Trung bình", "Không xác định"],
        correctIndex: 0,
        explanation: "mikros nghĩa là cực kỳ nhỏ bé."
      }
    ]
  },
  {
    id: 63,
    root: "macro",
    variants: [],
    origin: "Greek (makros)",
    meaningVi: "lớn, vĩ mô",
    meaningEn: "large, scale",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "macroeconomics",
        badge: "102 · KINH TẾ QUY MÔ LỚN, KINH TẾ VĨ MÔ",
        prefix: "macro-",
        prefixMeaning: "vĩ mô",
        root: "economics",
        rootMeaning: "kinh tế",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "macro- = lớn + economics = kinh tế",
        meaningVi: "kinh tế học vĩ mô",
        partOfSpeech: "n.",
        ipa: "/ˌmækrəʊˌiːkəˈnɒmɪks/",
        exampleEn: "She specializes in macroeconomics.",
        exampleVi: "Cô ấy chuyên nghiên cứu về kinh tế học vĩ mô.",
        doodleKey: "macroeconomics"
      }
    ],
    exercises: [
      {
        id: "ex_63_1",
        type: "meaning",
        question: "Gốc 'macro' đối lập với gốc nào sau đây?",
        options: ["Micro", "Mega", "Maxi", "Multi"],
        correctIndex: 0,
        explanation: "Macro (vĩ mô, lớn) đối lập với Micro (vi mô, nhỏ)."
      }
    ]
  },
  {
    id: 64,
    root: "mega",
    variants: [],
    origin: "Greek (megas)",
    meaningVi: "to lớn, vĩ đại, hàng triệu",
    meaningEn: "great, million",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "megacity",
        badge: "103 · SIÊU ĐÔ THỊ TRIỆU DÂN",
        prefix: "mega-",
        prefixMeaning: "siêu to lớn",
        root: "city",
        rootMeaning: "thành phố",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "mega- = siêu lớn + city = đô thị",
        meaningVi: "siêu đô thị hơn 10 triệu dân",
        partOfSpeech: "n.",
        ipa: "/ˈmeɡəsɪti/",
        exampleEn: "Tokyo is the world's largest megacity.",
        exampleVi: "Tokyo là siêu đô thị lớn nhất trên thế giới.",
        doodleKey: "megacity"
      }
    ],
    exercises: [
      {
        id: "ex_64_1",
        type: "meaning",
        question: "Gốc 'mega' trong megaphone mang nghĩa gì?",
        options: ["Lớn, khuếch đại", "Nhỏ bé", "Mềm mại", "Tối tăm"],
        correctIndex: 0,
        explanation: "megas nghĩa là to lớn, mạnh mẽ."
      }
    ]
  },
  {
    id: 65,
    root: "omni",
    variants: [],
    origin: "Latin (omnis)",
    meaningVi: "tất cả, toàn năng, ở mọi nơi",
    meaningEn: "all, everywhere",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "omnipresent",
        badge: "104 · HIỆN DIỆN Ở TẤT CẢ MỌI NƠI",
        prefix: "omni-",
        prefixMeaning: "tất cả",
        root: "present",
        rootMeaning: "hiện diện",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "omni- = mọi nơi + present = có mặt",
        meaningVi: "có mặt ở khắp muôn nơi",
        partOfSpeech: "adj.",
        ipa: "/ˌɒmnɪˈpreznt/",
        exampleEn: "Smartphones are omnipresent in modern life.",
        exampleVi: "Điện thoại thông minh hiện diện ở khắp mọi ngóc ngách cuộc sống.",
        doodleKey: "omnipresent"
      }
    ],
    exercises: [
      {
        id: "ex_65_1",
        type: "meaning",
        question: "Gốc 'omni' nghĩa là gì?",
        options: ["Tất cả, toàn bộ", "Một nửa", "Không có gì", "Chỉ một"],
        correctIndex: 0,
        explanation: "omnis trong tiếng Latin nghĩa là tất cả, toàn thể."
      }
    ]
  },
  {
    id: 66,
    root: "pan",
    variants: [],
    origin: "Greek (pas/pan)",
    meaningVi: "tất cả, toàn thể, toàn cảnh",
    meaningEn: "all, entire",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "panorama",
        badge: "105 · TẦM NHÌN TOÀN CẢNH",
        prefix: "pan-",
        prefixMeaning: "tất cả",
        root: "orama",
        rootMeaning: "cảnh nhìn",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pan- = toàn thể + orama = tầm nhìn",
        meaningVi: "toàn cảnh 360 độ",
        partOfSpeech: "n.",
        ipa: "/ˌpænəˈrɑːmə/",
        exampleEn: "We enjoyed the panorama of the mountains.",
        exampleVi: "Chúng tôi ngắm nhìn bức tranh toàn cảnh dãy núi.",
        doodleKey: "panorama"
      }
    ],
    exercises: [
      {
        id: "ex_66_1",
        type: "fill_blank",
        sentence: "From the hilltop, you get a 360-degree ______ of the city.",
        correctWord: "panorama",
        options: ["panorama", "autograph", "microscope", "perimeter"],
        explanation: "panorama = góc nhìn toàn cảnh rộng lớn."
      }
    ]
  },
  {
    id: 67,
    root: "uni",
    variants: [],
    origin: "Latin (unus)",
    meaningVi: "một, đồng nhất",
    meaningEn: "one, single",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "unique",
        badge: "106 · CHỈ CÓ MỘT DUY NHẤT, ĐỘC ĐÁO",
        prefix: "uni-",
        prefixMeaning: "một",
        root: "que",
        rootMeaning: "đặc tính",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "uni = duy nhất một",
        meaningVi: "độc nhất vô nhị, độc đáo",
        partOfSpeech: "adj.",
        ipa: "/juˈniːk/",
        exampleEn: "Everyone has a unique set of fingerprints.",
        exampleVi: "Mỗi người đều có dấu vân tay độc nhất vô nhị.",
        doodleKey: "unique"
      }
    ],
    exercises: [
      {
        id: "ex_67_1",
        type: "meaning",
        question: "Gốc 'uni' chỉ con số mấy?",
        options: ["Số 1", "Số 2", "Số 3", "Số 100"],
        correctIndex: 0,
        explanation: "unus nghĩa là một (1)."
      }
    ]
  },
  {
    id: 68,
    root: "mono",
    variants: [],
    origin: "Greek (monos)",
    meaningVi: "đơn nhất, duy nhất một",
    meaningEn: "single, alone",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "monologue",
        badge: "107 · MỘT NGƯỜI TỰ NÓI, ĐỘC THOẠI",
        prefix: "mono-",
        prefixMeaning: "một mình",
        root: "logue",
        rootMeaning: "lời nói",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "mono- = một + logue = nói",
        meaningVi: "lời độc thoại",
        partOfSpeech: "n.",
        ipa: "/ˈmɒnəlɒɡ/",
        exampleEn: "The actor delivered an emotional monologue.",
        exampleVi: "Nam diễn viên thể hiện một đoạn độc thoại đầy cảm xúc.",
        doodleKey: "monologue"
      }
    ],
    exercises: [
      {
        id: "ex_68_1",
        type: "meaning",
        question: "Gốc 'mono' trong monopoly, monotone có nghĩa là gì?",
        options: ["Một, đơn chiếc", "Nhiều người", "Đa dạng", "Mất mát"],
        correctIndex: 0,
        explanation: "monos = đơn độc, một mình."
      }
    ]
  },
  {
    id: 69,
    root: "bi",
    variants: ["di"],
    origin: "Latin & Greek",
    meaningVi: "hai, đôi",
    meaningEn: "two, twice",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "bilingual",
        badge: "108 · BIẾT NÓI HAI NGÔN NGỮ, SONG NGỮ",
        prefix: "bi-",
        prefixMeaning: "hai",
        root: "lingu",
        rootMeaning: "tiếng nói",
        suffix: "-al",
        suffixMeaning: "thuộc",
        breakdownFormula: "bi- = hai + lingua = ngôn ngữ",
        meaningVi: "song ngữ, nói hai thứ tiếng",
        partOfSpeech: "adj.",
        ipa: "/ˌbaɪˈlɪŋɡwəl/",
        exampleEn: "She is fluent and fully bilingual in English and French.",
        exampleVi: "Cô ấy nói song ngữ lưu loát tiếng Anh và tiếng Pháp.",
        doodleKey: "bilingual"
      }
    ],
    exercises: [
      {
        id: "ex_69_1",
        type: "meaning",
        question: "Gốc 'bi / di' chỉ số lượng bao nhiêu?",
        options: ["2", "1", "3", "4"],
        correctIndex: 0,
        explanation: "bi/di nghĩa là 2."
      }
    ]
  },
  {
    id: 70,
    root: "tri",
    variants: [],
    origin: "Greek & Latin",
    meaningVi: "ba, tam",
    meaningEn: "three",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "triangle",
        badge: "109 · HÌNH CÓ BA GÓC, HÌNH TAM GIÁC",
        prefix: "tri-",
        prefixMeaning: "ba",
        root: "angle",
        rootMeaning: "góc",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "tri- = ba + angle = góc",
        meaningVi: "hình tam giác",
        partOfSpeech: "n.",
        ipa: "/ˈtraɪæŋɡl/",
        exampleEn: "The sum of angles in a triangle is 180 degrees.",
        exampleVi: "Tổng các góc trong hình tam giác là 180 độ.",
        doodleKey: "triangle"
      }
    ],
    exercises: [
      {
        id: "ex_70_1",
        type: "meaning",
        question: "Gốc 'tri' trong tripod, trilogy nghĩa là gì?",
        options: ["Ba (3)", "Bốn (4)", "Mười (10)", "Một (1)"],
        correctIndex: 0,
        explanation: "tri- chỉ số lượng 3."
      }
    ]
  },
  {
    id: 71,
    root: "multi",
    variants: [],
    origin: "Latin (multus)",
    meaningVi: "nhiều, đa dạng",
    meaningEn: "many, multiple",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "multinational",
        badge: "110 · NẰM Ở NHIỀU QUỐC GIA, ĐA QUỐC GIA",
        prefix: "multi-",
        prefixMeaning: "nhiều",
        root: "nation",
        rootMeaning: "quốc gia",
        suffix: "-al",
        suffixMeaning: "thuộc",
        breakdownFormula: "multi- = nhiều + nation = quốc gia",
        meaningVi: "đa quốc gia",
        partOfSpeech: "adj.",
        ipa: "/ˌmʌltiˈnæʃnəl/",
        exampleEn: "She works for a top multinational firm.",
        exampleVi: "Cô ấy làm việc cho một tập đoàn đa quốc gia hàng đầu.",
        doodleKey: "multinational"
      }
    ],
    exercises: [
      {
        id: "ex_71_1",
        type: "meaning",
        question: "Gốc 'multi' mang nghĩa gì?",
        options: ["Nhiều, phong phú", "Rỗng tuếch", "Ít ỏi", "Đơn chiếc"],
        correctIndex: 0,
        explanation: "multus nghĩa là nhiều."
      }
    ]
  },
  {
    id: 72,
    root: "poly",
    variants: [],
    origin: "Greek (polys)",
    meaningVi: "nhiều, đa",
    meaningEn: "many",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "polyglot",
        badge: "111 · NÓI ĐƯỢC NHIỀU THỨ TIẾNG",
        prefix: "poly-",
        prefixMeaning: "nhiều",
        root: "glot",
        rootMeaning: "ngôn ngữ",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "poly- = nhiều + glotta = tiếng",
        meaningVi: "người biết nhiều thứ tiếng",
        partOfSpeech: "n.",
        ipa: "/ˈpɒliɡlɒt/",
        exampleEn: "As a polyglot, he speaks five languages easily.",
        exampleVi: "Là một người đa ngôn ngữ, anh ấy nói 5 thứ tiếng dễ dàng.",
        doodleKey: "polyglot"
      }
    ],
    exercises: [
      {
        id: "ex_72_1",
        type: "meaning",
        question: "Gốc 'poly' trong polygon, polyglot nghĩa là gì?",
        options: ["Nhiều", "Một", "Không", "Hai"],
        correctIndex: 0,
        explanation: "polys nghĩa là nhiều."
      }
    ]
  },
  {
    id: 73,
    root: "cent",
    variants: [],
    origin: "Latin (centum)",
    meaningVi: "một trăm (100)",
    meaningEn: "hundred",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "century",
        badge: "112 · KHOẢNG THỜI GIAN 100 NĂM, THẾ KỶ",
        prefix: "",
        prefixMeaning: "",
        root: "cent",
        rootMeaning: "trăm",
        suffix: "-ury",
        suffixMeaning: "thời kỳ",
        breakdownFormula: "cent = 100 + -ury = năm",
        meaningVi: "thế kỷ (100 năm)",
        partOfSpeech: "n.",
        ipa: "/ˈsentʃəri/",
        exampleEn: "We are living in the twenty-first century.",
        exampleVi: "Chúng ta đang sống ở thế kỷ hai mươi mốt.",
        doodleKey: "century"
      }
    ],
    exercises: [
      {
        id: "ex_73_1",
        type: "meaning",
        question: "Gốc 'cent' chỉ con số bao nhiêu?",
        options: ["100", "10", "1000", "50"],
        correctIndex: 0,
        explanation: "centum nghĩa là 100."
      }
    ]
  },
  {
    id: 74,
    root: "mill",
    variants: [],
    origin: "Latin (mille)",
    meaningVi: "một nghìn (1000)",
    meaningEn: "thousand",
    category: "nature_space",
    categoryVi: "Không gian & Thời gian",
    words: [
      {
        word: "millennium",
        badge: "113 · KHOẢNG THỜI GIAN 1000 NĂM, THIÊN NIÊN KỶ",
        prefix: "",
        prefixMeaning: "",
        root: "mill",
        rootMeaning: "nghìn",
        suffix: "-ennium",
        suffixMeaning: "năm",
        breakdownFormula: "mille = 1000 + annus = năm",
        meaningVi: "thiên niên kỷ",
        partOfSpeech: "n.",
        ipa: "/mɪˈleniəm/",
        exampleEn: "The year 2000 marked the start of a new millennium.",
        exampleVi: "Năm 2000 đánh dấu sự khởi đầu của một thiên niên kỷ mới.",
        doodleKey: "millennium"
      }
    ],
    exercises: [
      {
        id: "ex_74_1",
        type: "meaning",
        question: "Gốc 'mill' nghĩa là gì?",
        options: ["Một nghìn (1000)", "Mười (10)", "Một vạn", "Trăm"],
        correctIndex: 0,
        explanation: "mille = 1000."
      }
    ]
  },
  {
    id: 75,
    root: "jud",
    variants: ["jur", "jus"],
    origin: "Latin (jus/judex)",
    meaningVi: "luật pháp, công lý, phán xét",
    meaningEn: "law, right, judge",
    category: "society_law",
    categoryVi: "Con người, Luật & Xã hội",
    words: [
      {
        word: "justice",
        badge: "114 · SỰ THỰC THI LUẬT PHÁP, CÔNG LÝ",
        prefix: "",
        prefixMeaning: "",
        root: "just",
        rootMeaning: "công bằng",
        suffix: "-ice",
        suffixMeaning: "danh từ",
        breakdownFormula: "just = công lý + -ice = sự",
        meaningVi: "công lý, sự chính trực",
        partOfSpeech: "n.",
        ipa: "/ˈdʒʌstɪs/",
        exampleEn: "The legal court fights for justice for all.",
        exampleVi: "Tòa án đấu tranh vì công lý cho tất cả mọi người.",
        doodleKey: "justice"
      }
    ],
    exercises: [
      {
        id: "ex_75_1",
        type: "fill_blank",
        sentence: "Everyone deserves equal ______ under the constitution.",
        correctWord: "justice",
        options: ["justice", "malice", "avarice", "cowardice"],
        explanation: "justice = công lý."
      }
    ]
  }
];
