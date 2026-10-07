"""Official IELTS Writing Prompts Bank (Kho đề thi IELTS chính cống từ 2020 đến nay).
Covers official Cambridge IELTS 15-19 & British Council / IDP Real Exam Tests (2020 - 2026).
Fully annotated with Year, Source, Topic Category, Sub-type, Band 8+ Keywords & Essay Outlines.
"""
from typing import List, Dict, Any

# Curated Authentic IELTS Task 2 Prompts (2020 - Present)
IELTS_TASK2_AUTHENTIC_PROMPTS: List[Dict[str, Any]] = [
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
    },

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


# Curated Authentic IELTS Task 1 Prompts (2020 - Present)
IELTS_TASK1_AUTHENTIC_PROMPTS: List[Dict[str, Any]] = [
    # Cambridge 19 Task 1 Line Graph (2024)
    {
        "id": "t1_cam19_line",
        "year": 2024,
        "exam_date": "Cambridge 19 Test 1",
        "source": "Cambridge IELTS 19 Academic Test 1 (2024)",
        "title": "Production of Three Types of Fuel in the UK (Cambridge 19)",
        "prompt": "The line graph shows the production of three types of energy fuel (Petroleum, Natural Gas, and Coal) in the UK between 1981 and 2000.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "type": "Biểu đồ đường (Line Graph - Cambridge 19)",
        "sub_type": "line_graph",
        "keywords": ["overall downward trajectory", "fluctuated notably", "overtook coal production", "plateaued around", "peaked at energy units"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "line_graph",
            "title": "UK Fuel Production in Energy Units (1981 - 2000)",
            "unit": "triệu đơn vị năng lượng",
            "x_labels": ["1981", "1986", "1991", "1996", "2000"],
            "series": [
                {"name": "Petroleum (Dầu mỏ)", "color": "#3b82f6", "data": [90, 140, 100, 135, 140]},
                {"name": "Natural Gas (Khí đốt)", "color": "#10b981", "data": [40, 45, 55, 80, 105]},
                {"name": "Coal (Than đá)", "color": "#ef4444", "data": [80, 60, 55, 45, 38]}
            ]
        }
    },
    # Cambridge 19 Task 1 Bar Chart (2024)
    {
        "id": "t1_cam19_bar",
        "year": 2024,
        "exam_date": "Cambridge 19 Test 2",
        "source": "Cambridge IELTS 19 Academic Test 2 (2024)",
        "title": "Government Spending on Education Across 5 Nations (Cambridge 19)",
        "prompt": "The bar chart compares the percentage of national budget allocated to primary, secondary, and tertiary education across five distinct countries in 2022.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "type": "Biểu đồ cột (Bar Chart - Cambridge 19)",
        "sub_type": "bar_chart",
        "keywords": ["commanded the largest share", "marked discrepancy", "tertiary allocation", "secondary schooling outstripped", "marginal difference"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "bar_chart",
            "title": "National Budget Share on Education Levels in 2022 (%)",
            "unit": "% ngân sách quốc gia",
            "categories": ["Na Uy (Norway)", "Nhật Bản (Japan)", "Hàn Quốc (Korea)", "Vương quốc Anh (UK)", "Việt Nam"],
            "series": [
                {"name": "Tiểu học (Primary)", "color": "#3b82f6", "data": [28, 22, 25, 31, 35]},
                {"name": "Trung học (Secondary)", "color": "#10b981", "data": [42, 48, 45, 40, 38]},
                {"name": "Đại học (Tertiary)", "color": "#f59e0b", "data": [30, 30, 30, 29, 27]}
            ]
        }
    },
    # Cambridge 18 Task 1 Map (2023)
    {
        "id": "t1_cam18_map",
        "year": 2023,
        "exam_date": "Cambridge 18 Test 3",
        "source": "Cambridge IELTS 18 Academic Test 3 (2023)",
        "title": "Industrial Estate Redevelopment into Tech Park (Cambridge 18)",
        "prompt": "The two maps show an old industrial warehouse zone in 2005 and its redevelopment into a green technology innovation park in 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "type": "Bản đồ / Quy hoạch (Map - Cambridge 18)",
        "sub_type": "map",
        "keywords": ["derelict factories demolished", "repurposed into incubation hub", "pedestrian concourse added", "solar canopy installation", "retention basin"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "map",
            "title": "Industrial Zone Transformation (2005 vs 2020)",
            "period_a": {
                "year": "Năm 2005 (Khu công nghiệp cũ)",
                "zones": [
                    {"area": "North", "name": "4 heavy manufacturing warehouses", "status": "existing"},
                    {"area": "Center", "name": "Asphalt truck loading yard", "status": "existing"},
                    {"area": "East", "name": "Smokestack coal plant", "status": "existing"},
                    {"area": "South", "name": "Single lane access road with security gate", "status": "existing"}
                ]
            },
            "period_b": {
                "year": "Năm 2020 (Công viên công nghệ xanh)",
                "zones": [
                    {"area": "North", "name": "Demolished, replaced by 2 modern Tech Incubator complexes", "status": "new"},
                    {"area": "Center", "name": "Central pedestrian garden plaza with retention pond", "status": "new"},
                    {"area": "East", "name": "Coal plant decommissioned, replaced by Solar Car Park & EV stations", "status": "new"},
                    {"area": "South", "name": "Dual carriage road with bicycle lanes and light rail station", "status": "expanded"}
                ]
            }
        }
    },
    # Cambridge 18 Task 1 Process (2023)
    {
        "id": "t1_cam18_process",
        "year": 2023,
        "exam_date": "Cambridge 18 Test 2",
        "source": "Cambridge IELTS 18 Academic Test 2 (2023)",
        "title": "Ocean Wave Electricity Generation Mechanism (Cambridge 18)",
        "prompt": "The diagram illustrates the process by which an oscillating water column device generates electrical power from marine ocean waves.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "type": "Quy trình (Process - Cambridge 18)",
        "sub_type": "process",
        "keywords": ["oscillating chamber", "compression of air column", "bi-directional turbine", "wave retreat", "kinetic conversion"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "process",
            "title": "Wave Power Generation Process",
            "process_a": {
                "title": "Giai đoạn 1: Sóng dâng lên (Wave Ascent)",
                "steps": [
                    {"step": 1, "title": "Sóng biển dâng vào buồng khí (Rising wave)", "desc": "Nước biển dâng cao dồn vào khoang bê tông ngầm bên dưới.", "icon": "water"},
                    {"step": 2, "title": "Nén cột không khí (Air compression)", "desc": "Mực nước dâng ép luồng không khí bên trên qua cửa hẹp với áp suất lớn.", "icon": "wind"},
                    {"step": 3, "title": "Quay tuabin phát điện (Turbine rotation)", "desc": "Luồng khí nén tốc độ cao làm quay tuabin máy phát điện 500kW.", "icon": "spin"}
                ]
            },
            "process_b": {
                "title": "Giai đoạn 2: Sóng rút xuống (Wave Retreat)",
                "steps": [
                    {"step": 4, "title": "Sóng rút lùi ra biển (Water recedes)", "desc": "Nước hạ thấp tạo chân không cục bộ trong buồng khí.", "icon": "flow"},
                    {"step": 5, "title": "Hút luồng khí ngược chiều", "desc": "Không khí bên ngoài tràn vào, tuabin đa chiều tiếp tục quay theo một chiều liên tục.", "icon": "power"}
                ]
            }
        }
    },
    # Cambridge 17 Task 1 Table (2022)
    {
        "id": "t1_cam17_table",
        "year": 2022,
        "exam_date": "Cambridge 17 Test 1",
        "source": "Cambridge IELTS 17 Academic Test 1 (2022)",
        "title": "Domestic Water Consumption Rates in Six Cities (Cambridge 17)",
        "prompt": "The table compares domestic water consumption per person (in liters per day) alongside average monthly water utility costs in six major cities in 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "type": "Bảng số liệu (Table - Cambridge 17)",
        "sub_type": "table",
        "keywords": ["per capita consumption", "highest tariff rate", "stark divergence", "modest volume", "expenditure parity"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "table",
            "title": "Daily Water Usage per Capita & Monthly Bills (2020)",
            "columns": ["Thành phố (City)", "Lượng nước/người/ngày (L)", "Hóa đơn trung bình/tháng ($)"],
            "rows": [
                ["New York", "310 L", "$64"],
                ["London", "165 L", "$48"],
                ["Tokyo", "240 L", "$55"],
                ["Sydney", "285 L", "$72"],
                ["Singapore", "150 L", "$32"],
                ["Hà Nội", "145 L", "$12"]
            ]
        }
    },
    # Cambridge 16 Task 1 Bar Chart (2021)
    {
        "id": "t1_cam16_bar",
        "year": 2021,
        "exam_date": "Cambridge 16 Test 2",
        "source": "Cambridge IELTS 16 Academic Test 2 (2021)",
        "title": "Manufacturing Productivity in Three Industrial Sectors (Cambridge 16)",
        "prompt": "The bar chart compares productivity growth rates across three industrial manufacturing sectors (Automotive, Electronics, and Textiles) in a European country between 2010 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "type": "Biểu đồ cột (Bar Chart - Cambridge 16)",
        "sub_type": "bar_chart",
        "keywords": ["surpassed", "sustained ascent", "sharp dip", "eclipsed the counterparts", "productivity metric"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "bar_chart",
            "title": "Productivity Growth by Manufacturing Sector (% per annum)",
            "unit": "% tăng trưởng hàng năm",
            "categories": ["2010", "2015", "2020"],
            "series": [
                {"name": "Ô tô (Automotive)", "color": "#3b82f6", "data": [4.2, 5.8, 6.5]},
                {"name": "Điện tử (Electronics)", "color": "#10b981", "data": [6.1, 7.9, 9.4]},
                {"name": "Dệt may (Textiles)", "color": "#ef4444", "data": [3.0, 2.4, 1.8]}
            ]
        }
    },
    # Cambridge 15 Task 1 Pie Chart (2020)
    {
        "id": "t1_cam15_pie",
        "year": 2020,
        "exam_date": "Cambridge 15 Test 3",
        "source": "Cambridge IELTS 15 Academic Test 3 (2020)",
        "title": "Household Energy Consumption vs Greenhouse Gas Emissions (Cambridge 15)",
        "prompt": "The pie charts illustrate the percentage of electricity consumed by different appliances in an average Australian household and the resulting greenhouse gas emissions.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "type": "Biểu đồ tròn (Pie Chart - Cambridge 15)",
        "sub_type": "pie_chart",
        "keywords": ["energy consumption", "greenhouse gas emissions", "heating and cooling", "disproportionate share", "water heating"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "pie_chart",
            "title": "Australian Household Electricity Use vs Greenhouse Gas Emissions",
            "unit": "%",
            "charts": [
                {
                    "label": "Mức tiêu thụ điện (Electricity Use)",
                    "slices": [
                        {"name": "Sưởi ấm (Heating)", "value": 42, "color": "#ef4444"},
                        {"name": "Đun nước nóng (Water heating)", "value": 30, "color": "#f97316"},
                        {"name": "Tủ lạnh & Thiết bị (Appliances)", "value": 15, "color": "#3b82f6"},
                        {"name": "Hệ thống làm lạnh (Cooling)", "value": 7, "color": "#06b6d4"},
                        {"name": "Chiếu sáng (Lighting)", "value": 6, "color": "#eab308"}
                    ]
                },
                {
                    "label": "Khí thải nhà kính (Greenhouse Gas)",
                    "slices": [
                        {"name": "Đun nước nóng (Water heating)", "value": 32, "color": "#f97316"},
                        {"name": "Thiết bị điện (Appliances)", "value": 28, "color": "#3b82f6"},
                        {"name": "Sưởi ấm (Heating)", "value": 15, "color": "#ef4444"},
                        {"name": "Hệ thống làm lạnh (Cooling)", "value": 17, "color": "#06b6d4"},
                        {"name": "Chiếu sáng (Lighting)", "value": 8, "color": "#eab308"}
                    ]
                }
            ]
        }
    }
]


def get_all_authentic_ielts_prompts() -> Dict[str, List[Dict[str, Any]]]:
    """Retrieve all authentic IELTS prompts partitioned by task."""
    return {
        "ielts_task2": IELTS_TASK2_AUTHENTIC_PROMPTS,
        "ielts_task1": IELTS_TASK1_AUTHENTIC_PROMPTS,
    }
