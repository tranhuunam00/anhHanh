/**
 * Outlines for Task 1, Email, Paragraph, Free Writing & Language Guidelines
 * 100% Tiếng Việt chuẩn mực sư phạm.
 */

export const TASK1_OUTLINES = {
  dynamic: {
    title: "IELTS Task 1: Biểu đồ có biến thiên thời gian (Line / Bar / Table)",
    description: "Tập trung phân tích xu hướng tăng, giảm, dao động, đạt đỉnh hoặc chạm đáy qua các mốc thời gian.",
    sections: [
      {
        id: "intro",
        name: "1. Mở bài (Introduction)",
        wordTarget: "20 - 30 từ",
        components: [
          {
            label: "Paraphrase đề bài",
            guide: "Viết lại đề bài bằng 1 câu nêu rõ: Biểu đồ mô tả số liệu gì, ở quốc gia/khu vực nào, và trong khoảng thời gian từ năm nào đến năm nào."
          }
        ]
      },
      {
        id: "overview",
        name: "2. Tổng quan nổi bật (Overview)",
        wordTarget: "35 - 45 từ",
        components: [
          {
            label: "Điểm nổi bật 1: Xu hướng chung",
            guide: "Nêu xu hướng bao quát của các đối tượng (Ví dụ: Hầu hết các đối tượng đều tăng mạnh, trong khi một đối tượng duy nhất sụt giảm)."
          },
          {
            label: "Điểm nổi bật 2: Đối tượng dẫn đầu",
            guide: "Chỉ ra hạng mục luôn đứng đầu hoặc có sự thay đổi thứ bậc ngoạn mục nhất. TUYỆT ĐỐI KHÔNG đưa số liệu chi tiết vào đoạn Overview."
          }
        ]
      },
      {
        id: "body1",
        name: "3. Thân bài 1 (Body 1) - Nhóm đối tượng có xu hướng tăng / dẫn đầu",
        wordTarget: "45 - 55 từ",
        components: [
          {
            label: "Mô tả chi tiết kèm số liệu mốc thời gian",
            guide: "Trình bày số liệu tại năm khởi đầu -> sự biến thiên giữa kỳ (tăng vọt, dao động) -> số liệu tại năm kết thúc của nhóm đối tượng thứ nhất."
          }
        ]
      },
      {
        id: "body2",
        name: "4. Thân bài 2 (Body 2) - Nhóm đối tượng còn lại & So sánh đối chiếu",
        wordTarget: "45 - 55 từ",
        components: [
          {
            label: "Mô tả đối chiếu làm nổi bật sự khác biệt",
            guide: "Mô tả nhóm đối tượng giảm hoặc duy trì ổn định, liên tục so sánh tương quan cao hơn / thấp hơn so với nhóm ở Body 1."
          }
        ]
      }
    ]
  },

  static: {
    title: "IELTS Task 1: Biểu đồ không có thời gian (Pie Chart / Static Bar / Table)",
    description: "Tập trung so sánh tỷ trọng, thứ bậc cao nhất, thấp nhất và khoảng cách chênh lệch.",
    sections: [
      {
        id: "intro",
        name: "1. Mở bài (Introduction)",
        wordTarget: "20 - 30 từ",
        components: [
          {
            label: "Paraphrase đề bài",
            guide: "Nêu rõ biểu đồ so sánh các hạng mục nào, tại địa điểm nào trong một thời điểm duy nhất."
          }
        ]
      },
      {
        id: "overview",
        name: "2. Tổng quan (Overview)",
        wordTarget: "30 - 40 từ",
        components: [
          {
            label: "Hạng mục lớn nhất và nhỏ nhất",
            guide: "Chỉ ra đối tượng chiếm tỷ lệ áp đảo nhất và đối tượng chiếm thị phần khiêm tốn nhất."
          }
        ]
      },
      {
        id: "body1",
        name: "3. Thân bài 1 (Body 1) - Nhóm chiếm tỷ trọng cao",
        wordTarget: "50 - 55 từ",
        components: [
          {
            label: "Phân tích số liệu nhóm dẫn đầu",
            guide: "Báo cáo chi tiết số liệu của 2-3 hạng mục đứng đầu, làm rõ tỷ lệ phần trăm hoặc số lượng cụ thể."
          }
        ]
      },
      {
        id: "body2",
        name: "4. Thân bài 2 (Body 2) - Nhóm chiếm tỷ trọng thấp",
        wordTarget: "45 - 50 từ",
        components: [
          {
            label: "Phân tích số liệu nhóm còn lại & So sánh gấp bao nhiêu lần",
            guide: "Báo cáo các hạng mục nhỏ hơn, so sánh sự chênh lệch (Ví dụ: Thấp hơn gấp ba lần so với nhóm ở Body 1)."
          }
        ]
      }
    ]
  },

  process: {
    title: "IELTS Task 1: Dạng Quy trình (Process / Life Cycle)",
    description: "Mô tả tuần tự các bước sản xuất nhân tạo hoặc vòng đời tự nhiên.",
    sections: [
      {
        id: "intro",
        name: "1. Mở bài (Introduction)",
        wordTarget: "20 - 30 từ",
        components: [
          {
            label: "Paraphrase đề bài",
            guide: "Giới thiệu quy trình sản xuất vật liệu gì hoặc chu trình sinh trưởng của loài sinh vật nào."
          }
        ]
      },
      {
        id: "overview",
        name: "2. Tổng quan (Overview)",
        wordTarget: "30 - 40 từ",
        components: [
          {
            label: "Số giai đoạn & Điểm đầu - Điểm cuối",
            guide: "Quy trình bao gồm tổng cộng bao nhiêu bước, bắt đầu từ nguyên liệu thô nào và kết thúc bằng thành phẩm gì."
          }
        ]
      },
      {
        id: "body1",
        name: "3. Thân bài 1 (Body 1) - Các giai đoạn ban đầu",
        wordTarget: "50 - 55 từ",
        components: [
          {
            label: "Mô tả từ bước 1 đến bước trung gian",
            guide: "Sử dụng thể bị động và từ nối tuần tự (First of all, subsequently, following this) để tả các khâu xử lý thô."
          }
        ]
      },
      {
        id: "body2",
        name: "4. Thân bài 2 (Body 2) - Các giai đoạn hoàn thiện",
        wordTarget: "50 - 55 từ",
        components: [
          {
            label: "Mô tả từ bước chế biến đến đóng gói/xuất xưởng",
            guide: "Mô tả các khâu kiểm định chất lượng, đóng chai hoặc phân phối ra thị trường người tiêu dùng."
          }
        ]
      }
    ]
  },

  map: {
    title: "IELTS Task 1: Dạng Bản đồ / Quy hoạch (Map)",
    description: "Mô tả những thay đổi về mặt cơ sở hạ tầng, cảnh quan đô thị giữa các mốc thời gian.",
    sections: [
      {
        id: "intro",
        name: "1. Mở bài (Introduction)",
        wordTarget: "20 - 30 từ",
        components: [
          {
            label: "Paraphrase đề bài",
            guide: "Giới thiệu 2 bản đồ mô tả sự chuyển biến diện mạo của khu vực/ngôi làng/trường học qua 2 thời điểm."
          }
        ]
      },
      {
        id: "overview",
        name: "2. Tổng quan (Overview)",
        wordTarget: "30 - 40 từ",
        components: [
          {
            label: "Xu hướng hiện đại hóa & Tiện ích",
            guide: "Nhận xét tổng thể: Khu vực trở nên hiện đại hóa hơn, cây xanh bị thu hẹp và thêm nhiều khu nhà ở/tiện ích thương mại."
          }
        ]
      },
      {
        id: "body1",
        name: "3. Thân bài 1 (Body 1) - Sự thay đổi ở khu vực chính (Phía Bắc/Tây)",
        wordTarget: "50 - 55 từ",
        components: [
          {
            label: "Mô tả các công trình bị phá bỏ hoặc xây mới",
            guide: "Dùng từ vựng phương vị (in the north-east, adjacent to) và động từ thay đổi (demolished, replaced by, erected)."
          }
        ]
      },
      {
        id: "body2",
        name: "4. Thân bài 2 (Body 2) - Sự thay đổi ở khu vực còn lại (Phía Nam/Đông)",
        wordTarget: "50 - 55 từ",
        components: [
          {
            label: "Mô tả các tiện ích giao thông và công trình bảo tồn",
            guide: "Mô tả mở rộng đường sá, bãi đỗ xe hoặc các khu vực công cộng còn giữ nguyên trạng."
          }
        ]
      }
    ]
  }
};

