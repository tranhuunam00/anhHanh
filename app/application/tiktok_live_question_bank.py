"""Topic-based question bank for TikTok LIVE Interactive Classroom.

Covers IELTS 7.0+, Destination B2, Idioms/Slang, Word Stress, Phrasal Verbs, and Error ID.
"""
from typing import List, Dict, Any
from app.application.tiktok_live_questions_vtv import VTV_PRACTICAL_QUESTIONS
from app.application.tiktok_live_questions_slang_grammar import SLANG_AND_GRAMMAR_QUESTIONS

LIVE_QUESTION_TOPICS: List[Dict[str, Any]] = [
    {
        "id": "all",
        "name": "Tất cả chủ đề",
        "icon_key": "sparkles",
        "badge": "Tổng hợp",
        "description": "Tổng hợp đa dạng mọi dạng câu hỏi trắc nghiệm"
    },
    {
        "id": "vtv_news",
        "name": "Thời sự VTV & Đời sống",
        "icon_key": "newspaper",
        "badge": "Thời sự VTV",
        "description": "Các vấn đề thời sự thực tiễn hàng ngày trên VTV, kinh tế, giao thông & giá cả"
    },
    {
        "id": "climate_eco",
        "name": "Môi trường & Biến đổi khí hậu",
        "icon_key": "trees",
        "badge": "Môi trường VTV",
        "description": "Bụi mịn, bão lũ, thời tiết cực đoan & cam kết Net Zero xanh"
    },
    {
        "id": "tech_cyber",
        "name": "Công nghệ & Lừa đảo mạng",
        "icon_key": "shield",
        "badge": "VTV24 An ninh",
        "description": "Cảnh báo lừa đảo mạng, deepfake, an toàn tài khoản & xu hướng AI"
    },
    {
        "id": "ielts_vocab",
        "name": "Từ vựng IELTS 7.0+",
        "icon_key": "graduation",
        "badge": "Band 7.0-8.5",
        "description": "Academic Vocabulary, Collocations & Cụm từ Band cao"
    },
    {
        "id": "destination_b2",
        "name": "Destination B2",
        "icon_key": "book",
        "badge": "Chuẩn B2",
        "description": "Ngữ pháp, Giới từ & Cấu tạo từ giáo trình quốc tế"
    },
    {
        "id": "idioms_slang",
        "name": "Thành ngữ & Giao tiếp",
        "icon_key": "message",
        "badge": "Native Slang",
        "description": "Idioms, Slangs và cách diễn đạt tự nhiên người bản xứ"
    },
    {
        "id": "pronunciation_stress",
        "name": "Trọng âm & Phát âm",
        "icon_key": "mic",
        "badge": "Phonology",
        "description": "Quy tắc trọng âm từ 2-4 âm tiết & âm câm dễ bẫy"
    },
    {
        "id": "phrasal_verbs",
        "name": "Phrasal Verbs",
        "icon_key": "zap",
        "badge": "Core Verbs",
        "description": "Cụm động từ thông dụng trong giao tiếp & thi cử"
    }
]

