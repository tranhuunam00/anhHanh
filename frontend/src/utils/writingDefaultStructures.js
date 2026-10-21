/**
 * Bộ khung câu học thuật mặc định (Sentence Patterns & Frames) theo chủ đề & thể loại bài viết
 * Chuẩn Band 7.5 - 8.5 kèm nghĩa tiếng Việt và cách dùng cho AI Writing Studio.
 */

export const DEFAULT_TASK2_STRUCTURES = [
  {
    id: "def_t2_1",
    kind: "structure",
    category: "body",
    band: "Band 8.0",
    phrase: "A compelling case can be made that [...]",
    meaning: "Có một lý lẽ vô cùng thuyết phục rằng...",
    usage: "Dùng mở đầu phát triển luận điểm chính trong thân bài",
    template: "A compelling case can be made that [...]",
  },
  {
    id: "def_t2_2",
    kind: "structure",
    category: "body",
    band: "Band 8.0",
    phrase: "This phenomenon can be largely attributed to [...]",
    meaning: "Hiện tượng này phần lớn có thể quy cho / bắt nguồn từ...",
    usage: "Dùng phân tích nguyên nhân sâu xa của vấn đề",
    template: "This phenomenon can be largely attributed to [...]",
  },
  {
    id: "def_t2_3",
    kind: "structure",
    category: "body",
    band: "Band 7.5",
    phrase: "By diversifying their skillset through [...], individuals can [...]",
    meaning: "Bằng cách đa dạng hóa kỹ năng thông qua [...], cá nhân có thể...",
    usage: "Dùng diễn giải mối quan hệ nguyên nhân - kết quả tích cực",
    template: "By diversifying their skillset through [...], individuals can [...]",
  },
  {
    id: "def_t2_4",
    kind: "structure",
    category: "counter",
    band: "Band 8.0",
    phrase: "While opponents may contend that [...], evidence suggests that [...]",
    meaning: "Mặc dù người phản đối có thể cho rằng [...], bằng chứng cho thấy rằng...",
    usage: "Dùng viết câu phản biện (counter-argument) và khẳng định lập trường",
    template: "While opponents may contend that [...], evidence suggests that [...]",
  },
  {
    id: "def_t2_5",
    kind: "structure",
    category: "conclusion",
    band: "Band 8.0",
    phrase: "In conclusion, although [...] poses certain challenges, the long-term benefits of [...] are undeniable.",
    meaning: "Tóm lại, mặc dù [...] đặt ra một số thách thức nhất định, những lợi ích lâu dài của [...] là không thể phủ nhận.",
    usage: "Dùng viết câu kết luận khẳng định lại quan điểm tổng thể",
    template: "In conclusion, although [...] poses certain challenges, the long-term benefits of [...] are undeniable.",
  },
];

export const DEFAULT_TASK1_STRUCTURES = [
  {
    id: "def_t1_1",
    kind: "structure",
    category: "intro",
    band: "Band 8.0",
    phrase: "The chart illustrates the changes in [...] between [...] and [...]",
    meaning: "Biểu đồ minh họa những thay đổi về [...] trong giai đoạn từ [...] đến [...]",
    usage: "Dùng mở bài paraphrase thông tin đề bài Task 1",
    template: "The chart illustrates the changes in [...] between [...] and [...]",
  },
  {
    id: "def_t1_2",
    kind: "structure",
    category: "overview",
    band: "Band 8.0",
    phrase: "Overall, it is readily apparent that [...] experienced an upward trend, whereas [...] saw a marked decline.",
    meaning: "Nhìn chung, có thể thấy rõ ràng là [...] đã trải qua xu hướng tăng, trong khi [...] lại ghi nhận sự sụt giảm rõ rệt.",
    usage: "Dùng viết phần Tổng quan (Overview) nêu 2 xu hướng nổi bật nhất",
    template: "Overall, it is readily apparent that [...] experienced an upward trend, whereas [...] saw a marked decline.",
  },
  {
    id: "def_t1_3",
    kind: "structure",
    category: "body",
    band: "Band 7.5",
    phrase: "Starting at approximately [...], the figure for [...] surged dramatically to peak at [...] in [...]",
    meaning: "Bắt đầu ở mức xấp xỉ [...], con số cho [...] đã tăng vọt để đạt đỉnh ở mức [...] vào năm [...]",
    usage: "Dùng miêu tả chi tiết số liệu khởi điểm và điểm cực đại",
    template: "Starting at approximately [...], the figure for [...] surged dramatically to peak at [...] in [...]",
  },
];

/**
 * Lấy danh sách khung câu mặc định theo thể loại bài viết
 * @param {string} genre
 * @returns {Array<Object>}
 */
