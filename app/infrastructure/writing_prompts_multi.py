"""Curated Multi-language Writing Prompts for Japanese, Chinese, Korean, French and German."""
from typing import List, Dict, Any

CURATED_PROMPTS_MULTI: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
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
                "prompt": "Dans quelle mesure estimez-vous que la transition écologique doit primer sur la croissance économique immédiate ? Développez une argumentation nuancée và structurée.",
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
