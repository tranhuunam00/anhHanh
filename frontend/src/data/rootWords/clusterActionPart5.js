/**
 * Cụm 3: Hành động & Di chuyển (Action & Movement) - Phần 5
 * Gốc 9: pel/puls (đẩy, thúc ép, xua đuổi)
 * Đạt chuẩn >= 8 từ/gốc, đầy đủ tiền tố/gốc/hậu tố, IPA, ví dụ và bài tập phản xạ
 * Tuân thủ Rule 4: File code < 500 dòng
 */

export const ACTION_ROOTS_PART5 = [
  {
    id: 22,
    root: "pel",
    variants: ["puls", "pellere"],
    origin: "Latin (pellere / pulsum)",
    meaningVi: "đẩy, thúc ép, xua đuổi",
    meaningEn: "to drive, push, strike",
    category: "action",
    categoryVi: "Hành động & Di chuyển",
    words: [
      {
        word: "compel",
        badge: "01 · DỒN SỨC ĐẨY CÙNG LÚC, ÉP BUỘC",
        prefix: "com-",
        prefixMeaning: "cùng nhau, dồn dập",
        root: "pel",
        rootMeaning: "đẩy, ép",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "com- = dồn dập + pel = thúc đẩy",
        meaningVi: "ép buộc, cưỡng bách làm gì",
        partOfSpeech: "v.",
        ipa: "/kəmˈpel/",
        exampleEn: "Strong evidence compelled him to tell the truth.",
        exampleVi: "Bằng chứng xác thực đã ép buộc anh ấy phải nói ra sự thật.",
        doodleKey: "compel"
      },
      {
        word: "expel",
        badge: "02 · ĐẨY TRỤC XUẤT RA NGOÀI",
        prefix: "ex-",
        prefixMeaning: "ra ngoài",
        root: "pel",
        rootMeaning: "đẩy xua",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "ex- = ra ngoài + pel = đẩy xua",
        meaningVi: "trục xuất, đuổi học, tống ra",
        partOfSpeech: "v.",
        ipa: "/ɪkˈspel/",
        exampleEn: "The student was expelled for breaking school rules.",
        exampleVi: "Học sinh đã bị đuổi học vì vi phạm nghiêm trọng nội quy trường.",
        doodleKey: "expel"
      },
      {
        word: "propel",
        badge: "03 · ĐẨY MẠNH VỀ PHÍA TRƯỚC",
        prefix: "pro-",
        prefixMeaning: "về phía trước",
        root: "pel",
        rootMeaning: "đẩy",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "pro- = về trước + pel = đẩy mạnh",
        meaningVi: "đẩy tới trước, trợ lực tiến lên",
        partOfSpeech: "v.",
        ipa: "/prəˈpel/",
        exampleEn: "Rocket engines propel spacecraft into orbit.",
        exampleVi: "Động cơ tên lửa đẩy tàu vũ trụ tiến vào quỹ đạo.",
        doodleKey: "propel"
      },
      {
        word: "repel",
        badge: "04 · ĐẨY LÙI RA XA, CHỐNG CỰ",
        prefix: "re-",
        prefixMeaning: "ngược lại",
        root: "pel",
        rootMeaning: "đẩy",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "re- = lùi lại + pel = đẩy xua",
        meaningVi: "đẩy lùi quân địch; chống thấm nước",
        partOfSpeech: "v.",
        ipa: "/rɪˈpel/",
        exampleEn: "This spray effectively repels mosquitoes and insects.",
        exampleVi: "Bình xịt này xua đuổi muỗi và côn trùng rất hiệu quả.",
        doodleKey: "repel"
      },
      {
        word: "impulse",
        badge: "05 · SỰ THÚC ĐẨY BÊN TRONG, BỐC ĐỒNG",
        prefix: "im-",
        prefixMeaning: "vào trong",
        root: "pulse",
        rootMeaning: "đẩy",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "im- (in-) = bên trong + pulse = thúc đẩy",
        meaningVi: "thôi thúc bốc đồng; xung động thần kinh",
        partOfSpeech: "n.",
        ipa: "/ˈɪmpʌls/",
        exampleEn: "She bought the dress on an impulse.",
        exampleVi: "Cô ấy đã mua chiếc váy vì một thoáng bốc đồng.",
        doodleKey: "impulse"
      },
      {
        word: "repulsive",
        badge: "06 · CÓ XU HƯỚNG ĐẨY LÙI, GHÊ TỞM",
        prefix: "re-",
        prefixMeaning: "ngược lại",
        root: "puls",
        rootMeaning: "đẩy",
        suffix: "-ive",
        suffixMeaning: "có tính chất",
        breakdownFormula: "re- = đẩy ra + puls = đẩy + -ive = tính chất",
        meaningVi: "đáng ghê tởm, khiến người khác né tránh",
        partOfSpeech: "adj.",
        ipa: "/rɪˈpʌlsɪv/",
        exampleEn: "The decaying rubbish had a repulsive smell.",
        exampleVi: "Rác rưởi phân hủy bốc lên một mùi hôi ghê tởm.",
        doodleKey: "repulsive"
      },
      {
        word: "dispel",
        badge: "07 · ĐẨY XUA TAN BIẾN ĐI KHẮP NƠI",
        prefix: "dis-",
        prefixMeaning: "tan biến, rời rạc",
        root: "pel",
        rootMeaning: "đẩy xua",
        suffix: "",
        suffixMeaning: "",
        breakdownFormula: "dis- = tan biến + pel = xua đuổi",
        meaningVi: "xua tan nỗi sợ hãi, nghi ngờ",
        partOfSpeech: "v.",
        ipa: "/dɪˈspel/",
        exampleEn: "The doctor's reassuring words dispelled her anxiety.",
        exampleVi: "Những lời trấn an của bác sĩ đã xua tan đi nỗi lo âu của cô ấy.",
        doodleKey: "dispel"
      },
      {
        word: "pulse",
        badge: "08 · NHỊP ĐẨY MẠCH MÁU, NHỊP TIM",
        prefix: "",
        prefixMeaning: "",
        root: "puls",
        rootMeaning: "nhịp đập, thúc đẩy",
        suffix: "-e",
        suffixMeaning: "",
        breakdownFormula: "puls = nhịp đẩy sinh mệnh",
        meaningVi: "mạch đập, nhịp tim",
        partOfSpeech: "n., v.",
        ipa: "/pʌls/",
        exampleEn: "The nurse gently felt the patient's steady pulse.",
        exampleVi: "Y tá nhẹ nhàng bắt nhịp mạch đập ổn định của bệnh nhân.",
        doodleKey: "pulse"
      }
    ],
    exercises: [
      {
        id: "ex_22_1",
        type: "fill_blank",
        sentence: "Powerful jet turbines ______ the aircraft forward at great speed.",
        correctWord: "propel",
        options: ["propel", "expel", "repel", "compel"],
        explanation: "propel forward = đẩy mạnh về phía trước."
      },
      {
        id: "ex_22_2",
        type: "assembly",
        prompt: "Ghép để tạo từ mang nghĩa: 'đẩy trục xuất ra bên ngoài'",
        correctWord: "expel",
        parts: [{ text: "ex-", type: "prefix" }, { text: "pel", type: "root" }],
        distractors: ["pro-", "re-", "ceed"],
        explanation: "ex- (ra ngoài) + pel (đẩy) = expel (trục xuất)."
      },
      {
        id: "ex_22_3",
        type: "meaning",
        question: "Gốc Latin 'pel / puls' mang ý nghĩa gì?",
        options: ["Đẩy, thúc ép, xua đuổi", "Nghe lời", "Ngồi yên", "Chạm vào"],
        correctIndex: 0,
        explanation: "pellere nghĩa là thúc đẩy, đẩy xua."
      }
    ]
  }
];