export function getDefaultStructuresByGenre(genre = "ielts_task2") {
  if (genre === "ielts_task1") {
    return DEFAULT_TASK1_STRUCTURES;
  }
  return DEFAULT_TASK2_STRUCTURES;
}

import { formatBandLabel, parseBandScore } from "./bandVocabularyUtils.js";

/**
 * Kho collocations học thuật dự phòng đa chủ đề phân cấp theo Band (6.5 - 8.5)
 */
export const TOPIC_COLLOCATIONS_BANK = [
  // Band 8.0 - 8.5 (C2 Sophisticated Expressions)
  { word: "exponential professional growth", meaning: "sự phát triển vượt bậc về chuyên môn", category: "work", band: "Band 8.5" },
  { word: "merit-based remuneration", meaning: "chế độ đãi ngộ dựa trên năng lực", category: "work", band: "Band 8.0" },
  { word: "volatile labor landscape", meaning: "thị trường lao động nhiều biến động", category: "work", band: "Band 8.0" },
  { word: "career stagnation perils", meaning: "nguy cơ trì trệ trong con đường sự nghiệp", category: "work", band: "Band 8.0" },
  { word: "paradigm shift", meaning: "sự chuyển dịch căn bản mang tính hệ hình", category: "general", band: "Band 8.5" },
  { word: "sustainable economic equilibrium", meaning: "trạng thái cân bằng kinh tế bền vững", category: "economy", band: "Band 8.0" },
  { word: "socio-economic disparity", meaning: "sự chênh lệch về kinh tế - xã hội", category: "society", band: "Band 8.0" },
  { word: "mitigate detrimental impacts", meaning: "giảm thiểu các tác động tiêu cực", category: "general", band: "Band 8.0" },
  { word: "technological proliferation", meaning: "sự phổ biến nhanh chóng của công nghệ", category: "technology", band: "Band 8.0" },

  // Band 7.0 - 7.5 (C1 Academic Collocations)
  { word: "retention incentives", meaning: "chính sách khuyến khích giữ chân nhân tài", category: "work", band: "Band 7.5" },
  { word: "interpersonal adaptability", meaning: "khả năng thích ứng giao tiếp linh hoạt", category: "work", band: "Band 7.5" },
  { word: "long-term viability", meaning: "khả năng duy trì hiệu quả trong dài hạn", category: "general", band: "Band 7.5" },
  { word: "catalyst for innovation", meaning: "chất xúc tác thúc đẩy sự đổi mới sáng tạo", category: "general", band: "Band 7.5" },
  { word: "ecological preservation", meaning: "sự bảo tồn hệ sinh thái tự nhiên", category: "environment", band: "Band 7.5" },
  { word: "pedagogical enhancement", meaning: "sự cải tiến phương pháp giáo dục", category: "education", band: "Band 7.5" },
  { word: "career advancement prospects", meaning: "triển vọng thăng tiến nghề nghiệp", category: "work", band: "Band 7.0" },
  { word: "renewable energy transition", meaning: "sự chuyển đổi sang năng lượng tái tạo", category: "environment", band: "Band 7.0" },
  { word: "technological advancements", meaning: "những tiến bộ về mặt công nghệ", category: "technology", band: "Band 7.0" },

  // Band 6.0 - 6.5 (B2 Solid Collocations)
  { word: "practical work experience", meaning: "kinh nghiệm làm việc thực tế", category: "work", band: "Band 6.5" },
  { word: "workplace productivity", meaning: "năng suất tại nơi làm việc", category: "work", band: "Band 6.5" },
  { word: "environmental protection", meaning: "bảo vệ môi trường sống", category: "environment", band: "Band 6.0" },
  { word: "academic achievement", meaning: "thành tích trong học tập", category: "education", band: "Band 6.5" },
  { word: "cost of living pressure", meaning: "áp lực chi phí sinh hoạt", category: "society", band: "Band 6.5" },
];

/**
 * Kho khung câu học thuật bổ sung khi bấm Gen thêm
 */
