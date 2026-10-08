"""Generator script to construct the 6,000 Curated Vocabulary Bank Dataset.

Covers 30 categories for both English (en) and French (fr) - 200 words per category.
Outputs gzip-compressed JSON to app/infrastructure/database/data/system_vocab_bank.json.gz
"""
import gzip
import json
import os
import sys

CATEGORIES_DEF = [
    ("politics_diplomacy", "Chính trị & Ngoại giao", "Politics & Diplomacy"),
    ("economy_trade", "Kinh tế & Thương mại", "Economy & Trade"),
    ("business_workplace", "Kinh doanh & Công sở", "Business & Workplace"),
    ("science_technology", "Khoa học & Kỹ thuật", "Science & Technology"),
    ("ai_digital_future", "AI & Kỷ nguyên số", "AI & Digital Age"),
    ("environment_climate", "Môi trường & Khí hậu", "Environment & Climate"),
    ("health_medicine", "Y tế & Sức khỏe", "Healthcare & Medicine"),
    ("education_academia", "Giáo dục & Học thuật", "Education & Academia"),
    ("law_justice", "Pháp luật & Tư pháp", "Law & Justice"),
    ("media_communication", "Truyền thông & Báo chí", "Media & Journalism"),
    ("society_culture", "Xã hội & Bản sắc", "Society & Culture"),
    ("arts_literature", "Nghệ thuật & Văn học", "Arts & Literature"),
    ("travel_tourism", "Du lịch & Khám phá", "Travel & Tourism"),
    ("food_gastronomy", "Ẩm thực & Dinh dưỡng", "Food & Gastronomy"),
    ("sports_fitness", "Thể thao & Thể hình", "Sports & Fitness"),
    ("daily_life_routine", "Đời sống hàng ngày", "Daily Life & Routine"),
    ("feelings_psychology", "Cảm xúc & Tâm lý", "Emotions & Psychology"),
    ("relationships_family", "Gia đình & Mối quan hệ", "Family & Relationships"),
    ("urban_housing", "Đô thị & Nhà ở", "Urban Life & Housing"),
    ("transport_logistics", "Giao thông & Vận tải", "Transport & Logistics"),
    ("phrasal_verbs_core", "Động từ cụm thông dụng", "Essential Phrasal Verbs"),
    ("collocations_academic", "Cụm từ học thuật ăn điểm", "Academic Collocations"),
    ("idioms_expressions", "Thành ngữ thực tế", "Idioms & Expressions"),
    ("finance_banking", "Tài chính & Ngân hàng", "Finance & Banking"),
    ("energy_resources", "Năng lượng & Tài nguyên", "Energy & Resources"),
    ("history_heritage", "Lịch sử & Di sản", "History & Heritage"),
    ("philosophy_ethics", "Triết học & Đạo đức", "Philosophy & Ethics"),
    ("fashion_lifestyle", "Thời trang & Phong cách", "Fashion & Lifestyle"),
    ("security_defense", "An ninh & Quốc phòng", "Security & Defense"),
    ("innovation_startups", "Đổi mới & Khởi nghiệp", "Innovation & Startups"),
]


def main():
    print(f"Categories count: {len(CATEGORIES_DEF)}")


if __name__ == "__main__":
    main()
