"""Catalog combining all multilingual writing prompts and language configurations."""
from typing import Dict, List, Any
from app.infrastructure.writing_prompts_en import CURATED_PROMPTS_EN
from app.infrastructure.writing_prompts_multi import CURATED_PROMPTS_MULTI

CURATED_PROMPTS_BY_LANG: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    "en": CURATED_PROMPTS_EN,
    **CURATED_PROMPTS_MULTI,
}

CURATED_PROMPTS = CURATED_PROMPTS_BY_LANG["en"]

LANGUAGES_CONFIG = {
    "en": {
        "name": "Tiếng Anh",
        "native": "English",
        "system": "IELTS Band 0-9 / CEFR",
        "examiner": "Giám khảo Khảo thí IELTS Quốc tế kỳ cựu và Chuyên gia Ngôn ngữ học Tiếng Anh cấp cao (Senior IELTS Examiner & Academic Writing Coach)",
    },
    "ja": {
        "name": "Tiếng Nhật",
        "native": "日本語",
        "system": "JLPT N1-N5 & Tiểu luận Nhật ngữ (小論文 / 作文)",
        "examiner": "Giám khảo Năng lực Nhật ngữ JLPT cấp cao và Chuyên gia Viết luận Văn phong Nhật Bản (Japanese Academic Writing Coach)",
    },
    "zh": {
        "name": "Tiếng Trung",
        "native": "中文",
        "system": "HSK 1-6 & Viết luận Hán ngữ (写作)",
        "examiner": "Giám khảo Khảo thí Hán ngữ Quốc tế HSK cấp cao và Chuyên gia Văn phong Tiếng Trung (Chinese Academic Writing Coach)",
    },
    "ko": {
        "name": "Tiếng Hàn",
        "native": "한국어",
        "system": "TOPIK I-II & Viết luận Tiếng Hàn (쓰기)",
        "examiner": "Giám khảo Năng lực Tiếng Hàn TOPIK cấp cao và Chuyên gia Luyện viết Luận Hàn ngữ (Korean Writing Coach)",
    },
    "fr": {
        "name": "Tiếng Pháp",
        "native": "Français",
        "system": "DELF/DALF / CEFR A1-C2",
        "examiner": "Giám khảo Khảo thí Tiếng Pháp DELF/DALF và Chuyên gia Ngôn ngữ Pháp (French Writing Coach)",
    },
    "de": {
        "name": "Tiếng Đức",
        "native": "Deutsch",
        "system": "Goethe-Zertifikat / TestDaF",
        "examiner": "Giám khảo Khảo thí Tiếng Đức Goethe/TestDaF và Chuyên gia Văn phong Học thuật Đức (German Writing Coach)",
    },
}
