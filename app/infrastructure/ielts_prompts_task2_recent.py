"""Official IELTS Task 2 Prompts Bank (Recent Tests: 2023 - 2026 and Cambridge 18-19)."""
from typing import List, Dict, Any

IELTS_TASK2_PROMPTS_RECENT: List[Dict[str, Any]] = [
    # =========================================================================
    # NĂM 2026 (ĐỀ THI THẬT MỚI NHẤT)
    # =========================================================================
    {
        "id": "t2_2026_03_07",
        "year": 2026,
        "exam_date": "07/03/2026",
        "source": "Đề thi thật IDP/BC ngày 07/03/2026",
        "title": "Remote Working and Suburban Migration (Thi thật 2026)",
        "prompt": "With the rise of remote working, more people are moving away from major metropolitan centers to live in rural and suburban areas. What are the causes of this trend? Do the advantages of this movement outweigh the disadvantages?",
        "type": "Causes & Advantages/Disadvantages (Thi thật 2026)",
        "sub_type": "advantages_disadvantages",
        "topic_category": "Society & Urbanization",
        "keywords": ["decentralized workforce", "exorbitant cost of living", "rural revitalization", "digital infrastructure deficits", "urban hollow-out effect"],
        "outline": {
            "body1": "Causes & Advantages: Skyrocketing inner-city housing prices and unbearable congestion drive professionals away; affordable spacious housing and superior work-life balance improve mental well-being.",
            "body2": "Disadvantages: Suburban areas often lack high-speed broadband and specialized medical facilities; cities face reduced local tax revenues and commercial stagnation."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2026_02_10",
        "year": 2026,
        "exam_date": "10/02/2026",
        "source": "Đề thi thật IDP/BC ngày 10/02/2026",
        "title": "Sugar Tax and Fast Food Regulation (Thi thật 2026)",
        "prompt": "Some people argue that governments should impose heavy taxes on junk food and sugary beverages to encourage healthier eating habits. Others believe that individuals should have the freedom to choose what they eat. Discuss both views and give your own opinion.",
        "type": "Discuss Both Views (Thi thật 2026)",
        "sub_type": "discussion",
        "topic_category": "Health & Government",
        "keywords": ["fiscal disincentives", "diet-related non-communicable diseases", "regressive taxation", "consumer autonomy", "public healthcare expenditure"],
        "outline": {
            "body1": "Side A (Taxation): Sugar taxes curb consumption of empty calories, generate state revenue for healthcare, and pressure food manufacturers to reformulate recipes.",
            "body2": "Side B (Personal Choice) & Opinion: Food choices are a matter of personal freedom; flat taxes disproportionately burden low-income households. Balanced view: combine moderate taxes with subsidies for fresh organic produce and public nutrition education."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2026_01_24",
        "year": 2026,
        "exam_date": "24/01/2026",
        "source": "Đề thi thật IDP/BC ngày 24/01/2026",
        "title": "Traditional Craftsmanship in the Age of AI (Thi thật 2026)",
        "prompt": "As artificial intelligence and automated manufacturing become ubiquitous, some people believe that traditional handcrafted skills and artisan trades will inevitably disappear and are no longer worth preserving. To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Thi thật 2026)",
        "sub_type": "opinion",
        "topic_category": "Culture & Technology",
        "keywords": ["mass automated production", "intangible cultural heritage", "bespoke craftsmanship", "homogenized consumer goods", "cultural identity"],
        "outline": {
            "body1": "Counter-argument acknowledged: AI and robotics produce goods with higher precision, lower cost, and greater scalability, making manual labor obsolete in utilitarian contexts.",
            "body2": "Rebuttal & Main Opinion (Strongly Disagree): Handcrafted items carry emotional provenance, uniqueness, and ancestral heritage that algorithmic machines cannot replicate; luxury consumers place growing value on artisanal authenticity."
        },
        "min_words": 250,
        "recommended_time": 40
    },

    # =========================================================================
    # NĂM 2025 (ĐỀ THI THẬT TIÊU BIỂU)
    # =========================================================================
    {
        "id": "t2_2025_12_13",
        "year": 2025,
        "exam_date": "13/12/2025",
        "source": "Đề thi thật IDP/BC ngày 13/12/2025",
        "title": "Preserving Historic Buildings vs Modern Housing (Thi thật 2025)",
        "prompt": "In many cities, historic buildings are occupying valuable land that could otherwise be used to construct modern high-rise apartments to address housing shortages. Should governments demolish old buildings or preserve them at all costs?",
        "type": "Direct Question / Discussion (Thi thật 2025)",
        "sub_type": "discussion",
        "topic_category": "Society & Urbanization",
        "keywords": ["architectural heritage", "housing affordability crisis", "high-density residential towers", "cultural continuity", "adaptive reuse"],
        "outline": {
            "body1": "Case for Redevelopment: Urban populations are swelling; acute shortages of affordable homes force young workers into squalid housing or grueling commutes.",
            "body2": "Case for Preservation & Solution: Historic buildings serve as tangible anchors of collective memory and attract international tourism; adaptive reuse (converting historic interiors while preserving façades) harmonizes heritage with modernity."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2025_10_18",
        "year": 2025,
        "exam_date": "18/10/2025",
        "source": "Đề thi thật IDP/BC ngày 18/10/2025",
        "title": "Space Exploration Spending vs Earth Problems (Thi thật 2025)",
        "prompt": "Billions of dollars are spent every year on space exploration programs. Some believe that this money should instead be allocated to solving urgent problems on Earth, such as poverty and climate change. To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Thi thật 2025)",
        "sub_type": "opinion",
        "topic_category": "Government & Science",
        "keywords": ["astronomical fiscal allocation", "poverty eradication", "spin-off technological breakthroughs", "satellite climate monitoring", "planetary existential threats"],
        "outline": {
            "body1": "Why terrestrial problems seem urgent: Severe famine, underfunded public schools, and imminent climate disasters demand immediate humanitarian intervention.",
            "body2": "Why space investment remains vital (Partial Disagree): Space research yields invaluable technologies (weather satellites, GPS, lightweight insulation, solar cells) and monitors global warming patterns across the biosphere."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2025_08_09",
        "year": 2025,
        "exam_date": "09/08/2025",
        "source": "Đề thi thật IDP/BC ngày 09/08/2025",
        "title": "Aging Population and Raising Retirement Age (Thi thật 2025)",
        "prompt": "Because life expectancy is increasing rapidly worldwide, some people think that the mandatory retirement age should be raised. Others believe that older workers should retire to create job opportunities for the younger generation. Discuss both views and give your opinion.",
        "type": "Discuss Both Views (Thi thật 2025)",
        "sub_type": "discussion",
        "topic_category": "Society & Employment",
        "keywords": ["prolonged life expectancy", "statutory pension liabilities", "intergenerational job mobility", "institutional knowledge", "cognitive endurance"],
        "outline": {
            "body1": "Arguments for Raising Retirement Age: Relieves bankrupt pension funds, addresses acute skilled labor shortages, and capitalizes on seasoned mentorship from senior professionals.",
            "body2": "Arguments for Timely Retirement & Conclusion: Frees executive and entry-level positions for innovative youth facing underemployment. Optimal approach: flexible, voluntary phased retirement models."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2025_05_17",
        "year": 2025,
        "exam_date": "17/05/2025",
        "source": "Đề thi thật IDP/BC ngày 17/05/2025",
        "title": "Social Media Influencers and Youth Consumerism (Thi thật 2025)",
        "prompt": "Many young people are heavily influenced by internet personalities and celebrities on social media platforms when deciding what products to purchase. What are the reasons for this? Is this a positive or negative development?",
        "type": "Two-part Question (Thi thật 2025)",
        "sub_type": "two_part",
        "topic_category": "Media & Technology",
        "keywords": ["parasocial relationships", "algorithmic curation", "unbridled consumerism", "materialistic vanity", "sponsored endorsements"],
        "outline": {
            "body1": "Reasons: Influencers cultivate an illusion of authentic intimacy (parasocial connection); algorithmic feeds curate hyper-targeted lifestyle aesthetics that trigger FOMO (fear of missing out).",
            "body2": "Evaluation (Largely Negative): Fuels impulsive debt among impressionable adolescents, promotes unsustainable fast-fashion consumption, and normalizes deceptive, undisclosed sponsorships."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2025_03_22",
        "year": 2025,
        "exam_date": "22/03/2025",
        "source": "Đề thi thật IDP/BC ngày 22/03/2025",
        "title": "Fossil Fuel Subsidies vs Green Energy Transition (Thi thật 2025)",
        "prompt": "Some environmentalists argue that governments should immediately abolish all subsidies for fossil fuel industries and transfer the funds entirely to renewable energy projects. Do the advantages of this policy outweigh the disadvantages?",
        "type": "Advantages & Disadvantages (Thi thật 2025)",
        "sub_type": "advantages_disadvantages",
        "topic_category": "Environment & Economy",
        "keywords": ["hydrocarbon subsidies", "clean energy transition", "energy price volatility", "grid decarbonization", "economic dislocation"],
        "outline": {
            "body1": "Advantages: Decisively penalizes carbon polluters, accelerates cost parity for solar and wind infrastructure, and mitigates irreversible climate catastrophes.",
            "body2": "Disadvantages & Balanced Stance: Abrupt cessation could cause immediate spikes in electricity tariffs and heating costs for vulnerable citizens. Staged transition with targeted safety nets is far more practical."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2025_01_11",
        "year": 2025,
        "exam_date": "11/01/2025",
        "source": "Đề thi thật IDP/BC ngày 11/01/2025",
        "title": "Generative AI in Literature and the Arts (Thi thật 2025)",
        "prompt": "Artificial intelligence can now produce paintings, compose musical pieces, and write novels that resemble works created by human artists. Some people view this as a remarkable technological triumph, while others fear it undermines genuine human creativity. Discuss both views and give your own opinion.",
        "type": "Discuss Both Views (Thi thật 2025)",
        "sub_type": "discussion",
        "topic_category": "Technology & Art",
        "keywords": ["generative neural networks", "algorithmic synthesis", "creative introspection", "intellectual property infringement", "democratization of artistic production"],
        "outline": {
            "body1": "View 1 (Triumph): Democratizes artistic expression for amateurs, enhances graphic prototyping, and opens up novel digital mediums and interactive storytelling.",
            "body2": "View 2 & Opinion (Threat to Human Soul): AI merely recombines past human data without sentient experience, sorrow, or philosophical struggle; authentic art is irreplaceable because it reflects lived human consciousness."
        },
        "min_words": 250,
        "recommended_time": 40
    },

    # =========================================================================
    # CAMBRIDGE IELTS 19 (XUẤT BẢN 2024 - CHÍNH THỨC CAMBRIDGE)
    # =========================================================================
    {
        "id": "t2_cam19_t1",
        "year": 2024,
        "exam_date": "Cambridge 19 Test 1",
        "source": "Cambridge IELTS 19 Academic Test 1 (2024)",
        "title": "Competition vs Cooperation in Schools and Work (Cambridge 19)",
        "prompt": "Some people think that competition among students at school and employees in the workplace is the best way to encourage high performance. Others believe that teaching people how to cooperate and work together produces better results. Discuss both views and give your own opinion.",
        "type": "Discuss Both Views (Cambridge 19)",
        "sub_type": "discussion",
        "topic_category": "Education & Work",
        "keywords": ["competitive drive", "collaborative synergy", "zero-sum rivalry", "interpersonal friction", "psychological safety"],
        "outline": {
            "body1": "Merits of Competition: Stimulates individual ambition, encourages students to exceed personal limits, and rewards meritocracy and exceptional rigor.",
            "body2": "Merits of Cooperation & My View: Complex modern projects require cross-disciplinary teamwork; excessive competition breeds toxic sabotage and burnout. Cooperation underpinned by healthy personal accountability yields superior long-term results."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam19_t2",
        "year": 2024,
        "exam_date": "Cambridge 19 Test 2",
        "source": "Cambridge IELTS 19 Academic Test 2 (2024)",
        "title": "The Impact of Significant Historical Inventions (Cambridge 19)",
        "prompt": "Throughout human history, various inventions have completely transformed our daily lives. In your opinion, which invention has had the greatest impact on society? Give reasons for your choice and describe both positive and negative consequences.",
        "type": "Direct Question / Evaluation (Cambridge 19)",
        "sub_type": "two_part",
        "topic_category": "Science & History",
        "keywords": ["paradigmatic breakthrough", "instantaneous telecommunication", "unprecedented connectivity", "cybersecurity vulnerabilities", "digital sedentary lifestyle"],
        "outline": {
            "body1": "Choice & Positive Impacts (The Internet): Eradicated geographical barriers to information, powered global trade and scientific collaboration, and democratized education.",
            "body2": "Negative Ramifications: Brought chronic digital addiction, polarization via social media echo chambers, identity theft, and existential cybersecurity threats."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam19_t3",
        "year": 2024,
        "exam_date": "Cambridge 19 Test 3",
        "source": "Cambridge IELTS 19 Academic Test 3 (2024)",
        "title": "Relocating Companies to Regional and Rural Areas (Cambridge 19)",
        "prompt": "Some people propose that large businesses and factories should be moved out of major cities to regional and rural areas. Do the advantages of this policy outweigh the disadvantages?",
        "type": "Advantages & Disadvantages (Cambridge 19)",
        "sub_type": "advantages_disadvantages",
        "topic_category": "Economy & Urbanization",
        "keywords": ["metropolitan decentralization", "regional economic revitalisation", "industrial pollution migration", "logistical overheads", "skilled workforce scarcity"],
        "outline": {
            "body1": "Advantages: Alleviates metropolitan traffic congestion and unmanageable housing inflation; brings capital injection and steady employment to declining rural communities.",
            "body2": "Disadvantages & Conclusion: Higher transportation costs to shipping hubs, reluctance of specialized talent to relocate, and potential damage to pristine rural ecologies. Overall, advantages outweigh drawbacks if paired with freight rail infrastructure."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam19_t4",
        "year": 2024,
        "exam_date": "Cambridge 19 Test 4",
        "source": "Cambridge IELTS 19 Academic Test 4 (2024)",
        "title": "Increasing Longevity and Societal Consequences (Cambridge 19)",
        "prompt": "In many countries, people are living longer than ever before. What problems does an aging society cause for individuals and society as a whole? What measures can be taken to tackle these issues?",
        "type": "Problems & Solutions (Cambridge 19)",
        "sub_type": "causes_solutions",
        "topic_category": "Society & Demographics",
        "keywords": ["demographic graying", "strained healthcare infrastructure", "dependency ratio", "geriatric care", "pension reform"],
        "outline": {
            "body1": "Problems: Shrinking working-age tax base combined with burgeoning pension expenditures; intense strain on specialized geriatric healthcare and emotional burden on working families.",
            "body2": "Solutions: Gradually raising retirement ages with flexible hours; incentivizing private retirement savings; investing in automated healthcare tech to care for the elderly."
        },
        "min_words": 250,
        "recommended_time": 40
    },

    # =========================================================================
    # NĂM 2024 (ĐỀ THI THẬT IDP / BC)
    # =========================================================================
    {
        "id": "t2_2024_11_23",
        "year": 2024,
        "exam_date": "23/11/2024",
        "source": "Đề thi thật IDP/BC ngày 23/11/2024",
        "title": "Job Hopping vs Lifetime Employment for Youth (Thi thật 2024)",
        "prompt": "Nowadays, young professionals tend to change their jobs every few years rather than staying with a single company for their entire career. Why is this the case? Is this a positive or negative trend?",
        "type": "Two-part Question (Thi thật 2024)",
        "sub_type": "two_part",
        "topic_category": "Work & Employment",
        "keywords": ["transient employment", "career stagnation", "lateral skill acquisition", "organizational loyalty", "accelerated salary increments"],
        "outline": {
            "body1": "Reasons: Fast-evolving industries make skill diversification essential; staying in one company often brings sub-inflation raises, whereas job-hopping yields faster promotions.",
            "body2": "Evaluation (Largely Positive): Individuals gain adaptability and broader professional networks, though employers must invest more in onboarding and retention incentives."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2024_09_14",
        "year": 2024,
        "exam_date": "14/09/2024",
        "source": "Đề thi thật IDP/BC ngày 14/09/2024",
        "title": "Plastic Packaging Ban vs Consumer Convenience (Thi thật 2024)",
        "prompt": "Many consumer goods are sold in plastic packaging that is discarded immediately after use. Some people advocate a complete ban on single-use plastic packaging, while others say it is too convenient and hygienic to eliminate. Discuss both views and give your opinion.",
        "type": "Discuss Both Views (Thi thật 2024)",
        "sub_type": "discussion",
        "topic_category": "Environment & Consumerism",
        "keywords": ["non-biodegradable polymers", "microplastic contamination", "perishable food preservation", "biodegradable alternatives", "extended producer responsibility"],
        "outline": {
            "body1": "Why Plastic is Defended: Light, sterile, hermetically seals food against spoilage, and reduces foodborne pathogens at minimal cost.",
            "body2": "Why Plastic Must Be Phased Out & Opinion: Centuries-long persistence in marine ecosystems and human organs outweighs temporary convenience. Solution: mandatory compostable plant-based wrappers."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2024_06_22",
        "year": 2024,
        "exam_date": "22/06/2024",
        "source": "Đề thi thật IDP/BC ngày 22/06/2024",
        "title": "Government Spending: Contemporary Art vs Public Services (Thi thật 2024)",
        "prompt": "Some people think that governments should spend money on public services such as healthcare and education rather than wasting financial resources on supporting arts like music, theatre, and painting. To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Thi thật 2024)",
        "sub_type": "opinion",
        "topic_category": "Government & Arts",
        "keywords": ["public service provision", "cultural patronage", "civic identity", "essential social safety nets", "holistic well-being"],
        "outline": {
            "body1": "Primacy of Essential Services: Universal healthcare, well-equipped hospitals, and public schools directly save lives and alleviate generational poverty.",
            "body2": "Why Arts Cannot Be Abandoned (Partial Disagree): Arts preserve national heritage, foster critical thinking, stimulate creative tourism, and enrich mental well-being."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2024_03_02",
        "year": 2024,
        "exam_date": "02/03/2024",
        "source": "Đề thi thật IDP/BC ngày 02/03/2024",
        "title": "Disappearance of Local Traditions due to Globalisation (Thi thật 2024)",
        "prompt": "Differences between cultures around the world are becoming increasingly blurred as people everywhere wear the same clothes, eat similar fast food, and watch identical films. Do the advantages of this cultural homogenization outweigh the disadvantages?",
        "type": "Advantages & Disadvantages (Thi thật 2024)",
        "sub_type": "advantages_disadvantages",
        "topic_category": "Culture & Society",
        "keywords": ["cultural homogenization", "cross-cultural understanding", "linguistic extinction", "commercial monoculture", "indigenous traditions"],
        "outline": {
            "body1": "Advantages: Facilitates global trade, breaks down xenophobic barriers, and makes travel and international communication seamless.",
            "body2": "Disadvantages (Far Greater): Irreplaceable indigenous lore, cuisines, and languages are suffocated by multinational media giants, leaving global society impoverished of diversity."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_2024_01_18",
        "year": 2024,
        "exam_date": "18/01/2024",
        "source": "Đề thi thật IDP/BC ngày 18/01/2024",
        "title": "E-Commerce Dominance vs Brick-and-Mortar High Streets (Thi thật 2024)",
        "prompt": "Online shopping has grown dramatically and is causing traditional physical retail shops to close down in town centres. What problems does this cause for local communities? What measures can be taken to revitalize high street shopping?",
        "type": "Problems & Solutions (Thi thật 2024)",
        "sub_type": "causes_solutions",
        "topic_category": "Economy & Community",
        "keywords": ["e-commerce hegemony", "deserted high streets", "erosion of social cohesion", "experiential retail", "pedestrianization of town centers"],
        "outline": {
            "body1": "Problems: Boarded-up storefronts increase crime and visual decay; elderly residents who cannot use digital apps face exclusion; loss of local retail jobs.",
            "body2": "Solutions: Municipalities should reduce business property taxes; transform town centers into pedestrian cultural plazas with craft markets, cafés, and live performances."
        },
        "min_words": 250,
        "recommended_time": 40
    },

    # =========================================================================
    # CAMBRIDGE IELTS 18 (XUẤT BẢN 2023 - CHÍNH THỨC CAMBRIDGE)
    # =========================================================================
    {
        "id": "t2_cam18_t1",
        "year": 2023,
        "exam_date": "Cambridge 18 Test 1",
        "source": "Cambridge IELTS 18 Academic Test 1 (2023)",
        "title": "Environmental Protection: Individual Lifestyle vs Government Laws (Cambridge 18)",
        "prompt": "Some people believe that environmental problems should be solved by individuals taking personal responsibility, while others think that governments and large corporations need to enact strict regulations. Discuss both views and give your own opinion.",
        "type": "Discuss Both Views (Cambridge 18)",
        "sub_type": "discussion",
        "topic_category": "Environment & Governance",
        "keywords": ["grassroots eco-actions", "carbon footprint accountability", "macro-policy interventions", "corporate carbon emissions", "statutory enforcement"],
        "outline": {
            "body1": "The Role of Individuals: Adopting plant-rich diets, using public transit, and minimizing household waste instill collective civic duty and market demand for clean goods.",
            "body2": "The Role of Governments & Opinion: Over 70% of greenhouse gases stem from major industrial entities; only strict carbon pricing, renewable energy subsidies, and heavy fines can enforce real change. Governments must lead, supported by individual actions."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam18_t2",
        "year": 2023,
        "exam_date": "Cambridge 18 Test 2",
        "source": "Cambridge IELTS 18 Academic Test 2 (2023)",
        "title": "University Education: Employability vs Passion (Cambridge 18)",
        "prompt": "Some people think that university students should only focus on subjects that are directly relevant to future employment, such as medicine, engineering, and computer science. Others believe students should be free to study whatever subjects they enjoy, including literature and history. Discuss both views and give your opinion.",
        "type": "Discuss Both Views (Cambridge 18)",
        "sub_type": "discussion",
        "topic_category": "Education & Career",
        "keywords": ["vocational utilitarianism", "STEM marketability", "humanistic critical inquiry", "employability metrics", "intellectual fulfillment"],
        "outline": {
            "body1": "Focus on Practical Subjects: High tuition fees necessitate guaranteed ROI; engineering and medicine address national economic and health needs directly.",
            "body2": "Studying Subjects of Passion & Opinion: Humanities nurture ethical discernment, cultural empathy, and nuanced communication. True innovation thrives at the intersection of technology and humanistic curiosity."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam18_t3",
        "year": 2023,
        "exam_date": "Cambridge 18 Test 3",
        "source": "Cambridge IELTS 18 Academic Test 3 (2023)",
        "title": "Telecommuting and the Demise of Traditional Office Work (Cambridge 18)",
        "prompt": "Working from home has become widespread in many professions. Do the advantages of teleworking for workers and companies outweigh the potential disadvantages?",
        "type": "Advantages & Disadvantages (Cambridge 18)",
        "sub_type": "advantages_disadvantages",
        "topic_category": "Work & Technology",
        "keywords": ["telecommuting flexibility", "commuting stress reduction", "commercial real estate overheads", "social isolation", "blurred work-life boundaries"],
        "outline": {
            "body1": "Advantages: Saves hours of exhausting daily commuting; companies reduce office rent expenses; flexible working schedules support family commitments.",
            "body2": "Disadvantages: Domestic isolation, erosion of informal water-cooler collaboration, difficulty in training new graduates. Hybrid model represents the optimal balance."
        },
        "min_words": 250,
        "recommended_time": 40
    },
    {
        "id": "t2_cam18_t4",
        "year": 2023,
        "exam_date": "Cambridge 18 Test 4",
        "source": "Cambridge IELTS 18 Academic Test 4 (2023)",
        "title": "Severe Punishments for Environmental Violations (Cambridge 18)",
        "prompt": "Some people believe that heavy financial penalties and prison sentences are the most effective way to prevent businesses from polluting the natural environment. To what extent do you agree or disagree?",
        "type": "Agree / Disagree (Cambridge 18)",
        "sub_type": "opinion",
        "topic_category": "Environment & Law",
        "keywords": ["corporate penal liability", "punitive financial damages", "deterrent mechanism", "polluter-pays principle", "environmental compliance audits"],
        "outline": {
            "body1": "Why Punitive Deterrence is Effective: Trivial fines are treated by corporations as regular operational costs; criminalizing executive negligence forces boardrooms to prioritize environmental safeguards.",
            "body2": "Why Penalties Alone Are Insufficient (Nuanced View): Must be complemented by proactive tax incentives for adopting clean technologies and public transparency registers."
        },
        "min_words": 250,
        "recommended_time": 40
    }
]
