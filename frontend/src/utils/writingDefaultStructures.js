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
