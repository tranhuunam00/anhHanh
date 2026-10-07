"""AI Writing Coach & Evaluation Service using Google Gemini 2.5 Flash.
Provides comprehensive essay grading (IELTS Band 0-9), inline error corrections,
model rewrites, and C1/C2 vocabulary upgrades.
"""
import os
import re
import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from dotenv import load_dotenv

load_dotenv(override=True)
logger = logging.getLogger(__name__)

def get_gemini_api_key() -> str:
    """Dynamically get GEMINI_API_KEY from environment or .env, reloading on demand."""
    load_dotenv(override=True)
    return (os.getenv("GEMINI_API_KEY", "") or "").strip()


CURATED_PROMPTS_BY_LANG: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    "en": {
        "ielts_task2": [
            {
                "id": "t2_en_1",
                "title": "Artificial Intelligence in Education",
                "prompt": "Some people believe that artificial intelligence will soon replace teachers in the classroom, while others think that human educators will always remain essential. Discuss both views and give your own opinion.",
                "type": "Discussion & Opinion",
                "sub_type": "discussion",
                "keywords": ["automated tutoring", "pedagogical empathy", "personalized learning", "digital literacy", "irreplaceable guidance"],
                "min_words": 250,
                "recommended_time": 40
            },
            {
                "id": "t2_en_2",
                "title": "Environmental Protection vs Economic Growth",
                "prompt": "Many developing countries argue that economic development should take priority over environmental conservation. To what extent do you agree or disagree with this viewpoint?",
                "type": "Agree / Disagree",
                "sub_type": "opinion",
                "keywords": ["sustainable development", "ecological degradation", "industrial expansion", "carbon footprint", "renewable transition"],
                "min_words": 250,
                "recommended_time": 40
            },
            {
                "id": "t2_en_3",
                "title": "Remote Working and Social Isolation",
                "prompt": "An increasing number of employees now work remotely from home rather than in traditional offices. Do the advantages of this trend outweigh the disadvantages?",
                "type": "Advantages & Disadvantages",
                "sub_type": "advantages_disadvantages",
                "keywords": ["work-life balance", "geographical flexibility", "telecommuting", "social disconnect", "productivity metrics"],
                "min_words": 250,
                "recommended_time": 40
            },
            {
                "id": "t2_en_4",
                "title": "Youth Mental Health and Social Media",
                "prompt": "In recent years, anxiety and depression rates among young people have surged drastically. Many attribute this phenomenon to pervasive social media usage. What are the primary causes of this issue, and what feasible solutions can be implemented?",
                "type": "Causes & Solutions",
                "sub_type": "causes_solutions",
                "keywords": ["digital addiction", "cyberbullying", "peer validation", "psychological well-being", "screen time regulation"],
                "min_words": 250,
                "recommended_time": 40
            },
            {
                "id": "t2_en_5",
                "title": "Modern Consumerism and True Happiness",
                "prompt": "In contemporary society, individuals are purchasing vastly more consumer goods than ever before. Why is this occurring? Does possessing more material goods make individuals genuinely happier?",
                "type": "Two-part Question",
                "sub_type": "two_part",
                "keywords": ["materialistic pursuits", "conspicuous consumption", "transient gratification", "psychological contentment", "consumer-driven economy"],
                "min_words": 250,
                "recommended_time": 40
            }
        ],
        "ielts_task1": [
            {
                "id": "t1_en_line",
                "title": "Global Electric Vehicle Sales (2015-2025)",
                "prompt": "The line graph compares the sales figures of electric vehicles (in millions) across China, Europe, and the United States between 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\n[Data Summary]: In 2015, all three regions recorded under 0.4 million sales. By 2020, China reached 1.3M, Europe 1.4M, and the US 0.3M. By 2025, China experienced an exponential surge to 6.8M, Europe reached 3.2M, while the US grew moderately to 1.4M.",
                "type": "Biểu đồ đường (Line Graph)",
                "sub_type": "line_graph",
                "keywords": ["exponential surge", "upward trajectory", "outpaced", "moderate expansion", "peaked at"],
                "min_words": 150,
                "recommended_time": 20
            },
            {
                "id": "t1_en_bar",
                "title": "Household Waste Recycling Rates in 4 European Cities",
                "prompt": "The bar chart compares the percentage of municipal household waste recycled across four major cities (Berlin, London, Tokyo, Sydney) across three benchmark years: 2010, 2018, and 2024. Summarise the key trends and draw comparisons.\n\n[Data Summary]: Berlin led throughout, rising from 48% (2010) to 65% (2024). Tokyo followed steadily from 38% to 54%. London progressed from 25% to 44%, while Sydney exhibited the slowest growth, moving from 20% to 28%.",
                "type": "Biểu đồ cột (Bar Chart)",
                "sub_type": "bar_chart",
                "keywords": ["predominant recycling rate", "consistent upward climb", "lagged behind", "significant disparity"],
                "min_words": 150,
                "recommended_time": 20
            },
            {
                "id": "t1_en_pie",
                "title": "Electricity Generation by Energy Source in Australia",
                "prompt": "The pie charts illustrate the proportion of electricity generated from various energy sources in Australia in 2000 and 2020. Summarise the main features and note major shifts.\n\n[Data Summary]: In 2000, Coal dominated with 75%, Gas accounted for 12%, Hydro 8%, and Solar/Wind only 5%. By 2020, Coal contracted sharply to 52%, Solar/Wind expanded dramatically to 24%, Gas increased slightly to 16%, and Hydro remained stable at 8%.",
                "type": "Biểu đồ tròn (Pie Chart)",
                "sub_type": "pie_chart",
                "keywords": ["commanded a majority", "drastic expansion", "sharp contraction", "marginal fluctuation"],
                "min_words": 150,
                "recommended_time": 20
            },
            {
                "id": "t1_en_table",
                "title": "Transit Network Commuter Volumes and Satisfaction",
                "prompt": "The table compares daily passenger volumes (millions) and commuter satisfaction ratings across five capital metropolitan transit systems in 2023. Summarise the key metrics and comparisons.\n\n[Data Summary]: Tokyo: 8.5M riders/day, 94% satisfaction; Paris: 4.8M riders, 82% satisfaction; New York: 4.1M riders, 68% satisfaction; London: 3.7M riders, 86% satisfaction; Singapore: 3.2M riders, 96% satisfaction.",
                "type": "Bảng số liệu (Table)",
                "sub_type": "table",
                "keywords": ["highest ridership", "satisfaction index", "discrepancy", "surpassed", "lowest approval"],
                "min_words": 150,
                "recommended_time": 20
            },
            {
                "id": "t1_en_process",
                "title": "Industrial Paper Recycling Process",
                "prompt": "The diagram illustrates the 6 sequential stages involved in converting discarded waste paper into recycled commercial printer paper. Summarise the key operations and transition steps.\n\n[Process Stages]: 1. Collection & sorting of discarded paper -> 2. Pulverising in a high-capacity water tank to generate raw pulp -> 3. Chemical de-inking and filtering out ink particles -> 4. Eco-friendly hydrogen peroxide bleaching -> 5. Compression through heated heavy rollers to squeeze out water -> 6. Continuous drying, winding into giant reels, and precision slicing into reams.",
                "type": "Quy trình (Process)",
                "sub_type": "process",
                "keywords": ["sequential operations", "initial collection", "de-inking phase", "compressed through rollers", "final packaging"],
                "min_words": 150,
                "recommended_time": 20
            },
            {
                "id": "t1_en_map",
                "title": "Redevelopment of Portside Town Center (2010 vs Present)",
                "prompt": "The two maps illustrate the extensive infrastructural modifications that transformed the town center of Portside between 2010 and the present day. Summarise the structural changes and spatial developments.\n\n[Key Developments]: On the north riverbank, a derelict industrial warehouse and dock were demolished and replaced with a modern riverside park and pedestrian promenade. The western vehicular road was converted into a car-free pedestrian shopping boulevard. The old eastern train station was expanded into a multimodal transit hub with an underground metro link.",
                "type": "Bản đồ / Quy hoạch (Map)",
                "sub_type": "map",
                "keywords": ["demolished to make way for", "transformed into", "converted into pedestrianized zone", "infrastructural overhaul"],
                "min_words": 150,
                "recommended_time": 20
            }
        ],
        "email": [
            {
                "id": "em_en_1",
                "title": "Professional Project Delay Notification",
                "prompt": "Write a formal business email to a corporate client explaining that due to unexpected technical roadblocks, the delivery of the web application milestone will be delayed by one week. Offer a sincere apology, detail mitigation measures, and provide an updated delivery schedule.",
                "type": "Business Email",
                "sub_type": "formal_notification",
                "keywords": ["unforeseen impediments", "mitigation measures", "revised schedule", "sincere apologies", "quality assurance"],
                "min_words": 120,
                "recommended_time": 15
            }
        ],
        "paragraph": [
            {
                "id": "pa_en_1",
                "title": "Why Reading Books Daily Improves Mental Agility",
                "prompt": "Write a concise persuasive paragraph (100 - 150 words) arguing why establishing a daily reading habit enhances cognitive sharpness, analytical agility, and emotional empathy.",
                "type": "Short Paragraph",
                "sub_type": "persuasive",
                "keywords": ["cognitive stimulation", "analytical acuity", "neuroplasticity", "empathetic perspective"],
                "min_words": 80,
                "recommended_time": 10
            }
        ],
        "free": [
            {
                "id": "fr_en_1",
                "title": "Free Topic / Creative Choice",
                "prompt": "Write freely about any topic, reflection, story, opinion, or journal entry that interests you today. AI will review grammar, lexical richness, and fluency regardless of length.",
                "type": "Free Writing",
                "sub_type": "open",
                "keywords": ["spontaneous expression", "fluent narrative", "voice and tone"],
                "min_words": 50,
                "recommended_time": 20
            }
        ]
    },
    "ja": {
        "ielts_task2": [
            {
                "id": "t2_ja_1",
                "title": "教育現場におけるAIの導入と教師の役割",
                "prompt": "人工知能（AI）の急速な発展に伴い、将来的に学校の教師はAIに取って代わられると主張する人がいます。一方で、人間の教師ならではの役割は不可欠であるという意見もあります。双方の立場を踏まえた上で、あなたの考えを理由とともに述べてください。（400〜600字）",
                "type": "小論文 / 意見論述",
                "sub_type": "discussion",
                "keywords": ["個別最適化学習", "共感能力", "人間的指導", "デジタル変革", "道徳教育"],
                "min_words": 200,
                "recommended_time": 40
            },
            {
                "id": "t2_ja_2",
                "title": "経済成長と地球環境保全の優先順位",
                "prompt": "新興国においては環境保護よりも経済成長を最優先すべきだという主張があります。あなたはこの意見に賛成ですか、反対ですか。具体的な根拠を挙げて論述してください。",
                "type": "賛否論述 (Agree/Disagree)",
                "sub_type": "opinion",
                "keywords": ["持続可能な開発", "環境負荷", "産業振興", "再生可能エネルギー", "地球温暖化対策"],
                "min_words": 200,
                "recommended_time": 40
            },
            {
                "id": "t2_ja_3",
                "title": "若者のSNS利用とメンタルヘルス",
                "prompt": "近年、若者の間でSNSの過剰利用による孤独感や不安感が問題視されています。この問題の主な原因は何ですか。また、どのような対策が有効だと考えられますか。（原因と対策）",
                "type": "原因・対策論述",
                "sub_type": "causes_solutions",
                "keywords": ["承認欲求", "サイバーいじめ", "デジタルデトックス", "対人関係の希薄化", "情報リテラシー"],
                "min_words": 200,
                "recommended_time": 40
            }
        ],
        "ielts_task1": [
            {
                "id": "t1_ja_line",
                "title": "日本における再生可能エネルギー発電割合の推移 (2010-2024)",
                "prompt": "提示された折れ線グラフは、2010年から2024年にかけての日本国内における総発電量に占める再生可能エネルギー（太陽光・風力・水力）の割合の推移を示しています。主要な特徴と数値の変化を整理し、客観的に要約して説明してください。（200〜300字）\n\n【データ要約】: 2010年は全体で約9.5%にとどまっていたが、FIT法導入を契機に太陽光が急伸し、2020年には19.8%、2024年には24.2%に達した。水力は年8%前後でほぼ横ばいを維持している。",
                "type": "図表説明 (Line Graph)",
                "sub_type": "line_graph",
                "keywords": ["急激な上昇傾向", "横ばいで推移", "倍増", "主要な要因", "顕著な変化"],
                "min_words": 150,
                "recommended_time": 20
            },
            {
                "id": "t1_ja_proc",
                "title": "ペットボトルのリサイクル工程",
                "prompt": "提示されたフローチャートは、回収された使用済みペットボトルが再生ポリエステル繊維として再利用されるまでの6段階の工程を示しています。各工程の手順と変化を順を追って説明してください。\n\n【工程概要】: 1. 分別回収と圧縮 -> 2. 粉砕によるフレーク化 -> 3. 高温アルカリ洗浄と異物除去 -> 4. 溶融・ペレット成形 -> 5. 紡糸による繊維化 -> 6. 衣類・バッグへの製品化。",
                "type": "工程説明 (Process)",
                "sub_type": "process",
                "keywords": ["粉砕工程", "不純物の除去", "再ペレット化", "段階を経て", "最終製品への加工"],
                "min_words": 150,
                "recommended_time": 20
            }
        ],
        "email": [
            {
                "id": "em_ja_1",
                "title": "システム開発納期延期に関するお詫びとご報告",
                "prompt": "取引先の担当者に対し、技術的課題の発生によりWebアプリケーションの納品が当初予定より1週間遅延することをお詫びし、対策と新たな納品日程を伝えるビジネスメールを作成してください。（適切なビジネス敬語を使用）",
                "type": "ビジネスメール",
                "sub_type": "formal_notification",
                "keywords": ["平素より大変お世話になっております", "誠に遺憾ながら", "善後策を講じ", "何卒ご容赦", "ご査収のほど"],
                "min_words": 100,
                "recommended_time": 15
            }
        ],
        "paragraph": [
            {
                "id": "pa_ja_1",
                "title": "毎日の読書がもたらす知的効果",
                "prompt": "毎日の読書習慣がいかに論理的思考力と他者への共感力を高めるかについて、簡潔で説得力のある段落（150〜200字）を書いてください。",
                "type": "短文記述",
                "sub_type": "persuasive",
                "keywords": ["論理的思考力", "知見の深化", "語彙力の向上", "共感性"],
                "min_words": 80,
                "recommended_time": 10
            }
        ],
        "free": [
            {
                "id": "fr_ja_1",
                "title": "自由テーマ記述",
                "prompt": "今日感じたこと、関心のあるニュース、自己紹介など、自由に日本語で文章を書いてください。AIが文法や自然な言い回しを添削します。",
                "type": "自由作文",
                "sub_type": "open",
                "keywords": ["日常の省察", "自然な表現", "丁寧語"],
                "min_words": 50,
                "recommended_time": 20
            }
        ]
    },
    "zh": {
        "ielts_task2": [
            {
                "id": "t2_zh_1",
                "title": "人工智能时代下教师的角色与挑战",
                "prompt": "有人认为，随着人工智能（AI）技术的迅猛发展，教师终将被智能教学系统所取代；而另一些人认为，人类教师的情感关怀与言传身教不可替代。请讨论这两种观点并阐述你自己的看法。（400-600字）",
                "type": "议论文 (Discuss Both Views)",
                "sub_type": "discussion",
                "keywords": ["个性化教学", "情感共鸣", "言传身教", "技术迭代", "不可替代性"],
                "min_words": 200,
                "recommended_time": 40
            },
            {
                "id": "t2_zh_2",
                "title": "经济快速发展与生态环境保护的权衡",
                "prompt": "有人主张在发展中国家经济增长必须优先于环境保护。你在多大程度上同意或反对这一观点？请结合实际案例说明你的理由。",
                "type": "立论辩证 (Agree/Disagree)",
                "sub_type": "opinion",
                "keywords": ["可持续发展", "生态红线", "粗放型增长", "绿色低碳转型", "绿水青山"],
                "min_words": 200,
                "recommended_time": 40
            },
            {
                "id": "t2_zh_3",
                "title": "青少年社交媒体依赖与心理健康问题",
                "prompt": "近年来许多青少年因沉迷社交媒体而出现焦虑与抑郁倾向。导致这一问题的主要根源是什么？学校和家庭应当采取哪些具体对策加以应对？",
                "type": "成因与对策分析",
                "sub_type": "causes_solutions",
                "keywords": ["数字成瘾", "虚拟同伴压力", "心理疏导", "屏幕时间管控", "防沉迷机制"],
                "min_words": 200,
                "recommended_time": 40
            }
        ],
        "ielts_task1": [
            {
                "id": "t1_zh_bar",
                "title": "四大城市垃圾分类回收率对比分析 (2015-2024)",
                "prompt": "所给柱状图展示了2015年至2024年间上海、北京、东京与柏林四个城市的居民生活垃圾分类回收率。请概括图表反映的核心趋势并进行必要对比。（200-300字）\n\n【数据概括】: 柏林长期保持领先，由52%升至66%；上海在实施强制分类后增长最快，从18%跃升至58%；北京稳步上升至45%；东京由40%上升至52%。",
                "type": "图表说明 (Bar Chart)",
                "sub_type": "bar_chart",
                "keywords": ["显著跃升", "稳步攀升", "位列榜首", "差距明显缩小"],
                "min_words": 150,
                "recommended_time": 20
            },
            {
                "id": "t1_zh_proc",
                "title": "废弃塑料瓶再生制造纺织纤维工艺流程",
                "prompt": "请根据流程图描述废旧塑料瓶转化为涤纶再生纺织面料的全过程。梳理各阶段衔接并进行清晰汇报。\n\n【流程步骤】: 1. 回收分拣与打包 -> 2. 机械粉碎成碎片 -> 3. 高温脱标与强力清洗 -> 4. 熔融造粒 -> 5. 熔体纺丝抽丝 -> 6. 织造成环保面料。",
                "type": "流程图分析 (Process)",
                "sub_type": "process",
                "keywords": ["分拣阶段", "高温融化", "抽丝工艺", "循环利用", "最终成品"],
                "min_words": 150,
                "recommended_time": 20
            }
        ],
        "email": [
            {
                "id": "em_zh_1",
                "title": "关于软件项目延期交付的致歉与说明函",
                "prompt": "给合作方项目主管撰写一封正式商务电子邮件，说明由于关键技术模块攻关导致软件第一阶段交付延期一周，表达诚挚歉意并附上最新排期与补救措施。",
                "type": "商务邮件",
                "sub_type": "formal_notification",
                "keywords": ["顺祝商祺", "深表歉意", "全力抢抓进度", "最新推进计划", "望予谅解"],
                "min_words": 100,
                "recommended_time": 15
            }
        ],
        "paragraph": [
            {
                "id": "pa_zh_1",
                "title": "阅读对思维敏捷度的深远影响",
                "prompt": "写一段精炼而有力的论证段落（150字左右），阐述坚持日常深度阅读为何能显著提升人的思辨能力与情绪共情力。",
                "type": "短文说理",
                "sub_type": "persuasive",
                "keywords": ["厚积薄发", "思辨深度", "认知升级", "共情理解"],
                "min_words": 80,
                "recommended_time": 10
            }
        ],
        "free": [
            {
                "id": "fr_zh_1",
                "title": "自由表达写作",
                "prompt": "请用中文写下任何你感兴趣的话题、个人日记或生活感悟。AI将从用词精准度、句式多样性及文采方面为你提供全面修改建议。",
                "type": "自由写作",
                "sub_type": "open",
                "keywords": ["自由表达", "文笔流畅", "语句优美"],
                "min_words": 50,
                "recommended_time": 20
            }
        ]
    },
    "ko": {
        "ielts_task2": [
            {
                "id": "t2_ko_1",
                "title": "인공지능의 발전과 학교 교육의 미래",
                "prompt": "인공지능(AI)이 발전함에 따라 학교에서 교사의 역할이 AI로 대체될 것이라는 의견과, 인간 교사 고유의 역할은 여전히 필수적이라는 의견이 있습니다. 두 입장을 모두 논의하고 자신의 견해를 밝히십시오. (TOPIK 54번 유형, 600~700자)",
                "type": "TOPIK II 54번 논설문",
                "sub_type": "discussion",
                "keywords": ["맞춤형 학습", "정서적 교감", "인성 교육", "교육 혁신", "대체 불가능성"],
                "min_words": 200,
                "recommended_time": 40
            },
            {
                "id": "t2_ko_2",
                "title": "청소년 SNS 중독의 원인과 해결 방안",
                "prompt": "최근 청소년들의 과도한 SNS 이용으로 인한 심리적 불안과 우울감이 심각한 사회 문제로 대두되고 있습니다. 이러한 현상이 나타나는 원인은 무엇이며, 이를 해결하기 위한 방안은 무엇인지 서술하십시오.",
                "type": "원인과 해결 방안",
                "sub_type": "causes_solutions",
                "keywords": ["디지털 중독", "상대적 박탈감", "정서적 안정", "이용 시간 제한", "미디어 리터러시"],
                "min_words": 200,
                "recommended_time": 40
            }
        ],
        "ielts_task1": [
            {
                "id": "t1_ko_line",
                "title": "한국 1인 가구 비율 변화 추이 (2010-2024)",
                "prompt": "제시된 그래프는 2010년부터 2024년까지의 한국 전체 가구 대비 1인 가구 비율의 변화를 나타낸 것입니다. 주요 특징과 변화 추이를 객관적으로 설명하십시오. (TOPIK 53번 유형, 200~300자)\n\n[자료 요약]: 2010년 23.9%에서 2015년 27.2%, 2020년 31.7%, 2024년 35.5%로 지속적인 상승세를 기록함.",
                "type": "TOPIK II 53번 도표 설명",
                "sub_type": "line_graph",
                "keywords": ["지속적인 증가세", "급격한 상승", "비중을 차지하다", "원인으로 분석된다"],
                "min_words": 150,
                "recommended_time": 20
            },
            {
                "id": "t1_ko_proc",
                "title": "폐플라스틱 재활용 처리 과정",
                "prompt": "수거된 폐플라스틱이 친환경 제품으로 재탄생하는 6단계 공정을 순서에 맞추어 설명하십시오. (200~300자)",
                "type": "과정 설명 (Process)",
                "sub_type": "process",
                "keywords": ["선별 수거", "세척 및 분쇄", "펠릿 가공", "제품 생산"],
                "min_words": 150,
                "recommended_time": 20
            }
        ],
        "email": [
            {
                "id": "em_ko_1",
                "title": "프로젝트 납기 지연 안내 및 사과문",
                "prompt": "거래처 담당자에게 예기치 못한 기술 문제로 인해 웹 서비스 1차 납품이 일주일 지연됨을 알리고 정중히 사과하는 비즈니스 이메일을 작성하십시오.",
                "type": "비즈니스 이메일",
                "sub_type": "formal_notification",
                "keywords": ["안녕하십니까", "송구스럽게 생각합니다", "재발 방지", "양해 부탁드립니다"],
                "min_words": 100,
                "recommended_time": 15
            }
        ],
        "paragraph": [
            {
                "id": "pa_ko_1",
                "title": "독서가 사고력에 미치는 긍정적 영향",
                "prompt": "매일 꾸준히 책을 읽는 습관이 비판적 사고력과 문제 해결 능력을 키우는 이유를 논리적으로 서술하십시오. (150자 내외)",
                "type": "단락 쓰기",
                "sub_type": "persuasive",
                "keywords": ["사고의 확장", "비판적 시각", "자기 성찰"],
                "min_words": 80,
                "recommended_time": 10
            }
        ],
        "free": [
            {
                "id": "fr_ko_1",
                "title": "자유 작문",
                "prompt": "오늘의 일기나 관심 있는 주제에 대해 한국어로 자유롭게 작성해 보세요. AI가 문법과 자연스러운 표현을 지도해 드립니다.",
                "type": "자유 작문",
                "sub_type": "open",
                "keywords": ["자유로운 서술", "자연스러운 문장"],
                "min_words": 50,
                "recommended_time": 20
            }
        ]
    },
    "fr": {
        "ielts_task2": [
            {
                "id": "t2_fr_1",
                "title": "L'Intelligence Artificielle et l'Avenir de l'Enseignement",
                "prompt": "Certains affirment que l'essor fulgurant de l'intelligence artificielle conduira rapidement au remplacement des enseignants par des tuteurs virtuels. D'autres soutiennent que le rôle humain dans la pédagogie reste irremplaçable. Discutez de ces deux points de vue et exprimez votre opinion personnelle. (DELF B2 / DALF C1, 250 mots minimum)",
                "type": "Essai argumentatif (Discussion)",
                "sub_type": "discussion",
                "keywords": ["tutorat automatisé", "empathie pédagogique", "pédagogie différenciée", "irremplaçable"],
                "min_words": 250,
                "recommended_time": 40
            },
            {
                "id": "t2_fr_2",
                "title": "Croissance Économique vs Préservation Environnementale",
                "prompt": "Dans quelle mesure estimez-vous que la transition écologique doit primer sur la croissance économique immédiate ? Développez une argumentation nuancée et structurée.",
                "type": "Essai argumentatif (Opinion)",
                "sub_type": "opinion",
                "keywords": ["développement durable", "dégradation écologique", "empreinte carbone", "transition énergétique"],
                "min_words": 250,
                "recommended_time": 40
            }
        ],
        "ielts_task1": [
            {
                "id": "t1_fr_line",
                "title": "Évolution de la Consommation d'Énergie Renouvelable (2000-2024)",
                "prompt": "Le graphique illustre l'évolution du pourcentage d'énergie produite à partir de sources renouvelables dans quatre pays européens entre 2000 et 2024. Résumez les tendances marquantes et établissez des comparaisons significatives. (150 mots)",
                "type": "Analyse de Graphique",
                "sub_type": "line_graph",
                "keywords": ["hausse exponentielle", "stagnation", "dépasser", "progression constante"],
                "min_words": 150,
                "recommended_time": 20
            },
            {
                "id": "t1_fr_proc",
                "title": "Le Processus Industriel de Recyclage du Papier",
                "prompt": "Décrivez de manière chronologique et méthodique les 6 étapes clés de la transformation du papier usagé en papier réutilisable à partir du schéma fourni.",
                "type": "Description de Processus",
                "sub_type": "process",
                "keywords": ["étapes successives", "désencrage", "broyage en pâte", "séchage au rouleau"],
                "min_words": 150,
                "recommended_time": 20
            }
        ],
        "email": [
            {
                "id": "em_fr_1",
                "title": "Notification de Report d'Échéance de Projet",
                "prompt": "Rédigez un courriel formel à un client pour l'informer d'un retard d'une semaine dans la livraison d'un projet web en raison de défis techniques imprévus. Présentez vos excuses et proposez un calendrier réajusté.",
                "type": "Courriel professionnel",
                "sub_type": "formal_notification",
                "keywords": ["veuillez agréer", "impondérables techniques", "calendrier révisé", "sincères excuses"],
                "min_words": 120,
                "recommended_time": 15
            }
        ],
        "paragraph": [
            {
                "id": "pa_fr_1",
                "title": "Les Bienfaits Cognitifs de la Lecture Quotidienne",
                "prompt": "Rédigez un paragraphe persuasif de 100 à 150 mots démontrant comment une habitude de lecture quotidienne stimule la vivacité intellectuelle et l'esprit critique.",
                "type": "Paragraphe argumentatif",
                "sub_type": "persuasive",
                "keywords": ["acuité intellectuelle", "pensée critique", "empathie cognitive"],
                "min_words": 80,
                "recommended_time": 10
            }
        ],
        "free": [
            {
                "id": "fr_fr_1",
                "title": "Expression Libre",
                "prompt": "Écrivez librement en français sur le sujet de votre choix. L'IA corrigera la grammaire, la précision lexicale et l'élégance du style.",
                "type": "Écriture libre",
                "sub_type": "open",
                "keywords": ["expression spontanée", "richesse lexicale"],
                "min_words": 50,
                "recommended_time": 20
            }
        ]
    },
    "de": {
        "ielts_task2": [
            {
                "id": "t2_de_1",
                "title": "Künstliche Intelligenz im Bildungswesen",
                "prompt": "Einige Menschen glauben, dass künstliche Intelligenz in naher Zukunft menschliche Lehrkräfte an Schulen vollständig ersetzen wird. Andere halten die menschliche Pädagogik für unersetzbar. Erörtern Sie beide Positionen und nehmen Sie begründet Stellung. (TestDaF / Goethe C1, mind. 250 Wörter)",
                "type": "Argumentativer Aufsatz",
                "sub_type": "discussion",
                "keywords": ["individuelle Förderung", "pädagogische Empathie", "Digitalisierung", "unersetzbare Rolle"],
                "min_words": 250,
                "recommended_time": 40
            },
            {
                "id": "t2_de_2",
                "title": "Wirtschaftswachstum versus Umweltschutz",
                "prompt": "Inwieweit stimmen Sie der These zu, dass nachhaltiger Klimaschutz gegenüber kurzfristigem Wirtschaftswachstum vorrangig behandelt werden muss? Begründen Sie Ihren Standpunkt.",
                "type": "Stellungnahme (Agree/Disagree)",
                "sub_type": "opinion",
                "keywords": ["nachhaltige Entwicklung", "ökologische Verantwortung", "Energiewende", "CO2-Neutralität"],
                "min_words": 250,
                "recommended_time": 40
            }
        ],
        "ielts_task1": [
            {
                "id": "t1_de_bar",
                "title": "Haushaltsmüll-Recyclingquoten in europäischen Großstädten",
                "prompt": "Das Balkendiagramm vergleicht die Recyclingquoten von Haushaltsabfällen in vier europäischen Metropolen (Berlin, London, Tokio, Sydney) in den Jahren 2010, 2018 und 2024. Beschreiben und vergleichen Sie die wesentlichen Merkmale. (150 Wörter)",
                "type": "Grafikbeschreibung (Bar Chart)",
                "sub_type": "bar_chart",
                "keywords": ["kontinuierlicher Anstieg", "an der Spitze liegen", "deutlicher Unterschied"],
                "min_words": 150,
                "recommended_time": 20
            },
            {
                "id": "t1_de_proc",
                "title": "Der Prozess des industriellen Altpapierrecyclings",
                "prompt": "Beschreiben Sie anhand des Schaubilds die sechs chronologischen Phasen der Aufbereitung von Altpapier zu neuem Druckpapier.",
                "type": "Prozessbeschreibung (Process)",
                "sub_type": "process",
                "keywords": ["aufeinanderfolgende Phasen", "Entfärbungsprozess", "Walzentrocknung", "Endprodukt"],
                "min_words": 150,
                "recommended_time": 20
            }
        ],
        "email": [
            {
                "id": "em_de_1",
                "title": "Benachrichtigung über Projektverzögerung",
                "prompt": "Verfassen Sie eine formelle geschäftliche E-Mail an einen Kunden, in der Sie eine einwöchige Verzögerung bei der Fertigstellung eines Softwaremoduls mitteilen, die Gründe erklären und einen neuen Zeitplan vorschlagen.",
                "type": "Geschäftliche E-Mail",
                "sub_type": "formal_notification",
                "keywords": ["sehr geehrte Damen und Herren", "unvorhergesehene Verzögerung", "neuer Zeitplan", "wir bitten um Verständnis"],
                "min_words": 120,
                "recommended_time": 15
            }
        ],
        "paragraph": [
            {
                "id": "pa_de_1",
                "title": "Die geistigen Vorteile des täglichen Lesens",
                "prompt": "Schreiben Sie einen prägnanten argumentativen Absatz (100-150 Wörter) darüber, wie regelmäßiges Lesen das kritische Denkvermögen und die Empathie schärft.",
                "type": "Kurzer Absatz",
                "sub_type": "persuasive",
                "keywords": ["kritisches Denken", "geistige Beweglichkeit", "kognitive Fähigkeiten"],
                "min_words": 80,
                "recommended_time": 10
            }
        ],
        "free": [
            {
                "id": "fr_de_1",
                "title": "Freies Schreiben",
                "prompt": "Schreiben Sie frei auf Deutsch zu einem Thema Ihrer Wahl. Die KI analysiert Grammatik, Wortschatz und Ausdruckskraft.",
                "type": "Freies Schreiben",
                "sub_type": "open",
                "keywords": ["freier Ausdruck", "stilistische Vielfalt"],
                "min_words": 50,
                "recommended_time": 20
            }
        ]
    }
}

