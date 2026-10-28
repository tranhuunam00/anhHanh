/**
 * 100 Gốc Từ Tiếng Anh Cốt Lõi (Phần 1: Gốc 1 - 25)
 * Cấu trúc chuẩn: Prefix + Root + Suffix, Badge, Minh họa doodle, Câu ví dụ, Bài tập
 */

export const ROOT_WORDS_1_25 = [
  {
    id: 1,
    root: "spect",
    variants: ["spic"],
    origin: "Latin (spectare)",
    meaningVi: "nhìn, quan sát, xem",
    meaningEn: "to see, look, watch",
    category: "perception",
    categoryVi: "Nhìn & Cảm nhận",
    words: [
      {
        word: "respect",
        badge: "01 · NHÌN LẠI, COI TRỌNG",
        prefix: "re-",
        prefixMeaning: "quay lại",
        root: "spect",
        rootMeaning: "nhìn",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "re- = quay lại + spect = nhìn",
        meaningVi: "tôn trọng, coi trọng",
        partOfSpeech: "v., n.",
        ipa: "/rɪˈspekt/",
        exampleEn: "We respect our teachers.",
        exampleVi: "Chúng ta tôn trọng thầy cô.",
        doodleKey: "respect",
        customImage: "/roots/respect.jpg"
      },
      {
        word: "inspect",
        badge: "02 · NHÌN VÀO TRONG, THANH TRA",
        prefix: "in-",
        prefixMeaning: "vào trong",
        root: "spect",
        rootMeaning: "nhìn",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "in- = vào trong + spect = nhìn",
        meaningVi: "thanh tra, kiểm tra kỹ",
        partOfSpeech: "v.",
        ipa: "/ɪnˈspekt/",
        exampleEn: "The officer came to inspect the building.",
        exampleVi: "Viên chức đến kiểm tra kỹ tòa nhà.",
        doodleKey: "inspect",
        customImage: "/roots/inspect.jpg"
      },
      {
        word: "prospect",
        badge: "03 · NHÌN VỀ PHÍA TRƯỚC, TRIỂN VỌNG",
        prefix: "pro-",
        prefixMeaning: "về phía trước",
        root: "spect",
        rootMeaning: "nhìn",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pro- = về phía trước + spect = nhìn",
        meaningVi: "triển vọng, tương lai",
        partOfSpeech: "n.",
        ipa: "/ˈprɒspekt/",
        exampleEn: "The company has bright prospects for growth.",
        exampleVi: "Công ty có triển vọng phát triển tươi sáng.",
        doodleKey: "prospect"
      }
    ],
    exercises: [
      {
        id: "ex_1_1",
        type: "assembly",
        prompt: "Ghép tiền tố và gốc từ để tạo từ mang nghĩa: 'tôn trọng, coi trọng'",
        correctWord: "respect",
        parts: [{ text: "re-", type: "prefix" }, { text: "spect", type: "root" }],
        distractors: ["in-", "con-", "port"],
        explanation: "re- (quay lại, coi trọng) + spect (nhìn) = respect (tôn trọng)."
      },
      {
        id: "ex_1_2",
        type: "fill_blank",
        sentence: "Students should always ______ their teachers and elders.",
        correctWord: "respect",
        options: ["respect", "inspect", "suspect", "expect"],
        explanation: "respect có nghĩa là tôn trọng, kính trọng."
      },
      {
        id: "ex_1_3",
        type: "meaning",
        question: "Gốc Latin 'spect' trong respect, inspect, prospect có nghĩa gốc là gì?",
        options: ["Nhìn, quan sát", "Nói, phát biểu", "Kéo, lôi cuốn", "Xây dựng"],
        correctIndex: 0,
        explanation: "'spect' xuất phát từ Latin spectare, có nghĩa là nhìn, ngắm, quan sát."
      }
    ]
  },
  {
    id: 2,
    root: "dict",
    variants: ["dic"],
    origin: "Latin (dicere)",
    meaningVi: "nói, tuyên bố",
    meaningEn: "to speak, say, declare",
    category: "communication",
    categoryVi: "Nói & Viết",
    words: [
      {
        word: "predict",
        badge: "04 · NÓI TRƯỚC, DỰ ĐOÁN",
        prefix: "pre-",
        prefixMeaning: "trước",
        root: "dict",
        rootMeaning: "nói",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pre- = trước + dict = nói",
        meaningVi: "dự đoán, dự báo",
        partOfSpeech: "v.",
        ipa: "/prɪˈdɪkt/",
        exampleEn: "It is hard to predict the weather tomorrow.",
        exampleVi: "Rất khó để dự đoán thời tiết ngày mai.",
        doodleKey: "predict",
        customImage: "/roots/predict.jpg"
      },
      {
        word: "contradict",
        badge: "05 · NÓI NGƯỢC LẠI, MÂU THUẪN",
        prefix: "contra-",
        prefixMeaning: "chống lại, ngược",
        root: "dict",
        rootMeaning: "nói",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "contra- = ngược lại + dict = nói",
        meaningVi: "cãi lại, mâu thuẫn",
        partOfSpeech: "v.",
        ipa: "/ˌkɒntrəˈdɪkt/",
        exampleEn: "His actions contradict his words.",
        exampleVi: "Hành động của anh ấy mâu thuẫn với lời nói.",
        doodleKey: "contradict"
      }
    ],
    exercises: [
      {
        id: "ex_2_1",
        type: "assembly",
        prompt: "Ghép tiền tố và gốc từ để tạo từ mang nghĩa: 'nói trước, dự báo'",
        correctWord: "predict",
        parts: [{ text: "pre-", type: "prefix" }, { text: "dict", type: "root" }],
        distractors: ["contra-", "mis-", "scribe"],
        explanation: "pre- (trước) + dict (nói) = predict (dự đoán, tiên tri)."
      },
      {
        id: "ex_2_2",
        type: "fill_blank",
        sentence: "Scientists try to ______ when the earthquake will happen.",
        correctWord: "predict",
        options: ["predict", "dictate", "contradict", "verdict"],
        explanation: "predict = dự đoán sự kiện xảy ra trong tương lai."
      },
      {
        id: "ex_2_3",
        type: "meaning",
        question: "Gốc 'dict' trong predict, contradict, dictionary nghĩa là gì?",
        options: ["Nói, phát ngôn", "Nghe, âm thanh", "Viết, vẽ", "Đi, bước"],
        correctIndex: 0,
        explanation: "'dict' bắt nguồn từ Latin dicere (nói, phát biểu)."
      }
    ]
  },
  {
    id: 3,
    root: "struct",
    variants: ["stru"],
    origin: "Latin (struere)",
    meaningVi: "xây dựng, xếp đặt",
    meaningEn: "to build, arrange",
    category: "creation",
    categoryVi: "Tạo dựng & Tư duy",
    words: [
      {
        word: "construct",
        badge: "06 · CÙNG NHAU XÂY, XÂY DỰNG",
        prefix: "con-",
        prefixMeaning: "cùng nhau",
        root: "struct",
        rootMeaning: "xây dựng",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "con- = cùng nhau + struct = xây",
        meaningVi: "xây dựng, kiến tạo",
        partOfSpeech: "v.",
        ipa: "/kənˈstrʌkt/",
        exampleEn: "They construct a new bridge across the river.",
        exampleVi: "Họ xây dựng một cây cầu mới bắc qua sông.",
        doodleKey: "construct"
      },
      {
        word: "instruct",
        badge: "07 · XÂY ĐẮP KIẾN THỨC, HƯỚNG DẪN",
        prefix: "in-",
        prefixMeaning: "vào trong",
        root: "struct",
        rootMeaning: "xây dựng",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "in- = vào trong + struct = xây",
        meaningVi: "hướng dẫn, chỉ bảo",
        partOfSpeech: "v.",
        ipa: "/ɪnˈstrʌkt/",
        exampleEn: "The mentor instructed her on how to code.",
        exampleVi: "Người hướng dẫn chỉ bảo cô ấy cách lập trình.",
        doodleKey: "instruct"
      }
    ],
    exercises: [
      {
        id: "ex_3_1",
        type: "assembly",
        prompt: "Ghép tiền tố và gốc từ để tạo từ mang nghĩa: 'cùng nhau xây dựng'",
        correctWord: "construct",
        parts: [{ text: "con-", type: "prefix" }, { text: "struct", type: "root" }],
        distractors: ["de-", "re-", "tract"],
        explanation: "con- (cùng nhau) + struct (xây dựng) = construct (xây dựng)."
      },
      {
        id: "ex_3_2",
        type: "fill_blank",
        sentence: "Workers will ______ a modern hospital here.",
        correctWord: "construct",
        options: ["construct", "destruct", "instruct", "obstruct"],
        explanation: "construct = xây dựng công trình, nhà cửa."
      },
      {
        id: "ex_3_3",
        type: "meaning",
        question: "Gốc 'struct' trong construct, structure có ý nghĩa gì?",
        options: ["Xây dựng", "Phá hủy", "Uốn cong", "Kéo dài"],
        correctIndex: 0,
        explanation: "'struct' trong tiếng Latin có nghĩa là xây cất, lắp ghép."
      }
    ]
  },
  {
    id: 4,
    root: "tract",
    variants: [],
    origin: "Latin (trahere)",
    meaningVi: "kéo, lôi cuốn",
    meaningEn: "to pull, draw, drag",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "attract",
        badge: "08 · KÉO VỀ PHÍA MÌNH, THU HÚT",
        prefix: "ad-",
        prefixMeaning: "về phía",
        root: "tract",
        rootMeaning: "kéo",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "at- (ad-) = về phía + tract = kéo",
        meaningVi: "thu hút, hấp dẫn",
        partOfSpeech: "v.",
        ipa: "/əˈtrækt/",
        exampleEn: "Magnets attract certain metals.",
        exampleVi: "Nam châm hút các kim loại nhất định.",
        doodleKey: "attract"
      },
      {
        word: "extract",
        badge: "09 · KÉO RA NGOÀI, CHIẾT XUẤT",
        prefix: "ex-",
        prefixMeaning: "ra ngoài",
        root: "tract",
        rootMeaning: "kéo",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "ex- = ra ngoài + tract = kéo",
        meaningVi: "chiết xuất, rút ra",
        partOfSpeech: "v.",
        ipa: "/ɪkˈstrækt/",
        exampleEn: "They extract oil from olives.",
        exampleVi: "Họ chiết xuất dầu từ quả ô liu.",
        doodleKey: "extract"
      }
    ],
    exercises: [
      {
        id: "ex_4_1",
        type: "assembly",
        prompt: "Ghép để tạo từ mang nghĩa: 'kéo ra ngoài, chiết xuất'",
        correctWord: "extract",
        parts: [{ text: "ex-", type: "prefix" }, { text: "tract", type: "root" }],
        distractors: ["at-", "sub-", "port"],
        explanation: "ex- (ra ngoài) + tract (kéo) = extract (chiết xuất, rút ra)."
      },
      {
        id: "ex_4_2",
        type: "fill_blank",
        sentence: "Beautiful flowers ______ bees and butterflies.",
        correctWord: "attract",
        options: ["attract", "distract", "retract", "contract"],
        explanation: "attract = thu hút, hấp dẫn đến gần."
      },
      {
        id: "ex_4_3",
        type: "meaning",
        question: "Gốc 'tract' trong attract, extract, tractor nghĩa là gì?",
        options: ["Kéo, lôi", "Đẩy, ép", "Cắt, chặt", "Chảy, rót"],
        correctIndex: 0,
        explanation: "'tract' có gốc từ trahere nghĩa là kéo, lôi đi."
      }
    ]
  },
  {
    id: 5,
    root: "port",
    variants: [],
    origin: "Latin (portare)",
    meaningVi: "mang, vác, chuyên chở",
    meaningEn: "to carry, bear",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "transport",
        badge: "10 · MANG QUA NƠI KHÁC, VẬN CHUYỂN",
        prefix: "trans-",
        prefixMeaning: "qua, xuyên suốt",
        root: "port",
        rootMeaning: "mang, chở",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "trans- = qua lại + port = mang chở",
        meaningVi: "vận chuyển, chuyên chở",
        partOfSpeech: "v., n.",
        ipa: "/ˈtrænspɔːt/",
        exampleEn: "Ships transport cargo across oceans.",
        exampleVi: "Tàu bè vận chuyển hàng hóa qua đại dương.",
        doodleKey: "transport"
      },
      {
        word: "export",
        badge: "11 · MANG RA NGOÀI NƯỚC, XUẤT KHẨU",
        prefix: "ex-",
        prefixMeaning: "ra ngoài",
        root: "port",
        rootMeaning: "mang chở",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "ex- = ra ngoài + port = mang chở",
        meaningVi: "xuất khẩu",
        partOfSpeech: "v., n.",
        ipa: "/ˈekspɔːt/",
        exampleEn: "Vietnam exports coffee and rice.",
        exampleVi: "Việt Nam xuất khẩu cà phê và gạo.",
        doodleKey: "export"
      }
    ],
    exercises: [
      {
        id: "ex_5_1",
        type: "assembly",
        prompt: "Ghép để tạo từ mang nghĩa: 'mang hàng hóa ra nước ngoài (xuất khẩu)'",
        correctWord: "export",
        parts: [{ text: "ex-", type: "prefix" }, { text: "port", type: "root" }],
        distractors: ["im-", "trans-", "ject"],
        explanation: "ex- (ra ngoài) + port (mang) = export (xuất khẩu)."
      },
      {
        id: "ex_5_2",
        type: "fill_blank",
        sentence: "Trains are used to ______ goods between major cities.",
        correctWord: "transport",
        options: ["transport", "support", "deport", "report"],
        explanation: "transport = vận chuyển hàng hóa, hành khách."
      },
      {
        id: "ex_5_3",
        type: "meaning",
        question: "Gốc 'port' trong portable, transport, export có nghĩa là gì?",
        options: ["Mang, vác, chở", "Nhìn, xem", "Nói, kể", "Giữ lại"],
        correctIndex: 0,
        explanation: "'port' bắt nguồn từ portare (mang, vác, chở)."
      }
    ]
  },
  {
    id: 6,
    root: "duc",
    variants: ["duct"],
    origin: "Latin (ducere)",
    meaningVi: "dẫn dắt, đưa tới",
    meaningEn: "to lead, guide",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "produce",
        badge: "12 · ĐƯA RA PHÍA TRƯỚC, SẢN XUẤT",
        prefix: "pro-",
        prefixMeaning: "về phía trước",
        root: "duce",
        rootMeaning: "dẫn dắt, tạo ra",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pro- = ra trước + duce = dẫn dắt",
        meaningVi: "sản xuất, tạo ra",
        partOfSpeech: "v.",
        ipa: "/prəˈdjuːs/",
        exampleEn: "This factory produces clean energy.",
        exampleVi: "Nhà máy này sản xuất năng lượng sạch.",
        doodleKey: "produce"
      },
      {
        word: "conduct",
        badge: "13 · CÙNG DẪN DẮT, TIẾN HÀNH / CHỈ HUY",
        prefix: "con-",
        prefixMeaning: "cùng nhau",
        root: "duct",
        rootMeaning: "dẫn dắt",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "con- = cùng + duct = dẫn dắt",
        meaningVi: "tiến hành, điều khiển",
        partOfSpeech: "v., n.",
        ipa: "/kənˈdʌkt/",
        exampleEn: "The team will conduct a new experiment.",
        exampleVi: "Nhóm sẽ tiến hành một thí nghiệm mới.",
        doodleKey: "conduct"
      }
    ],
    exercises: [
      {
        id: "ex_6_1",
        type: "fill_blank",
        sentence: "The maestro raised his baton to ______ the orchestra.",
        correctWord: "conduct",
        options: ["conduct", "produce", "deduce", "induce"],
        explanation: "conduct orchestra = chỉ huy dàn nhạc."
      },
      {
        id: "ex_6_2",
        type: "meaning",
        question: "Gốc 'duc / duct' trong conduct, introduce, educate nghĩa là gì?",
        options: ["Dẫn dắt, chỉ lối", "Viết, vẽ", "Cắt đứt", "Lắng nghe"],
        correctIndex: 0,
        explanation: "'duc/duct' từ Latin ducere nghĩa là dẫn đường, dẫn dắt."
      }
    ]
  },
  {
    id: 7,
    root: "scrib",
    variants: ["script"],
    origin: "Latin (scribere)",
    meaningVi: "viết, ghi chép",
    meaningEn: "to write",
    category: "communication",
    categoryVi: "Nói & Viết",
    words: [
      {
        word: "describe",
        badge: "14 · VIẾT CHI TIẾT XUỐNG, MIÊU TẢ",
        prefix: "de-",
        prefixMeaning: "xuống, rõ ràng",
        root: "scribe",
        rootMeaning: "viết",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "de- = xuống + scribe = viết",
        meaningVi: "miêu tả, mô tả",
        partOfSpeech: "v.",
        ipa: "/dɪˈskraɪb/",
        exampleEn: "Can you describe what you saw?",
        exampleVi: "Bạn có thể miêu tả những gì bạn nhìn thấy không?",
        doodleKey: "describe"
      },
      {
        word: "subscribe",
        badge: "15 · KÝ TÊN BÊN DƯỚI, ĐĂNG KÝ",
        prefix: "sub-",
        prefixMeaning: "dưới",
        root: "scribe",
        rootMeaning: "viết, ký",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "sub- = phía dưới + scribe = viết/ký",
        meaningVi: "đăng ký theo dõi",
        partOfSpeech: "v.",
        ipa: "/səbˈskraɪb/",
        exampleEn: "Subscribe to our channel for new updates.",
        exampleVi: "Đăng ký kênh để nhận thông báo mới.",
        doodleKey: "subscribe"
      }
    ],
    exercises: [
      {
        id: "ex_7_1",
        type: "fill_blank",
        sentence: "Please ______ your experience in three sentences.",
        correctWord: "describe",
        options: ["describe", "prescribe", "subscribe", "inscribe"],
        explanation: "describe = mô tả, miêu tả lại."
      },
      {
        id: "ex_7_2",
        type: "meaning",
        question: "Gốc 'scrib / script' trong manuscript, describe nghĩa là gì?",
        options: ["Viết, ghi lại", "Vẽ tranh", "Đọc to", "Đếm số"],
        correctIndex: 0,
        explanation: "'scrib/script' nghĩa là viết (scribere)."
      }
    ]
  },
  {
    id: 8,
    root: "mit",
    variants: ["miss"],
    origin: "Latin (mittere)",
    meaningVi: "gửi đi, thả ra",
    meaningEn: "to send, let go",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "transmit",
        badge: "16 · GỬI XUYÊN QUA, TRUYỀN TẢI",
        prefix: "trans-",
        prefixMeaning: "qua, xuyên",
        root: "mit",
        rootMeaning: "gửi",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "trans- = qua + mit = gửi",
        meaningVi: "truyền phát, truyền tải",
        partOfSpeech: "v.",
        ipa: "/trænzˈmɪt/",
        exampleEn: "Satellites transmit radio signals.",
        exampleVi: "Vệ tinh truyền tải tín hiệu vô tuyến.",
        doodleKey: "transmit"
      },
      {
        word: "dismiss",
        badge: "17 · CHO ĐI RA, GIẢI TÁN",
        prefix: "dis-",
        prefixMeaning: "ra xa, phân tán",
        root: "miss",
        rootMeaning: "gửi đi",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "dis- = ra xa + miss = gửi đi",
        meaningVi: "bác bỏ, giải tán, sa thải",
        partOfSpeech: "v.",
        ipa: "/dɪsˈmɪs/",
        exampleEn: "The teacher dismissed the class early.",
        exampleVi: "Giáo viên cho lớp giải tán sớm.",
        doodleKey: "dismiss"
      }
    ],
    exercises: [
      {
        id: "ex_8_1",
        type: "meaning",
        question: "Gốc 'mit / miss' trong transmit, mission có ý nghĩa gì?",
        options: ["Gửi đi, phóng thích", "Nhận lại", "Giữ chặt", "Quan sát"],
        correctIndex: 0,
        explanation: "'mit/miss' từ Latin mittere nghĩa là gửi đi."
      }
    ]
  },
  {
    id: 9,
    root: "form",
    variants: [],
    origin: "Latin (forma)",
    meaningVi: "hình dáng, tạo hình",
    meaningEn: "shape, structure",
    category: "creation",
    categoryVi: "Tạo dựng & Tư duy",
    words: [
      {
        word: "transform",
        badge: "18 · ĐỔI HÌNH DẠNG, BIẾN ĐỔI",
        prefix: "trans-",
        prefixMeaning: "chuyển đổi",
        root: "form",
        rootMeaning: "hình dáng",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "trans- = chuyển + form = hình dáng",
        meaningVi: "biến đổi hoàn toàn",
        partOfSpeech: "v.",
        ipa: "/trænsˈfɔːm/",
        exampleEn: "AI will transform education in the future.",
        exampleVi: "AI sẽ chuyển đổi nền giáo dục trong tương lai.",
        doodleKey: "transform"
      },
      {
        word: "reform",
        badge: "19 · TẠO LẠI DÁNG MỚI, CẢI CÁCH",
        prefix: "re-",
        prefixMeaning: "lại",
        root: "form",
        rootMeaning: "hình dạng",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "re- = lại + form = dáng",
        meaningVi: "cải cách, sửa đổi tốt hơn",
        partOfSpeech: "v., n.",
        ipa: "/rɪˈfɔːm/",
        exampleEn: "The government plans to reform the tax system.",
        exampleVi: "Chính phủ có kế hoạch cải cách hệ thống thuế.",
        doodleKey: "reform"
      }
    ],
    exercises: [
      {
        id: "ex_9_1",
        type: "fill_blank",
        sentence: "Caterpillars ______ into beautiful butterflies.",
        correctWord: "transform",
        options: ["transform", "conform", "perform", "deform"],
        explanation: "transform = biến hình, biến đổi diện mạo."
      }
    ]
  },
  {
    id: 10,
    root: "vert",
    variants: ["vers"],
    origin: "Latin (vertere)",
    meaningVi: "xoay, quay, đổi chiều",
    meaningEn: "to turn",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "reverse",
        badge: "20 · QUAY NGƯỢC LẠI, ĐẢO NGƯỢC",
        prefix: "re-",
        prefixMeaning: "ngược lại",
        root: "verse",
        rootMeaning: "quay",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "re- = lại + verse = quay",
        meaningVi: "đảo ngược, lùi lại",
        partOfSpeech: "v., adj.",
        ipa: "/rɪˈvɜːs/",
        exampleEn: "He put the car in reverse gear.",
        exampleVi: "Anh ấy vào số lùi cho xe ô tô.",
        doodleKey: "reverse"
      },
      {
        word: "convert",
        badge: "21 · CÙNG XOAY SANG HƯỚNG MỚI, CHUYỂN ĐỔI",
        prefix: "con-",
        prefixMeaning: "hoàn toàn",
        root: "vert",
        rootMeaning: "xoay",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "con- = hoàn toàn + vert = xoay",
        meaningVi: "chuyển đổi (đơn vị, niềm tin)",
        partOfSpeech: "v.",
        ipa: "/kənˈvɜːt/",
        exampleEn: "Convert dollars into Vietnamese Dong.",
        exampleVi: "Chuyển đổi đồng Đô la sang Việt Nam Đồng.",
        doodleKey: "convert"
      }
    ],
    exercises: [
      {
        id: "ex_10_1",
        type: "meaning",
        question: "Gốc 'vert / vers' trong invert, convert nghĩa là gì?",
        options: ["Xoay, quay hướng", "Đứng yên", "Nói nhỏ", "Đốt cháy"],
        correctIndex: 0,
        explanation: "'vertere' trong tiếng Latin nghĩa là quay, lộn, xoay."
      }
    ]
  },
  {
    id: 11,
    root: "vid",
    variants: ["vis"],
    origin: "Latin (videre)",
    meaningVi: "nhìn thấy, trông thấy",
    meaningEn: "to see",
    category: "perception",
    categoryVi: "Nhìn & Cảm nhận",
    words: [
      {
        word: "visible",
        badge: "22 · CÓ THỂ NHÌN THẤY, HIỆN RÕ",
        prefix: "",
        prefixMeaning: "",
        root: "vis",
        rootMeaning: "nhìn",
        suffix: "-ible",
        suffixMeaning: "có thể",
        breakdownFormula: "vis = nhìn + -ible = có thể",
        meaningVi: "có thể nhìn thấy",
        partOfSpeech: "adj.",
        ipa: "/ˈvɪzəbl/",
        exampleEn: "The stars are visible on clear nights.",
        exampleVi: "Những ngôi sao có thể nhìn thấy vào đêm quang mây.",
        doodleKey: "visible"
      },
      {
        word: "revise",
        badge: "23 · NHÌN LẠI ĐỂ SỬA, ÔN TẬP",
        prefix: "re-",
        prefixMeaning: "lại",
        root: "vise",
        rootMeaning: "nhìn",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "re- = lại + vise = nhìn",
        meaningVi: "ôn tập, xem lại chỉnh sửa",
        partOfSpeech: "v.",
        ipa: "/rɪˈvaɪz/",
        exampleEn: "I need to revise for my English exam.",
        exampleVi: "Tôi cần ôn tập cho kỳ thi tiếng Anh.",
        doodleKey: "revise"
      }
    ],
    exercises: [
      {
        id: "ex_11_1",
        type: "fill_blank",
        sentence: "Fog made the mountain peak barely ______.",
        correctWord: "visible",
        options: ["visible", "audible", "tangible", "invisible"],
        explanation: "visible = có thể nhìn thấy được bằng mắt."
      }
    ]
  },
  {
    id: 12,
    root: "aud",
    variants: ["audit"],
    origin: "Latin (audire)",
    meaningVi: "nghe",
    meaningEn: "to hear, listen",
    category: "perception",
    categoryVi: "Nhìn & Cảm nhận",
    words: [
      {
        word: "audience",
        badge: "24 · NHỮNG NGƯỜI LẮNG NGHE, KHÁN GIẢ",
        prefix: "",
        prefixMeaning: "",
        root: "aud",
        rootMeaning: "nghe",
        suffix: "-ience",
        suffixMeaning: "tập hợp người",
        breakdownFormula: "aud = nghe + -ience = người nghe",
        meaningVi: "khán giả, thính giả",
        partOfSpeech: "n.",
        ipa: "/ˈɔːdiəns/",
        exampleEn: "The audience clapped enthusiastically.",
        exampleVi: "Khán giả vỗ tay nhiệt liệt.",
        doodleKey: "audience"
      },
      {
        word: "audible",
        badge: "25 · CÓ THỂ NGHE THẤY ĐƯỢC",
        prefix: "",
        prefixMeaning: "",
        root: "aud",
        rootMeaning: "nghe",
        suffix: "-ible",
        suffixMeaning: "có thể",
        breakdownFormula: "aud = nghe + -ible = có thể",
        meaningVi: "nghe rõ, có thể nghe được",
        partOfSpeech: "adj.",
        ipa: "/ˈɔːdəbl/",
        exampleEn: "His whisper was barely audible.",
        exampleVi: "Tiếng thì thầm của anh ấy hầu như không nghe rõ.",
        doodleKey: "audible"
      }
    ],
    exercises: [
      {
        id: "ex_12_1",
        type: "meaning",
        question: "Gốc 'aud' trong audio, auditorium, audible có nghĩa là gì?",
        options: ["Nghe, âm thanh", "Nhìn, hình ảnh", "Chạm vào", "Nếm thử"],
        correctIndex: 0,
        explanation: "'audire' trong tiếng Latin nghĩa là lắng nghe."
      }
    ]
  },
  {
    id: 13,
    root: "sens",
    variants: ["sent"],
    origin: "Latin (sentire)",
    meaningVi: "cảm nhận, nhận thức",
    meaningEn: "to feel, perceive",
    category: "perception",
    categoryVi: "Nhìn & Cảm nhận",
    words: [
      {
        word: "sensitive",
        badge: "26 · DỄ CẢM NHẬN, NHẠY CẢM",
        prefix: "",
        prefixMeaning: "",
        root: "sens",
        rootMeaning: "cảm nhận",
        suffix: "-itive",
        suffixMeaning: "có tính chất",
        breakdownFormula: "sens = cảm nhận + -itive = có tính",
        meaningVi: "nhạy cảm, tinh tế",
        partOfSpeech: "adj.",
        ipa: "/ˈsensətɪv/",
        exampleEn: "She is very sensitive to other people's feelings.",
        exampleVi: "Cô ấy rất nhạy cảm với cảm xúc của người khác.",
        doodleKey: "sensitive"
      },
      {
        word: "consent",
        badge: "27 · CÙNG CẢM NGHĨ, ĐỒNG THUẬN",
        prefix: "con-",
        prefixMeaning: "cùng nhau",
        root: "sent",
        rootMeaning: "cảm nghĩ",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "con- = cùng + sent = cảm nhận",
        meaningVi: "đồng thuận, tán thành",
        partOfSpeech: "n., v.",
        ipa: "/kənˈsent/",
        exampleEn: "Both parties signed the agreement by mutual consent.",
        exampleVi: "Hai bên ký thỏa thuận với sự đồng thuận chung.",
        doodleKey: "consent"
      }
    ],
    exercises: [
      {
        id: "ex_13_1",
        type: "meaning",
        question: "Gốc 'sens / sent' mang ý nghĩa gì?",
        options: ["Cảm nhận, cảm giác", "Chạy trốn", "Xây dựng", "Vẽ hình"],
        correctIndex: 0,
        explanation: "sentire = cảm nhận, giác quan."
      }
    ]
  },
  {
    id: 14,
    root: "tang",
    variants: ["tact"],
    origin: "Latin (tangere)",
    meaningVi: "chạm, tiếp xúc",
    meaningEn: "to touch",
    category: "perception",
    categoryVi: "Nhìn & Cảm nhận",
    words: [
      {
        word: "contact",
        badge: "28 · CHẠM VÀO NHAU, LIÊN LẠC",
        prefix: "con-",
        prefixMeaning: "với nhau",
        root: "tact",
        rootMeaning: "chạm",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "con- = cùng + tact = chạm",
        meaningVi: "liên lạc, tiếp xúc",
        partOfSpeech: "n., v.",
        ipa: "/ˈkɒntækt/",
        exampleEn: "Feel free to contact me anytime.",
        exampleVi: "Cứ thoải mái liên lạc với tôi bất cứ lúc nào.",
        doodleKey: "contact"
      },
      {
        word: "tangible",
        badge: "29 · CÓ THỂ SỜ CHẠM ĐƯỢC, HỮU HÌNH",
        prefix: "",
        prefixMeaning: "",
        root: "tang",
        rootMeaning: "chạm",
        suffix: "-ible",
        suffixMeaning: "có thể",
        breakdownFormula: "tang = chạm + -ible = có thể",
        meaningVi: "hữu hình, thực tế",
        partOfSpeech: "adj.",
        ipa: "/ˈtændʒəbl/",
        exampleEn: "We want tangible results from our hard work.",
        exampleVi: "Chúng tôi muốn kết quả hữu hình từ sự nỗ lực.",
        doodleKey: "tangible"
      }
    ],
    exercises: [
      {
        id: "ex_14_1",
        type: "fill_blank",
        sentence: "Please ______ customer service if you have questions.",
        correctWord: "contact",
        options: ["contact", "contract", "distract", "retract"],
        explanation: "contact = liên hệ, tiếp xúc."
      }
    ]
  },
  {
    id: 15,
    root: "scop",
    variants: [],
    origin: "Greek (skopein)",
    meaningVi: "quan sát, nhìn ngắm",
    meaningEn: "to view, examine",
    category: "perception",
    categoryVi: "Nhìn & Cảm nhận",
    words: [
      {
        word: "telescope",
        badge: "30 · NHÌN XA, KÍNH THIÊN VĂN",
        prefix: "tele-",
        prefixMeaning: "ở xa",
        root: "scope",
        rootMeaning: "quan sát",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "tele- = xa + scope = ngắm",
        meaningVi: "kính thiên văn",
        partOfSpeech: "n.",
        ipa: "/ˈtelɪskəʊp/",
        exampleEn: "Astronomers view distant planets with a telescope.",
        exampleVi: "Các nhà thiên văn ngắm hành tinh xa qua kính thiên văn.",
        doodleKey: "telescope"
      },
      {
        word: "microscope",
        badge: "31 · NHÌN VẬT SIÊU NHỎ, KÍNH HIỂN VI",
        prefix: "micro-",
        prefixMeaning: "siêu nhỏ",
        root: "scope",
        rootMeaning: "quan sát",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "micro- = nhỏ + scope = ngắm",
        meaningVi: "kính hiển vi",
        partOfSpeech: "n.",
        ipa: "/ˈmaɪkrəskəʊp/",
        exampleEn: "Bacteria can be seen under a microscope.",
        exampleVi: "Vi khuẩn có thể được nhìn thấy dưới kính hiển vi.",
        doodleKey: "microscope"
      }
    ],
    exercises: [
      {
        id: "ex_15_1",
        type: "meaning",
        question: "Gốc Hy Lạp 'scop' nghĩa là gì?",
        options: ["Quan sát, nhìn", "Đo nhiệt độ", "Nghe trộm", "Viết thư"],
        correctIndex: 0,
        explanation: "skopein = ngắm nhìn, soi xét."
      }
    ]
  },
  {
    id: 16,
    root: "phon",
    variants: [],
    origin: "Greek (phone)",
    meaningVi: "âm thanh, tiếng nói",
    meaningEn: "sound, voice",
    category: "communication",
    categoryVi: "Nói & Viết",
    words: [
      {
        word: "symphony",
        badge: "32 · HÒA CÙNG TIẾNG NÓI, BẢN GIAO HƯỞNG",
        prefix: "sym-",
        prefixMeaning: "cùng nhau",
        root: "phony",
        rootMeaning: "âm thanh",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "sym- = hòa hợp + phony = âm thanh",
        meaningVi: "bản giao hưởng",
        partOfSpeech: "n.",
        ipa: "/ˈsɪmfəni/",
        exampleEn: "Beethoven composed his famous ninth symphony.",
        exampleVi: "Beethoven đã sáng tác bản giao hưởng số chín nổi tiếng.",
        doodleKey: "symphony"
      },
      {
        word: "microphone",
        badge: "33 · THU ÂM NHỎ, MICRÔ",
        prefix: "micro-",
        prefixMeaning: "nhỏ",
        root: "phone",
        rootMeaning: "âm thanh",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "micro- = nhỏ + phone = tiếng",
        meaningVi: "micrô khuếch đại âm",
        partOfSpeech: "n.",
        ipa: "/ˈmaɪkrəfəʊn/",
        exampleEn: "Speak directly into the microphone.",
        exampleVi: "Hãy nói trực tiếp vào micrô.",
        doodleKey: "microphone"
      }
    ],
    exercises: [
      {
        id: "ex_16_1",
        type: "meaning",
        question: "Gốc 'phon' trong telephone, headphones có nghĩa là gì?",
        options: ["Âm thanh", "Ánh sáng", "Hình khối", "Chữ cái"],
        correctIndex: 0,
        explanation: "phone nghĩa là âm thanh, giọng nói."
      }
    ]
  },
  {
    id: 17,
    root: "graph",
    variants: ["gram"],
    origin: "Greek (graphein)",
    meaningVi: "viết, vẽ, ghi lại",
    meaningEn: "to write, draw, record",
    category: "communication",
    categoryVi: "Nói & Viết",
    words: [
      {
        word: "photograph",
        badge: "34 · VẼ BẰNG ÁNH SÁNG, BỨC ẢNH",
        prefix: "photo-",
        prefixMeaning: "ánh sáng",
        root: "graph",
        rootMeaning: "vẽ, ghi",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "photo- = ánh sáng + graph = vẽ ghi",
        meaningVi: "bức ảnh chụp",
        partOfSpeech: "n., v.",
        ipa: "/ˈfəʊtəɡrɑːf/",
        exampleEn: "She took a photograph of the sunrise.",
        exampleVi: "Cô ấy chụp một bức ảnh bình minh tuyệt đẹp.",
        doodleKey: "photograph"
      },
      {
        word: "autograph",
        badge: "35 · TỰ TAY VIẾT, CHỮ KÝ",
        prefix: "auto-",
        prefixMeaning: "tự mình",
        root: "graph",
        rootMeaning: "viết",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "auto- = tự thân + graph = viết",
        meaningVi: "chữ ký lưu niệm",
        partOfSpeech: "n., v.",
        ipa: "/ˈɔːtəɡrɑːf/",
        exampleEn: "Fans waited outside to get his autograph.",
        exampleVi: "Người hâm mộ đứng chờ để xin chữ ký của anh ấy.",
        doodleKey: "autograph"
      }
    ],
    exercises: [
      {
        id: "ex_17_1",
        type: "fill_blank",
        sentence: "He asked the author to sign an ______ in his book.",
        correctWord: "autograph",
        options: ["autograph", "biography", "paragraph", "diagram"],
        explanation: "autograph = chữ ký của người nổi tiếng."
      }
    ]
  },
  {
    id: 18,
    root: "log",
    variants: ["logue"],
    origin: "Greek (logos)",
    meaningVi: "lời nói, học thuyết, lý lẽ",
    meaningEn: "word, study, reason",
    category: "communication",
    categoryVi: "Nói & Viết",
    words: [
      {
        word: "dialogue",
        badge: "36 · LỜI QUA TIẾNG LẠI, ĐỐI THOẠI",
        prefix: "dia-",
        prefixMeaning: "qua lại",
        root: "logue",
        rootMeaning: "lời nói",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "dia- = qua lại + logue = lời",
        meaningVi: "cuộc đối thoại",
        partOfSpeech: "n.",
        ipa: "/ˈdaɪəlɒɡ/",
        exampleEn: "Constructive dialogue resolves conflict.",
        exampleVi: "Đối thoại mang tính xây dựng giúp giải quyết mâu thuẫn.",
        doodleKey: "dialogue"
      },
      {
        word: "logic",
        badge: "37 · NGUYÊN TẮC LÝ LẼ, LOGIC",
        prefix: "",
        prefixMeaning: "",
        root: "log",
        rootMeaning: "lý lẽ",
        suffix: "-ic",
        suffixMeaning: "thuộc về",
        breakdownFormula: "log = lý lẽ + -ic = thuộc",
        meaningVi: "lập luận logic, lý lẽ",
        partOfSpeech: "n.",
        ipa: "/ˈlɒdʒɪk/",
        exampleEn: "There is clear logic behind this decision.",
        exampleVi: "Có lý lẽ rất rõ ràng đằng sau quyết định này.",
        doodleKey: "logic"
      }
    ],
    exercises: [
      {
        id: "ex_18_1",
        type: "meaning",
        question: "Gốc 'log / logos' nghĩa là gì?",
        options: ["Lời nói, lý lẽ, học thuyết", "Vận động", "Xoay chiều", "Cắt tỉa"],
        correctIndex: 0,
        explanation: "logos có nghĩa là lời nói, tư duy lý luận."
      }
    ]
  },
  {
    id: 19,
    root: "voc",
    variants: ["vok"],
    origin: "Latin (vocare)",
    meaningVi: "gọi, tiếng nói",
    meaningEn: "to call, voice",
    category: "communication",
    categoryVi: "Nói & Viết",
    words: [
      {
        word: "vocal",
        badge: "38 · THUỘC VỀ GIỌNG NÓI, LÊN TIẾNG",
        prefix: "",
        prefixMeaning: "",
        root: "voc",
        rootMeaning: "giọng nói",
        suffix: "-al",
        suffixMeaning: "thuộc về",
        breakdownFormula: "voc = giọng nói + -al = thuộc về",
        meaningVi: "thuộc giọng nói, to tiếng",
        partOfSpeech: "adj.",
        ipa: "/ˈvəʊkl/",
        exampleEn: "She is a vocal supporter of human rights.",
        exampleVi: "Cô ấy là một người lên tiếng ủng hộ nhân quyền mạnh mẽ.",
        doodleKey: "vocal"
      },
      {
        word: "provoke",
        badge: "39 · GỌI HƯỚNG RA TRƯỚC, KHIÊU KHÍCH",
        prefix: "pro-",
        prefixMeaning: "về phía trước",
        root: "voke",
        rootMeaning: "gọi",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pro- = ra trước + voke = gọi",
        meaningVi: "khiêu khích, kích động",
        partOfSpeech: "v.",
        ipa: "/prəˈvəʊk/",
        exampleEn: "Do not provoke the dog when it eats.",
        exampleVi: "Đừng khiêu khích con chó khi nó đang ăn.",
        doodleKey: "provoke"
      }
    ],
    exercises: [
      {
        id: "ex_19_1",
        type: "fill_blank",
        sentence: "Singers need to protect their ______ cords.",
        correctWord: "vocal",
        options: ["vocal", "local", "focal", "moral"],
        explanation: "vocal cords = dây thanh quản."
      }
    ]
  },
  {
    id: 20,
    root: "clam",
    variants: ["claim"],
    origin: "Latin (clamare)",
    meaningVi: "la hét, hô to, tuyên bố",
    meaningEn: "to cry out, shout",
    category: "communication",
    categoryVi: "Nói & Viết",
    words: [
      {
        word: "proclaim",
        badge: "40 · LA LỚN TRƯỚC BÀN DÂN, CÔNG BỐ",
        prefix: "pro-",
        prefixMeaning: "công khai ra trước",
        root: "claim",
        rootMeaning: "hô to",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pro- = ra trước + claim = hô to",
        meaningVi: "tuyên bố, công bố rộng rãi",
        partOfSpeech: "v.",
        ipa: "/prəˈkleɪm/",
        exampleEn: "They proclaimed independence to the world.",
        exampleVi: "Họ tuyên bố nền độc lập trước toàn thế giới.",
        doodleKey: "proclaim"
      },
      {
        word: "exclaim",
        badge: "41 · HÔ LỚN RA NGOÀI, THỐT LÊN",
        prefix: "ex-",
        prefixMeaning: "ra ngoài",
        root: "claim",
        rootMeaning: "la to",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "ex- = ra ngoài + claim = la to",
        meaningVi: "thốt lên, kêu lên ngạc nhiên",
        partOfSpeech: "v.",
        ipa: "/ɪkˈskleɪm/",
        exampleEn: "'What a wonderful gift!' she exclaimed.",
        exampleVi: "'Thật là món quà tuyệt vời!' cô ấy thốt lên.",
        doodleKey: "exclaim"
      }
    ],
    exercises: [
      {
        id: "ex_20_1",
        type: "meaning",
        question: "Gốc 'clam / claim' trong exclaim, reclaim nghĩa là gì?",
        options: ["Hô to, tuyên bố", "Chạy trốn", "Cười lớn", "Nhìn ngắm"],
        correctIndex: 0,
        explanation: "clamare nghĩa là hô to, kêu to."
      }
    ]
  },
  {
    id: 21,
    root: "mot",
    variants: ["mov", "mob"],
    origin: "Latin (movere)",
    meaningVi: "di chuyển, chuyển động",
    meaningEn: "to move",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "promote",
        badge: "42 · ĐẨY TIẾN LÊN PHÍA TRƯỚC, THĂNG CHỨC / QUẢNG BÁ",
        prefix: "pro-",
        prefixMeaning: "tiến về trước",
        root: "mote",
        rootMeaning: "di chuyển",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pro- = tới trước + mote = chuyển",
        meaningVi: "quảng bá, thăng chức",
        partOfSpeech: "v.",
        ipa: "/prəˈməʊt/",
        exampleEn: "He was promoted to project manager.",
        exampleVi: "Anh ấy được thăng chức lên làm quản lý dự án.",
        doodleKey: "promote"
      },
      {
        word: "mobile",
        badge: "43 · DỄ DÀNG DI CHUYỂN, LƯU ĐỘNG",
        prefix: "",
        prefixMeaning: "",
        root: "mob",
        rootMeaning: "chuyển động",
        suffix: "-ile",
        suffixMeaning: "dễ dàng",
        breakdownFormula: "mob = chuyển động + -ile = dễ",
        meaningVi: "di động, lưu động",
        partOfSpeech: "adj.",
        ipa: "/ˈməʊbaɪl/",
        exampleEn: "Mobile phones connect people worldwide.",
        exampleVi: "Điện thoại di động kết nối mọi người trên toàn cầu.",
        doodleKey: "mobile"
      }
    ],
    exercises: [
      {
        id: "ex_21_1",
        type: "fill_blank",
        sentence: "Hard work helped her get ______ to senior director.",
        correctWord: "promoted",
        options: ["promoted", "demoted", "removed", "remoted"],
        explanation: "promote = thăng chức."
      }
    ]
  },
  {
    id: 22,
    root: "pel",
    variants: ["puls"],
    origin: "Latin (pellere)",
    meaningVi: "đẩy, thúc ép",
    meaningEn: "to drive, push",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "propel",
        badge: "44 · ĐẨY VỀ PHÍA TRƯỚC, ĐẨY ĐI",
        prefix: "pro-",
        prefixMeaning: "về phía trước",
        root: "pel",
        rootMeaning: "đẩy",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pro- = ra trước + pel = đẩy",
        meaningVi: "đẩy về phía trước, thúc đẩy",
        partOfSpeech: "v.",
        ipa: "/prəˈpel/",
        exampleEn: "Wind sails propel the boat smoothly.",
        exampleVi: "Những cánh buồm đẩy con thuyền lướt êm ái.",
        doodleKey: "propel"
      },
      {
        word: "impulse",
        badge: "45 · SỰ THÚC ĐẨY TỪ BÊN TRONG, BỐC ĐỒNG",
        prefix: "in-",
        prefixMeaning: "vào trong",
        root: "pulse",
        rootMeaning: "đẩy",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "im- (in-) = trong + pulse = thúc đẩy",
        meaningVi: "xung động, sự bốc đồng",
        partOfSpeech: "n.",
        ipa: "/ˈɪmpʌls/",
        exampleEn: "He bought the gadget on an impulse.",
        exampleVi: "Anh ấy mua món đồ đó theo một sự bốc đồng nhất thời.",
        doodleKey: "impulse"
      }
    ],
    exercises: [
      {
        id: "ex_22_1",
        type: "meaning",
        question: "Gốc 'pel / puls' trong compel, propel, pulse mang nghĩa gì?",
        options: ["Đẩy, thúc ép", "Níu giữ", "Uốn lượn", "Chôn cất"],
        correctIndex: 0,
        explanation: "pellere có nghĩa là thúc giục, đẩy tới."
      }
    ]
  },
  {
    id: 23,
    root: "ced",
    variants: ["ceed", "cess"],
    origin: "Latin (cedere)",
    meaningVi: "đi, bước, nhượng bộ",
    meaningEn: "to go, yield",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "proceed",
        badge: "46 · TIẾN BƯỚC VỀ TRƯỚC, TIẾP TỤC",
        prefix: "pro-",
        prefixMeaning: "về phía trước",
        root: "ceed",
        rootMeaning: "đi",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pro- = tới trước + ceed = đi",
        meaningVi: "tiến hành, tiếp tục bước đi",
        partOfSpeech: "v.",
        ipa: "/prəˈsiːd/",
        exampleEn: "Please proceed to boarding gate number 5.",
        exampleVi: "Xin vui lòng di chuyển đến cửa lên máy bay số 5.",
        doodleKey: "proceed"
      },
      {
        word: "exceed",
        badge: "47 · BƯỚC VƯỢT RA NGOÀI, VƯỢT QUÁ",
        prefix: "ex-",
        prefixMeaning: "ra ngoài, quá mức",
        root: "ceed",
        rootMeaning: "bước đi",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "ex- = ngoài + ceed = đi",
        meaningVi: "vượt quá giới hạn",
        partOfSpeech: "v.",
        ipa: "/ɪkˈsiːd/",
        exampleEn: "Do not exceed the posted speed limit.",
        exampleVi: "Đừng chạy xe vượt quá giới hạn tốc độ quy định.",
        doodleKey: "exceed"
      }
    ],
    exercises: [
      {
        id: "ex_23_1",
        type: "fill_blank",
        sentence: "Drivers must not ______ the legal speed limit.",
        correctWord: "exceed",
        options: ["exceed", "proceed", "succeed", "recede"],
        explanation: "exceed = vượt quá giới hạn."
      }
    ]
  },
  {
    id: 24,
    root: "ven",
    variants: ["vent"],
    origin: "Latin (venire)",
    meaningVi: "đến, tới",
    meaningEn: "to come",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "prevent",
        badge: "48 · ĐẾN CHẶN TRƯỚC, NGĂN NGỪA",
        prefix: "pre-",
        prefixMeaning: "trước",
        root: "vent",
        rootMeaning: "đến",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pre- = trước + vent = đến",
        meaningVi: "ngăn chặn, phòng ngừa",
        partOfSpeech: "v.",
        ipa: "/prɪˈvent/",
        exampleEn: "Vaccines help prevent dangerous diseases.",
        exampleVi: "Vắc xin giúp ngăn ngừa các bệnh nguy hiểm.",
        doodleKey: "prevent"
      },
      {
        word: "invent",
        badge: "49 · TÌM TỚI ĐIỀU MỚI, PHÁT MINH",
        prefix: "in-",
        prefixMeaning: "vào trong, tại",
        root: "vent",
        rootMeaning: "đến",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "in- = vào + vent = đến",
        meaningVi: "phát minh, sáng chế",
        partOfSpeech: "v.",
        ipa: "/ɪnˈvent/",
        exampleEn: "Edison helped invent the electric light bulb.",
        exampleVi: "Edison đã giúp phát minh ra bóng đèn điện.",
        doodleKey: "invent"
      }
    ],
    exercises: [
      {
        id: "ex_24_1",
        type: "fill_blank",
        sentence: "Wearing masks helps ______ the spread of viruses.",
        correctWord: "prevent",
        options: ["prevent", "invent", "convene", "intervene"],
        explanation: "prevent = ngăn ngừa sự lây lan."
      }
    ]
  },
  {
    id: 25,
    root: "curr",
    variants: ["curs"],
    origin: "Latin (currere)",
    meaningVi: "chạy, trôi chảy",
    meaningEn: "to run, flow",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "current",
        badge: "50 · ĐANG CHẢY, DÒNG CHẢY / HIỆN HÀNH",
        prefix: "",
        prefixMeaning: "",
        root: "curr",
        rootMeaning: "chảy",
        suffix: "-ent",
        suffixMeaning: "đang diễn ra",
        breakdownFormula: "curr = chạy chảy + -ent = đang",
        meaningVi: "hiện tại, dòng chảy",
        partOfSpeech: "adj., n.",
        ipa: "/ˈkʌrənt/",
        exampleEn: "What is your current address?",
        exampleVi: "Địa chỉ hiện tại của bạn là gì?",
        doodleKey: "current"
      },
      {
        word: "recur",
        badge: "51 · CHẠY LẶP LẠI, TÁI DIỄN",
        prefix: "re-",
        prefixMeaning: "lại",
        root: "cur",
        rootMeaning: "chạy",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "re- = lặp lại + cur = chạy",
        meaningVi: "tái diễn, lặp lại",
        partOfSpeech: "v.",
        ipa: "/rɪˈkɜː/",
        exampleEn: "The same software bug recurred after reboot.",
        exampleVi: "Lỗi phần mềm cũ lại tái diễn sau khi khởi động lại.",
        doodleKey: "recur"
      }
    ],
    exercises: [
      {
        id: "ex_25_1",
        type: "meaning",
        question: "Gốc 'curr / curs' trong current, excursion, cursor nghĩa là gì?",
        options: ["Chạy, trôi đi", "Ngủ yên", "Ăn uống", "Ngắm nhìn"],
        correctIndex: 0,
        explanation: "currere trong tiếng Latin nghĩa là chạy nhanh, trôi chảy."
      }
    ]
  }
];
