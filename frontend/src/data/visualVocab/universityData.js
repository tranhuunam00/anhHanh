/**
 * University Campus & Academic Life Visual Vocabulary Dataset
 * Features high-angle illustrated campus with key educational landmarks
 */
export const UNIVERSITY_CAMPUS_TOPIC = {
  id: "university_campus",
  title: "Khuôn Viên Trường Đại Học",
  englishTitle: "University Campus & Facilities",
  category: "Education & Campus Life",
  image: "/images/visual_vocab/university_campus.jpg",
  aspectRatio: 16 / 9,
  description: "14 từ vựng về cơ sở vật chất đại học: thư viện, phòng thí nghiệm, giảng đường, ký túc xá, tháp đồng hồ, nhà ăn, sân vận động...",
  items: [
    {
      id: "library",
      word: "library",
      ipa: "/ˈlaɪbrəri/",
      pos: "noun",
      meaning: "Thư viện trung tâm (Đại học)",
      example: "Students spend long study nights in the historic campus library.",
      x: 41.5,
      y: 42.0,
      pointerDirection: "bottom"
    },
    {
      id: "laboratory",
      word: "laboratory",
      ipa: "/ləˈbɒrətri/",
      pos: "noun",
      meaning: "Phòng thí nghiệm nghiên cứu",
      example: "The solar-powered laboratory houses modern biotechnology equipment.",
      x: 65.5,
      y: 19.5,
      pointerDirection: "center"
    },
    {
      id: "clock_tower",
      word: "clock tower",
      ipa: "/ˈklɒk taʊər/",
      pos: "noun",
      meaning: "Tháp chuông đồng hồ",
      example: "The tall clock tower rings melodiously every sixty minutes.",
      x: 86.0,
      y: 28.0,
      pointerDirection: "center"
    },
    {
      id: "auditorium",
      word: "auditorium",
      ipa: "/ˌɔːdɪˈtɔːriəm/",
      pos: "noun",
      meaning: "Hội trường, nhà hát vòng tròn ngoài trời",
      example: "The open-air auditorium hosts graduation and guest lectures.",
      x: 14.5,
      y: 76.0,
      pointerDirection: "center"
    },
    {
      id: "dormitory",
      word: "dormitory",
      ipa: "/ˈdɔːmɪtri/",
      pos: "noun",
      meaning: "Ký túc xá sinh viên",
      example: "Freshman students usually share a room in the university dormitory.",
      x: 82.0,
      y: 83.0,
      pointerDirection: "center"
    },
    {
      id: "cafeteria",
      word: "cafeteria",
      ipa: "/ˌkæfəˈtɪəriə/",
      pos: "noun",
      meaning: "Nhà ăn sinh viên, quán cà phê ngoài trời",
      example: "The cafeteria terrace serves coffee, healthy lunches, and snacks.",
      x: 88.5,
      y: 53.0,
      pointerDirection: "center"
    },
    {
      id: "quadrangle",
      word: "quadrangle",
      ipa: "/ˈkwɒdræŋɡl/",
      pos: "noun",
      meaning: "Bãi cỏ / sân trung tâm khuôn viên (Quad)",
      example: "Students gathered on the green quadrangle to celebrate exams ending.",
      x: 65.0,
      y: 64.0,
      pointerDirection: "center"
    },
    {
      id: "lecture_hall",
      word: "lecture hall",
      ipa: "/ˈlektʃər hɔːl/",
      pos: "noun",
      meaning: "Giảng đường lớn",
      example: "The professor delivered a lecture on robotics in Hall B.",
      x: 11.5,
      y: 25.5,
      pointerDirection: "center"
    },
    {
      id: "faculty_building",
      word: "faculty building",
      ipa: "/ˈfæklti ˈbɪldɪŋ/",
      pos: "noun",
      meaning: "Tòa nhà khoa & văn phòng giảng viên",
      example: "You can find academic advisors on the third floor of the faculty building.",
      x: 75.5,
      y: 24.5,
      pointerDirection: "center"
    },
    {
      id: "stadium",
      word: "stadium",
      ipa: "/ˈsteɪdiəm/",
      pos: "noun",
      meaning: "Sân vận động thể thao",
      example: "The athletics tournament was held at the outdoor university stadium.",
      x: 32.5,
      y: 15.5,
      pointerDirection: "center"
    },
    {
      id: "bleachers",
      word: "bleachers",
      ipa: "/ˈbliːtʃərz/",
      pos: "noun",
      meaning: "Khán đài ngồi xem thi đấu",
      example: "Supporters filled the bleachers to cheer on their varsity team.",
      x: 27.0,
      y: 9.5,
      pointerDirection: "center"
    },
    {
      id: "bicycle_lane",
      word: "bicycle lane",
      ipa: "/ˈbaɪsɪkl leɪn/",
      pos: "noun",
      meaning: "Làn đường xe đạp",
      example: "Cycling on the dedicated bicycle lane keeps the campus eco-friendly.",
      x: 23.5,
      y: 56.5,
      pointerDirection: "center"
    },
    {
      id: "pathway",
      word: "pathway",
      ipa: "/ˈpɑːθweɪ/",
      pos: "noun",
      meaning: "Lối đi bộ trong trường",
      example: "Paved pathways connect all major departments across the campus.",
      x: 52.0,
      y: 72.0,
      pointerDirection: "center"
    },
    {
      id: "bench",
      word: "park bench",
      ipa: "/pɑːk bentʃ/",
      pos: "noun",
      meaning: "Ghế dài ngoài trời",
      example: "A quiet wooden bench is the perfect spot for afternoon reading.",
      x: 38.0,
      y: 60.5,
      pointerDirection: "center"
    }
  ],
  distractors: [
    { id: "dist_canteen", word: "canteen", ipa: "/kænˈtiːn/", meaning: "Căng tin trường học" },
    { id: "dist_semester", word: "semester", ipa: "/sɪˈmestər/", meaning: "Học kỳ" },
    { id: "dist_tuition", word: "tuition", ipa: "/tjuːˈɪʃn/", meaning: "Học phí" },
    { id: "dist_syllabus", word: "syllabus", ipa: "/ˈsɪləbəs/", meaning: "Đề cương môn học" },
    { id: "dist_diploma", word: "diploma", ipa: "/dɪˈpləʊmə/", meaning: "Bằng tốt nghiệp" },
    { id: "dist_chancellor", word: "chancellor", ipa: "/ˈtʃɑːnsələr/", meaning: "Hiệu trưởng đại học" },
    { id: "dist_registrar", word: "registrar", ipa: "/ˌredʒɪˈstrɑːr/", meaning: "Phòng đào tạo sinh viên" },
    { id: "dist_alumni", word: "alumni", ipa: "/əˈlʌmnaɪ/", meaning: "Cựu sinh viên" },
    { id: "dist_curriculum", word: "curriculum", ipa: "/kəˈrɪkjələm/", meaning: "Chương trình giảng dạy" },
    { id: "dist_thesis", word: "thesis", ipa: "/ˈθiːsɪs/", meaning: "Khóa luận tốt nghiệp" },
    { id: "dist_scholarship", word: "scholarship", ipa: "/ˈskɒləʃɪp/", meaning: "Học bổng" },
    { id: "dist_dean", word: "dean", ipa: "/diːn/", meaning: "Trưởng khoa" },
  ]
};