CURATED_PROMPTS = CURATED_PROMPTS_BY_LANG["en"]


LANGUAGES_CONFIG = {
    "en": {"name": "Tiếng Anh", "native": "English", "system": "IELTS Band 0-9 / CEFR", "examiner": "Giám khảo Khảo thí IELTS Quốc tế kỳ cựu và Chuyên gia Ngôn ngữ học Tiếng Anh cấp cao (Senior IELTS Examiner & Academic Writing Coach)"},
    "ja": {"name": "Tiếng Nhật", "native": "日本語", "system": "JLPT N1-N5 & Tiểu luận Nhật ngữ (小論文 / 作文)", "examiner": "Giám khảo Năng lực Nhật ngữ JLPT cấp cao và Chuyên gia Viết luận Văn phong Nhật Bản (Japanese Academic Writing Coach)"},
    "zh": {"name": "Tiếng Trung", "native": "中文", "system": "HSK 1-6 & Viết luận Hán ngữ (写作)", "examiner": "Giám khảo Khảo thí Hán ngữ Quốc tế HSK cấp cao và Chuyên gia Văn phong Tiếng Trung (Chinese Academic Writing Coach)"},
    "ko": {"name": "Tiếng Hàn", "native": "한국어", "system": "TOPIK I-II & Viết luận Tiếng Hàn (쓰기)", "examiner": "Giám khảo Năng lực Tiếng Hàn TOPIK cấp cao và Chuyên gia Luyện viết Luận Hàn ngữ (Korean Writing Coach)"},
    "fr": {"name": "Tiếng Pháp", "native": "Français", "system": "DELF/DALF / CEFR A1-C2", "examiner": "Giám khảo Khảo thí Tiếng Pháp DELF/DALF và Chuyên gia Ngôn ngữ Pháp (French Writing Coach)"},
    "de": {"name": "Tiếng Đức", "native": "Deutsch", "system": "Goethe-Zertifikat / TestDaF", "examiner": "Giám khảo Khảo thí Tiếng Đức Goethe/TestDaF và Chuyên gia Văn phong Học thuật Đức (German Writing Coach)"},
}


