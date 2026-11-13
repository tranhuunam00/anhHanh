/**
 * Cambridge IELTS 20 - Test 1 Reading Explanations & Evidence
 * Comprehensive breakdown for all 40 questions across Passages 1, 2, and 3.
 * Adheres to <= 500 lines rule.
 */

export const cam20Test1ReadingExplanations = {
  // --- PASSAGE 1: The kākāpō (Questions 1 - 13) ---
  1: {
    qNum: 1,
    answer: "FALSE",
    location: "Đoạn 1, Dòng 5-6",
    evidence: "It is the world's only flightless parrot, and is also possibly one of the world's longest-living birds, with a reported lifespan of up to 100 years.",
    explanation: "Bài đọc khẳng định kākāpō là 'loài vẹt DUY NHẤT trên thế giới không biết bay' (the world's only flightless parrot). Điều này mâu thuẫn trực tiếp với nhận định trong câu hỏi rằng có những loài vẹt khác cũng không biết bay ('other parrots that share... inability to fly'), do đó đáp án là FALSE.",
    keywords: [
      { question: "inability to fly", passage: "flightless" },
      { question: "other parrots share", passage: "the world's only flightless parrot" }
    ]
  },
  2: {
    qNum: 2,
    answer: "FALSE",
    location: "Đoạn 1, Dòng 10-11",
    evidence: "Kākāpō breed in summer and autumn, but only in years when food is plentiful.",
    explanation: "Kākāpō chỉ sinh sản vào mùa hè và mùa thu trong những năm nguồn thức ăn dồi dào ('only in years when food is plentiful'), chứ không phải sinh sản hàng năm ('every year'). Do đó đáp án là FALSE.",
    keywords: [
      { question: "produce chicks", passage: "breed" },
      { question: "every year", passage: "only in years when food is plentiful" }
    ]
  },
  3: {
    qNum: 3,
    answer: "FALSE",
    location: "Đoạn 1, Dòng 11-12",
    evidence: "Males play no part in incubation or chick-rearing - females alone incubate eggs and feed the chicks.",
    explanation: "Chim trống hoàn toàn không tham gia vào việc ấp trứng hay nuôi con ('males play no part in incubation or chick-rearing - females alone... feed the chicks'). Nhận định cho rằng chim trống mang thức ăn về tổ cho chim mái là sai sự thật, do đó đáp án là FALSE.",
    keywords: [
      { question: "bring food back to nesting females", passage: "females alone incubate eggs and feed the chicks" },
      { question: "male kākāpō help at nest", passage: "males play no part in incubation or chick-rearing" }
    ]
  },
  4: {
    qNum: 4,
    answer: "NOT GIVEN",
    location: "Đoạn 2, Dòng 3-5",
    evidence: "For the early settlers, the flightless kākāpō was easy prey. They ate its meat and used its feathers to make soft cloaks. With them came the Polynesian dog and rat, which also preyed on kākāpō.",
    explanation: "Bài đọc cho biết cả người định cư Polynesia và chuột Polynesia đều săn bắt kākāpō, nhưng hoàn toàn không có thông tin so sánh xem chuột Polynesia có phải là mối đe dọa lớn hơn người định cư hay không ('a greater threat'). Do đó đáp án là NOT GIVEN.",
    keywords: [
      { question: "a greater threat than", passage: "không có thông tin so sánh mức độ nguy hiểm (Not Given)" },
      { question: "hunted by settlers and rats", passage: "easy prey... ate meat... rat also preyed" }
    ]
  },
  5: {
    qNum: 5,
    answer: "TRUE",
    location: "Đoạn 5, Dòng 1-3",
    evidence: "Unfortunately, predation by feral cats on Rakiura Island led to a rapid decline in kākāpō numbers. As a result, during 1980-97, the surviving population was evacuated to three island sanctuaries...",
    explanation: "Việc mèo hoang săn bắt trên đảo Rakiura khiến số lượng kākāpō sụt giảm nghiêm trọng, vì vậy quần thể sống sót đã được sơ tán tới 3 khu bảo tồn trên các hòn đảo khác. Thông tin này trùng khớp 100% với câu hỏi, do đó đáp án là TRUE.",
    keywords: [
      { question: "transferred to new locations", passage: "surviving population was evacuated to three island sanctuaries" },
      { question: "at risk from feral cats", passage: "predation by feral cats... led to rapid decline" }
    ]
  },
  6: {
    qNum: 6,
    answer: "TRUE",
    location: "Đoạn 5, Dòng 14-16",
    evidence: "This involved moving the birds between islands, supplementary feeding of adults and rescuing and hand-raising any failing chicks.",
    explanation: "Kế hoạch phục hồi bao gồm việc giải cứu và tự tay chăm sóc nuôi dưỡng những chim non gặp khó khăn ('rescuing and hand-raising any failing chicks' tương đương hoàn toàn với 'caring for struggling young birds'). Nhờ đó số lượng kākāpō đã tăng lên, do đó đáp án là TRUE.",
    keywords: [
      { question: "caring for young birds", passage: "hand-raising any chicks" },
      { question: "struggling", passage: "failing" }
    ]
  },
  7: {
    qNum: 7,
    answer: "bulbs",
    location: "Đoạn 1, Dòng 9-10",
    evidence: "They are entirely vegetarian, with their diet including the leaves, roots and bark of trees as well as bulbs, and fern fronds.",
    explanation: "Chế độ ăn của kākāpō gồm lá, rễ, vỏ cây, củ (bulbs) và lá dương xỉ (fern fronds). Từ cần điền là 'bulbs'.",
    keywords: [
      { question: "diet consists of fern fronds, parts of tree and [bulbs]", passage: "diet including leaves, roots, bark... bulbs, and fern fronds" }
    ]
  },
  8: {
    qNum: 8,
    answer: "soil",
    location: "Đoạn 1, Dòng 12-13",
    evidence: "The 1-4 eggs are laid in soil, which is repeatedly turned over before and during incubation.",
    explanation: "Trứng của kākāpō được đẻ trong đất (soil). Từ cần điền là 'soil'.",
    keywords: [
      { question: "nests are created in [soil] where eggs are laid", passage: "eggs are laid in soil" }
    ]
  },
  9: {
    qNum: 9,
    answer: "feathers",
    location: "Đoạn 2, Dòng 4",
    evidence: "They ate its meat and used its feathers to make soft cloaks.",
    explanation: "Người định cư Polynesia sử dụng lông vũ (feathers) của kākāpō để may áo choàng mềm (soft cloaks $\\leftrightarrow$ clothes). Từ cần điền là 'feathers'.",
    keywords: [
      { question: "the [feathers] were used to make clothes", passage: "used its feathers to make soft cloaks" }
    ]
  },
  10: {
    qNum: 10,
    answer: "deer",
    location: "Đoạn 2, Dòng 8-9",
    evidence: "...and introduced species such as deer depleted the remaining forests of food.",
    explanation: "Các loài du nhập như hươu nai (deer) đã làm cạn kiệt nguồn thức ăn trong rừng của kākāpō. Từ cần điền là 'deer'.",
    keywords: [
      { question: "[deer] were an animal which ate food sources", passage: "species such as deer depleted the remaining forests of food" }
    ]
  },
  11: {
    qNum: 11,
    answer: "1980",
    location: "Đoạn 4, Dòng 5-6",
    evidence: "There were about 200 individuals, and in 1980 it was confirmed females were also present.",
    explanation: "Năm 1980, sự xuất hiện của các cá thể kākāpō cái trên đảo Rakiura đã được xác nhận chính thức. Con số năm cần điền là '1980'.",
    keywords: [
      { question: "sighting of female kākāpō reported in year [1980]", passage: "in 1980 it was confirmed females were also present" }
    ]
  },
  12: {
    qNum: 12,
    answer: "funding",
    location: "Đoạn 5, Dòng 9-11",
    evidence: "In 1996, a new Recovery Plan was launched, together with a specialist advisory group called the Kākāpō Scientific and Technical Advisory Committee and a higher amount of funding.",
    explanation: "Kế hoạch Phục hồi đi kèm với một lượng ngân sách tài trợ cao hơn ('a higher amount of funding' $\\leftrightarrow$ 'an increase in funding'). Từ cần điền là 'funding'.",
    keywords: [
      { question: "included an increase in [funding]", passage: "a higher amount of funding" }
    ]
  },
  13: {
    qNum: 13,
    answer: "stakeholders",
    location: "Đoạn 5, Dòng 21-22",
    evidence: "...and ensure stakeholders continue to be fully engaged in the preservation of the species.",
    explanation: "Một mục tiêu cốt lõi hiện nay là đảm bảo các bên liên quan (stakeholders) tiếp tục tham gia đầy đủ vào việc bảo tồn loài. Từ cần điền là 'stakeholders'.",
    keywords: [
      { question: "maintain the involvement of [stakeholders]", passage: "ensure stakeholders continue to be fully engaged" }
    ]
  },

  // --- PASSAGE 2: Bring elms to Britain (Questions 14 - 26) ---
  14: {
    qNum: 14,
    answer: "C",
    location: "Đoạn C, Dòng 9-12",
    evidence: "Nevertheless, opportunities are limited as the number of these mature survivors is relatively small. 'What are the reasons for their survival?' asks Russell. 'Avoidance, tolerance, resistance? We don't know where the balance lies between the three...'",
    explanation: "Đoạn C đề cập đến khó khăn trong nghiên cứu do số lượng cây du cổ thụ sống sót quá ít ỏi ('number of these mature survivors is relatively small').",
    keywords: [
      { question: "research problems from only a few surviving large elms", passage: "opportunities are limited as the number of mature survivors is relatively small" }
    ]
  },
  15: {
    qNum: 15,
    answer: "G",
    location: "Đoạn G, Dòng 4-9",
    evidence: "For her, the environmental case for reintroducing elm is strong... Others are more wary. 'On the face of it, it seems like a good idea,' says Elliot. The problem, he suggests, is that, 'You're replacing a native species with a horticultural analogue...'",
    explanation: "Đoạn G chỉ ra sự bất đồng quan điểm giữa Russell (ủng hộ việc tái du nhập cây lai để phục hồi động vật hoang dã) và Elliot (lo ngại về việc thay thế loài bản địa và nguy cơ lây truyền bệnh mới).",
    keywords: [
      { question: "difference of opinion about reintroducing elms", passage: "For her, the environmental case is strong... Others are more wary" }
    ]
  },
  16: {
    qNum: 16,
    answer: "B",
    location: "Đoạn B, Dòng 3-6",
    evidence: "...in the '70s a second epidemic was triggered by shipments of elm from Canada. The wood came in the form of logs destined for boat building and its intact bark was perfect for the elm bark beetles...",
    explanation: "Đoạn B mô tả dịch bệnh thứ hai bùng phát do các chuyến tàu chở gỗ cây du từ Canada cập cảng nước Anh, mang theo bọ cánh cứng mang nấm độc.",
    keywords: [
      { question: "how Dutch elm disease was brought into Britain", passage: "second epidemic was triggered by shipments of elm from Canada" }
    ]
  },
  17: {
    qNum: 17,
    answer: "E",
    location: "Đoạn E, Dòng 5-7",
    evidence: "Local factors appear to have contributed to their survival. Strong winds from the sea make it difficult for the determined elm bark beetle to attack this coastal city's elm population.",
    explanation: "Đoạn E mô tả điều kiện gió biển mạnh tại thành phố ven biển Brighton đã ngăn cản bọ cánh cứng tấn công, giúp cây du ở đây thoát khỏi dịch bệnh.",
    keywords: [
      { question: "conditions that enabled a location to escape disease", passage: "Strong winds from the sea make it difficult for the elm bark beetle to attack this coastal city" }
    ]
  },
  18: {
    qNum: 18,
    answer: "C",
    location: "Đoạn C, Dòng 4-7",
    evidence: "Once the trunk of the elm reaches 10-15 centimetres or so in diameter, it becomes a perfect size for beetles to lay eggs and for the fungus to take hold.",
    explanation: "Đoạn C chỉ rõ giai đoạn cây non trở nên dễ bị nhiễm bệnh là khi thân cây đạt đường kính khoảng 10-15 cm, tạo điều kiện lý tưởng cho bọ đẻ trứng.",
    keywords: [
      { question: "stage at which young elms become vulnerable", passage: "Once the trunk reaches 10-15 centimetres... perfect size for beetles to lay eggs" }
    ]
  },
  19: {
    qNum: 19,
    answer: "B",
    location: "Đoạn F, Dòng 6-8",
    evidence: "'The effects are very quick,' says Russell. 'You return in four to six weeks and trees that are resistant show no symptoms, whereas those that are susceptible show leaf loss and may even have died completely.'",
    explanation: "Karen Russell khẳng định thiệt hại diễn ra rất nhanh ('effects are very quick'), cây nhiễm bệnh rụng lá và chết chỉ sau 4 đến 6 tuần.",
    keywords: [
      { question: "damage rapidly becomes visible", passage: "effects are very quick... four to six weeks... died completely" }
    ]
  },
  20: {
    qNum: 20,
    answer: "A",
    location: "Đoạn G, Dòng 10-12",
    evidence: "'Sometimes the best thing you can do is just give nature time to recover ... over time, you might get resistance,' says Elliot.",
    explanation: "Matt Elliot cho rằng cách tốt nhất là để tự nhiên có thời gian tự phục hồi, chờ xem các cây sống sót có tự phát triển tính kháng bệnh hay không.",
    keywords: [
      { question: "better to wait and see if mature elms continue to flourish", passage: "just give nature time to recover ... over time, you might get resistance" }
    ]
  },
  21: {
    qNum: 21,
    answer: "B",
    location: "Đoạn C, Dòng 12-14",
    evidence: "'What are the reasons for their survival?' asks Russell. 'Avoidance, tolerance, resistance? ... I don't see how it can be entirely down to luck.'",
    explanation: "Karen Russell cho rằng sự sống sót của các cây cổ thụ không thể chỉ do may mắn mà chắc chắn phải có lý do/cơ chế sinh học cụ thể giải thích cho điều đó.",
    keywords: [
      { question: "must be an explanation for the survival", passage: "reasons for their survival... I don't see how it can be entirely down to luck" }
    ]
  },
  22: {
    qNum: 22,
    answer: "C",
    location: "Đoạn E, Dòng 8-9",
    evidence: "'The beetles can just march in if we're not careful, as the threat is right on our doorstep,' says Bourne.",
    explanation: "Peter Bourne cảnh báo bọ cánh cứng mang mầm bệnh có thể tiến vào bất cứ lúc nào vì mối đe dọa đang ở ngay trước cửa ('right on our doorstep').",
    keywords: [
      { question: "insects carrying disease", passage: "elm bark beetles" },
      { question: "not very far away", passage: "threat is right on our doorstep" }
    ]
  },
  23: {
    qNum: 23,
    answer: "A",
    location: "Đoạn A, Dòng 6-9",
    evidence: "'You look at old photographs from the 1960s and it's only then that you realise the impact [elms had] ... They were significant, large trees ... then they were gone,' says Matt Elliot.",
    explanation: "Matt Elliot chia sẻ rằng chỉ khi nhìn vào các bức ảnh cũ từ thập niên 1960 ta mới thực sự nhận thức được sự hiện diện nổi bật của loài cây này trước khi dịch bệnh xóa sổ chúng.",
    keywords: [
      { question: "understand the effect", passage: "realise the impact" },
      { question: "see evidence of how prominent it was", passage: "look at old photographs... realise they were significant, large trees" }
    ]
  },
  24: {
    qNum: 24,
    answer: "oak",
    location: "Đoạn D, Dòng 1-2",
    evidence: "For centuries, elm ran a close second to oak as the hardwood tree of choice in Britain...",
    explanation: "Trong nhiều thế kỷ, cây du đứng thứ hai sau cây sồi ('ran a close second to oak'), nghĩa là sồi (oak) là loài duy nhất được ưa chuộng hơn du. Từ cần điền là 'oak'.",
    keywords: [
      { question: "only tree more popular than elm", passage: "elm ran a close second to oak" },
      { question: "tree of choice", passage: "most favored / popular timber" }
    ]
  },
  25: {
    qNum: 25,
    answer: "flooring",
    location: "Đoạn D, Dòng 5-6",
    evidence: "In the 18th century, it was planted more widely and its wood was used for items such as storage crates and flooring.",
    explanation: "Vào thế kỷ 18, gỗ du được dùng làm thùng chứa (crates $\\leftrightarrow$ boxes) và ván lót sàn (flooring). Từ cần điền là 'flooring'.",
    keywords: [
      { question: "boxes", passage: "storage crates" },
      { question: "provide wood for", passage: "its wood was used for items such as" }
    ]
  },
  26: {
    qNum: 26,
    answer: "keel",
    location: "Đoạn D, Dòng 7-8",
    evidence: "It was also suitable for items that experienced high levels of impact and was used to build the keel of the 19th-century sailing ship Cutty Sark...",
    explanation: "Gỗ du chịu lực va đập tốt nên được sử dụng để đóng sống tàu (keel) của con tàu Cutty Sark. Từ cần điền là 'keel'.",
    keywords: [
      { question: "was constructed from elm", passage: "used to build the keel" },
      { question: "high levels of impact", passage: "withstand heavy stress / forces" }
    ]
  },

  // --- PASSAGE 3: How stress affects our judgement (Questions 27 - 40) ---
  27: {
    qNum: 27,
    answer: "C",
    location: "Đoạn 1, Dòng 1-3",
    evidence: "Some of the most important decisions of our lives occur while we're feeling stressed and anxious. From medical decisions to financial and professional ones, we are all sometimes required to weigh up information under stressful conditions.",
    explanation: "Tác giả mở đầu bài viết bằng việc nhắc đến một thách thức mà mọi người đều phải đối mặt: cân nhắc và đưa ra các quyết định quan trọng trong trạng thái căng thẳng.",
    keywords: [
      { question: "mentioning a challenge faced by everyone", passage: "we are all sometimes required to weigh up information under stressful conditions" }
    ]
  },
  28: {
    qNum: 28,
    answer: "A",
    location: "Đoạn 2, Dòng 4-6",
    evidence: "These ups and downs presented the perfect setting for an experiment on how people's ability to use information changes when they feel under pressure.",
    explanation: "Sự thay đổi thất thường giữa những ngày thảnh thơi và những ngày căng thẳng tạo nên bối cảnh hoàn hảo để nghiên cứu tâm lý lính cứu hỏa.",
    keywords: [
      { question: "regular changes of stress levels make them ideal study subjects", passage: "These ups and downs presented the perfect setting for an experiment" }
    ]
  },
  29: {
    qNum: 29,
    answer: "D",
    location: "Đoạn 4, Dòng 1-4",
    evidence: "This is how we arrived at these results. We asked the firefighters to estimate their likelihood of experiencing 40 different adverse events in their life... We then gave them either good news... or bad news... and asked them to provide new estimates.",
    explanation: "Đoạn 4 giải thích từng bước cách thức tiến hành thí nghiệm (describing their methodology).",
    keywords: [
      { question: "describing their methodology", passage: "This is how we arrived at these results. We asked the firefighters to... We then gave them..." }
    ]
  },
  30: {
    qNum: 30,
    answer: "C",
    location: "Đoạn 7, Dòng 1-3",
    evidence: "When we experience stressful events, a physiological change is triggered that causes us to take in warnings and focus on what might go wrong. Brain imaging reveals that this 'switch' is related to a sudden boost in a neural signal...",
    explanation: "Cơ chế 'công tắc não bộ' kích thích sự nhạy bén và tập trung cao độ vào các tín hiệu cảnh báo nguy cơ đe dọa bên ngoài (heightened sensitivity to external threats).",
    keywords: [
      { question: "heightened sensitivity to indications of external threats", passage: "causes us to take in warnings and focus on what might go wrong" }
    ]
  },
  31: {
    qNum: 31,
    answer: "B",
    location: "Đoạn 4, Dòng 4-6",
    evidence: "People are normally quite optimistic - they will ignore bad news and embrace the good. This is what happened when the firefighters were relaxed...",
    explanation: "Khi thư thái, lính cứu hỏa có xu hướng phớt lờ các tin xấu ('ignore bad news' $\\leftrightarrow$ 'took relatively little notice of bad news').",
    keywords: [
      { question: "when relaxed, usually [took relatively little notice of bad news]", passage: "quite optimistic - they will ignore bad news... when the firefighters were relaxed" }
    ]
  },
  32: {
    qNum: 32,
    answer: "G",
    location: "Đoạn 5, Dòng 1-3",
    evidence: "Under these conditions, they became hyper-vigilant to bad news, even when it had nothing to do with their job... and altered their beliefs in response.",
    explanation: "Khi căng thẳng, họ trở nên quá cảnh giác và cho rằng khả năng mình gặp phải điều tồi tệ là cao hơn trước đó.",
    keywords: [
      { question: "when stressed, [thought it more likely they would experience something bad]", passage: "hyper-vigilant to bad news... altered their beliefs in response" }
    ]
  },
  33: {
    qNum: 33,
    answer: "F",
    location: "Đoạn 5, Dòng 3-5",
    evidence: "In contrast, stress didn't change how they responded to good news (such as learning that the likelihood of card fraud was lower than they'd thought).",
    explanation: "Dù trong hoàn cảnh nào (thư thái hay căng thẳng), phản ứng của họ với tin tốt vẫn không đổi ('behaved in a similar manner, regardless of circumstances').",
    keywords: [
      { question: "when told good news, always [behaved in a similar manner]", passage: "stress didn't change how they responded to good news" }
    ]
  },
  34: {
    qNum: 34,
    answer: "E",
    location: "Đoạn 6, Dòng 2-4",
    evidence: "...students who were told they had to give a surprise public speech, which would be judged by a panel, recorded and posted online. Sure enough, their cortisol levels spiked, their heart rates went up...",
    explanation: "Chỉ số cortisol và nhịp tim của sinh viên tăng vọt khi họ bị đặt vào tình huống căng thẳng là phải thuyết trình bất ngờ trước hội đồng.",
    keywords: [
      { question: "cortisol levels and heart rates were affected when researchers [put them in a stressful situation]", passage: "surprise public speech judged by panel... cortisol levels spiked, heart rates went up" }
    ]
  },
  35: {
    qNum: 35,
    answer: "D",
    location: "Đoạn 6, Dòng 4-5",
    evidence: "...and they suddenly became better at processing unrelated, yet alarming, information about rates of disease and violence.",
    explanation: "Trong cả hai thí nghiệm, thông tin tiêu cực được xử lý tốt hơn rõ rệt khi đối tượng tham gia cảm thấy căng thẳng ('were feeling under stress').",
    keywords: [
      { question: "negative information was processed better when subjects [were feeling under stress]", passage: "became better at processing unrelated yet alarming information" }
    ]
  },
  36: {
    qNum: 36,
    answer: "YES",
    location: "Đoạn 8, Dòng 3-6",
    evidence: "Studies show that if we observe positive feeds on social media... we are more likely to post uplifting messages ourselves. If we observe negative posts... we will in turn create more negative posts.",
    explanation: "Bài đọc nêu rõ nếu thấy bài tích cực thì đăng bài tích cực, thấy phàn nàn tiêu cực thì sẽ đăng bài tiêu cực, đúng với nhận định giọng điệu bài đăng phản ánh nội dung trên bảng tin. Đáp án là YES.",
    keywords: [
      { question: "tone of content reflects nature of posts in feeds", passage: "observe positive feeds... post uplifting messages... observe negative posts... create more negative posts" }
    ]
  },
  37: {
    qNum: 37,
    answer: "NOT GIVEN",
    location: "Đoạn 9, Dòng 2-3",
    evidence: "Repeatedly checking your phone, according to a survey conducted by the American Psychological Association, is related to stress.",
    explanation: "Bài đọc có nhắc điện thoại liên quan đến căng thẳng nhưng hoàn toàn không so sánh tác động của điện thoại với các thiết bị điện tử khác ('greater impact than other devices'). Đáp án là NOT GIVEN.",
    keywords: [
      { question: "phones have greater impact than other devices", passage: "Repeatedly checking your phone... is related to stress" }
    ]
  },
  38: {
    qNum: 38,
    answer: "NO",
    location: "Đoạn 10, Dòng 5-7",
    evidence: "...which temporarily enhances the likelihood that people will take in negative reports, which increases stress further.",
    explanation: "Căng thẳng làm tăng khả năng con người tiếp nhận các báo cáo tiêu cực ('enhances the likelihood that people will take in negative reports'), trái ngược hoàn toàn với nhận định 'càng đọc càng ít tiếp nhận được' ('less able to take the information in'). Đáp án là NO.",
    keywords: [
      { question: "less able to take the information in", passage: "enhances the likelihood that people will take in negative reports" }
    ]
  },
  39: {
    qNum: 39,
    answer: "YES",
    location: "Đoạn 10, Dòng 7-8",
    evidence: "As a result, trips are cancelled, even if the disaster took place across the globe; stocks are sold, even when holding on is the best thing to do.",
    explanation: "Căng thẳng từ mạng xã hội dẫn đến những phản ứng thái quá không cần thiết như hủy chuyến đi dù thảm họa ở nửa kia bán cầu, hoặc bán tháo cổ phiếu không đáng có ('unnecessary precautions'). Đáp án là YES.",
    keywords: [
      { question: "lead us to take unnecessary precautions", passage: "trips are cancelled even if disaster took place across globe; stocks are sold" }
    ]
  },
  40: {
    qNum: 40,
    answer: "YES",
    location: "Đoạn 11, Dòng 1-4",
    evidence: "The good news, however, is that positive emotions, such as hope, are contagious too, and are powerful in inducing people to act to find solutions. Being aware of the close relationship... can help us frame our messages more effectively...",
    explanation: "Cảm xúc tích cực cũng có tính lây lan và truyền cảm hứng giải quyết vấn đề, chứng minh xu hướng bị ảnh hưởng tâm lý có thể được ứng dụng theo cách tích cực. Đáp án là YES.",
    keywords: [
      { question: "affected by other people's moods can be used in a positive way", passage: "positive emotions are contagious too... inducing people to act to find solutions" }
    ]
  }
};

