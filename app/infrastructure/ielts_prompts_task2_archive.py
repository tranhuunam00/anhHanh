"""Official IELTS Task 2 Prompts Bank Archive (Tests from 2020 - 2023 and Cambridge 15-17)."""
from typing import List, Dict, Any

IELTS_TASK2_PROMPTS_ARCHIVE: List[Dict[str, Any]] = [
    # =========================================================================
    # NĂM 2023 (ĐỀ THI THẬT IDP / BC)
    # =========================================================================
    {
        "id": "t2_2023_10_28",
        "year": 2023,
        "exam_date": "28/10/2023",
        "source": "Đề thi thật IDP/BC ngày 28/10/2023",
        "title": "Fast Fashion and Environmental Crisis (Thi thật 2023)",
        "prompt": "In many countries, people buy a large amount of inexpensive, trendy clothes and discard them after wearing them only a few times. What are the causes of this 'fast fashion' phenomenon? What problems does it cause for the environment?",
        "type": "Causes & Problems (Thi thật 2023)",
        "sub_type": "causes_solutions",
        "topic_category": "Environment & Consumerism",
        "keywords": ["hyper-consumerism", "synthetic microfibers", "landfill overflow", "textile dyeing effluent", "throwaway culture"],
        "outline": {
            "body1": "Causes: Cheap synthetic manufacturing, hyper-accelerated social media micro-trends, and influencer haul videos encouraging disposable wardrobe turnover.",
            "body2": "Environmental Consequences: Massive textile waste clogging developing nations' landfills, toxic chemical runoff polluting rivers, and microscopic plastic fibers accumulating in marine food webs."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2023_06_24",
        "year": 2023,
        "exam_date": "24/06/2023",
        "source": "Đề thi thật IDP/BC ngày 24/06/2023",
        "title": "Gap Year: Travel & Work vs Immediate University Enrollment (Thi thật 2023)",
        "prompt": "In some countries, it is common for school leavers to take a gap year to work or travel before starting university. Do the advantages of taking a gap year outweigh the disadvantages?",
        "type": "Advantages & Disadvantages (Thi thật 2023)",
        "sub_type": "advantages_disadvantages",
        "topic_category": "Education & Youth",
        "keywords": ["transitional sabbatical", "experiential maturity", "financial independence", "academic momentum loss", "career trajectory clarity"],
        "outline": {
            "body1": "Advantages: Fosters emotional resilience and cultural exposure; allows adolescents to clarify true career aspirations rather than rushing into unsuitable majors.",
            "body2": "Disadvantages: Risk of losing academic study rhythm, peer pressure from graduating a year later, and financial drains if traveling without a steady budget."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2023_02_11",
        "year": 2023,
        "exam_date": "11/02/2023",
        "source": "Đề thi thật IDP/BC ngày 11/02/2023",
        "title": "AI Replacing Intellectual and Creative Professions (Thi thật 2023)",
        "prompt": "Advancements in automated technology and artificial intelligence mean that many complex intellectual jobs, such as translation, data analysis, and legal drafting, may soon be performed by machines. Do you think this is a positive or negative development?",
        "type": "Opinion / Positive or Negative (Thi thật 2023)",
        "sub_type": "opinion",
        "topic_category": "Technology & Employment",
        "keywords": ["white-collar automation", "algorithmic productivity", "structural labor displacement", "human oversight", "upskilling imperatives"],
        "outline": {
            "body1": "Positives: Drastically lowers the cost of legal and translation services for ordinary citizens; eliminates tedious clerical paperwork and maximizes accuracy.",
            "body2": "Negatives & Stance: Threat of sudden structural unemployment among mid-career knowledge workers. Verdict: Positive overall provided governments fund continuous workforce reskilling."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2023_01_14",
        "year": 2023,
        "exam_date": "14/01/2023",
        "source": "Đề thi thật IDP/BC ngày 14/01/2023",
        "title": "The Rise of Cashless Society and Digital Currencies (Thi thật 2023)",
        "prompt": "In many countries today, people rarely use cash for transactions, relying almost entirely on cards and electronic payments. Do the advantages of moving toward a cashless society outweigh the disadvantages?",
        "type": "Advantages & Disadvantages (Thi thật 2023)",
        "sub_type": "advantages_disadvantages",
        "topic_category": "Economy & Technology",
        "keywords": ["cashless ecosystem", "financial transparency", "curbing tax evasion", "digital exclusion", "cyber theft vulnerabilities"],
        "outline": {
            "body1": "Advantages: Tremendous convenience for consumers; streamlines business operations; curbs black-market transactions and tax evasion via auditable digital trails.",
            "body2": "Disadvantages: Excludes tech-illiterate elderly citizens; leaves entire economies vulnerable to power outages and cyber attacks; erodes personal privacy through financial tracking."
        },
        "min_words": 250,
        "recommended_time": 40
    },

    # =========================================================================
    # CAMBRIDGE IELTS 17 (XUẤT BẢN 2022 - CHÍNH THỨC CAMBRIDGE)
    # =========================================================================
    {
        "id": "t2_cam17_t1",
        "year": 2022,
        "exam_date": "Cambridge 17 Test 1",
        "source": "Cambridge IELTS 17 Academic Test 1 (2022)",
        "title": "Teaching Children Right from Wrong and Punishment (Cambridge 17)",
        "prompt": "It is important for children to learn the difference between right and wrong at an early age. Punishment is necessary to help them learn this distinction. To what extent do you agree or disagree with this statement? What sort of punishment should parents and teachers use?",
        "type": "Two-part Opinion (Cambridge 17)",
        "sub_type": "two_part",
        "topic_category": "Education & Parenting",
        "keywords": ["moral discernment", "constructive discipline", "corporal punishment", "empathetic guidance", "positive reinforcement"],
        "outline": {
            "body1": "Agreement on Necessity of Discipline: Without boundaries, children develop entitled or antisocial behaviors; however, physical violence breeds resentment and fear.",
            "body2": "Appropriate Non-Violent Punishments: Temporary revocation of privileges (screen time), reflective timeouts, and mandatory restitution (apologizing or repairing damage)."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam17_t2",
        "year": 2022,
        "exam_date": "Cambridge 17 Test 2",
        "source": "Cambridge IELTS 17 Academic Test 2 (2022)",
        "title": "Solo Living in Contemporary Society (Cambridge 17)",
        "prompt": "In many countries around the world, an increasing number of individuals are choosing to live alone rather than with family or roommates. What are the primary reasons for this trend? Is this a positive or negative development?",
        "type": "Two-part Question (Cambridge 17)",
        "sub_type": "two_part",
        "topic_category": "Society & Lifestyle",
        "keywords": ["single-person households", "financial self-sufficiency", "social fragmentation", "unconstrained personal autonomy", "housing market strain"],
        "outline": {
            "body1": "Reasons: Financial independence of young professionals; rising age of marriage; preference for personal privacy and quiet after high-stress workdays.",
            "body2": "Evaluation (Mixed): Fosters self-reliance and emotional independence; however, causes acute social alienation and exacerbates national housing shortages."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam17_t3",
        "year": 2022,
        "exam_date": "Cambridge 17 Test 3",
        "source": "Cambridge IELTS 17 Academic Test 3 (2022)",
        "title": "Technological Automation: Job Destruction vs Creation (Cambridge 17)",
        "prompt": "Some people believe that rapid advances in technology will lead to widespread unemployment. Others argue that technology always creates more new job opportunities than it eliminates. Discuss both views and give your own opinion.",
        "type": "Discuss Both Views (Cambridge 17)",
        "sub_type": "discussion",
        "topic_category": "Technology & Economy",
        "keywords": ["technological unemployment", "creative destruction", "paradigm shift", "obsolete professions", "high-skill job generation"],
        "outline": {
            "body1": "Pessimistic View: Automation eliminates manual and routine cognitive tasks much faster than displaced workers can be retrained.",
            "body2": "Optimistic View & Stance: Historical precedents (steam engine, computer) prove that technology spawns entire new industries (AI ethics, green engineering). With government retraining programs, the net outcome is positive."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam17_t4",
        "year": 2022,
        "exam_date": "Cambridge 17 Test 4",
        "source": "Cambridge IELTS 17 Academic Test 4 (2022)",
        "title": "National History vs World History in Schools (Cambridge 17)",
        "prompt": "Some people think that it is more important for children to study the history of their own country, while others think they should learn about world history instead. Discuss both views and give your own opinion.",
        "type": "Discuss Both Views (Cambridge 17)",
        "sub_type": "discussion",
        "topic_category": "Education & History",
        "keywords": ["national heritage", "civic pride", "cosmopolitan worldview", "geopolitical literacy", "balanced curriculum"],
        "outline": {
            "body1": "National History: Imparts cultural roots, constitutional values, and a sense of shared civic identity and gratitude toward national forebears.",
            "body2": "World History & Opinion: Cultivates global perspective, prevents parochial chauvinism, and helps students understand modern geopolitical alliances. A dual, integrated syllabus is the ideal solution."
        },
        "min_words": 250,
        "recommended_time": 40
    },

    # =========================================================================
    # NĂM 2022 (ĐỀ THI THẬT IDP / BC)
    # =========================================================================
    {
        "id": "t2_2022_10_22",
        "year": 2022,
        "exam_date": "22/10/2022",
        "source": "Đề thi thật IDP/BC ngày 22/10/2022",
        "title": "Prison Sentences vs Community Service Rehabilitation (Thi thật 2022)",
        "prompt": "Some people believe that locking criminals up in prison is the best way to reduce crime rates. Others argue that education and non-custodial community work are more effective for rehabilitation. Discuss both views and give your opinion.",
        "type": "Discuss Both Views (Thi thật 2022)",
        "sub_type": "discussion",
        "topic_category": "Crime & Law",
        "keywords": ["custodial sentences", "recidivism rates", "restorative justice", "penal deterrence", "vocational rehabilitation"],
        "outline": {
            "body1": "For Incarceration: Protects the public from violent offenders, delivers justice to victims, and provides a powerful psychological deterrent.",
            "body2": "For Community Rehabilitation & Opinion: Prisons often act as schools for crime where minor offenders become hardened; vocational training and community payback reduce reoffending. Violent criminals require prison, while non-violent offenders benefit most from community rehabilitation."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2022_06_25",
        "year": 2022,
        "exam_date": "25/06/2022",
        "source": "Đề thi thật IDP/BC ngày 25/06/2022",
        "title": "Free Public Transport for Air Pollution Abatement (Thi thật 2022)",
        "prompt": "Some people argue that the best way to solve vehicular traffic congestion and urban air pollution is to make all public transport free of charge. To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Thi thật 2022)",
        "sub_type": "opinion",
        "topic_category": "Environment & Transport",
        "keywords": ["fare-free transit", "modal shift", "congestion mitigation", "municipal fiscal burden", "transit reliability"],
        "outline": {
            "body1": "Why Free Transit Attracts Riders: Eliminates cost barriers, encouraging commuters to leave cars behind and reducing tailpipe emissions.",
            "body2": "Why Free Transit Alone Fails (Partial Disagree): If trains are overcrowded, unreliable, or slow, drivers will still prefer private cars; funding must prioritize network expansion, speed, and congestion charging for cars."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2022_03_12",
        "year": 2022,
        "exam_date": "12/03/2022",
        "source": "Đề thi thật IDP/BC ngày 12/03/2022",
        "title": "Plant-Based Diets vs Meat Consumption (Thi thật 2022)",
        "prompt": "In order to protect the global environment and improve personal health, everyone should adopt a vegetarian diet. To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Thi thật 2022)",
        "sub_type": "opinion",
        "topic_category": "Health & Environment",
        "keywords": ["livestock emissions", "pastoral deforestation", "cardiovascular health", "nutritional adequacy", "enforced dietary uniformity"],
        "outline": {
            "body1": "Merits of Reducing Meat: Industrial livestock farming generates substantial methane, requires massive deforestation for soy feed, and excessive red meat intake raises cancer and heart disease risks.",
            "body2": "Why Enforced Universal Vegetarianism is Unrealistic (Disagree): Many regions have harsh climates unsuitable for agriculture; meat provides bioavailable vitamin B12 and iron. Moderation and sustainable livestock practices are preferable to outright bans."
        },
        "min_words": 250,
        "recommended_time": 40
    },

    # =========================================================================
    # CAMBRIDGE IELTS 16 (XUẤT BẢN 2021 - CHÍNH THỨC CAMBRIDGE)
    # =========================================================================
    {
        "id": "t2_cam16_t1",
        "year": 2021,
        "exam_date": "Cambridge 16 Test 1",
        "source": "Cambridge IELTS 16 Academic Test 1 (2021)",
        "title": "Compulsory Community Service for High Schoolers (Cambridge 16)",
        "prompt": "Some people believe that unpaid community service should be a compulsory part of high school programmes (for example working for a charity, improving the neighborhood or teaching sports to younger children). To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Cambridge 16)",
        "sub_type": "opinion",
        "topic_category": "Education & Youth",
        "keywords": ["compulsory civic service", "altruistic disposition", "practical life skills", "academic overload", "voluntarism ethos"],
        "outline": {
            "body1": "Benefits: Instills social empathy, breaks insular screen-time habits, teaches real-world teamwork, and strengthens community safety nets.",
            "body2": "Drawbacks of Mandatory Nature: Heavy homework burdens might cause resentment if forced; should be incentivized through credits rather than made strictly punitive."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam16_t2",
        "year": 2021,
        "exam_date": "Cambridge 16 Test 2",
        "source": "Cambridge IELTS 16 Academic Test 2 (2021)",
        "title": "Tourism in Remote Pristine Environments (Cambridge 16)",
        "prompt": "In many parts of the world, tourists are increasingly visiting remote and pristine natural environments such as the Arctic, deserts, or tropical rainforests. Do the advantages of this development outweigh the disadvantages?",
        "type": "Advantages & Disadvantages (Cambridge 16)",
        "sub_type": "advantages_disadvantages",
        "topic_category": "Tourism & Environment",
        "keywords": ["ecotourism incursion", "fragile biomes", "economic sustenance for indigenous tribes", "ecological footprint", "over-tourism degradation"],
        "outline": {
            "body1": "Advantages: Generates vital revenue for indigenous wilderness guides, raises first-hand global awareness of endangered ecosystems.",
            "body2": "Disadvantages (Far Greater): Aircraft emissions to reach remote areas, waste pollution, disturbance of fragile animal breeding grounds. Strict quotas must be enforced."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam16_t3",
        "year": 2021,
        "exam_date": "Cambridge 16 Test 3",
        "source": "Cambridge IELTS 16 Academic Test 3 (2021)",
        "title": "Manufacture of Short-Lived Consumer Goods (Cambridge 16)",
        "prompt": "Many manufactured goods such as smartphones, household appliances, and clothing are intentionally designed not to last long. What are the causes of this? What effects does this have on individuals and society?",
        "type": "Causes & Effects (Cambridge 16)",
        "sub_type": "causes_solutions",
        "topic_category": "Consumerism & Technology",
        "keywords": ["planned obsolescence", "hyper-consumerist culture", "landfill crisis", "financial exploitation", "right to repair legislation"],
        "outline": {
            "body1": "Causes: Corporate greed seeking repeat purchases (planned obsolescence), fierce cost-cutting using flimsy parts, fast-moving technological iterations.",
            "body2": "Effects: Heavier financial drain on struggling households forced to replace goods constantly; catastrophic e-waste containing toxic heavy metals piling up in developing nations."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam16_t4",
        "year": 2021,
        "exam_date": "Cambridge 16 Test 4",
        "source": "Cambridge IELTS 16 Academic Test 4 (2021)",
        "title": "Financial Literacy in the School Curriculum (Cambridge 16)",
        "prompt": "Some people think that financial management should be taught in schools as a mandatory subject alongside traditional subjects like mathematics and history. To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Cambridge 16)",
        "sub_type": "opinion",
        "topic_category": "Education & Economy",
        "keywords": ["financial literacy", "budgeting competence", "debt traps", "curriculum overload", "real-world readiness"],
        "outline": {
            "body1": "Arguments for Financial Education: Millions of school leavers succumb to predatory high-interest credit card debt and pay-later schemes without basic budget skills.",
            "body2": "Practical Implementation: Can be seamlessly woven into secondary math classes (compound interest, tax returns, mortgages) without overburdening the timetable."
        },
        "min_words": 250,
        "recommended_time": 40
    },

    # =========================================================================
    # NĂM 2021 (ĐỀ THI THẬT IDP / BC)
    # =========================================================================
    {
        "id": "t2_2021_10_23",
        "year": 2021,
        "exam_date": "23/10/2021",
        "source": "Đề thi thật IDP/BC ngày 23/10/2021",
        "title": "Screen Time Regulation for Children (Thi thật 2021)",
        "prompt": "Children today spend hours each day glued to digital screens for gaming, video streaming, and social interaction. Who is primarily responsible for limiting their screen time: parents or school authorities? Discuss both views and give your opinion.",
        "type": "Discuss Both Views (Thi thật 2021)",
        "sub_type": "discussion",
        "topic_category": "Education & Family",
        "keywords": ["digital dependency", "parental oversight", "digital hygiene curriculum", "sedentary lifestyle", "cyber safety protocols"],
        "outline": {
            "body1": "Case for Parental Primacy: Devices are predominantly used in domestic bedrooms; parents pay for internet access and possess direct moral authority.",
            "body2": "Case for School Responsibility & Synthesis: Schools must enforce device bans on campus and teach digital media literacy. Parents must enforce domestic cut-offs."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2021_07_10",
        "year": 2021,
        "exam_date": "10/07/2021",
        "source": "Đề thi thật IDP/BC ngày 10/07/2021",
        "title": "Preserving Endangered Minority Languages (Thi thật 2021)",
        "prompt": "Every year several indigenous languages die out. Some people believe that it is not worth saving dying languages because the world is better off communicating in a few common global tongues. To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Thi thật 2021)",
        "sub_type": "opinion",
        "topic_category": "Culture & Linguistics",
        "keywords": ["linguistic extinction", "linguistic diversity", "indigenous cultural heritage", "lingua franca efficiency", "unique worldviews"],
        "outline": {
            "body1": "Argument for Common Tongues: English or Spanish simplifies international trade, academic publishing, and diplomacy without translation barriers.",
            "body2": "Why Language Preservation is Crucial (Strongly Disagree): Each language encodes unique oral history, botany knowledge, and cultural philosophy. When a language dies, a distinct way of perceiving human reality vanishes forever."
        },
        "min_words": 250,
        "recommended_time": 40
    },

    # =========================================================================
    # CAMBRIDGE IELTS 15 (XUẤT BẢN 2020 - CHÍNH THỨC CAMBRIDGE)
    # =========================================================================
    {
        "id": "t2_cam15_t1",
        "year": 2020,
        "exam_date": "Cambridge 15 Test 1",
        "source": "Cambridge IELTS 15 Academic Test 1 (2020)",
        "title": "Executive Compensation vs Average Worker Wages (Cambridge 15)",
        "prompt": "In many countries, senior executives in large companies earn astronomical salaries that are hundreds of times higher than the wages of their ordinary employees. Some people think this is justifiable, while others believe that governments should place a limit on the maximum wage. Discuss both views and give your opinion.",
        "type": "Discuss Both Views (Cambridge 15)",
        "sub_type": "discussion",
        "topic_category": "Economy & Work",
        "keywords": ["executive remuneration", "income inequality", "corporate meritocracy", "statutory wage ceiling", "social resentment"],
        "outline": {
            "body1": "Justification: CEOs carry immense fiduciary responsibility; their strategic leadership can create or destroy thousands of jobs; rare talent commands market-driven compensation.",
            "body2": "Call for Caps & Opinion: Unchecked wage disparity demoralizes workers and breeds social unrest. Rather than arbitrary hard caps, governments should apply progressive corporate taxation and link bonuses to employee median wage ratios."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam15_t2",
        "year": 2020,
        "exam_date": "Cambridge 15 Test 2",
        "source": "Cambridge IELTS 15 Academic Test 2 (2020)",
        "title": "Will Digital Books Completely Replace Print? (Cambridge 15)",
        "prompt": "In the future, nobody will buy printed newspapers or books because everything will be read online free of charge. To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Cambridge 15)",
        "sub_type": "opinion",
        "topic_category": "Media & Technology",
        "keywords": ["digital publication dominance", "tactile reading experience", "freemium paywalls", "screen fatigue", "journalistic monetization"],
        "outline": {
            "body1": "Arguments for Digital Supremacy: Instant global accessibility, multimedia integration, zero paper consumption, portability on lightweight e-readers.",
            "body2": "Why Print Will Not Wholly Perish (Disagree): High-quality journalism cannot be given away free; printed books offer tactile pleasure and focus free from screen notifications."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam15_t3",
        "year": 2020,
        "exam_date": "Cambridge 15 Test 3",
        "source": "Cambridge IELTS 15 Academic Test 3 (2020)",
        "title": "The Pervasive Power of Commercial Advertising (Cambridge 15)",
        "prompt": "Advertising is everywhere and is extremely successful at persuading people to purchase products they neither need nor can afford. To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Cambridge 15)",
        "sub_type": "opinion",
        "topic_category": "Media & Advertising",
        "keywords": ["subconscious consumer manipulation", "artificial desire creation", "consumer sovereignty", "impulse buying", "brand loyalty"],
        "outline": {
            "body1": "Persuasive Omnipresence: Targeted digital ads exploit psychological insecurities and create manufactured needs for luxury goods and fast fashion.",
            "body2": "Counterpoint & Verdict: Consumers have access to independent online reviews and price comparison platforms; educated adults retain discernment. Yet for children, ads are excessively manipulative."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam15_t4",
        "year": 2020,
        "exam_date": "Cambridge 15 Test 4",
        "source": "Cambridge IELTS 15 Academic Test 4 (2020)",
        "title": "Purpose of Tertiary Education: Vocational vs Academic (Cambridge 15)",
        "prompt": "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university is to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. Discuss both views and give your opinion.",
        "type": "Discuss Both Views (Cambridge 15)",
        "sub_type": "discussion",
        "topic_category": "Education & Career",
        "keywords": ["vocational alignment", "pure intellectual pursuit", "market-driven curriculum", "critical pedagogy", "knowledge economy"],
        "outline": {
            "body1": "Vocational Function: High tuition costs mean students expect market-ready skills to service student debt; industries need competent engineers and clinicians.",
            "body2": "Pure Knowledge & Opinion: Universities are bastions of philosophical debate, basic theoretical science, and independent inquiry. The ideal university balances vocational training with rigorous critical thinking."
        },
        "min_words": 250,
        "recommended_time": 40
    },

    # =========================================================================
    # NĂM 2020 (ĐỀ THI THẬT IDP / BC)
    # =========================================================================
    {
        "id": "t2_2020_11_28",
        "year": 2020,
        "exam_date": "28/11/2020",
        "source": "Đề thi thật IDP/BC ngày 28/11/2020",
        "title": "Digital Divide and Generation Gap between Youth and Seniors (Thi thật 2020)",
        "prompt": "The generation gap between young people and the elderly has widened significantly due to differing attitudes toward modern technology. What problems does this cause? How can this gap be bridged?",
        "type": "Problems & Solutions (Thi thật 2020)",
        "sub_type": "causes_solutions",
        "topic_category": "Society & Family",
        "keywords": ["intergenerational friction", "digital alienation of the elderly", "telecommunications gap", "community digital literacy workshops", "family dialogue"],
        "outline": {
            "body1": "Problems: Older generations feel discarded by digital banking and online public portals; family conversations stall over misunderstandings of internet culture.",
            "body2": "Solutions: Community centers should offer patient peer-to-peer digital workshops; youth should be encouraged to teach grandparents digital communication apps."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2020_08_08",
        "year": 2020,
        "exam_date": "08/08/2020",
        "source": "Đề thi thật IDP/BC ngày 08/08/2020",
        "title": "Metropolitan Congestion Charges (Thi thật 2020)",
        "prompt": "Some city councils have introduced a daily congestion fee for private cars entering the city centre during peak hours. Do the advantages of this system outweigh the disadvantages?",
        "type": "Advantages & Disadvantages (Thi thật 2020)",
        "sub_type": "advantages_disadvantages",
        "topic_category": "Transport & City Planning",
        "keywords": ["congestion pricing", "cordon toll zones", "peak-hour traffic reduction", "regressive financial burden", "reinvested public transit funds"],
        "outline": {
            "body1": "Advantages: Decisively thins gridlock, lowers toxic roadside nitrogen oxide levels, and raises revenue to upgrade public metro and bus fleets.",
            "body2": "Disadvantages: Penalizes low-income suburban workers who cannot afford inner-city housing and lack direct train links. Verdict: Advantages dominate if electric cars receive exemptions."
        },
        "min_words": 250,
        "recommended_time": 40
    }
]
