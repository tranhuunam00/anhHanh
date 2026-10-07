// Academic Writing Structures, Collocations & High-Band Templates
// Phân loại theo Band (6.5, 7.5, 8.0-9.0) và Chức năng bài viết IELTS / Essay

export const WRITING_CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "intro", label: "Mở bài & Dẫn dắt" },
  { id: "body", label: "Luận điểm & Phân tích" },
  { id: "examples", label: "Dẫn chứng & Ví dụ" },
  { id: "counter", label: "Phản biện & Nhượng bộ" },
  { id: "conclusion", label: "Kết bài & Khẳng định" },
  { id: "linkers", label: "Từ nối học thuật" },
  { id: "grammar", label: "Cấu trúc ngữ pháp Band 8+" },
];

export const WRITING_STRUCTURES = [
  // --- MỞ BÀI & DẪN DẮT ---
  {
    category: "intro",
    band: "band7",
    phrase: "A contentious debate has emerged concerning...",
    meaning: "Một cuộc tranh luận gay gắt đã nảy sinh xoay quanh...",
    usage: "Dùng mở đầu phần dẫn dắt vấn đề mang tính 2 luồng quan điểm.",
    template: "A contentious debate has emerged concerning whether [chủ đề]."
  },
  {
    category: "intro",
    band: "band8",
    phrase: "Whether [X] or [Y] remains a matter of fierce contention among scholars and policymakers alike.",
    meaning: "Liệu [X] hay [Y] vẫn luôn là vấn đề gây tranh cãi quyết liệt giữa các học giả và nhà hoạch định chính sách.",
    usage: "Mở bài Band 8+ mang tính học thuật đỉnh cao.",
    template: "Whether [X] or [Y] remains a matter of fierce contention among scholars and policymakers alike."
  },
  {
    category: "intro",
    band: "band7",
    phrase: "There has been growing consensus that...",
    meaning: "Ngày càng có sự đồng thuận rộng rãi rằng...",
    usage: "Dẫn dắt một xu hướng hoặc sự thật được số đông thừa nhận.",
    template: "There has been growing consensus that [mệnh đề]."
  },
  {
    category: "intro",
    band: "band8",
    phrase: "While proponents champion the idea of [X], I would contend that [Y] warrants equal scrutiny.",
    meaning: "Trong khi những người ủng hộ nhiệt liệt cổ vũ cho [X], tôi cho rằng [Y] cũng cần được xem xét kỹ lưỡng tương đương.",
    usage: "Câu Thesis statement nêu rõ lập trường cá nhân sắc sảo.",
    template: "While proponents champion the idea of [X], I would contend that [Y] warrants equal scrutiny."
  },
  {
    category: "intro",
    band: "band6",
    phrase: "It is widely believed that...",
    meaning: "Nhiều người tin rằng...",
    usage: "Mở đầu ý kiến chung một cách tự nhiên.",
    template: "It is widely believed that [mệnh đề]."
  },

  // --- LUẬN ĐIỂM & PHÂN TÍCH (BODY) ---
  {
    category: "body",
    band: "band7",
    phrase: "The primary rationale underpinning this stance is that...",
    meaning: "Lý do căn bản củng cố cho quan điểm này là...",
    usage: "Bắt đầu đoạn thân bài giải thích nguyên nhân cốt lõi.",
    template: "The primary rationale underpinning this stance is that [mệnh đề]."
  },
  {
    category: "body",
    band: "band8",
    phrase: "Central to this perspective is the premise that...",
    meaning: "Điểm cốt lõi của góc nhìn này là tiền đề cho rằng...",
    usage: "Đưa ra luận điểm học thuật sâu sắc Band 8+.",
    template: "Central to this perspective is the premise that [mệnh đề]."
  },
  {
    category: "body",
    band: "band7",
    phrase: "Advocates substantiate their perspective by arguing that...",
    meaning: "Những người ủng hộ củng cố góc nhìn của họ bằng cách lập luận rằng...",
    usage: "Phát triển và củng cố luận cứ thân bài.",
    template: "Advocates substantiate their perspective by arguing that [mệnh đề]."
  },
  {
    category: "body",
    band: "band8",
    phrase: "This phenomenon is predominantly attributable to...",
    meaning: "Hiện tượng này chủ yếu xuất phát từ / có thể quy cho...",
    usage: "Phân tích nguyên nhân sâu xa (thay cho 'This happens because').",
    template: "This phenomenon is predominantly attributable to [cụm danh từ / V-ing]."
  },
  {
    category: "body",
    band: "band7",
    phrase: "This, in turn, exerts a profound influence on...",
    meaning: "Điều này, kéo theo đó, tạo ra ảnh hưởng sâu rộng lên...",
    usage: "Diễn tả hệ quả mắt xích logic.",
    template: "This, in turn, exerts a profound influence on [đối tượng]."
  },

  // --- DẪN CHỨNG & VÍ DỤ ---
  {
    category: "examples",
    band: "band7",
    phrase: "A prime illustration of this phenomenon is...",
    meaning: "Một minh chứng tiêu biểu cho hiện tượng này chính là...",
    usage: "Đưa ra dẫn chứng xác thực (thay cho 'For example').",
    template: "A prime illustration of this phenomenon is [ví dụ cụ thể]."
  },
  {
    category: "examples",
    band: "band8",
    phrase: "Empirical research conducted by [authorities] corroborates the notion that...",
    meaning: "Nghiên cứu thực nghiệm được thực hiện bởi [các chuyên gia/tổ chức] đã chứng thực cho quan điểm rằng...",
    usage: "Đưa dẫn chứng học thuật uy tín có sức nặng tối đa.",
    template: "Empirical research conducted by [tổ chức/học giả] corroborates the notion that [mệnh đề]."
  },
  {
    category: "examples",
    band: "band7",
    phrase: "This is epitomized by the case of...",
    meaning: "Điều này được khắc họa rõ nét qua trường hợp của...",
    usage: "Dẫn chứng sinh động và mang tính điển hình.",
    template: "This is epitomized by the case of [ví dụ]."
  },
  {
    category: "examples",
    band: "band6",
    phrase: "A notable example is...",
    meaning: "Một ví dụ đáng chú ý là...",
    usage: "Nêu ví dụ rõ ràng, gãy gọn.",
    template: "A notable example is [ví dụ]."
  },

  // --- PHẢN BIỆN & NHƯỢNG BỘ (COUNTERARGUMENT) ---
  {
    category: "counter",
    band: "band7",
    phrase: "Notwithstanding the aforementioned merits, it is undeniable that...",
    meaning: "Mặc dù có những lợi ích đã đề cập ở trên, không thể phủ nhận rằng...",
    usage: "Chuyển ý sang mặt hạn chế hoặc quan điểm đối lập rất mượt mà.",
    template: "Notwithstanding the aforementioned merits, it is undeniable that [mệnh đề]."
  },
  {
    category: "counter",
    band: "band8",
    phrase: "Plausible as this argument may sound, it fails to account for...",
    meaning: "Nghe có vẻ hợp lý là vậy, song lập luận này đã bỏ qua không tính đến...",
    usage: "Cấu trúc đảo ngữ tính từ Band 8.5+ để bẻ luận điểm đối phương.",
    template: "Plausible as this argument may sound, it fails to account for [yếu tố quan trọng]."
  },
  {
    category: "counter",
    band: "band8",
    phrase: "Far from being a panacea, [X] may inadvertently exacerbate the situation.",
    meaning: "Không hề là viên thuốc chữa bách bệnh, [X] có thể vô tình làm tình hình trầm trọng thêm.",
    usage: "Phản biện sâu sắc về tính hiệu quả của một giải pháp.",
    template: "Far from being a panacea, [X] may inadvertently exacerbate the situation."
  },
  {
    category: "counter",
    band: "band7",
    phrase: "Conversely, opponents argue with equal justification that...",
    meaning: "Ngược lại, những người phản đối cũng có lý lẽ tương đương khi cho rằng...",
    usage: "Giới thiệu quan điểm của phe đối lập công tâm và khách quan.",
    template: "Conversely, opponents argue with equal justification that [mệnh đề]."
  },

  // --- KẾT BÀI & KHẲNG ĐỊNH ---
  {
    category: "conclusion",
    band: "band7",
    phrase: "In light of the evidence presented, it is reasonable to conclude that...",
    meaning: "Dưới ánh sáng của các bằng chứng đã nêu, hoàn toàn hợp lý khi kết luận rằng...",
    usage: "Câu mở đầu phần kết bài chuẩn chỉnh.",
    template: "In light of the evidence presented, it is reasonable to conclude that [kết luận]."
  },
  {
    category: "conclusion",
    band: "band8",
    phrase: "On balance, while acknowledging the undeniable merits of [X], I remain convinced that [Y]...",
    meaning: "Sau khi cân nhắc mọi mặt, dù thừa nhận những lợi ích không thể phủ nhận của [X], tôi vẫn tin chắc rằng [Y]...",
    usage: "Kết bài thể hiện khả năng cân bằng quan điểm và khẳng định lập trường Band 8+.",
    template: "On balance, while acknowledging the undeniable merits of [X], I remain convinced that [Y]."
  },
  {
    category: "conclusion",
    band: "band8",
    phrase: "It is imperative that a multifaceted approach be adopted to mitigate this dilemma.",
    meaning: "Điều tối quan trọng là phải áp dụng một phương tiếp cận đa diện để xoa dịu bài toán nan giải này.",
    usage: "Đưa ra lời khuyên hoặc hướng giải quyết cuối bài thi.",
    template: "It is imperative that a multifaceted approach be adopted to [mục tiêu]."
  },
  {
    category: "conclusion",
    band: "band6",
    phrase: "In conclusion, taking all factors into consideration...",
    meaning: "Tóm lại, sau khi xem xét tất cả các yếu tố...",
    usage: "Kết luận an toàn và rõ ràng.",
    template: "In conclusion, taking all factors into consideration, [kết luận]."
  },

  // --- TỪ NỐI HỌC THUẬT (LINKERS) ---
  {
    category: "linkers",
    band: "band7",
    phrase: "Consequently, / As a consequence,",
    meaning: "Do đó / Hệ quả là...",
    usage: "Nối câu chỉ hệ quả nhân quả.",
    template: "Consequently, [mệnh đề]."
  },
  {
    category: "linkers",
    band: "band7",
    phrase: "In sharp contrast to...",
    meaning: "Tương phản rõ rệt với...",
    usage: "So sánh tương phản nổi bật.",
    template: "In sharp contrast to [X], [Y]..."
  },
  {
    category: "linkers",
    band: "band8",
    phrase: "Predominantly / Concomitantly",
    meaning: "Chủ yếu / Đồng thời diễn ra song song",
    usage: "Từ vựng nối câu nâng cao tính học thuật.",
    template: "Concomitantly, [mệnh đề]."
  },

  // --- CẤU TRÚC NGỮ PHÁP BAND 8+ (GRAMMAR TEMPLATES) ---
  {
    category: "grammar",
    band: "band8",
    phrase: "Not only does [S + V], but [S] also...",
    meaning: "Không những [làm gì], mà [ai đó] còn...",
    usage: "Đảo ngữ với 'Not only' giúp bứt phá điểm Grammar Range lên Band 8+.",
    template: "Not only does [S + V-nguyên-thể], but it also [V-chia]..."
  },
  {
    category: "grammar",
    band: "band8",
    phrase: "Seldom do we witness such a profound transformation in...",
    meaning: "Hiếm khi chúng ta được chứng kiến sự chuyển biến sâu sắc như vậy trong...",
    usage: "Đảo ngữ với Seldom/Rarely.",
    template: "Seldom do we witness such a profound transformation in [lĩnh vực]."
  },
  {
    category: "grammar",
    band: "band8",
    phrase: "Only by [V-ing] can [S] effectively address...",
    meaning: "Chỉ bằng cách [hành động] thì [chúng ta/chính phủ] mới có thể giải quyết hiệu quả...",
    usage: "Đảo ngữ với 'Only by' trong câu giải pháp.",
    template: "Only by [V-ing] can [S] effectively address [vấn đề]."
  },
  {
    category: "grammar",
    band: "band8",
    phrase: "It is [noun/phrase] that plays a pivotal role in...",
    meaning: "Chính [yếu tố này] đóng vai trò then chốt trong...",
    usage: "Câu chẻ (Cleft sentence) để nhấn mạnh chủ thể quan trọng.",
    template: "It is [yếu tố] that plays a pivotal role in [lĩnh vực]."
  },
  {
    category: "grammar",
    band: "band8",
    phrase: "The more [S + V], the more [S + V]...",
    meaning: "Càng... thì càng...",
    usage: "So sánh kép (Double comparative) diễn tả mối quan hệ tỉ lệ thuận/nghịch.",
    template: "The more pervasive digital media becomes, the more susceptible individuals are to disinformation."
  },
  {
    category: "grammar",
    band: "band8",
    phrase: "Were [governments] to implement [policy], [positive outcome] would ensue.",
    meaning: "Nếu [chính phủ] thực hiện [chính sách], [kết quả tốt] sẽ lập tức theo sau.",
    usage: "Đảo ngữ câu điều kiện loại 2 (Were + S + to V) cực kỳ sang trọng.",
    template: "Were [chính phủ/cá nhân] to [hành động], [hệ quả] would ensue."
  },
  {
    category: "grammar",
    band: "band8",
    phrase: "Having weighed the arguments on both sides, one can deduce that...",
    meaning: "Sau khi cân nhắc các luận điểm từ cả hai phía, người ta có thể suy ra rằng...",
    usage: "Mệnh đề phân từ hoàn thành (Perfect Participle).",
    template: "Having weighed the arguments on both sides, one can deduce that [kết luận]."
  }
];