class AIWritingService:
    @classmethod
    def get_prompts_library(cls, language: Optional[str] = None) -> Any:
        """Return curated prompts library, either by specific language or backward-compatible dictionary with both genres and by-language map."""
        if language and language in CURATED_PROMPTS_BY_LANG:
            return CURATED_PROMPTS_BY_LANG[language]
        res = dict(CURATED_PROMPTS_BY_LANG["en"])
        for lang_code, lang_data in CURATED_PROMPTS_BY_LANG.items():
            res[lang_code] = lang_data
        return res

    @classmethod
    async def generate_prompt(
        cls,
        genre: str,
        topic_area: Optional[str] = None,
        language: str = "en",
        sub_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate a brand new realistic writing prompt in chosen language & sub-type using Gemini."""
        api_key = get_gemini_api_key()
        cfg = LANGUAGES_CONFIG.get(language, LANGUAGES_CONFIG["en"])
        lang_name = cfg["name"]

        if not api_key:
            # Fallback to prompt from library
            lang_dict = CURATED_PROMPTS_BY_LANG.get(language, CURATED_PROMPTS_BY_LANG["en"])
            prompts = lang_dict.get(genre, lang_dict.get("ielts_task2", []))
            if sub_type and sub_type != "all":
                matched = [p for p in prompts if p.get("sub_type") == sub_type]
                if matched:
                    prompts = matched
            import random
            return random.choice(prompts)

        area_hint = f"về lĩnh vực: {topic_area}" if topic_area else "về một chủ đề mang tính thời sự hoặc khoa học xã hội phổ biến"

        # Specialized instructions depending on genre and sub-type
        sub_type_rule = ""
        min_words = 250
        rec_time = 40

        if genre == "ielts_task1":
            min_words = 150
            rec_time = 20
            if sub_type == "process":
                sub_type_rule = """
YÊU CẦU ĐẶC BIỆT DẠNG QUY TRÌNH (PROCESS / FLOWCHART):
- Đề bài BẮT BUỘC mô tả một quy trình sản xuất công nghiệp, tái chế hoặc chu trình sinh học.
- Trong nội dung 'prompt', BẮT BUỘC liệt kê rõ ràng 5 đến 7 bước/giai đoạn kế tiếp nhau (được đánh số 1. -> 2. -> 3. -> ...) từ nguyên liệu đầu vào cho đến thành phẩm cuối cùng để người học có dữ liệu thực tế viết bài báo cáo 150 từ!
"""
            elif sub_type == "map":
                sub_type_rule = """
YÊU CẦU ĐẶC BIỆT DẠNG BẢN ĐỒ / QUY HOẠCH (MAP COMPARISON):
- Đề bài BẮT BUỘC mô tả sự thay đổi và tái quy hoạch của một khu vực (thị trấn, khuôn viên trường học, bệnh viện, khu công nghiệp) giữa 2 mốc thời gian (ví dụ: năm 2010 và hiện tại).
- Trong 'prompt', BẮT BUỘC mô tả cụ thể 4-6 thay đổi về cơ sở hạ tầng (công trình nào bị phá dỡ, công trình nào mới xây dựng, mở rộng đường sá, khu đi bộ) để người học có dữ liệu so sánh!
"""
            elif sub_type in ["line_graph", "bar_chart", "pie_chart", "table", "mixed"]:
                sub_type_rule = f"""
YÊU CẦU ĐẶC BIỆT DẠNG BIỂU ĐỒ SỐ LIỆU ({sub_type}):
- Trong phần nội dung 'prompt', BẮT BUỘC có mục '[Data Summary]' liệt kê cụ thể các số liệu nổi bật (mốc năm, số lượng hoặc tỷ lệ % cụ thể của 3-4 quốc gia/đối tượng so sánh) để người học có thể phân tích xu hướng tăng/giảm và so sánh dữ liệu thực tế!
"""
            else:
                sub_type_rule = """
YÊU CẦU DẠNG BÁO CÁO DỮ LIỆU / QUY TRÌNH TASK 1:
- Cung cấp bối cảnh rõ ràng và kèm theo tóm tắt dữ liệu/các bước cụ thể trong 'prompt' để người viết có đủ căn cứ số liệu phân tích.
"""
        elif genre == "ielts_task2":
            min_words = 250
            rec_time = 40
            if sub_type == "opinion":
                sub_type_rule = "YÊU CẦU ĐẶC BIỆT: Đề bài dạng 'Agree or Disagree' (Quan điểm cá nhân). Câu hỏi kết thúc bằng câu hỏi mức độ đồng ý/phản đối."
            elif sub_type == "discussion":
                sub_type_rule = "YÊU CẦU ĐẶC BIỆT: Đề bài dạng 'Discuss both views and give your opinion' (Bàn luận 2 quan điểm trái chiều và đưa ra ý kiến bản thân)."
            elif sub_type == "causes_solutions":
                sub_type_rule = "YÊU CẦU ĐẶC BIỆT: Đề bài dạng 'Causes and Solutions' (Nguyên nhân của một thực trạng nhức nhối và đề xuất giải pháp khả thi)."
            elif sub_type == "advantages_disadvantages":
                sub_type_rule = "YÊU CẦU ĐẶC BIỆT: Đề bài dạng 'Advantages vs Disadvantages' (Liệu lợi ích có vượt trội hơn những tác hại hay không?)."
            elif sub_type == "two_part":
                sub_type_rule = "YÊU CẦU ĐẶC BIỆT: Đề bài dạng 'Two-part Question' (Đặt ra 2 câu hỏi trực tiếp liên quan đến một hiện tượng xã hội)."

        prompt_instruction = f"""Bạn là một chuyên gia khảo thí ngôn ngữ và giảng viên luyện viết học thuật hàng đầu ({cfg['examiner']}).
Hãy tạo MỘT đề bài luyện viết hoàn chỉnh {area_hint}.
Thể loại yêu cầu: {genre}
Dạng đề chi tiết yêu cầu: {sub_type or 'tự chọn phù hợp'}
Ngôn ngữ của đề bài: BẮT BUỘC VIẾT TOÀN BỘ BẰNG {lang_name} ({cfg['native']})!

{sub_type_rule}

QUY TẮC BẮT BUỘC:
- Toàn bộ 'title', 'prompt', 'keywords' PHẢI được viết bằng ngôn ngữ {lang_name} ({cfg['native']}).
- Đề bài phải mang tính thực tế, văn phong khảo thí chuẩn mực theo định dạng chứng chỉ của ngôn ngữ này ({cfg['system']}).

Trả về kết quả DUY NHẤT định dạng JSON:
{{
  "id": "gen_{genre}_{language}_{sub_type or 'custom'}",
  "title": "Tiêu đề ngắn gọn bằng {lang_name}",
  "prompt": "Nội dung đề bài chi tiết bằng {lang_name} (có kèm số liệu hoặc các bước nếu là Task 1)",
  "type": "Tên dạng đề bằng Tiếng Việt hoặc {lang_name}",
  "sub_type": "{sub_type or 'general'}",
  "keywords": ["từ khóa 1", "từ khóa 2", "từ khóa 3", "từ khóa 4", "từ khóa 5"],
  "min_words": {min_words},
  "recommended_time": {rec_time}
}}
"""
        models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
        async with httpx.AsyncClient(timeout=60.0) as client:
            for model_name in models_to_try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt_instruction}]}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.7
                    }
                }
                try:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        raw_text = re.sub(r"^```json\s*", "", raw_text)
                        raw_text = re.sub(r"\s*```$", "", raw_text)
                        parsed = json.loads(raw_text)
                        return parsed
                except Exception as e:
                    logger.warning(f"Generate prompt failed with {model_name}: {e}")
                    continue

        lang_dict = CURATED_PROMPTS_BY_LANG.get(language, CURATED_PROMPTS_BY_LANG["en"])
        prompts = lang_dict.get(genre, lang_dict.get("ielts_task2", []))
        import random
        return random.choice(prompts)


    @classmethod
    async def suggest_structures(
        cls,
        topic: str,
        language: str = "en",
        target_band: float = 7.0,
        genre: str = "ielts_task2"
    ) -> Dict[str, Any]:
        """Generate tailored collocations, argument patterns and structures specifically for this topic."""
        api_key = get_gemini_api_key()
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY chưa được cấu hình trên máy chủ.")

        cfg = LANGUAGES_CONFIG.get(language, LANGUAGES_CONFIG["en"])
        lang_name = cfg["name"]
        examiner = cfg["examiner"]

        prompt_instruction = f"""Bạn là {examiner}.
Nhiệm vụ của bạn là phân tích đề bài luyện viết dưới đây và đề xuất bộ GỢI Ý CỤM TỪ (COLLOCATIONS) & KHUNG CẤU TRÚC CÂU (SENTENCE FRAMES) đắt giá nhất dành cho đề bài này bằng {lang_name}.

ĐỀ BÀI (TOPIC):
\"\"\"{topic}\"\"\"

NGÔN NGỮ BÀI VIẾT: {lang_name} ({language})
THỂ LOẠI: {genre}
MỤC TIÊU BAND: {target_band}

QUY TẮC CỐT LÕI (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):
1. TUYỆT ĐỐI KHÔNG ĐƯỢC VIẾT CẢ CÂU HOÀN CHỈNH ĐÃ VIẾT SẴN HẾT NỘI DUNG / NGUYÊN CÂU DÀI 25-40 TỪ. Người học luyện viết cần tự xây dựng nội dung bài của họ, không phải copy nguyên câu có sẵn.
2. CHỈ CUNG CẤP ĐÚNG 2 LOẠI GỢI Ý SAU ĐÂY:
   - Loại A: "collocation" (Cụm từ đắt giá theo chủ đề): Là cụm 2 - 5 từ kết hợp tự nhiên, học thuật sát sườn với đề bài.
     * VÍ DỤ ĐÚNG (Tiếng Anh): "spark considerable debate", "supplant human educators", "irreplaceable human element", "foster critical thinking", "exacerbate educational inequality", "harness AI capabilities".
     * TUYỆT ĐỐI KHÔNG: "The advent of AI has sparked debate in education." (Sai vì đây là cả câu hoàn chỉnh!)
   - Loại B: "structure" (Khung cấu trúc câu / Sentence frame): Là khung mẫu ngữ pháp học thuật, BẮT BUỘC DÙNG DẤU NGOẶC VUÔNG `[...]` làm chỗ trống để người học tự điền ý của mình vào.
     * VÍ DỤ ĐÚNG (Tiếng Anh):
       - "The advent of [...] has sparked considerable debate regarding [...]."
       - "While proponents envision [...], opponents contend that [...]."
       - "Far from [V-ing / N], [...] is more likely to [...]."
       - "There is an emerging consensus that [...], thereby [...]."
       - "A compelling rationale for [...] lies in the fact that [...]."
     * TUYỆT ĐỐI KHÔNG: Tự điền nội dung đề bài vào trong khung để thành câu hoàn chỉnh!

Hãy đề xuất khoảng 10 đến 14 gợi ý (kết hợp cả "collocation" cụm từ và "structure" khung câu có `[...]`), phân bổ theo các giai đoạn bài viết:
- "intro": Mở bài, đặt vấn đề, câu lập trường
- "body": Nêu luận điểm chính, nguyên nhân, tác động, đào sâu
- "counter": Luận điểm phản biện, nhượng bộ, góc nhìn đa chiều
- "conclusion": Kết bài, khẳng định lại lập trường, tầm nhìn

Mỗi gợi ý gồm các trường:
- "kind": "collocation" (nếu là cụm từ ngắn) HOẶC "structure" (nếu là khung câu chứa dấu `[...]`)
- "category": Một trong: "intro", "body", "counter", "conclusion"
- "band": "band6", "band7", hoặc "band8"
- "phrase": Cụm từ ngắn (nếu kind là "collocation") HOẶC Khung câu có dấu `[...]` (nếu kind là "structure")
- "meaning": Nghĩa tiếng Việt của cụm từ hoặc tác dụng ngữ pháp của khung câu
- "template": Đoạn để chèn vào bài (với collocation là chính cụm từ đó; với structure là khung câu có các placeholder cụ thể như `[vấn đề/chủ đề]`, `[luận điểm 1]`)
- "usage": Lời khuyên ngắn (1 câu tiếng Việt) về cách ứng dụng và điền ý vào bài

TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON:
{{
  "topic": "{topic[:150]}",
  "language": "{language}",
  "suggestions": [
    {{
      "kind": "collocation",
      "category": "intro",
      "band": "band8",
      "phrase": "spark considerable debate",
      "meaning": "châm ngòi cho một làn sóng tranh luận đáng kể",
      "template": "spark considerable debate",
      "usage": "Dùng sau chủ ngữ mô tả sự việc/công nghệ mới gây tranh cãi."
    }},
    {{
      "kind": "structure",
      "category": "counter",
      "band": "band8",
      "phrase": "While proponents envision [...], opponents contend that [...]",
      "meaning": "Trong khi phe ủng hộ kỳ vọng [...], phe phản đối lại cho rằng [...]",
      "template": "While proponents envision [kỳ vọng của phe ủng hộ], opponents contend that [quan điểm phản biện của phe đối lập].",
      "usage": "Dùng để cân bằng 2 luồng quan điểm đối lập trong thân bài."
    }}
  ]
}}
"""
        models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
        last_error = None

        async with httpx.AsyncClient(timeout=120.0) as client:
            for model_name in models_to_try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt_instruction}]}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.4
                    }
                }
                try:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        raw_text = re.sub(r"^```json\s*", "", raw_text)
                        raw_text = re.sub(r"\s*```$", "", raw_text)
                        parsed = json.loads(raw_text)
                        return parsed
                    else:
                        last_error = f"HTTP {resp.status_code}: {resp.text[:200]}"
                except Exception as e:
                    last_error = str(e)
                    continue

        raise RuntimeError(f"Không thể tạo gợi ý cấu trúc AI: {last_error}")

    @classmethod
    async def evaluate_writing(
        cls,
        topic: str,
        content: str,
        genre: str = "ielts_task2",
        target_band: float = 7.0,
        language: str = "en"
    ) -> Dict[str, Any]:
        """Grade and thoroughly evaluate a student's writing submission using Gemini AI."""
        if not content or len(content.strip().split()) < 15:
            raise ValueError("Bài viết quá ngắn (tối thiểu 15 từ) để AI có thể đánh giá và chấm điểm chính xác.")

        api_key = get_gemini_api_key()
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY chưa được cấu hình trên máy chủ.")

        word_count = len(content.strip().split())
        cfg = LANGUAGES_CONFIG.get(language, LANGUAGES_CONFIG["en"])
        lang_name = cfg["name"]
        examiner = cfg["examiner"]
        system_scale = cfg["system"]

        eval_prompt = f"""Bạn là {examiner}.
Nhiệm vụ của bạn là đánh giá, chấm điểm cực kỳ khách quan, tỉ mỉ và đưa ra nhận xét sửa lỗi chi tiết cho bài viết bằng {lang_name} của học viên dưới đây theo thang điểm {system_scale}.

ĐỀ BÀI (PROMPT):
\"\"\"{topic}\"\"\"

NGÔN NGỮ BÀI VIẾT: {lang_name} ({language})
THỂ LOẠI (GENRE): {genre} (ielts_task2, ielts_task1, email, paragraph, hoặc free)
MỤC TIÊU BAND / ĐIỂM: {target_band}
ĐỘ DÀI THỰC TẾ: {word_count} từ/ký tự

BÀI VIẾT CỦA HỌC VIÊN:
\"\"\"
{content}
\"\"\"

YÊU CẦU CHẤM ĐIỂM & ĐÁNH GIÁ:
1. Chấm điểm theo thang điểm chuẩn IELTS 0.0 - 9.0 (làm tròn đến 0.5):
   - overall_score: Điểm tổng kết (ví dụ: 6.5, 7.0, 7.5...).
   - task_response: Điểm và nhận xét mức độ hoàn thành đề bài, luận điểm, dẫn chứng.
   - coherence_cohesion: Điểm và nhận xét mạch lạc, cấu trúc đoạn, từ nối (linking devices).
   - lexical_resource: Điểm và nhận xét vốn từ, collocations, tính tự nhiên, độ đa dạng.
   - grammatical_range_accuracy: Điểm và nhận xét độ đa dạng cấu trúc ngữ pháp và độ chính xác câu.
2. Danh sách sửa lỗi chi tiết (corrections):
   - Tìm ra TẤT CẢ các lỗi ngữ pháp, chính tả, dùng từ vụng về, câu cồng kềnh trong bài.
   - Với mỗi lỗi, chỉ rõ:
     + "original": đoạn văn bản học viên viết
     + "corrected": phương án sửa chuẩn xác, tự nhiên
     + "type": loại lỗi ("grammar", "vocabulary", "spelling", "style", "cohesion")
     + "explanation": giải thích chi tiết bằng TIẾNG VIỆT vì sao sai và cách dùng đúng.
3. Bài viết mẫu viết lại nâng cấp (model_essay):
   - Viết lại toàn bộ bài viết này ở trình độ Band 8.5 - 9.0 (Native Academic / Professional level).
   - Giữ nguyên các ý tưởng và lập luận ban đầu của học viên nhưng diễn đạt lại bằng từ vựng đắt giá, cấu trúc câu đa dạng, mượt mà.
4. Gợi ý từ vựng & Collocations nâng cấp (vocab_upgrades):
   - Trích xuất 5 đến 8 từ vựng hoặc collocations học thuật cao cấp (C1/C2) phù hợp với bài viết này.
   - Mỗi từ gồm:
     + "word": Từ/cụm từ tiếng Anh
     + "meaning": Nghĩa tiếng Việt tự nhiên
     + "phonetic": Phiên âm quốc tế IPA (ví dụ: "/ˌɒb.lɪˈɡeɪ.ʃən/")
     + "replace_for": Cụm từ đơn giản trong bài của học viên mà từ này có thể thay thế (ví dụ: "big problem" -> "grave dilemma")
     + "context_sentence": Câu ví dụ minh họa cách dùng trong ngữ cảnh bài này.

ĐỊNH DẠNG TRẢ VỀ:
BẮT BUỘC là JSON duy nhất (không bọc text giải thích bên ngoài), theo schema:
{{
  "overall_score": 7.0,
  "max_score": 9.0,
  "summary_review": "Nhận xét tổng quan bằng tiếng Việt về ưu điểm và hạn chế cốt lõi của bài viết...",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "weaknesses": ["Điểm cần khắc phục 1", "Điểm cần khắc phục 2"],
  "criteria_scores": {{
    "task_response": {{
      "score": 7.0,
      "feedback": "Nhận xét chi tiết về Task Achievement/Response bằng tiếng Việt..."
    }},
    "coherence_cohesion": {{
      "score": 6.5,
      "feedback": "Nhận xét chi tiết về Coherence & Cohesion bằng tiếng Việt..."
    }},
    "lexical_resource": {{
      "score": 7.0,
      "feedback": "Nhận xét chi tiết về Lexical Resource bằng tiếng Việt..."
    }},
    "grammatical_range_accuracy": {{
      "score": 7.5,
      "feedback": "Nhận xét chi tiết về Grammar Range & Accuracy bằng tiếng Việt..."
    }}
  }},
  "corrections": [
    {{
      "original": "...",
      "corrected": "...",
      "type": "grammar",
      "explanation": "..."
    }}
  ],
  "model_essay": "Bài viết mẫu hoàn hảo viết lại ở Band 8.5-9.0...",
  "vocab_upgrades": [
    {{
      "word": "...",
      "meaning": "...",
      "phonetic": "...",
      "replace_for": "...",
      "context_sentence": "..."
    }}
  ]
}}
"""
        models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
        last_error = None

        async with httpx.AsyncClient(timeout=300.0) as client:
            for model_name in models_to_try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                payload = {
                    "contents": [{"parts": [{"text": eval_prompt}]}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.2
                    }
                }
                try:
                    logger.info(f"Submitting essay evaluation ({word_count} words) to {model_name}...")
                    response = await client.post(url, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        raw_text = re.sub(r"^```json\s*", "", raw_text)
                        raw_text = re.sub(r"\s*```$", "", raw_text)

                        parsed = json.loads(raw_text)
                        logger.info(f"Essay successfully evaluated by {model_name}. Overall Score: {parsed.get('overall_score')}")
                        return parsed
                    else:
                        logger.warning(f"Model {model_name} returned HTTP {response.status_code}: {response.text[:200]}")
                        last_error = f"HTTP {response.status_code}: {response.text[:200]}"
                except Exception as e:
                    logger.warning(f"Error evaluating essay with {model_name}: {e}")
                    last_error = str(e)

        raise RuntimeError(f"Không thể kết nối hoặc xử lý kết quả với Gemini AI: {last_error}")