export const OTHER_GENRES_OUTLINES = {
  // Business Email
  email: {
    title: "Business Email (Thư điện tử thương mại chuyên nghiệp)",
    description: "Cấu trúc thư công việc mạch lạc, trang trọng, hướng tới giải quyết vấn đề nhanh chóng.",
    sections: [
      {
        id: "subject",
        name: "1. Tiêu đề thư (Subject Line)",
        components: [
          {
            label: "Rõ ràng, ngắn gọn & Đúng trọng tâm",
            guide: "Nêu trực tiếp mục đích thư (Ví dụ: [Dự án X] - Cập nhật tiến độ & Đề xuất giải pháp tuần 42)."
          }
        ]
      },
      {
        id: "salutation",
        name: "2. Lời chào trang trọng (Salutation)",
        components: [
          {
            label: "Chào hỏi chuẩn mực",
            guide: "Dear Mr./Ms. [Họ] (Trang trọng) hoặc Dear [Tên] / Dear Team (Nội bộ)."
          }
        ]
      },
      {
        id: "opening",
        name: "3. Mục đích viết thư (Opening & Reason for Writing)",
        components: [
          {
            label: "Nêu mục đích ngay trong 1-2 câu đầu",
            guide: "Đi thẳng vào lý do liên hệ (I am writing to inquire about / to follow up on...)."
          }
        ]
      },
      {
        id: "details",
        name: "4. Nội dung chi tiết (Key Details & Discussion)",
        components: [
          {
            label: "Trình bày thông tin theo ý gạch đầu dòng rõ ràng",
            guide: "Nêu các mốc thời gian, số liệu, vấn đề phát sinh hoặc nội dung thỏa thuận cụ thể."
          }
        ]
      },
      {
        id: "action",
        name: "5. Kêu gọi hành động & Thời hạn (Call to Action & Deadline)",
        components: [
          {
            label: "Nêu rõ hành động mong đợi tiếp theo",
            guide: "Yêu cầu phản hồi hoặc gửi tài liệu kèm thời hạn chót cụ thể (Please review and confirm by Friday)."
          }
        ]
      },
      {
        id: "closing",
        name: "6. Lời kết & Ký tên (Sign-off & Signature)",
        components: [
          {
            label: "Kết thư chuyên nghiệp",
            guide: "Best regards, / Sincerely, kèm họ tên đầy đủ, chức danh và thông tin liên hệ."
          }
        ]
      }
    ]
  },

  // Đoạn văn ngắn (Paragraph)
  paragraph: {
    title: "Đoạn văn ngắn học thuật (Mô hình PEEL / TEEL)",
    description: "Cấu trúc 1 đoạn văn chuẩn mực, phát triển lập luận hoàn chỉnh và cô đọng.",
    sections: [
      {
        id: "topic_sentence",
        name: "1. Point / Topic Sentence (Câu chủ đề)",
        components: [
          {
            label: "Nêu ý chính bao quát toàn đoạn",
            guide: "Một câu duy nhất tuyên bố rõ ràng quan điểm hoặc nội dung trọng tâm của toàn bộ đoạn văn."
          }
        ]
      },
      {
        id: "explanation",
        name: "2. Explanation / Elaboration (Luận giải chuyên sâu)",
        components: [
          {
            label: "Phân tích nguyên nhân và cơ chế",
            guide: "Đi sâu giải thích lý do tại sao câu chủ đề lại đúng, hiện tượng này tác động như thế nào."
          }
        ]
      },
      {
        id: "evidence",
        name: "3. Evidence / Example (Dẫn chứng thực tế)",
        components: [
          {
            label: "Đưa ra bằng chứng hoặc ví dụ cụ thể",
            guide: "Dẫn số liệu, sự thật khách quan hoặc một trường hợp điển hình làm tăng tính thuyết phục."
          }
        ]
      },
      {
        id: "link",
        name: "4. Link / Concluding (Câu kết đoạn)",
        components: [
          {
            label: "Chốt lại vấn đề & Liên kết ý",
            guide: "Đúc kết tầm quan trọng của ý chính và tạo câu nối hoàn hảo khép lại đoạn văn."
          }
        ]
      }
    ]
  },

  // Viết tự do (Free Writing)
  free: {
    title: "Viết tự do / Nhật ký / Góc nhìn cá nhân",
    description: "Bố cục linh hoạt nhưng vẫn giữ mạch tư duy xuyên suốt, hấp dẫn người đọc.",
    sections: [
      {
        id: "hook",
        name: "1. Khởi nguồn cảm hứng (Opening)",
        components: [
          {
            label: "Đặt bối cảnh hoặc cảm xúc khởi đầu",
            guide: "Mở đầu bằng một khoảnh khắc ấn tượng, một câu hỏi tự vấn hoặc cảm xúc gợi mở."
          }
        ]
      },
      {
        id: "narrative",
        name: "2. Diễn biến trải nghiệm (Narrative & Details)",
        components: [
          {
            label: "Kể lại diễn biến câu chuyện sinh động",
            guide: "Miêu tả các sự kiện, hành động hoặc quan sát cụ thể theo dòng thời gian."
          }
        ]
      },
      {
        id: "reflection",
        name: "3. Suy ngẫm & Bài học (Reflection & Insight)",
        components: [
          {
            label: "Ý nghĩa sâu sắc đằng sau câu chuyện",
            guide: "Chia sẻ sự thay đổi trong nhận thức, bài học quý giá hoặc triết lý sống rút ra."
          }
        ]
      },
      {
        id: "takeaway",
        name: "4. Lời kết đúc kết (Closing Takeaway)",
        components: [
          {
            label: "Thông điệp hướng tới tương lai",
            guide: "Khép lại bằng một lời nhắc nhở cho bản thân hoặc thông điệp tích cực lan tỏa đến mọi người."
          }
        ]
      }
    ]
  }
};

