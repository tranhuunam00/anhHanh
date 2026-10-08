"""Data builder that generates 6,000 high-quality vocabulary entries.

30 topics x 200 items (100 English + 100 French per topic).
Saves output to system_vocab_bank.json.gz.
"""
import gzip
import json
import os
import re
from typing import List, Dict, Any

from app.infrastructure.database.data.vocab_generator_engine import CATEGORIES_CATALOG

# Topic seed definitions with specialized terms per category
# English & French seeds mapping to thematic clusters
TOPIC_TERMS_SEEDS = {
    "politics_diplomacy": {
        "en_words": [
            ("diplomacy", "/dɪˈpləʊməsi/", "ngoại giao", "Diplomacy is essential to resolve conflicts peacefully. [Ngoại giao là điều thiết yếu để giải quyết xung đột trong hòa bình.]", "single_word", "B2"),
            ("sovereignty", "/ˈsɒvrənti/", "chủ quyền", "National sovereignty must be respected by all nations. [Chủ quyền quốc gia phải được mọi nước tôn trọng.]", "single_word", "C1"),
            ("ambassador", "/æmˈbæsədər/", "đại sứ", "The ambassador presented his credentials to the head of state. [Đại sứ đã trình quốc thư lên nguyên thủ quốc gia.]", "single_word", "B1"),
            ("treaty", "/ˈtriːti/", "hiệp ước", "Both countries ratified the peace treaty yesterday. [Cả hai nước đã phê chuẩn hiệp ước hòa bình hôm qua.]", "single_word", "B2"),
            ("delegation", "/ˌdelɪˈɡeɪʃn/", "phái đoàn", "The high-ranking delegation arrived in the capital. [Phái đoàn cấp cao đã tới thủ đô.]", "single_word", "B2"),
            ("consensus", "/kənˈsensəs/", "sự đồng thuận", "The committee reached a broad consensus on the reform. [Ủy ban đã đạt được sự đồng thuận rộng rãi về cải cách.]", "single_word", "C1"),
            ("sanction", "/ˈsæŋkʃn/", "lệnh trừng phạt", "Economic sanctions were imposed to deter aggression. [Các biện pháp trừng phạt kinh tế đã được áp đặt nhằm ngăn chặn xâm lược.]", "single_word", "B2"),
            ("summit", "/ˈsʌmɪt/", "hội nghị thượng đỉnh", "Leaders gathered for the annual regional summit. [Các nhà lãnh đạo đã tập hợp dự hội nghị thượng đỉnh khu vực thường niên.]", "single_word", "B2"),
            ("ratify", "/ˈrætɪfaɪ/", "phê chuẩn", "Parliament voted to ratify the landmark convention. [Quốc hội đã bỏ phiếu phê chuẩn công ước mang tính bước ngoặt.]", "single_word", "C1"),
            ("coalition", "/ˌkəʊəˈlɪʃn/", "liên minh", "The ruling coalition agreed on a joint policy package. [Liên minh cầm quyền đã thống nhất về gói chính sách chung.]", "single_word", "B2"),
        ],
        "en_phrases": [
            ("bilateral relations", "/baɪˈlætərəl rɪˈleɪʃnz/", "quan hệ song phương", "Both leaders pledged to deepen bilateral relations. [Cả hai nhà lãnh đạo cam kết làm sâu sắc hơn quan hệ song phương.]", "phrase", "B2"),
            ("strategic partnership", "/strəˈtiːdʒɪk ˈpɑːtnəʃɪp/", "đối tác chiến lược", "The agreement upgraded ties to a comprehensive strategic partnership. [Thỏa thuận đã nâng cấp quan hệ lên đối tác chiến lược toàn diện.]", "phrase", "C1"),
            ("mutual trust", "/ˈmjuːtʃuəl trʌst/", "sự tin cậy lẫn nhau", "Sustainable peace relies on building mutual trust. [Hòa bình bền vững dựa trên việc xây dựng sự tin cậy lẫn nhau.]", "phrase", "B2"),
            ("peaceful coexistence", "/ˈpiːsfl ˌkəʊɪɡˈzɪstəns/", "chung sống hòa bình", "The principles promote peaceful coexistence among neighbors. [Các nguyên tắc thúc đẩy sự chung sống hòa bình giữa các nước láng giềng.]", "phrase", "C1"),
            ("diplomatic immunity", "/ˌdɪpləˈmætɪk ɪˈmjuːnəti/", "quyền miễn trừ ngoại giao", "Diplomatic immunity protects envoys during their missions. [Quyền miễn trừ ngoại giao bảo vệ các đặc phái viên trong sứ mệnh của họ.]", "phrase", "C1"),
        ],
        "fr_words": [
            ("diplomatie", "/di.plɔ.ma.si/", "ngoại giao", "La diplomatie reste la meilleure voie vers la paix. [Ngoại giao vẫn là con đường tốt nhất hướng tới hòa bình.]", "single_word", "B2"),
            ("souveraineté", "/su.vʁɛn.te/", "chủ quyền", "Le respect de la souveraineté est fondamental. [Tôn trọng chủ quyền là điều cơ bản.]", "single_word", "C1"),
            ("ambassadeur", "/ɑ̃.ba.sa.dœʁ/", "đại sứ", "L'ambassadeur a rencontré le ministre des Affaires étrangères. [Đại sứ đã gặp Bộ trưởng Ngoại giao.]", "single_word", "B1"),
            ("traité", "/tʁɛ.te/", "hiệp ước", "Le traité a été signé à Genève. [Hiệp ước đã được ký kết tại Geneva.]", "single_word", "B2"),
            ("délégation", "/de.le.ɡa.sjɔ̃/", "phái đoàn", "La délégation française est arrivée ce matin. [Phái đoàn Pháp đã đến vào sáng nay.]", "single_word", "B2"),
            ("consensus", "/kɔ̃.sɑ̃.sys/", "sự đồng thuận", "Ils ont réussi à bâtir un large consensus. [Họ đã thành công trong việc xây dựng sự đồng thuận rộng rãi.]", "single_word", "C1"),
            ("sanction", "/sɑ̃k.sjɔ̃/", "lệnh trừng phạt", "Des sanctions sévères ont été adoptées. [Các biện pháp trừng phạt nghiêm khắc đã được thông qua.]", "single_word", "B2"),
            ("sommet", "/sɔ.mɛ/", "hội nghị thượng đỉnh", "Le sommet mondial s'est tenu à Paris. [Hội nghị thượng đỉnh toàn cầu đã diễn ra tại Paris.]", "single_word", "B2"),
            ("ratifier", "/ʁa.ti.fje/", "phê chuẩn", "Le Parlement a voté pour ratifier l'accord. [Quốc hội đã bỏ phiếu phê chuẩn thỏa thuận.]", "single_word", "C1"),
            ("coalition", "/kɔ.a.li.sjɔ̃/", "liên minh", "La coalition au pouvoir a présenté son projet. [Liên minh cầm quyền đã trình bày dự án của mình.]", "single_word", "B2"),
        ],
        "fr_phrases": [
            ("relations bilatérales", "/ʁə.la.sjɔ̃ bi.la.te.ʁal/", "quan hệ song phương", "Les relations bilatérales se renforcent continuellement. [Quan hệ song phương đang không ngừng được tăng cường.]", "phrase", "B2"),
            ("partenariat stratégique", "/paʁ.tə.na.ʁja stʁa.te.ʒik/", "đối tác chiến lược", "Ce partenariat stratégique ouvre de nouvelles perspectives. [Đối tác chiến lược này mở ra những triển vọng mới.]", "phrase", "C1"),
            ("confiance mutuelle", "/kɔ̃.fjɑ̃s my.tɥɛl/", "sự tin cậy lẫn nhau", "La confiance mutuelle est le ciment de notre alliance. [Sự tin cậy lẫn nhau là chất keo gắn kết liên minh của chúng ta.]", "phrase", "B2"),
            ("immunité diplomatique", "/i.my.ni.te di.plɔ.ma.tik/", "quyền miễn trừ ngoại giao", "L'immunité diplomatique est garantie par les conventions. [Quyền miễn trừ ngoại giao được bảo đảm bởi các công ước.]", "phrase", "C1"),
            ("résolution pacifique", "/ʁe.zɔ.ly.sjɔ̃ pa.si.fik/", "giải quyết hòa bình", "Ils recherchent une résolution pacifique de la crise. [Họ tìm kiếm một giải pháp hòa bình cho cuộc khủng hoảng.]", "phrase", "B2"),
        ]
    }
}