export const EXTRA_SENTENCE_PATTERNS = [
  {
    phrase: "A closer examination reveals that [...] primarily stems from [...]",
    meaning: "Xem xét kỹ hơn cho thấy rằng [...] chủ yếu bắt nguồn từ...",
    usage: "Dùng phân tích sâu bản chất nguyên nhân của sự việc",
    band: "Band 8.5",
    template: "A closer examination reveals that [...] primarily stems from [...]",
  },
  {
    phrase: "Under no circumstances should the significance of [...] be underestimated.",
    meaning: "Trong bất kỳ hoàn cảnh nào cũng không nên đánh giá thấp tầm quan trọng của...",
    usage: "Dùng câu đảo ngữ (Inversion) nhấn mạnh tính cấp thiết",
    band: "Band 8.5",
    template: "Under no circumstances should the significance of [...] be underestimated.",
  },
  {
    phrase: "Notwithstanding the aforementioned drawbacks, the overriding benefits of [...] are paramount.",
    meaning: "Bất chấp những hạn chế đã nêu, những lợi ích bao trùm của [...] vẫn là tối quan trọng.",
    usage: "Dùng chuyển ý phản biện và kết luận một cách thuyết phục",
    band: "Band 8.0",
    template: "Notwithstanding the aforementioned drawbacks, the overriding benefits of [...] are paramount.",
  },
  {
    phrase: "This serves as a testament to the fact that [...] can profoundly influence [...]",
    meaning: "Điều này đóng vai trò như một minh chứng rõ ràng cho việc [...] có thể tác động sâu sắc đến...",
    usage: "Dùng liên kết dẫn chứng thực tế với luận điểm bài viết",
    band: "Band 8.0",
    template: "This serves as a testament to the fact that [...] can profoundly influence [...]",
  },
  {
    phrase: "It is widely acknowledged that fostering [...] is instrumental in achieving [...]",
    meaning: "Một điều được thừa nhận rộng rãi rằng việc nuôi dưỡng [...] là yếu tố then chốt để đạt được...",
    usage: "Dùng mở đầu luận điểm giải pháp hoặc lợi ích",
    band: "Band 8.0",
    template: "It is widely acknowledged that fostering [...] is instrumental in achieving [...]",
  },
];

/**
 * Trích xuất các collocations học thuật dự phòng dựa trên prompt text và targetBand
 * @param {string} promptText
 * @param {Array<string|Object>} existingWords
 * @param {number|string} [targetBand=7.0]
 * @returns {Array<Object>}
 */
export function getFallbackCollocations(promptText = "", existingWords = [], targetBand = 7.0) {
  const existingLower = new Set(
    existingWords.map((w) => (typeof w === "string" ? w : w.word || w.phrase || "").toLowerCase())
  );
  const pLower = (promptText || "").toLowerCase();
  const targetNum = parseBandScore(targetBand, 7.0);

  // 1. Lọc theo chủ đề bài viết
  let matching = TOPIC_COLLOCATIONS_BANK.filter((item) => {
    if (existingLower.has(item.word.toLowerCase())) return false;
    if (pLower.includes(item.category)) return true;
    if (pLower.includes("job") || pLower.includes("career") || pLower.includes("work") || pLower.includes("employ")) {
      return item.category === "work" || item.category === "general";
    }
    if (pLower.includes("environ") || pLower.includes("green") || pLower.includes("nature")) {
      return item.category === "environment" || item.category === "general";
    }
    if (pLower.includes("tech") || pLower.includes("ai") || pLower.includes("digital")) {
      return item.category === "technology" || item.category === "general";
    }
    return true;
  });

  if (matching.length === 0) {
    matching = TOPIC_COLLOCATIONS_BANK.filter((item) => !existingLower.has(item.word.toLowerCase()));
  }

  // 2. Sắp xếp ưu tiên theo độ tiệm cận với targetBand của người học
  matching.sort((a, b) => {
    const scoreA = parseBandScore(a.band, 7.0);
    const scoreB = parseBandScore(b.band, 7.0);
    const diffA = Math.abs(scoreA - targetNum);
    const diffB = Math.abs(scoreB - targetNum);
    return diffA - diffB;
  });

  return matching.slice(0, 5).map((item, idx) => ({
    word: item.word,
    phrase: item.word,
    meaning: item.meaning,
    kind: "collocation",
    band: item.band || formatBandLabel(targetBand),
    isGenerated: true,
    createdAt: new Date(Date.now() + idx * 100).toISOString(),
  }));
}

/**
 * Trích xuất các khung câu dự phòng khi bấm Gen thêm
 */
export function getFallbackSentenceFrames(existingPhrases = []) {
  const existingSet = new Set(existingPhrases.map((p) => p.toLowerCase()));
  const available = EXTRA_SENTENCE_PATTERNS.filter((s) => !existingSet.has(s.phrase.toLowerCase()));
  const toAdd = available.length > 0 ? available.slice(0, 3) : EXTRA_SENTENCE_PATTERNS.slice(0, 3);

  return toAdd.map((item, idx) => ({
    id: `extra_gen_${Date.now()}_${idx}`,
    kind: "structure",
    band: item.band,
    phrase: item.phrase,
    meaning: item.meaning,
    usage: item.usage,
    template: item.template,
    createdAt: new Date(Date.now() + idx * 100).toISOString(),
  }));
}