export const LANGUAGE_WRITING_GUIDELINES = {
  en: {
    name: "Tiếng Anh (English)",
    flag: "🇬🇧",
    thinkingMode: "Tư duy lập luận tuyến tính (Linear Thinking)",
    principles: [
      "Luận đề trực diện (Thesis Statement): Phải khẳng định rõ lập trường ngay cuối câu mở bài.",
      "Cấu trúc đoạn văn chuẩn PEEL: Mỗi đoạn thân bài chỉ tập trung vào 1 ý chính, có câu chủ đề (Topic Sentence) ở đầu đoạn.",
      "Từ nối học thuật (Cohesive Devices): Dùng từ nối đa dạng (Moreover, In contrast, Consequently, Furthermore) thể hiện rõ mối quan hệ nhân - quả.",
      "Dẫn chứng mang tính khách quan: Tránh dùng 'I think', 'My friend told me' trong văn học thuật IELTS; hãy dùng 'Studies demonstrate that', 'Recent research highlights that'."
    ]
  },
  ja: {
    name: "Tiếng Nhật (日本語)",
    flag: "🇯🇵",
    thinkingMode: "Bố cục Khởi - Thừa - Chuyển - Kết (起承転結) hoặc 序論・本論・結論",
    principles: [
      "Văn thể luận văn: Bắt buộc dùng thể だ/である (Da/Dewa nai) trong văn nghị luận, tuyệt đối không dùng thể hội thoại です/ます.",
      "Bố cục 3 phần chuẩn (序論 - Mở bài, 本論 - Thân bài, 結論 - Kết bài): Đoạn thân bài cần phân tích đa chiều trước khi đưa ra nhận định cá nhân.",
      "Liên từ logic học thuật: Tận dụng liên từ nối chặt chẽ như 一方で (mặt khác), さらに (hơn nữa), したがって (do đó), なぜなら (bởi vì).",
      "Kính ngữ trong thư từ (Keigo): Nếu viết Business Email, bắt buộc tuân thủ お世話になっております và kết thúc bằng よろしくお願いいたします."
    ]
  },
  zh: {
    name: "Tiếng Trung (中文)",
    flag: "🇨🇳",
    thinkingMode: "Kết cấu Tổng - Phân - Tổng (总-分-总) & Khởi - Thừa - Chuyển - Hợp (起承转合)",
    principles: [
      "Bố cục Tổng - Phân - Tổng: Mở đầu bằng nhận định bao quát (Tổng), thân bài chia từng luận điểm phân tích (Phân), kết luận khẳng định lại và nâng tầm (Tổng).",
      "Sử dụng cặp liên từ tầng bậc: Không thể thiếu các cặp từ nối logic: 不仅...而且... (không những... mà còn...), 虽然...但是... (tuy... nhưng...), 首先...其次...最后... (trước hết... tiếp theo... sau cùng...).",
      "Tận dụng Thành ngữ 4 chữ (成语): Vận dụng hợp lý thành ngữ 4 chữ (众所周知, 循序渐进, 息息相关) để tạo văn phong học thuật cao cấp.",
      "Chuẩn đề HSK 5-6: Câu văn súc tích, tránh lặp chủ ngữ, dùng câu phức chính phụ linh hoạt."
    ]
  },
  ko: {
    name: "Tiếng Hàn (한국어)",
    flag: "🇰🇷",
    thinkingMode: "Cấu trúc Mở - Thân - Kết (도입 - 전개 - 결론 / 마무리)",
    principles: [
      "Văn phong viết chuẩn TOPIK II: Bắt buộc dùng thể trần thuật -(ㄴ/는)다, -았다/었다 trong bài viết Task 53 và Task 54.",
      "Giải quyết trọn vẹn từng câu hỏi gợi ý của đề thi: Đề thi TOPIK thường có 3 câu hỏi gợi ý; thân bài cần bám sát trả lời lần lượt từng câu hỏi này.",
      "Liên từ nối học thuật tiếng Hàn: Sử dụng linh hoạt các liên từ: 첫째/둘째 (thứ nhất/thứ hai), 반면에 (trái lại), 따라서 (vì vậy), 그러므로 (cho nên).",
      "Quy tắc giãn cách và thụt đầu dòng (원고지): Trong văn bản giấy thi TOPIK, mỗi đoạn mới phải thụt vào 1 ô vuông."
    ]
  },
  fr: {
    name: "Tiếng Pháp (Français)",
    flag: "🇫🇷",
    thinkingMode: "Bố cục Luận văn Pháp (Plan dialectique: Thèse - Antithèse - Synthèse)",
    principles: [
      "Mở bài chuẩn 3 bước: Amorce (câu dẫn dắt thu hút) -> Problématique (câu hỏi vấn đề cốt lõi) -> Annonce du plan (thông báo lộ trình dàn bài).",
      "Thân bài biện chứng (Thèse - Antithèse): Phân tích lập luận ủng hộ (Thèse), sau đó phản biện và nêu giới hạn (Antithèse).",
      "Từ nối học thuật tinh tế: D'une part... d'autre part (một mặt... mặt khác), En outre (ngoài ra), Néanmoins (tuy nhiên), En conclusion (kết luận).",
      "Kết bài 2 phần: Bilan (tổng kết ngắn gọn các luận điểm) và Ouverture (mở rộng vấn đề gợi mở suy ngẫm)."
    ]
  },
  de: {
    name: "Tiếng Đức (Deutsch)",
    flag: "🇩🇪",
    thinkingMode: "Bố cục Einleitung -> Hauptteil (Argumentation) -> Schluss",
    principles: [
      "Tư duy lập luận logic phản biện (Pro & Kontra): Hauptteil cần cân nhắc kỹ lưỡng cả lập luận ủng hộ lẫn phản đối trước khi đưa ra Schlusssatz.",
      "Cấu trúc khung câu tiếng Đức: Chú ý vị trí động từ trong mệnh đề phụ (Kausalsatz với weil/da đưa động từ về cuối câu).",
      "Từ nối học thuật TestDaF: Einerseits... andererseits (một mặt... mặt khác), Folglich (do đó), Darüber hinaus (hơn nữa), Zusammenfassend (tóm lại).",
      "Tính khách quan và trung lập: Dùng cấu trúc bị động (Passiv) hoặc thể giả định (Konjunktiv) khi phân tích quan điểm khoa học."
    ]
  }
};
