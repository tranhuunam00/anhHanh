"""Practical real-world questions inspired by daily VTV News, VTV24, Society & Tech trends."""
from typing import List, Dict, Any

VTV_PRACTICAL_QUESTIONS: List[Dict[str, Any]] = [
    # --- TOPIC: THỜI SỰ VTV & ĐỜI SỐNG THỰC TẾ (vtv_news) ---
    {
        "id": "vtv_1",
        "topic": "vtv_news",
        "category": "Kinh tế & Giá cả",
        "question": "Bản tin VTV Tài chính: 'Do ảnh hưởng chuỗi cung ứng, giá các mặt hàng thiết yếu ___ chóng mặt.'",
        "options": ["A. plummeted", "B. skyrocketed", "C. stagnated", "D. depreciated"],
        "answer": "B",
        "explanation": "'Skyrocketed' = tăng vọt lên trời với tốc độ chóng mặt. Trái nghĩa là 'plummeted' (lao dốc thê thảm).",
        "timer_seconds": 20
    },
    {
        "id": "vtv_2",
        "topic": "vtv_news",
        "category": "Giao thông đô thị",
        "question": "VTV Giao thông: 'During rush hour, urban commuters often get stuck in severe traffic ___.'",
        "options": ["A. gridlock", "B. breakdown", "C. clearance", "D. shortcut"],
        "answer": "A",
        "explanation": "'Traffic gridlock' = tình trạng ùn tắc giao thông nghiêm trọng, tê liệt hoàn toàn không di chuyển được.",
        "timer_seconds": 20
    },
    {
        "id": "vtv_3",
        "topic": "vtv_news",
        "category": "Đời sống công sở",
        "question": "VTV24: Nhiều người trẻ hiện nay đối mặt với trạng thái kiệt quệ thể chất và tinh thần gọi là ___.",
        "options": ["A. chill out", "B. burnout", "C. standout", "D. breakout"],
        "answer": "B",
        "explanation": "'Burnout' = hội chứng kiệt sức nghề nghiệp do căng thẳng và áp lực công việc kéo dài.",
        "timer_seconds": 20
    },
    {
        "id": "vtv_4",
        "topic": "vtv_news",
        "category": "An toàn thực phẩm",
        "question": "VTV Vấn đề hôm nay: Cơ quan chức năng xử lý nghiêm các vụ vi phạm an toàn thực phẩm: 'Food safety ___.'",
        "options": ["A. approvals", "B. violations", "C. virtues", "D. bonuses"],
        "answer": "B",
        "explanation": "'Food safety violations' = các hành vi vi phạm quy định về vệ sinh an toàn thực phẩm.",
        "timer_seconds": 20
    },
    {
        "id": "vtv_5",
        "topic": "vtv_news",
        "category": "Chi tiêu gia đình",
        "question": "Thời kỳ lạm phát, nhiều gia đình phải 'thắt lưng buộc bụng'. Thành ngữ tiếng Anh tương ứng là:",
        "options": ["A. tighten their belt", "B. loosen their pocket", "C. break the chain", "D. cut the rope"],
        "answer": "A",
        "explanation": "'Tighten one's belt' = thắt lưng buộc bụng, tiết kiệm chi tiêu tối đa trong thời kỳ khó khăn.",
        "timer_seconds": 20
    },
    {
        "id": "vtv_6",
        "topic": "vtv_news",
        "category": "Thị trường vàng & Tài chính",
        "question": "VTV Khớp lệnh: 'Do biến động địa chính trị, giá vàng trong nước liên tục lập đỉnh mới: Gold prices hit an all-time ___.'",
        "options": ["A. low", "B. high", "C. debt", "D. loss"],
        "answer": "B",
        "explanation": "'Hit an all-time high' = chạm mốc cao kỷ lục trong lịch sử. Trái nghĩa là 'hit an all-time low'.",
        "timer_seconds": 20
    },
    {
        "id": "vtv_7",
        "topic": "vtv_news",
        "category": "Bất động sản & Nhà ở",
        "question": "VTV Tiêu điểm: Giá chung cư tại các đô thị lớn tăng phi mã, vượt quá khả năng chi trả của người trẻ: 'Housing ___.'",
        "options": ["A. affordability crisis", "B. comfort zone", "C. luxury discount", "D. empty vacancy"],
        "answer": "A",
        "explanation": "'Housing affordability crisis' = cuộc khủng hoảng khả năng chi trả nhà ở của người dân.",
        "timer_seconds": 20
    },
    {
        "id": "vtv_8",
        "topic": "vtv_news",
        "category": "Thị trường lao động",
        "question": "Ngành công nghiệp vi mạch bán dẫn đang khát nhân lực chất lượng cao: 'Facing an acute talent ___.'",
        "options": ["A. surplus", "B. shortage", "C. leisure", "D. privilege"],
        "answer": "B",
        "explanation": "'Acute talent shortage' = tình trạng khan hiếm, thiếu hụt trầm trọng nguồn nhân lực tài năng.",
        "timer_seconds": 20
    },
    {
        "id": "vtv_9",
        "topic": "vtv_news",
        "category": "Xu hướng mua sắm MXH",
        "question": "Livestream bán hàng kích thích tâm lý mua sắm bốc đồng không suy tính của khách hàng, gọi là: 'Impulse ___.'",
        "options": ["A. buying", "B. selling", "C. lending", "D. refusing"],
        "answer": "A",
        "explanation": "'Impulse buying' = thói quen mua sắm theo cảm xúc nhất thời, chốt đơn bốc đồng không có kế hoạch.",
        "timer_seconds": 20
    },
    {
        "id": "vtv_10",
        "topic": "vtv_news",
        "category": "Lối sống & Tâm lý",
        "question": "Trào lưu người trẻ tìm về thiên nhiên, yoga hoặc thiền để 'chữa lành' tâm hồn được gọi là:",
        "options": ["A. Toxic hustle", "B. Mental healing", "C. Public shaming", "D. Bitter arguing"],
        "answer": "B",
        "explanation": "'Mental healing' = chữa lành sức khỏe tâm trí, xoa dịu những áp lực và tổn thương tinh thần.",
        "timer_seconds": 20
    },

    # --- TOPIC: MÔI TRƯỜNG & BIẾN ĐỔI KHÍ HẬU (climate_eco) ---
    {
        "id": "eco_1",
        "topic": "climate_eco",
        "category": "Ô nhiễm không khí",
        "question": "VTV Dự báo thời tiết cảnh báo chỉ số chất lượng không khí báo động đỏ, nồng độ bụi mịn ___ vượt ngưỡng.",
        "options": ["A. PM2.5", "B. CO2", "C. H2O", "D. O3"],
        "answer": "A",
        "explanation": "'PM2.5' = Particulate Matter 2.5 (hạt bụi mịn có đường kính dưới 2.5 micromet gây hại cho phổi).",
        "timer_seconds": 20
    },
    {
        "id": "eco_2",
        "topic": "climate_eco",
        "category": "Thiên tai thời tiết",
        "question": "Các đợt nắng nóng gay gắt kéo dài nhiều ngày kỷ lục trên thế giới được gọi là ___.",
        "options": ["A. heatwave", "B. blizzard", "C. flood", "D. avalanche"],
        "answer": "A",
        "explanation": "'Heatwave' = đợt sóng nhiệt, đợt nắng nóng cực đoan diện rộng.",
        "timer_seconds": 20
    },
    {
        "id": "eco_3",
        "topic": "climate_eco",
        "category": "Môi trường xanh",
        "question": "Chiến dịch xanh trên VTV kêu gọi người tiêu dùng tẩy chay đồ nhựa dùng một lần: '___ plastics.'",
        "options": ["A. everlasting", "B. single-use", "C. long-term", "D. multi-purpose"],
        "answer": "B",
        "explanation": "'Single-use plastics' = các sản phẩm nhựa chỉ dùng một lần rồi vứt bỏ (ly nhựa, ống hút, túi nilon).",
        "timer_seconds": 20
    },
    {
        "id": "eco_4",
        "topic": "climate_eco",
        "category": "Năng lượng sạch",
        "question": "Mục tiêu Net Zero cam kết chuyển dịch mạnh mẽ sang các nguồn năng lượng tái tạo: '___ energy.'",
        "options": ["A. renewable", "B. exhaustible", "C. fossil", "D. synthetic"],
        "answer": "A",
        "explanation": "'Renewable energy' = năng lượng tái tạo (điện mặt trời, điện gió, thủy điện... không cạn kiệt).",
        "timer_seconds": 20
    },
    {
        "id": "eco_5",
        "topic": "climate_eco",
        "category": "Thiên tai bão lũ",
        "question": "Mưa bão lớn kéo dài tại vùng núi tiềm ẩn nguy cơ sạt lở đất nghiêm trọng: 'Risk of ___.'",
        "options": ["A. landslides", "B. earthquakes", "C. volcanoes", "D. sandstorms"],
        "answer": "A",
        "explanation": "'Landslide' = hiện tượng sạt lở đất, đất đá sụt trượt do mưa lũ ngấm no nước.",
        "timer_seconds": 20
    },

    # --- TOPIC: CÔNG NGHỆ & AN NINH MẠNG (tech_cyber) ---
    {
        "id": "cyber_1",
        "topic": "tech_cyber",
        "category": "Lừa đảo mạng",
        "question": "VTV24 cảnh báo: Kẻ gian tạo video mạo danh khuôn mặt và giọng nói người thân để vay tiền bằng công nghệ ___.",
        "options": ["A. Deepfake", "B. Bluetooth", "C. Firewall", "D. Antivirus"],
        "answer": "A",
        "explanation": "'Deepfake' = công nghệ trí tuệ nhân tạo giả mạo khuôn mặt và giọng nói của người khác với độ chân thực cao.",
        "timer_seconds": 20
    },
    {
        "id": "cyber_2",
        "topic": "tech_cyber",
        "category": "Tội phạm mạng",
        "question": "Thủ đoạn gửi email hoặc tin nhắn giả mạo cơ quan công an / ngân hàng nhằm đánh cắp mật khẩu gọi là ___.",
        "options": ["A. Phishing", "B. Streaming", "C. Debugging", "D. Downloading"],
        "answer": "A",
        "explanation": "'Phishing' (tấn công giả mạo) = chiêu trò lừa đảo câu thông tin tài khoản và mật khẩu của người dùng.",
        "timer_seconds": 20
    },
    {
        "id": "cyber_3",
        "topic": "tech_cyber",
        "category": "Bảo mật tài khoản",
        "question": "Để bảo vệ tài khoản mạng xã hội, người dùng bắt buộc nên bật tính năng xác thực 2 bước: Two-factor ___ (2FA).",
        "options": ["A. authentication", "B. acceleration", "C. liquidation", "D. interruption"],
        "answer": "A",
        "explanation": "'Two-factor authentication' (2FA) = tính năng xác thực 2 lớp, gửi mã OTP về điện thoại tăng cường bảo mật.",
        "timer_seconds": 20
    },
    {
        "id": "cyber_4",
        "topic": "tech_cyber",
        "category": "Rò rỉ dữ liệu",
        "question": "Sự cố các tập đoàn bị tin tặc tấn công làm lộ hàng triệu thông tin người dùng được gọi là 'Data ___.'",
        "options": ["A. Breach", "B. Repair", "C. Blessing", "D. Treasure"],
        "answer": "A",
        "explanation": "'Data Breach' = vi phạm dữ liệu, rò rỉ cơ sở dữ liệu bí mật ra ngoài internet.",
        "timer_seconds": 20
    },
    {
        "id": "cyber_5",
        "topic": "tech_cyber",
        "category": "Trí tuệ nhân tạo",
        "question": "Làn sóng công nghệ AI có khả năng tự sáng tạo nội dung văn bản, tranh ảnh và video được gọi là:",
        "options": ["A. Generative AI", "B. Mechanical AI", "C. Passive AI", "D. Traditional AI"],
        "answer": "A",
        "explanation": "'Generative AI' (AI tạo sinh) = các mô hình như ChatGPT, Midjourney, Gemini có khả năng tự sinh nội dung mới.",
        "timer_seconds": 20
    },
    {
        "id": "cyber_6",
        "topic": "tech_cyber",
        "category": "Mã độc tống tiền",
        "question": "Loại mã độc nguy hiểm mã hóa toàn bộ dữ liệu máy tính của doanh nghiệp để đòi tiền chuộc được gọi là:",
        "options": ["A. Freeware", "B. Ransomware", "C. Hardware", "D. Shareware"],
        "answer": "B",
        "explanation": "'Ransomware' = phần mềm độc hại tống tiền (ransom), bắt cóc dữ liệu và ép nạn nhân trả tiền chuộc.",
        "timer_seconds": 20
    },
    {
        "id": "cyber_7",
        "topic": "tech_cyber",
        "category": "Cảnh báo lừa đảo",
        "question": "VTV Cảnh báo: Kẻ lừa đảo dụ người dân cài app giả mạo cơ quan thuế chứa mã độc chiếm quyền điều khiển: '___ app.'",
        "options": ["A. Beneficial", "B. Malicious", "C. Transparent", "D. Wholesome"],
        "answer": "B",
        "explanation": "'Malicious app' = ứng dụng độc hại chứa mã độc (malware) nhằm đánh cắp tiền trong tài khoản.",
        "timer_seconds": 20
    },
    {
        "id": "eco_6",
        "topic": "climate_eco",
        "category": "Hiện tượng khí hậu đô thị",
        "question": "Hiện tượng bê tông hóa khiến các đại đô thị nóng hơn nhiều so với vùng nông thôn ngoại thành gọi là: 'Urban heat ___ effect.'",
        "options": ["A. island", "B. river", "C. cloud", "D. cave"],
        "answer": "A",
        "explanation": "'Urban heat island effect' = hiệu ứng đảo nhiệt đô thị, nhiệt độ trung tâm thành phố cao bất thường do bê tông hấp thụ nhiệt.",
        "timer_seconds": 20
    },
    {
        "id": "eco_7",
        "topic": "climate_eco",
        "category": "Xử lý rác thải công nghệ",
        "question": "Pin hỏng, bo mạch và thiết bị điện tử cũ bị vứt bỏ tạo ra lượng rác thải nguy hại gọi là: '___-waste.'",
        "options": ["A. A", "B. E", "C. I", "D. O"],
        "answer": "B",
        "explanation": "'E-waste' (Electronic waste) = rác thải điện tử chứa kim loại nặng cần quy trình xử lý chuyên biệt.",
        "timer_seconds": 15
    },
    {
        "id": "eco_8",
        "topic": "climate_eco",
        "category": "Cam kết bảo vệ trái đất",
        "question": "Mục tiêu đưa lượng phát thải khí nhà kính về mức cân bằng bằng 0 đến năm 2050 được gọi là: 'Net-___ emissions.'",
        "options": ["A. one", "B. zero", "C. ten", "D. full"],
        "answer": "B",
        "explanation": "'Net-zero emissions' = phát thải ròng bằng không, giảm thiểu tối đa khí nhà kính kết hợp hấp thụ carbon tương đương.",
        "timer_seconds": 15
    }
]