DEFAULT_LIVE_QUESTIONS: List[Dict[str, Any]] = [
    # --- TOPIC 1: IELTS VOCABULARY & COLLOCATIONS (Band 7.0+) ---
    {
        "id": "ielts_1",
        "topic": "ielts_vocab",
        "category": "Synonym",
        "question": "Which word is a Band 7.5+ synonym for 'meticulous'?",
        "options": ["A. Careless", "B. Thorough", "C. Rapid", "D. Reckless"],
        "answer": "B",
        "explanation": "'Meticulous' có nghĩa là tỉ mỉ, cẩn thận từng chi tiết = 'Thorough' / 'Painstaking'.",
        "timer_seconds": 20
    },
    {
        "id": "ielts_2",
        "topic": "ielts_vocab",
        "category": "Collocation",
        "question": "IELTS Academic: 'The government must take drastic measures to ___ emissions.'",
        "options": ["A. elevate", "B. curb", "C. flourish", "D. stimulate"],
        "answer": "B",
        "explanation": "'Curb emissions' = kiểm soát, kìm hãm lượng khí thải (Academic Collocation Band 8.0).",
        "timer_seconds": 20
    },
    {
        "id": "ielts_3",
        "topic": "ielts_vocab",
        "category": "Antonym",
        "question": "Find the OPPOSITE of 'ubiquitous':",
        "options": ["A. Omnipresent", "B. Rare", "C. Pervasive", "D. Universal"],
        "answer": "B",
        "explanation": "'Ubiquitous' = phổ biến ở khắp nơi. Trái nghĩa là 'Rare' (hiếm thấy).",
        "timer_seconds": 20
    },
    {
        "id": "ielts_4",
        "topic": "ielts_vocab",
        "category": "Collocation",
        "question": "IELTS Writing: 'Technological proliferation has a ___ impact on youth.'",
        "options": ["A. profound", "B. high", "C. heavy", "D. strict"],
        "answer": "A",
        "explanation": "'Have a profound impact on...' = có tác động sâu sắc đến... (Cụm từ ghi điểm Writing).",
        "timer_seconds": 20
    },
    {
        "id": "ielts_5",
        "topic": "ielts_vocab",
        "category": "Synonym",
        "question": "Which word means 'to worsen or make a problem more severe'?",
        "options": ["A. Ameliorate", "B. Exacerbate", "C. Facilitate", "D. Reconcile"],
        "answer": "B",
        "explanation": "'Exacerbate' = làm trầm trọng thêm vấn đề. Trái nghĩa là 'Ameliorate' (cải thiện).",
        "timer_seconds": 20
    },

    # --- TOPIC 2: DESTINATION B2 (Grammar & Word Formation) ---
    {
        "id": "dest_1",
        "topic": "destination_b2",
        "category": "Preposition",
        "question": "Destination B2: 'The suspect was accused ___ committing the cyber attack.'",
        "options": ["A. with", "B. for", "C. of", "D. about"],
        "answer": "C",
        "explanation": "Cấu trúc Collocation chuẩn: accused OF doing something (bị buộc tội làm gì).",
        "timer_seconds": 20
    },
    {
        "id": "dest_2",
        "topic": "destination_b2",
        "category": "Word Formation",
        "question": "Destination B2: What is the adjective form of 'KNOWLEDGE'?",
        "options": ["A. Knowledgeable", "B. Knowledgeful", "C. Knowledging", "D. Knowledged"],
        "answer": "A",
        "explanation": "Danh từ 'Knowledge' -> Tính từ: 'Knowledgeable' (có hiểu biết sâu rộng).",
        "timer_seconds": 20
    },
    {
        "id": "dest_3",
        "topic": "destination_b2",
        "category": "Grammar",
        "question": "Destination B2: 'I would rather you ___ touch my private belongings.'",
        "options": ["A. didn't", "B. don't", "C. won't", "D. wouldn't"],
        "answer": "A",
        "explanation": "Cấu trúc: S1 + would rather + S2 + V(quá khứ đơn) để mong muốn ai đó làm/không làm gì ở hiện tại.",
        "timer_seconds": 20
    },
    {
        "id": "dest_4",
        "topic": "destination_b2",
        "category": "Preposition",
        "question": "Destination B2: 'She congratulated him ___ winning the scholarship.'",
        "options": ["A. for", "B. about", "C. on", "D. in"],
        "answer": "C",
        "explanation": "Cấu trúc chuẩn: congratulate someone ON doing something (chúc mừng ai về điều gì).",
        "timer_seconds": 20
    },
    {
        "id": "dest_5",
        "topic": "destination_b2",
        "category": "Word Formation",
        "question": "Destination B2: Fill negative prefix: 'It is highly ___ to smoke here.' (LEGAL)",
        "options": ["A. unlegal", "B. illegal", "C. dislegal", "D. inlegal"],
        "answer": "B",
        "explanation": "Từ bắt đầu bằng chữ 'l' thường thêm tiền tố phủ định 'il-': Legal -> Illegal.",
        "timer_seconds": 20
    },

    # --- TOPIC 3: IDIOMS & SLANG (Giao tiếp tự nhiên) ---
    {
        "id": "idiom_1",
        "topic": "idioms_slang",
        "category": "Idiom",
        "question": "What does the idiom 'hit the sack' mean?",
        "options": ["A. Go to sleep", "B. Punch someone", "C. Go shopping", "D. Start working"],
        "answer": "A",
        "explanation": "'Hit the sack' hoặc 'Hit the hay' là thành ngữ thông dụng chỉ việc đi ngủ.",
        "timer_seconds": 20
    },
    {
        "id": "idiom_2",
        "topic": "idioms_slang",
        "category": "Idiom",
        "question": "If something happens 'once in a blue moon', it happens:",
        "options": ["A. Every week", "B. Very rarely", "C. At nighttime", "D. Always"],
        "answer": "B",
        "explanation": "'Once in a blue moon' = năm thì mười họa, cực kỳ hiếm khi xảy ra.",
        "timer_seconds": 20
    },
    {
        "id": "idiom_3",
        "topic": "idioms_slang",
        "category": "Slang",
        "question": "In modern English slang, if a party is 'LIT', it means:",
        "options": ["A. Well-lighted", "B. Extremely fun/exciting", "C. On fire", "D. Boring"],
        "answer": "B",
        "explanation": "Slang giới trẻ: 'Lit' = cực kỳ náo nhiệt, sôi động và vui vẻ.",
        "timer_seconds": 20
    },
    {
        "id": "idiom_4",
        "topic": "idioms_slang",
        "category": "Idiom",
        "question": "What does 'bite the bullet' mean?",
        "options": ["A. Eat quickly", "B. Face a painful situation bravely", "C. Go hunting", "D. Start a fight"],
        "answer": "B",
        "explanation": "'Bite the bullet' = cắn răng chịu đựng, dũng cảm đối mặt với tình thế khó khăn.",
        "timer_seconds": 20
    },
    {
        "id": "idiom_5",
        "topic": "idioms_slang",
        "category": "Idiom",
        "question": "Complete the idiom: 'Break a ___' (Wishing someone good luck):",
        "options": ["A. leg", "B. hand", "C. heart", "D. record"],
        "answer": "A",
        "explanation": "'Break a leg' là lời chúc may mắn, thành công (đặc biệt trong biểu diễn sân khấu).",
        "timer_seconds": 15
    },

    # --- TOPIC 4: WORD STRESS & PRONUNCIATION (Trọng âm & Phát âm) ---
    {
        "id": "stress_1",
        "topic": "pronunciation_stress",
        "category": "Word Stress",
        "question": "Which syllable is stressed in 'PHOTOGRAPH'?",
        "options": ["A. 1st (PHO-)", "B. 2nd (-TO-)", "C. 3rd (-GRAPH)"],
        "answer": "A",
        "explanation": "Danh từ 'photograph' trọng âm rơi vào âm tiết thứ nhất: /ˈfoʊ.tə.ɡræf/.",
        "timer_seconds": 20
    },
    {
        "id": "stress_2",
        "topic": "pronunciation_stress",
        "category": "Word Stress",
        "question": "Which syllable is stressed in 'PHOTOGRAPHY'?",
        "options": ["A. 1st (pho-)", "B. 2nd (-TOG-)", "C. 3rd (-ra-)", "D. 4th (-phy)"],
        "answer": "B",
        "explanation": "Hậu tố -graphy làm trọng âm rơi vào âm tiết đứng ngay trước nó: /fəˈtɑː.ɡrə.fi/ (âm 2).",
        "timer_seconds": 20
    },
    {
        "id": "stress_3",
        "topic": "pronunciation_stress",
        "category": "Silent Letter",
        "question": "Which letter is SILENT in the word 'DOUBT'?",
        "options": ["A. D", "B. O", "C. U", "D. B"],
        "answer": "D",
        "explanation": "Chữ 'B' đứng trước 'T' trong 'doubt', 'debt', 'subtle' là âm câm: /daʊt/.",
        "timer_seconds": 15
    },
    {
        "id": "stress_4",
        "topic": "pronunciation_stress",
        "category": "Word Stress",
        "question": "Choose the word with stress on the 2nd syllable:",
        "options": ["A. Economic", "B. Contagious", "C. Industry", "D. Atmosphere"],
        "answer": "B",
        "explanation": "'Contagious' /kənˈteɪ.dʒəs/ (âm 2). Còn Economic (âm 3), Industry (âm 1), Atmosphere (âm 1).",
        "timer_seconds": 20
    },
    {
        "id": "stress_5",
        "topic": "pronunciation_stress",
        "category": "Pronunciation",
        "question": "Which word has the 'CH' pronounced as /k/?",
        "options": ["A. Church", "B. Chef", "C. Chaos", "D. Chair"],
        "answer": "C",
        "explanation": "'Chaos' phát âm là /ˈkeɪ.ɑːs/ (/k/). Còn Church /tʃ/, Chef /ʃ/, Chair /tʃ/.",
        "timer_seconds": 20
    },

    # --- TOPIC 5: PHRASAL VERBS (Cụm động từ thông dụng) ---
    {
        "id": "pv_1",
        "topic": "phrasal_verbs",
        "category": "Phrasal Verb",
        "question": "Which phrasal verb means 'to cancel an event'?",
        "options": ["A. Call off", "B. Put off", "C. Give up", "D. Turn down"],
        "answer": "A",
        "explanation": "'Call off' = hủy bỏ. 'Put off' = hoãn lại (postpone).",
        "timer_seconds": 20
    },
    {
        "id": "pv_2",
        "topic": "phrasal_verbs",
        "category": "Phrasal Verb",
        "question": "Complete sentence: 'Can you please ___ after my cat while I'm away?'",
        "options": ["A. look for", "B. look after", "C. look into", "D. look out"],
        "answer": "B",
        "explanation": "'Look after' = chăm sóc, trông nom (take care of).",
        "timer_seconds": 20
    },
    {
        "id": "pv_3",
        "topic": "phrasal_verbs",
        "category": "Phrasal Verb",
        "question": "'She turned down their job offer.' Here 'turn down' means:",
        "options": ["A. Accept", "B. Reject / Refuse", "C. Decrease volume", "D. Delay"],
        "answer": "B",
        "explanation": "'Turn down an offer' = từ chối lời mời hoặc cơ hội làm việc.",
        "timer_seconds": 20
    },
    {
        "id": "pv_4",
        "topic": "phrasal_verbs",
        "category": "Phrasal Verb",
        "question": "Which phrasal verb means 'to tolerate or endure something unpleasant'?",
        "options": ["A. Put up with", "B. Come up with", "C. Run out of", "D. Look down on"],
        "answer": "A",
        "explanation": "'Put up with' = chịu đựng, nhẫn nhịn điều gì đó gây khó chịu.",
        "timer_seconds": 20
    },
    {
        "id": "pv_5",
        "topic": "phrasal_verbs",
        "category": "Phrasal Verb",
        "question": "Complete sentence: 'We have completely ___ out of milk.'",
        "options": ["A. taken", "B. run", "C. fallen", "D. broken"],
        "answer": "B",
        "explanation": "'Run out of something' = cạn kiệt, hết sạch cái gì.",
        "timer_seconds": 15
    }
]

# Include real-world VTV News & practical daily topics
DEFAULT_LIVE_QUESTIONS.extend(VTV_PRACTICAL_QUESTIONS)
DEFAULT_LIVE_QUESTIONS.extend(SLANG_AND_GRAMMAR_QUESTIONS)


def get_questions_by_topic(topic_id: str = "all") -> List[Dict[str, Any]]:
    """Filter questions by topic ID. Returns all questions if topic_id is 'all'."""
    if not topic_id or topic_id == "all":
        return list(DEFAULT_LIVE_QUESTIONS)
    filtered = [q for q in DEFAULT_LIVE_QUESTIONS if q.get("topic") == topic_id]
    return filtered if filtered else list(DEFAULT_LIVE_QUESTIONS)

