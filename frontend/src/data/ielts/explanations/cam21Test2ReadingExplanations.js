/**
 * Cambridge IELTS 21 - Test 2 Reading Explanations & Evidence
 * Comprehensive breakdown for all 40 questions across Passages 1, 2, and 3.
 * Adheres to <= 500 lines rule.
 */

export const cam21Test2ReadingExplanations = {
  // Passage 1: Do animals dream? (Questions 1 - 13)
  1: {
    qNum: 1,
    answer: "rats",
    location: "Đoạn 2, Dòng 1-3",
    evidence: "researchers compared the brain patterns of rats running through a maze when awake with their brain patterns during REM sleep. They found the patterns were very similar and concluded that the sleeping rats were dreaming about going through the maze.",
    explanation: "Bài đọc nêu rõ các nhà nghiên cứu đã so sánh hoạt động não bộ của loài chuột (rats) khi chạy mê cung và khi ngủ REM, nhận thấy mô hình sóng não tương đồng và kết luận chuột có giấc mơ.",
    keywords: [
      { question: "similar brain patterns observed", passage: "brain patterns were very similar" },
      { question: "active and sleeping", passage: "when awake with brain patterns during REM sleep" }
    ]
  },
  2: {
    qNum: 2,
    answer: "visual",
    location: "Đoạn 3, Dòng 4-6",
    evidence: "REM sleep activity was high in brain regions involved in processing visual information, especially images related to physical activities such as flying...",
    explanation: "Khi chim bồ câu ngủ, vùng não xử lý thông tin thị giác (visual information) hoạt động mạnh mẽ, tương ứng với vị trí cần điền tính từ bổ nghĩa cho 'input'.",
    keywords: [
      { question: "parts of the brain that deal with [visual] input", passage: "brain regions involved in processing visual information" }
    ]
  },
  3: {
    qNum: 3,
    answer: "half",
    location: "Đoạn 4, Dòng 3-5",
    evidence: "These include whales and dolphins, which do not shut down their entire brain when they sleep, but only half of it, keeping the rest awake.",
    explanation: "Cá voi và cá heo không tắt toàn bộ não mà chỉ tắt một nửa não bộ (half of it) khi ngủ, nửa còn lại vẫn thức.",
    keywords: [
      { question: "still have [half] their brain awake", passage: "not shut down their entire brain... but only half of it, keeping the rest awake" }
    ]
  },
  4: {
    qNum: 4,
    answer: "temperature",
    location: "Đoạn 4, Dòng 7-8",
    evidence: "It's thought that they don't experience REM sleep because during REM sleep animals are more vulnerable to extremes of temperature.",
    explanation: "Động vật khi ngủ REM dễ bị thương tổn trước các biến động cực đoan của nhiệt độ (temperature), vì vậy cá voi và cá heo không trải qua giấc ngủ REM.",
    keywords: [
      { question: "sensitivity to [temperature]", passage: "vulnerable to extremes of temperature" }
    ]
  },
  5: {
    qNum: 5,
    answer: "vivid",
    location: "Đoạn 4, Dòng 5-6",
    evidence: "They also show no sign of REM sleep, suggesting that they may only experience non-REM dreams, which are less vivid.",
    explanation: "Bài đọc cho biết giấc mơ non-REM thì 'less vivid' (ít sống động hơn), do đó giấc mơ của chúng 'probably not very vivid'.",
    keywords: [
      { question: "not very [vivid]", passage: "less vivid" }
    ]
  },
  6: {
    qNum: 6,
    answer: "TRUE",
    location: "Đoạn 5, Dòng 2-4",
    evidence: "Growing evidence from birds and mammals suggests that REM sleep and dreaming are important for forming memories and learning. It is believed that when events are replayed in dreams, this helps to integrate memories into longer-term storage.",
    explanation: "Việc tái hiện các sự kiện quá khứ trong giấc mơ giúp tích hợp ký ức vào bộ nhớ dài hạn (lasting memories) -> Thông tin hoàn toàn trùng khớp với đề bài.",
    keywords: [
      { question: "create lasting memories", passage: "integrate memories into longer-term storage" },
      { question: "past experiences", passage: "when events are replayed" }
    ]
  },
  7: {
    qNum: 7,
    answer: "FALSE",
    location: "Đoạn 6, Dòng 2-4",
    evidence: "We are quick to interpret the twitching limbs and quiet barks of sleeping dogs, but the truth is that we don't know if there is an internal experience of chasing rabbits that comes along with that.",
    explanation: "Tác giả khẳng định ta chưa thể biết chó đang mơ thấy gì (we don't know if there is an internal experience...), mâu thuẫn trực tiếp với nhận định trong câu hỏi 'It is now possible to tell'.",
    keywords: [
      { question: "It is now possible to tell what type of dream a dog is having", passage: "the truth is that we don't know if there is an internal experience" }
    ]
  },
  8: {
    qNum: 8,
    answer: "NOT GIVEN",
    location: "Đoạn 7, Dòng 1-3",
    evidence: "In 2019, while making a documentary, David Scheel of Alaska Pacific University in the USA housed an octopus named Heidi in a tank in his living room.",
    explanation: "Bài đọc chỉ đề cập Scheel làm phim tài liệu quan sát bạch tuộc Heidi trong phòng khách, hoàn toàn KHÔNG có thông tin nói bộ phim có ảnh hưởng (influential) đến các nghiên cứu khác hay không.",
    keywords: [
      { question: "documentary was influential on other research", passage: "Not mentioned in the text" }
    ]
  },
  9: {
    qNum: 9,
    answer: "FALSE",
    location: "Đoạn 8, Dòng 1-3",
    evidence: "Costello, as the octopus was called, thrashed around, extended his mantle as if trying to make himself look bigger, and squirted ink as though he were being attacked by a predator.",
    explanation: "Costello vùng vẫy và phun mực như thể 'đang bị kẻ săn mồi tấn công' (being attacked by a predator), trái ngược với nhận định trong đề bài là 'phản ứng như thể đang đi săn' (as if it was hunting).",
    keywords: [
      { question: "as if it was hunting", passage: "as though he were being attacked by a predator" }
    ]
  },
  10: {
    qNum: 10,
    answer: "TRUE",
    location: "Đoạn 8, Dòng 4-6",
    evidence: "The nightmare study is intriguing, says Scheel... He argues that as well as outward behaviour, brain imaging is needed to show that the octopuses are replaying sequences of activities from their waking lives in dreams.",
    explanation: "Scheel cho rằng bên cạnh quan sát hành vi bên ngoài thì cần phải chụp ảnh não bộ (brain imaging is needed) -> Ông tin rằng cần tiến hành thêm các nghiên cứu về giấc mơ bạch tuộc.",
    keywords: [
      { question: "believes more research... should be carried out", passage: "brain imaging is needed to show..." }
    ]
  },
  11: {
    qNum: 11,
    answer: "FALSE",
    location: "Đoạn 9, Dòng 1-2",
    evidence: "The trouble is that we will never be able to experience any animal's dreams. That goes for other humans' dreams too.",
    explanation: "Tác giả khẳng định con người 'sẽ không bao giờ trải nghiệm được' giấc mơ của người khác (never be able to experience other humans' dreams), trái ngược với 'may soon be able to share'.",
    keywords: [
      { question: "may soon be able to share", passage: "we will never be able to experience" }
    ]
  },
  12: {
    qNum: 12,
    answer: "NOT GIVEN",
    location: "Đoạn 9, Dòng 4-6",
    evidence: "For example, vision is the dominant sense for many humans, and so our dreams are heavily visual too. Dogs primarily navigate the world using smell while spiders rely much more on vibrations.",
    explanation: "Đoạn văn liệt kê thị giác (vision), khứu giác (smell) và rung động (vibrations), hoàn toàn không đề cập đến thính giác (hearing) trong giấc mơ động vật.",
    keywords: [
      { question: "Hearing may be an important part", passage: "No mention of hearing in the passage" }
    ]
  },
  13: {
    qNum: 13,
    answer: "NOT GIVEN",
    location: "Đoạn 10, Dòng 1-3",
    evidence: "And if this is the case, it is possible that better understanding of these purposes might shed light on the true purpose of our own dreams.",
    explanation: "Tác giả kết luận việc nghiên cứu giấc mơ có thể làm sáng tỏ mục đích giấc mơ của con người, nhưng không có thông tin về việc 'sự quan tâm của con người gần đây có tăng lên hay không'.",
    keywords: [
      { question: "Interest in the reasons... has increased greatly", passage: "No information about increased interest" }
    ]
  },

  // Passage 2: Mapungubwe (Questions 14 - 26)
  14: {
    qNum: 14,
    answer: "E",
    location: "Đoạn E, Dòng 6-8",
    evidence: "The figures may have been used in ceremonies as offerings to ancestors, but their precise function is not known.",
    explanation: "Cụm 'precise function is not known' (chức năng chính xác chưa được biết) tương đương với 'uncertainty regarding the purpose of certain objects'.",
    keywords: [
      { question: "uncertainty regarding the purpose", passage: "their precise function is not known" }
    ]
  },
  15: {
    qNum: 15,
    answer: "B",
    location: "Đoạn B, Dòng 8-10",
    evidence: "This settlement, known as Babandyanalo, covers around 5 hectares (12.3 acres) and predates the hilltop structures.",
    explanation: "Từ 'predates' (có niên đại trước) đồng nghĩa với việc khu định cư Babandyanalo được xây dựng sớm hơn các công trình trên đồi ('built earlier than the other buildings').",
    keywords: [
      { question: "built earlier than", passage: "predates the hilltop structures" }
    ]
  },
  16: {
    qNum: 16,
    answer: "A",
    location: "Đoạn A, Dòng 4-6",
    evidence: "...cattle herding and other types of farming brought plenty of food and a surplus that could be traded for needed goods.",
    explanation: "Nông nghiệp tạo ra thặng dư lương thực có thể đem trao đổi lấy các hàng hóa cần thiết khác ('traded for needed goods' $\leftrightarrow$ 'items traded for other things').",
    keywords: [
      { question: "items that could be traded for other things", passage: "surplus that could be traded for needed goods" }
    ]
  },
  17: {
    qNum: 17,
    answer: "D",
    location: "Đoạn D, Dòng 7-9",
    evidence: "It is likely that trade links led to a strengthening of political authority in order to control and even monopolise these lucrative interregional connections.",
    explanation: "Các mối giao thương giúp củng cố quyền lực chính trị của các nhà lãnh đạo ('strengthening of political authority' $\leftrightarrow$ 'status of the leaders was affected by commerce').",
    keywords: [
      { question: "status of the leaders was affected", passage: "strengthening of political authority" },
      { question: "commerce", passage: "trade links" }
    ]
  },
  18: {
    qNum: 18,
    answer: "F",
    location: "Đoạn F, Dòng 7-9",
    evidence: "These objects were all found at the royal burial site and date to c. 1150. They are the first known indicators that gold had an intrinsic value of its own...",
    explanation: "Các hiện vật vàng có niên đại khoảng năm 1150 là dấu hiệu đầu tiên cho thấy vàng mang giá trị nội tại tự thân ('point in time when gold started being appreciated for its qualities').",
    keywords: [
      { question: "point in time", passage: "date to c. 1150" },
      { question: "gold started being appreciated for its qualities", passage: "gold had an intrinsic value of its own" }
    ]
  },
  19: {
    qNum: 19,
    answer: "C",
    location: "Đoạn C, Dòng 3-4",
    evidence: "A wooden staircase connected the two levels, the sockets for the steps being clearly visible in the sandstone cliff face.",
    explanation: "Cầu thang gỗ nối hai tầng với các lỗ mộng cắm bậc thang hiện rõ trên vách đá sa thạch ('sockets for steps clearly visible' $\leftrightarrow$ 'visible remains of a feature that joined two locations').",
    keywords: [
      { question: "feature that joined two locations together", passage: "wooden staircase connected the two levels" },
      { question: "visible remains", passage: "sockets for the steps being clearly visible" }
    ]
  },
  20: {
    qNum: 20,
    answer: "B",
    location: "Đoạn B, Dòng 7-8",
    evidence: "The rest of the community lived in mud and thatch housing spread out below the hill, although there is one stone structure here.",
    explanation: "Cộng đồng sống trong những căn nhà làm từ bùn và rạ ('mud and thatch') -> Cho biết nhà cửa của cư dân được xây dựng bằng vật liệu gì ('what their homes were made of').",
    keywords: [
      { question: "what their homes were made of", passage: "lived in mud and thatch housing" }
    ]
  },
  21: {
    qNum: 21,
    answer: "D",
    location: "Đoạn C, Dòng 4-5",
    evidence: "There were some grander residences dotted around the outskirts of Babandyanalo, and these probably belonged to male relatives of the king.",
    explanation: "Các dinh thự lớn ở rìa Babandyanalo thuộc về những người họ hàng nam giới của nhà vua -> Cung cấp thông tin về mối quan hệ gia tộc ('family ties of some people who lived there').",
    keywords: [
      { question: "family ties of some people who lived there", passage: "belonged to male relatives of the king" }
    ]
  },
  22: {
    qNum: 22,
    answer: "plateau",
    location: "Đoạn A, Dòng 2-3",
    evidence: "The area controlled by the rulers of Mapungubwe had at its heart a large sandstone plateau, which was easily defended due to its inaccessibility.",
    explanation: "Trung tâm vùng đất được kiểm soát bởi các thủ lĩnh Mapungubwe là một cao nguyên sa thạch rộng lớn (sandstone plateau).",
    keywords: [
      { question: "built around a sandstone [plateau]", passage: "had at its heart a large sandstone plateau" }
    ]
  },
  23: {
    qNum: 23,
    answer: "inaccessibility",
    location: "Đoạn A, Dòng 3",
    evidence: "...which was easily defended due to its inaccessibility.",
    explanation: "Khu vực này dễ phòng thủ nhờ vào sự khó tiếp cận / hiểm trở của địa hình (inaccessibility).",
    keywords: [
      { question: "safe from attack due to its [inaccessibility]", passage: "easily defended due to its inaccessibility" }
    ]
  },
  24: {
    qNum: 24,
    answer: "manure",
    location: "Đoạn A, Dòng 6-7",
    evidence: "Archaeology has revealed extensive layers of bones and manure, which indicate that from the 9th century CE there were large cattle herds...",
    explanation: "Các nhà khảo cổ tìm thấy các lớp xương và phân chuồng (manure), chứng minh sự tồn tại của đàn gia súc lớn.",
    keywords: [
      { question: "remains of bones and [manure]", passage: "extensive layers of bones and manure" }
    ]
  },
  25: {
    qNum: 25,
    answer: "power",
    location: "Đoạn A, Dòng 7-8",
    evidence: "...large cattle herds, the traditional source of political power in southern African communities.",
    explanation: "Gia súc là nguồn gốc truyền thống tạo nên quyền lực chính trị (political power) của các cộng đồng miền nam châu Phi.",
    keywords: [
      { question: "associated with political [power]", passage: "traditional source of political power" }
    ]
  },
  26: {
    qNum: 26,
    answer: "weaving",
    location: "Đoạn A, Dòng 9-10",
    evidence: "...cotton cultivation and weaving, as indicated by abundant finds of spindle whorls.",
    explanation: "Phát hiện con dọi xe sợi (spindle whorls) chứng minh sự hiện diện của hoạt động trồng bông và dệt vải (cotton cultivation and weaving).",
    keywords: [
      { question: "spindle whorls were used for [weaving]", passage: "cotton cultivation and weaving, as indicated by... spindle whorls" }
    ]
  },

  // Passage 3: Artificial Intelligence (Questions 27 - 40)
  27: {
    qNum: 27,
    answer: "B",
    location: "Đoạn 1, Dòng 1-4",
    evidence: "In many countries in the West, hysteria about the future of artificial intelligence (AI) is everywhere. There seems to be no shortage of sensationalist news... Just looking at the media headlines, you might think that we are already living in a future where AI has infiltrated every aspect of society.",
    explanation: "Tác giả mở đầu bằng việc mô tả nhận thức giật gân, thổi phồng của công chúng và truyền thông về AI (describing a public perception of AI).",
    keywords: [
      { question: "describing a public perception of AI", passage: "hysteria about future of AI... media headlines" }
    ]
  },
  28: {
    qNum: 28,
    answer: "A",
    location: "Đoạn 1, Dòng 8-10",
    evidence: "But, in fact, instead of supporting AI progress, this mindset actually jeopardises the value of machine intelligence by disregarding important AI safety principles and setting unrealistic expectations...",
    explanation: "Tác giả chỉ ra nguy cơ (risk involved) của tư tưởng 'AI solutionism' khi nó gây tổn hại đến giá trị AI (jeopardises the value) và coi nhẹ các nguyên tắc an toàn.",
    keywords: [
      { question: "points out a risk involved", passage: "jeopardises the value... disregarding AI safety principles" }
    ]
  },
  29: {
    qNum: 29,
    answer: "C",
    location: "Đoạn 3, Dòng 2-4",
    evidence: "While many politicians proclaim the transformative effects of the coming 'AI revolution', they fail to realise the complexity around deploying advanced machine learning systems in the real world.",
    explanation: "Các chính trị gia chưa nhận thức được những khó khăn, phức tạp thực tế khi triển khai AI (unaware of the challenges of implementing national AI initiatives $\leftrightarrow$ fail to realise the complexity).",
    keywords: [
      { question: "unaware of the challenges", passage: "fail to realise the complexity around deploying" }
    ]
  },
  30: {
    qNum: 30,
    answer: "F",
    location: "Đoạn 3, Dòng 8-10",
    evidence: "Similarly, adding a neural network to a system of government does not mean it will be instantaneously more inclusive or fair.",
    explanation: "Việc đưa AI vào chính phủ không đồng nghĩa với việc mang lại sự công bằng hay bình đẳng hơn (fair/inclusive $\leftrightarrow$ equality, từ khóa F trong bảng từ).",
    keywords: [
      { question: "solutions and promote [equality]", passage: "more inclusive or fair" }
    ]
  },
  31: {
    qNum: 31,
    answer: "G",
    location: "Đoạn 4, Dòng 1-3",
    evidence: "AI systems need a lot of data to function, but the public sector typically does not have the appropriate data infrastructure to support advanced machine learning.",
    explanation: "Khu vực công chưa có cơ sở hạ tầng dữ liệu phù hợp (appropriate data infrastructure $\leftrightarrow$ framework, từ khóa G).",
    keywords: [
      { question: "necessary [framework] to manage data", passage: "appropriate data infrastructure to support advanced machine learning" }
    ]
  },
  32: {
    qNum: 32,
    answer: "I",
    location: "Đoạn 4, Dòng 5-6",
    evidence: "More often than not, data is spread across different government departments that each require special permissions to be accessed.",
    explanation: "Dữ liệu phân tán yêu cầu sự cấp phép đặc biệt mới được truy cập (special permissions $\leftrightarrow$ approval, từ khóa I).",
    keywords: [
      { question: "needs [approval] to access the relevant data", passage: "require special permissions to be accessed" }
    ]
  },
  33: {
    qNum: 33,
    answer: "C",
    location: "Đoạn 4, Dòng 7-8",
    evidence: "Above all, the public sector typically lacks the human talent with the right technological capabilities to fully reap the benefits of machine intelligence.",
    explanation: "Khu vực công thiếu nhân tài có năng lực công nghệ phù hợp (right technological capabilities $\leftrightarrow$ skills, từ khóa C).",
    keywords: [
      { question: "few employees have the [skills]", passage: "lacks human talent with the right technological capabilities" }
    ]
  },
  34: {
    qNum: 34,
    answer: "A",
    location: "Đoạn 6, Dòng 2-4",
    evidence: "Even though it was developed to deliver the best recommendations, human experts found it hard to trust the machine. As a result, the AI programme was abandoned...",
    explanation: "Các chuyên gia y tế gặp khó khăn trong việc tin tưởng cỗ máy (hard to trust the machine $\leftrightarrow$ little faith in its reliability, từ khóa A).",
    keywords: [
      { question: "little faith in its [reliability]", passage: "found it hard to trust the machine" }
    ]
  },
  35: {
    qNum: 35,
    answer: "D",
    location: "Đoạn 7, Dòng 3-4",
    evidence: "The system was found to amplify structural racial discrimination and was later abandoned.",
    explanation: "Hệ thống AI tại toà án bị phát hiện làm trầm trọng thêm sự phân biệt đối xử (amplify structural racial discrimination $\leftrightarrow$ magnified existing prejudices, từ khóa D).",
    keywords: [
      { question: "magnified existing [prejudices]", passage: "amplify structural racial discrimination" }
    ]
  },
  36: {
    qNum: 36,
    answer: "NO",
    location: "Đoạn 5, Dòng 1-3",
    evidence: "Stuart Russell, a professor of computer science... has long advocated a more sensible and realistic approach that focuses on simple everyday applications of AI...",
    explanation: "Russell đề xuất cách tiếp cận thực tế và hợp lý (sensible and realistic approach), mâu thuẫn hoàn toàn với khẳng định rằng đề xuất của ông là 'viển vông / không thực tế' (impractical) -> NO.",
    keywords: [
      { question: "proposals are impractical", passage: "advocated a more sensible and realistic approach" }
    ]
  },
  37: {
    qNum: 37,
    answer: "NOT GIVEN",
    location: "Đoạn 5, Dòng 4-6",
    evidence: "Similarly, Rodney Brooks, professor of robotics at MIT, writes that 'almost all innovations in robotics and AI take far, far, longer to be really widely deployed than people in the field and outside the field imagine'.",
    explanation: "Đoạn văn trích dẫn quan điểm của Brooks về thời gian triển khai AI, nhưng KHÔNG hề nói quan điểm của ông có bị những người ủng hộ AI chỉ trích bất công hay không -> NOT GIVEN.",
    keywords: [
      { question: "attracted unfair criticism from supporters", passage: "No mention of criticism in the passage" }
    ]
  },
  38: {
    qNum: 38,
    answer: "NO",
    location: "Đoạn 9, Dòng 4-5",
    evidence: "Still, AI security remains an often overlooked topic when machine learning systems are installed.",
    explanation: "Bảo mật AI thường bị xem nhẹ / bỏ qua (often overlooked topic), trái ngược trực tiếp với khẳng định 'luôn luôn được cân nhắc' (always taken into account) -> NO.",
    keywords: [
      { question: "always taken into account", passage: "remains an often overlooked topic" }
    ]
  },
  39: {
    qNum: 39,
    answer: "YES",
    location: "Đoạn 10, Dòng 2-4",
    evidence: "If we are to reap the benefits and minimise the potential harms of AI... This means we need to have a discussion about AI ethics and the distrust that many people have towards machine learning.",
    explanation: "Để hưởng lợi ích và giảm thiểu tác hại, chúng ta phải thảo luận về sự nghi ngại của người dân (distrust that many people have $\leftrightarrow$ explore people's concerns) -> YES.",
    keywords: [
      { question: "explore people's concerns about its use", passage: "discussion about AI ethics and the distrust that many people have" }
    ]
  },
  40: {
    qNum: 40,
    answer: "B",
    location: "Toàn bài đọc, đặc biệt Đoạn 8 & 11",
    evidence: "These examples demonstrate that there is no AI solution for everything... Instead of painting an unrealistic picture of the power of AI, it is important to take a step back...",
    explanation: "Tiêu đề phụ phù hợp nhất là 'Why AI may not be the answer to our problems' vì toàn bài phân tích các giới hạn, sự ngộ nhận và thất bại thực tế của trào lưu AI solutionism.",
    keywords: [
      { question: "suitable subtitle", passage: "there is no AI solution for everything... separate actual capabilities from fantasy" }
    ]
  }
};

