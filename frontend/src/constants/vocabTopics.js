/**
 * Standard 30 Curated Vocabulary Bank Topics (English & French).
 * Shared constant matching Backend `app.constants.vocab_topics`.
 */
export const VOCAB_TOPICS = [
  { id: "politics_diplomacy", name_vi: "Chính trị & Ngoại giao", name_en: "Politics & Diplomacy", icon: "Landmark" },
  { id: "economy_trade", name_vi: "Kinh tế & Thương mại", name_en: "Economy & Trade", icon: "TrendingUp" },
  { id: "business_workplace", name_vi: "Kinh doanh & Công sở", name_en: "Business & Workplace", icon: "Briefcase" },
  { id: "science_technology", name_vi: "Khoa học & Kỹ thuật", name_en: "Science & Technology", icon: "Cpu" },
  { id: "ai_digital_future", name_vi: "AI & Kỷ nguyên số", name_en: "AI & Digital Age", icon: "Sparkles" },
  { id: "environment_climate", name_vi: "Môi trường & Khí hậu", name_en: "Environment & Climate", icon: "Leaf" },
  { id: "health_medicine", name_vi: "Y tế & Sức khỏe", name_en: "Healthcare & Medicine", icon: "Activity" },
  { id: "education_academia", name_vi: "Giáo dục & Học thuật", name_en: "Education & Academia", icon: "GraduationCap" },
  { id: "law_justice", name_vi: "Pháp luật & Tư pháp", name_en: "Law & Justice", icon: "Scale" },
  { id: "media_communication", name_vi: "Truyền thông & Báo chí", name_en: "Media & Journalism", icon: "Radio" },
  { id: "society_culture", name_vi: "Xã hội & Bản sắc", name_en: "Society & Culture", icon: "Users" },
  { id: "arts_literature", name_vi: "Nghệ thuật & Văn học", name_en: "Arts & Literature", icon: "Palette" },
  { id: "travel_tourism", name_vi: "Du lịch & Khám phá", name_en: "Travel & Tourism", icon: "Compass" },
  { id: "food_gastronomy", name_vi: "Ẩm thực & Dinh dưỡng", name_en: "Food & Gastronomy", icon: "Utensils" },
  { id: "sports_fitness", name_vi: "Thể thao & Thể hình", name_en: "Sports & Fitness", icon: "Trophy" },
  { id: "daily_life_routine", name_vi: "Đời sống hàng ngày", name_en: "Daily Life & Routine", icon: "Clock" },
  { id: "feelings_psychology", name_vi: "Cảm xúc & Tâm lý", name_en: "Emotions & Psychology", icon: "Heart" },
  { id: "relationships_family", name_vi: "Gia đình & Mối quan hệ", name_en: "Family & Relationships", icon: "Smile" },
  { id: "urban_housing", name_vi: "Đô thị & Nhà ở", name_en: "Urban Life & Housing", icon: "Home" },
  { id: "transport_logistics", name_vi: "Giao thông & Vận tải", name_en: "Transport & Logistics", icon: "Truck" },
  { id: "phrasal_verbs_core", name_vi: "Động từ cụm thông dụng", name_en: "Essential Phrasal Verbs", icon: "Flame" },
  { id: "collocations_academic", name_vi: "Cụm từ học thuật ăn điểm", name_en: "Academic Collocations", icon: "Award" },
  { id: "idioms_expressions", name_vi: "Thành ngữ thực tế", name_en: "Idioms & Expressions", icon: "Lightbulb" },
  { id: "finance_banking", name_vi: "Tài chính & Ngân hàng", name_en: "Finance & Banking", icon: "DollarSign" },
  { id: "energy_resources", name_vi: "Năng lượng & Tài nguyên", name_en: "Energy & Resources", icon: "Zap" },
  { id: "history_heritage", name_vi: "Lịch sử & Di sản", name_en: "History & Heritage", icon: "Book" },
  { id: "philosophy_ethics", name_vi: "Triết học & Đạo đức", name_en: "Philosophy & Ethics", icon: "Feather" },
  { id: "fashion_lifestyle", name_vi: "Thời trang & Phong cách", name_en: "Fashion & Lifestyle", icon: "Scissors" },
  { id: "security_defense", name_vi: "An ninh & Quốc phòng", name_en: "Security & Defense", icon: "Shield" },
  { id: "innovation_startups", name_vi: "Đổi mới & Khởi nghiệp", name_en: "Innovation & Startups", icon: "Rocket" },
];

export const getVocabTopicName = (topicId, lang = "vi") => {
  const found = VOCAB_TOPICS.find((t) => t.id === topicId);
  if (!found) return topicId;
  return lang === "en" ? found.name_en : found.name_vi;
};
