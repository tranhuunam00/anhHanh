/**
 * Standard Writing Outlines (Dàn bài chuẩn 100% Tiếng Việt)
 * Phục vụ học viên xây dựng cấu trúc bài viết chuẩn mực theo từng thể loại, dạng đề và ngôn ngữ.
 * 
 * Quy tắc cốt lõi:
 * - Đối với IELTS Task 2 (Dạng 2): Bắt buộc đủ 4 phần (Mở bài, Body 1, Body 2, Kết bài).
 * - Trong Body 1 và Body 2 của Dạng 2: Bắt buộc có Main Idea, Supporting Idea và Example tùy từng dạng.
 * - Đối với các dạng khác: Đảm bảo cấu trúc chuẩn mực đặc thù của từng dạng và từng ngôn ngữ.
 */

export const TASK2_OUTLINES = {
  // 1. Dạng Agree or Disagree (Opinion Essay)
  opinion: {
    title: "Dạng Agree / Disagree (Nghị luận bày tỏ quan điểm)",
    description: "Dạng bài yêu cầu người viết nêu rõ mức độ đồng ý hoặc không đồng ý với một nhận định.",
    sections: [
      {
        id: "intro",
        name: "1. Mở bài (Introduction)",
        duration: "3 - 5 phút",
        wordTarget: "40 - 50 từ",
        components: [
          {
            label: "Câu 1: Dẫn dắt & Diễn giải lại đề bài (Paraphrase)",
            guide: "Sử dụng từ đồng nghĩa hoặc đổi cấu trúc câu để diễn đạt lại nhận định trong đề bài một cách khách quan."
          },
          {
            label: "Câu 2: Luận đề khẳng định lập trường (Thesis Statement)",
            guide: "Khẳng định dứt khoát quan điểm cá nhân: Hoàn toàn đồng ý (Strongly Agree), Hoàn toàn phản đối (Strongly Disagree), hoặc Đồng ý một phần (Partly Agree / Balanced)."
          }
        ]
      },
      {
        id: "body1",
        name: "2. Thân bài 1 (Body 1) - Luận điểm thứ nhất",
        duration: "12 - 15 phút",
        wordTarget: "90 - 100 từ",
        components: [
          {
            label: "Main Idea (Ý chính / Câu chủ đề)",
            guide: "Nêu trực tiếp lý do đầu tiên củng cố cho quan điểm của bạn (Ví dụ: Lợi ích kinh tế, sự an toàn hoặc quyền tự do cá nhân)."
          },
          {
            label: "Supporting Idea (Luận cứ giải thích & Phân tích chuyên sâu)",
            guide: "Phân tích cơ chế tại sao: Hiện tượng này diễn ra như thế nào? Dẫn đến mắt xích hệ quả trực tiếp gì cho cá nhân hoặc xã hội?"
          },
          {
            label: "Example (Dẫn chứng / Ví dụ thực tế minh họa)",
            guide: "Đưa ra dẫn chứng thực tế, số liệu nghiên cứu, hiện tượng xã hội hoặc ví dụ điển hình để tăng sức thuyết phục tuyệt đối cho luận điểm."
          }
        ]
      },
      {
        id: "body2",
        name: "3. Thân bài 2 (Body 2) - Luận điểm thứ hai (Sâu sắc & Bao quát hơn)",
        duration: "12 - 15 phút",
        wordTarget: "90 - 100 từ",
        components: [
          {
            label: "Main Idea (Ý chính / Câu chủ đề 2)",
            guide: "Nêu lý do thứ hai quan trọng hơn hoặc khía cạnh dài hạn (Ví dụ: Sự phát triển bền vững, giá trị đạo đức hoặc tương lai của cộng đồng)."
          },
          {
            label: "Supporting Idea (Luận cứ giải thích & Đánh giá tác động)",
            guide: "Đi sâu phân tích tác động dài hạn: Nếu không thực hiện thì sẽ gây ra hậu quả gì, hoặc nếu áp dụng sẽ đem lại bước tiến vượt bậc ra sao?"
          },
          {
            label: "Example (Dẫn chứng / Ví dụ thực tế minh họa)",
            guide: "Ví dụ thực tế sinh động từ các quốc gia tiên tiến, báo cáo khoa học hoặc trải nghiệm xã hội phổ quát chứng minh cho luận điểm 2."
          }
        ]
      },
      {
        id: "conclusion",
        name: "4. Kết bài (Conclusion)",
        duration: "3 - 5 phút",
        wordTarget: "30 - 40 từ",
        components: [
          {
            label: "Câu 1: Tái khẳng định lập trường (Restate Thesis)",
            guide: "Khẳng định lại một lần nữa quan điểm nhất quán từ mở bài bằng cách dùng từ ngữ diễn đạt khác."
          },
          {
            label: "Câu 2: Tóm lược 2 luận điểm then chốt & Khuyến nghị (Summary & Final thought)",
            guide: "Tóm gọn lại 2 lý do cốt lõi ở Body 1 và Body 2 trong một câu liên kết mạch lạc, có thể kèm theo một dự đoán tương lai."
          }
        ]
      }
    ]
  },

  // 2. Dạng Discuss Both Views (Thảo luận 2 quan điểm & Nêu ý kiến cá nhân)
  discussion: {
    title: "Dạng Discuss Both Views (Thảo luận 2 luồng quan điểm)",
    description: "Dạng bài yêu cầu phân tích khách quan cả hai quan điểm trái chiều và đưa ra ý kiến cá nhân.",
    sections: [
      {
        id: "intro",
        name: "1. Mở bài (Introduction)",
        duration: "3 - 5 phút",
        wordTarget: "40 - 50 từ",
        components: [
          {
            label: "Câu 1: Giới thiệu 2 luồng ý kiến trái chiều trong xã hội",
            guide: "Nêu rõ đang có cuộc tranh luận sôi nổi giữa hai nhóm quan điểm đối lập về vấn đề này."
          },
          {
            label: "Câu 2: Luận đề nêu quan điểm cá nhân (Thesis Statement)",
            guide: "Khẳng định mặc dù cả hai luồng ý kiến đều có cơ sở, cá nhân bạn nghiêng về quan điểm nào hơn."
          }
        ]
      },
      {
        id: "body1",
        name: "2. Thân bài 1 (Body 1) - Phân tích Quan điểm thứ nhất (View 1)",
        duration: "12 - 15 phút",
        wordTarget: "90 - 100 từ",
        components: [
          {
            label: "Main Idea (Ý chính của Quan điểm 1)",
            guide: "Giải thích tại sao một bộ phận người dân hoặc chuyên gia ủng hộ quan điểm thứ nhất."
          },
          {
            label: "Supporting Idea (Luận cứ & Cơ sở thực tế của View 1)",
            guide: "Phân tích khía cạnh hợp lý, sự thuận tiện hoặc giá trị thiết thực mà quan điểm này hướng đến."
          },
          {
            label: "Example (Dẫn chứng thực tế cho View 1)",
            guide: "Ví dụ cụ thể minh họa về nhóm đối tượng đang được hưởng lợi hoặc áp dụng theo quan điểm 1."
          }
        ]
      },
      {
        id: "body2",
        name: "3. Thân bài 2 (Body 2) - Phân tích Quan điểm thứ hai & Lập trường của bạn (View 2)",
        duration: "12 - 15 phút",
        wordTarget: "90 - 100 từ",
        components: [
          {
            label: "Main Idea (Ý chính của Quan điểm 2 & Sự đồng tình của bạn)",
            guide: "Nêu lý do vì sao quan điểm thứ hai tiến bộ, vượt trội và bền vững hơn quan điểm thứ nhất."
          },
          {
            label: "Supporting Idea (Luận cứ phân tích chiều sâu & Phản biện)",
            guide: "Phân tích giá trị dài hạn, tính nhân văn hoặc cách mà quan điểm 2 khắc phục nhược điểm của quan điểm 1."
          },
          {
            label: "Example (Dẫn chứng thực tế thuyết phục)",
            guide: "Minh chứng sinh động từ thực tiễn xã hội hoặc chính sách công chứng minh cho tính ưu việt của View 2."
          }
        ]
      },
      {
        id: "conclusion",
        name: "4. Kết bài (Conclusion)",
        duration: "3 - 5 phút",
        wordTarget: "30 - 40 từ",
        components: [
          {
            label: "Câu 1: Tóm tắt sự tồn tại của cả hai góc nhìn",
            guide: "Điểm lại vắn tắt giá trị của cả hai luồng tư tưởng."
          },
          {
            label: "Câu 2: Nhấn mạnh lại lựa chọn của bản thân",
            guide: "Khẳng định dứt khoát lý do lựa chọn của bản thân mang tính tối ưu cho sự phát triển chung."
          }
        ]
      }
    ]
  },

  // 3. Dạng Causes and Solutions (Nguyên nhân & Giải pháp)
  causes_solutions: {
    title: "Dạng Causes & Solutions (Nguyên nhân & Giải pháp)",
    description: "Dạng bài yêu cầu làm rõ các căn nguyên cốt lõi và đề xuất giải pháp khả thi.",
    sections: [
      {
        id: "intro",
        name: "1. Mở bài (Introduction)",
        duration: "3 - 5 phút",
        wordTarget: "40 - 50 từ",
        components: [
          {
            label: "Câu 1: Nêu thực trạng báo động của vấn đề (Background)",
            guide: "Diễn giải lại hiện tượng xã hội tiêu cực đang diễn biến phức tạp và thu hút sự chú ý rộng rãi."
          },
          {
            label: "Câu 2: Luận đề định hướng bài viết (Thesis Statement)",
            guide: "Khẳng định hiện tượng này bắt nguồn từ nhiều nguyên nhân căn bản và cần các giải pháp can thiệp quyết liệt."
          }
        ]
      },
      {
        id: "body1",
        name: "2. Thân bài 1 (Body 1) - Các Nguyên nhân Cốt lõi (Causes)",
        duration: "12 - 15 phút",
        wordTarget: "90 - 100 từ",
        components: [
          {
            label: "Main Idea (Ý chính: Hai nhóm nguyên nhân trọng yếu)",
            guide: "Khái quát 2 nguyên nhân nền tảng (Ví dụ: Ý thức cá nhân còn hạn chế & Sự thiếu vắng chế tài quản lý nghiêm ngặt)."
          },
          {
            label: "Supporting Idea (Luận cứ phân tích cơ chế gây hại)",
            guide: "Giải thích cụ thể tại sao các yếu tố này lại dẫn đến thực trạng hiện tại, mắt xích gây hại lan rộng ra sao."
          },
          {
            label: "Example (Dẫn chứng thực trạng hoặc số liệu thực tế)",
            guide: "Đưa ra sự việc, con số thống kê hoặc ví dụ thực tế về tác hại của các nguyên nhân này trong đời sống."
          }
        ]
      },
      {
        id: "body2",
        name: "3. Thân bài 2 (Body 2) - Các Giải pháp Khả thi (Solutions)",
        duration: "12 - 15 phút",
        wordTarget: "90 - 100 từ",
        components: [
          {
            label: "Main Idea (Ý chính: Các biện pháp xử lý tương ứng)",
            guide: "Đề xuất các giải pháp tương ứng giải quyết triệt để từng nguyên nhân nêu trên (Chính sách pháp luật & Giáo dục nâng cao nhận thức)."
          },
          {
            label: "Supporting Idea (Luận cứ về cách thức vận hành & Tính hiệu quả)",
            guide: "Phân tích chi tiết giải pháp sẽ được thực thi như thế nào và đem lại chuyển biến tích cực ra sao."
          },
          {
            label: "Example (Dẫn chứng mô hình thành công)",
            guide: "Nêu ví dụ về quốc gia, thành phố hoặc tổ chức đã áp dụng thành công các biện pháp này."
          }
        ]
      },
      {
        id: "conclusion",
        name: "4. Kết bài (Conclusion)",
        duration: "3 - 5 phút",
        wordTarget: "30 - 40 từ",
        components: [
          {
            label: "Câu 1: Tóm lược mối liên hệ Nguyên nhân - Giải pháp",
            guide: "Khẳng định lại rằng tuy vấn đề nghiêm trọng do các nguyên nhân cụ thể, hoàn toàn có thể khắc phục."
          },
          {
            label: "Câu 2: Kêu gọi hành động đồng bộ (Call to Action)",
            guide: "Nhấn mạnh sự phối hợp giữa chính quyền và mỗi cá nhân là chìa khóa để chấm dứt tình trạng này."
          }
        ]
      }
    ]
  },

  // 4. Dạng Advantages and Disadvantages (Lợi ích & Bất cập)
  advantages_disadvantages: {
    title: "Dạng Advantages & Disadvantages (Lợi ích & Bất cập)",
    description: "Dạng bài yêu cầu phân tích hai mặt ưu - khuyết và đánh giá liệu mặt nào chiếm ưu thế vượt trội.",
    sections: [
      {
        id: "intro",
        name: "1. Mở bài (Introduction)",
        duration: "3 - 5 phút",
        wordTarget: "40 - 50 từ",
        components: [
          {
            label: "Câu 1: Giới thiệu xu hướng / sự việc (Background)",
            guide: "Diễn giải lại xu hướng đang bùng nổ hoặc quyết định mới trong xã hội."
          },
          {
            label: "Câu 2: Luận đề khẳng định cán cân (Thesis Statement)",
            guide: "Nêu rõ lập trường: Mặc dù có những bất cập nhất định, các lợi ích mang lại hoàn toàn vượt trội (hoặc ngược lại)."
          }
        ]
      },
      {
        id: "body1",
        name: "2. Thân bài 1 (Body 1) - Các Hạn chế / Bất cập (Disadvantages)",
        duration: "12 - 15 phút",
        wordTarget: "90 - 100 từ",
        components: [
          {
            label: "Main Idea (Ý chính: Những điểm trừ và rủi ro tiềm ẩn)",
            guide: "Nêu rõ mặt hạn chế hoặc gánh nặng mà xu hướng này gây ra (Ví dụ: Chi phí cao, sự thụ động, áp lực xã hội)."
          },
          {
            label: "Supporting Idea (Luận cứ giải thích ảnh hưởng tiêu cực)",
            guide: "Phân tích tác động bất lợi đến công việc, sức khỏe tinh thần hoặc mối quan hệ xã hội của con người."
          },
          {
            label: "Example (Dẫn chứng thực tế về rủi ro)",
            guide: "Ví dụ cụ thể về tổn thất hoặc trường hợp gặp khó khăn điển hình khi gặp phải bất cập này."
          }
        ]
      },
      {
        id: "body2",
        name: "3. Thân bài 2 (Body 2) - Các Ưu điểm Vượt trội (Advantages)",
        duration: "12 - 15 phút",
        wordTarget: "90 - 100 từ",
        components: [
          {
            label: "Main Idea (Ý chính: Các lợi ích then chốt và tính đột phá)",
            guide: "Đưa ra các lợi thế vượt trội chứng minh đây là bước tiến tất yếu (Ví dụ: Tiết kiệm thời gian, mở rộng tri thức toàn cầu)."
          },
          {
            label: "Supporting Idea (Luận cứ phân tích giá trị vượt trội)",
            guide: "Phân tích lý do tại sao những lợi ích này có giá trị lâu dài và lấn át hoàn toàn những bất cập tạm thời ở Body 1."
          },
          {
            label: "Example (Dẫn chứng thực tế minh chứng thành công)",
            guide: "Dẫn chứng sinh động về sự tiện lợi và năng suất tăng vọt trong thực tế công việc và đời sống."
          }
        ]
      },
      {
        id: "conclusion",
        name: "4. Kết bài (Conclusion)",
        duration: "3 - 5 phút",
        wordTarget: "30 - 40 từ",
        components: [
          {
            label: "Câu 1: Tóm lược thế cân bằng giữa ưu và nhược",
            guide: "Thừa nhận cả hai mặt nhưng tái khẳng định ưu thế áp đảo của mặt lợi ích."
          },
          {
            label: "Câu 2: Đưa ra lời khuyên thích ứng (Advice / Outlook)",
            guide: "Khuyến nghị cách tận dụng tối đa mặt tích cực đồng thời giảm thiểu tối đa các rủi ro."
          }
        ]
      }
    ]
  },

  // 5. Dạng Two-part Question (Hai câu hỏi / Direct Questions)
  two_part: {
    title: "Dạng Two-part Question (Trả lời 2 câu hỏi trực tiếp)",
    description: "Đề bài đưa ra 2 câu hỏi riêng biệt, yêu cầu trả lời thấu đáo từng câu hỏi trong mỗi đoạn thân bài.",
    sections: [
      {
        id: "intro",
        name: "1. Mở bài (Introduction)",
        duration: "3 - 5 phút",
        wordTarget: "40 - 50 từ",
        components: [
          {
            label: "Câu 1: Diễn giải bối cảnh chủ đề (Background Context)",
            guide: "Paraphrase lại chủ đề chung mà đề bài đang đề cập."
          },
          {
            label: "Câu 2: Luận đề trả lời khái quát cả 2 câu hỏi (Thesis Statement)",
            guide: "Đưa ra câu trả lời vắn tắt cho câu hỏi 1 và câu hỏi 2 ngay trong câu mở bài."
          }
        ]
      },
      {
        id: "body1",
        name: "2. Thân bài 1 (Body 1) - Trả lời thấu đáo Câu hỏi thứ nhất",
        duration: "12 - 15 phút",
        wordTarget: "90 - 100 từ",
        components: [
          {
            label: "Main Idea (Ý chính: Trực diện trả lời Câu hỏi 1)",
            guide: "Đưa ra câu trả lời trực tiếp cho câu hỏi 1 (Ví dụ: Nguyên nhân chính là gì? hoặc Xu hướng này tích cực hay tiêu cực?)."
          },
          {
            label: "Supporting Idea (Luận cứ phân tích & Luận giải chi tiết)",
            guide: "Giải thích các yếu tố tác động và cơ chế logic củng cố cho câu trả lời trên."
          },
          {
            label: "Example (Dẫn chứng thực tế cho Câu hỏi 1)",
            guide: "Dẫn chứng thực tế chứng minh cho nhận định đã trả lời ở câu hỏi 1."
          }
        ]
      },
      {
        id: "body2",
        name: "3. Thân bài 2 (Body 2) - Trả lời thấu đáo Câu hỏi thứ hai",
        duration: "12 - 15 phút",
        wordTarget: "90 - 100 từ",
        components: [
          {
            label: "Main Idea (Ý chính: Trực diện trả lời Câu hỏi 2)",
            guide: "Đưa ra câu trả lời trực tiếp cho câu hỏi 2 (Ví dụ: Cần làm gì để cải thiện? hoặc Hậu quả tương lai là gì?)."
          },
          {
            label: "Supporting Idea (Luận cứ phân tích tính khả thi & Kết quả)",
            guide: "Lập luận chi tiết về các giải pháp, tính khả thi hoặc dự báo xu hướng tương lai."
          },
          {
            label: "Example (Dẫn chứng thực tế cho Câu hỏi 2)",
            guide: "Ví dụ cụ thể về ứng dụng thực tế hoặc trường hợp điển hình liên quan đến câu hỏi 2."
          }
        ]
      },
      {
        id: "conclusion",
        name: "4. Kết bài (Conclusion)",
        duration: "3 - 5 phút",
        wordTarget: "30 - 40 từ",
        components: [
          {
            label: "Câu 1 & 2: Đúc kết câu trả lời cho cả hai câu hỏi",
            guide: "Tóm lược lại câu trả lời then chốt của câu hỏi 1 và câu hỏi 2, khẳng định thông điệp bài học chung."
          }
        ]
      }
    ]
  }
};
