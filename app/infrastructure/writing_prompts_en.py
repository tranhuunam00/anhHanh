"""Curated English Writing Prompts for IELTS Task 1, Task 2, Emails, Paragraphs and Free writing."""
from typing import List, Dict, Any
from app.infrastructure.ielts_prompts_bank import (
    IELTS_TASK2_AUTHENTIC_PROMPTS,
    IELTS_TASK1_AUTHENTIC_PROMPTS,
)

CURATED_PROMPTS_EN: Dict[str, List[Dict[str, Any]]] = {
    "ielts_task2": IELTS_TASK2_AUTHENTIC_PROMPTS,
    "ielts_task1": IELTS_TASK1_AUTHENTIC_PROMPTS + [
        {
            "id": "t1_cam13_line",
            "title": "Tourist Visits to Four Attractions in Brighton (Cambridge 13 Test 2)",
            "prompt": "The line graph shows the percentage of tourists to England who visited four distinct attractions in Brighton (Pavilion, Pier, Art Gallery, and Festival) between 1980 and 2010.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "type": "Biểu đồ đường (Line Graph)",
            "sub_type": "line_graph",
            "keywords": ["upward trajectory", "peaked dramatically", "marginal fluctuation", "sharp decline", "overtook"],
            "min_words": 150,
            "recommended_time": 20,
            "visual_data": {
                "type": "line_graph",
                "title": "Percentage of Tourists Visiting 4 Brighton Attractions (1980 - 2010)",
                "unit": "% du khách",
                "x_labels": ["1980", "1990", "2000", "2010"],
                "series": [
                    {"name": "Pavilion", "color": "#3b82f6", "data": [23, 22, 34, 31]},
                    {"name": "Art Gallery", "color": "#10b981", "data": [21, 38, 38, 8]},
                    {"name": "Pier", "color": "#f59e0b", "data": [10, 15, 22, 22]},
                    {"name": "Festival", "color": "#8b5cf6", "data": [30, 28, 25, 28]}
                ]
            }
        },
        {
            "id": "t1_cam14_bar",
            "title": "Male & Female Students Across 6 Fields of Study (Cambridge 14 Test 1)",
            "prompt": "The bar chart compares the proportion of male and female students studying six different academic disciplines at a university in the UK in 2019.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "type": "Biểu đồ cột (Bar Chart)",
            "sub_type": "bar_chart",
            "keywords": ["predominant gender", "considerable disparity", "roughly equal proportion", "marked divergence", "outnumbered"],
            "min_words": 150,
            "recommended_time": 20,
            "visual_data": {
                "type": "bar_chart",
                "title": "Gender Distribution Across 6 University Subjects (2019)",
                "unit": "% sinh viên",
                "categories": ["Computer Science", "Engineering", "Medicine", "Law", "Languages", "Arts"],
                "series": [
                    {"name": "Nam (Male)", "color": "#3b82f6", "data": [78, 85, 42, 48, 28, 35]},
                    {"name": "Nữ (Female)", "color": "#ec4899", "data": [22, 15, 58, 52, 72, 65]}
                ]
            }
        },
        {
            "id": "t1_cam11_pie",
            "title": "Water Consumption by Sector in Two Continents (Cambridge 11 Test 1)",
            "prompt": "The pie charts illustrate the proportion of water consumed across three primary sectors (Industrial, Agricultural, and Domestic) in North America and Southeast Asia in 2000.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "type": "Biểu đồ tròn (Pie Chart)",
            "sub_type": "pie_chart",
            "keywords": ["commanded the vast majority", "substantial disparity", "industrial demand", "minimal domestic share", "heavy reliance on agriculture"],
            "min_words": 150,
            "recommended_time": 20,
            "visual_data": {
                "type": "pie_chart",
                "title": "Water Usage Distribution by Sector (Year 2000)",
                "unit": "%",
                "charts": [
                    {
                        "label": "Bắc Mỹ (North America)",
                        "slices": [
                            {"name": "Industrial (Công nghiệp)", "value": 48, "color": "#3b82f6"},
                            {"name": "Agricultural (Nông nghiệp)", "value": 39, "color": "#10b981"},
                            {"name": "Domestic (Sinh hoạt)", "value": 13, "color": "#f59e0b"}
                        ]
                    },
                    {
                        "label": "Đông Nam Á (Southeast Asia)",
                        "slices": [
                            {"name": "Industrial (Công nghiệp)", "value": 12, "color": "#3b82f6"},
                            {"name": "Agricultural (Nông nghiệp)", "value": 81, "color": "#10b981"},
                            {"name": "Domestic (Sinh hoạt)", "value": 7, "color": "#f59e0b"}
                        ]
                    }
                ]
            }
        },
        {
            "id": "t1_cam10_table",
            "title": "Fairtrade Coffee & Banana Sales in 5 European Countries (Cambridge 10 Test 2)",
            "prompt": "The table compares the sales turnover of Fairtrade-certified coffee and bananas (in millions of euros) across five European nations in 1999 and 2004.\n\nSummarise the key metrics, trends and comparisons.",
            "type": "Bảng số liệu (Table)",
            "sub_type": "table",
            "keywords": ["highest sales volume", "exponential surge", "eclipsed", "modest growth", "revenue discrepancy"],
            "min_words": 150,
            "recommended_time": 20,
            "visual_data": {
                "type": "table",
                "title": "Fairtrade Coffee & Banana Revenue (Millions of Euros - 1999 vs 2004)",
                "columns": ["Quốc gia (Country)", "Coffee (1999)", "Coffee (2004)", "Bananas (1999)", "Bananas (2004)"],
                "rows": [
                    ["Vương quốc Anh (UK)", "1.5", "20.0", "15.0", "47.0"],
                    ["Thụy Sĩ (Switzerland)", "3.0", "6.0", "5.5", "4.5"],
                    ["Đan Mạch (Denmark)", "1.8", "2.0", "0.6", "4.0"],
                    ["Bỉ (Belgium)", "1.0", "1.7", "0.6", "4.0"],
                    ["Thụy Điển (Sweden)", "0.8", "1.0", "1.8", "1.2"]
                ]
            }
        },
        {
            "id": "t1_cam8_process",
            "title": "Industrial Cement & Concrete Manufacturing Process (Cambridge 8 Test 3)",
            "prompt": "The two diagrams illustrate the stages involved in the industrial production of cement and how cement is subsequently combined with other materials to produce concrete for the construction sector.\n\nSummarise the key operations, steps, and proportional components.",
            "type": "Quy trình (Process)",
            "sub_type": "process",
            "keywords": ["crushed into fine powder", "cylindrical rotating kiln", "extreme heat up to 1400°C", "concrete formulation", "proportional combination"],
            "min_words": 150,
            "recommended_time": 20,
            "visual_data": {
                "type": "process",
                "title": "Industrial Cement Manufacturing & Concrete Production",
                "process_a": {
                    "title": "Giai đoạn 1: Quy trình sản xuất Xi măng (Cement)",
                    "steps": [
                        {"step": 1, "title": "Nghiền nguyên liệu (Crushing)", "desc": "Đá vôi (Limestone) và Đất sét (Clay) đưa vào máy nghiền tạo bột mịn.", "icon": "crush"},
                        {"step": 2, "title": "Phối trộn (Mixing pipe)", "desc": "Bột nguyên liệu đi qua ống xoay phối trộn đều thành hỗn hợp đồng nhất.", "icon": "mix"},
                        {"step": 3, "title": "Nung lò quay (Rotating Kiln)", "desc": "Hỗn hợp nung trong lò quay nghiêng ở nhiệt độ cực cao 1400°C - 1500°C.", "icon": "heat"},
                        {"step": 4, "title": "Làm nguội & Nghiền mịn (Grinding)", "desc": "Xỉ clinker làm nguội, trộn thêm Thạch cao (Gypsum) và nghiền thành xi măng.", "icon": "grind"},
                        {"step": 5, "title": "Đóng bao & Xuất xưởng (Packaging)", "desc": "Xi măng thành phẩm tự động đóng bao 50kg và xếp lên xe vận chuyển.", "icon": "pack"}
                    ]
                },
                "process_b": {
                    "title": "Giai đoạn 2: Tỷ lệ phối trộn Bê tông (Concrete Formulation)",
                    "ingredients": [
                        {"name": "Sỏi / Đá dăm (Gravel)", "pct": 50, "color": "#64748b"},
                        {"name": "Cát xây dựng (Sand)", "pct": 25, "color": "#eab308"},
                        {"name": "Xi măng (Cement)", "pct": 15, "color": "#3b82f6"},
                        {"name": "Nước sạch (Water)", "pct": 10, "color": "#06b6d4"}
                    ],
                    "machine": "Cả 4 thành phần được nạp vào Máy trộn bê tông (Concrete Mixer) quay đều tạo hỗn hợp vữa xây dựng."
                }
            }
        },
        {
            "id": "t1_cam14_map",
            "title": "The Village of Stokeford Redevelopment (Cambridge 14 Test 4)",
            "prompt": "The two maps show the village of Stokeford in 1930 and in 2010, illustrating its transformation from a rural settlement into a modern residential suburb.\n\nSummarise the structural changes and spatial developments.",
            "type": "Bản đồ / Quy hoạch (Map)",
            "sub_type": "map",
            "keywords": ["farmland converted into residential estates", "school expanded with additional classrooms", "large manor repurposed as retirement home", "new side roads constructed", "demolished to make way for"],
            "min_words": 150,
            "recommended_time": 20,
            "visual_data": {
                "type": "map",
                "title": "Bản đồ quy hoạch Làng Stokeford (1930 so với 2010)",
                "period_a": {
                    "year": "Năm 1930 (Làng Nông thôn thuần túy)",
                    "zones": [
                        {"area": "Đông Bắc (North-East)", "name": "Sông River Stoke với cầu gỗ qua sông", "status": "existing"},
                        {"area": "Phía Đông & Đông Nam", "name": "Đất nông nghiệp rộng lớn (Farmland)", "status": "demolished"},
                        {"area": "Trung tâm (Center)", "name": "Trục đường chính làng với Bưu điện & Trường tiểu học nhỏ", "status": "existing"},
                        {"area": "Tây Bắc (North-West)", "name": "Biệt thự cổ (Large Manor House) với vườn tư gia rộng", "status": "converted"},
                        {"area": "Phía Tây & Tây Nam", "name": "Vài căn nhà gỗ nông dân rải rác (10 - 15 nóc nhà)", "status": "existing"}
                    ]
                },
                "period_b": {
                    "year": "Năm 2010 (Khu đô thị cư dân hiện đại)",
                    "zones": [
                        {"area": "Đông Bắc (North-East)", "name": "Cầu bê tông cốt thép hiện đại hóa bắc qua sông", "status": "expanded"},
                        {"area": "Phía Đông & Đông Nam", "name": "Đất nông nghiệp bị xóa bỏ hoàn toàn, thay bằng 2 Khu đô thị nhà ở (Housing Estates) và các tuyến đường nhánh", "status": "new"},
                        {"area": "Trung tâm (Center)", "name": "Đường chính mở rộng; Trường tiểu học xây thêm 2 dãy phòng học mới tăng gấp đôi quy mô", "status": "expanded"},
                        {"area": "Tây Bắc (North-West)", "name": "Biệt thự cổ được cải tạo và mở rộng thành Viện dưỡng lão (Retirement Home)", "status": "converted"},
                        {"area": "Phía Tây & Tây Nam", "name": "Nhiều dãy nhà ở liền kề mới mọc lên dọc 2 bên tuyến đường", "status": "new"}
                    ]
                }
            }
        },
        {
            "id": "t1_cam_lakeside",
            "title": "Town of Lakeside Redevelopment (Cambridge - 2000 vs 2009)",
            "prompt": "The two maps show the changes that took place in the town of Lakeside between 2000 and 2009.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "type": "Bản đồ / Quy hoạch (Map)",
            "sub_type": "map",
            "keywords": ["woodland cleared to construct car park", "industrial complex significantly expanded", "residential area replaced with commercial shopping centre", "derelict warehouses redeveloped into office buildings", "lake contracted into smaller pond"],
            "min_words": 150,
            "recommended_time": 20,
            "visual_data": {
                "type": "map",
                "map_preset": "lakeside",
                "image_url": "/images/writing/lakeside_map.png",
                "title": "Town of Lakeside Urban Development (2000 vs 2009)",
                "period_a": {
                    "year": "Lake side 2000",
                    "zones": [
                        {"area": "North-East", "name": "Woodland & Lake (Hồ nước lớn góc đông bắc)", "status": "existing"},
                        {"area": "North", "name": "Derelict warehouses (Nhà kho bỏ hoang)", "status": "demolished"},
                        {"area": "North-West", "name": "Residential area (Khu dân cư phía tây bắc)", "status": "existing"},
                        {"area": "Center", "name": "Old Town (Phố cổ trung tâm)", "status": "demolished"},
                        {"area": "Center-West", "name": "Arts Centre & School (Trung tâm nghệ thuật & Trường học)", "status": "converted"},
                        {"area": "West", "name": "Residential area (Khu nhà ở phía tây)", "status": "demolished"},
                        {"area": "East", "name": "Industrial complex (Khu công nghiệp quy mô nhỏ)", "status": "expanded"},
                        {"area": "South", "name": "Residential area (Dãy nhà ở phía nam ven sông)", "status": "existing"}
                    ]
                },
                "period_b": {
                    "year": "Lake side 2009",
                    "zones": [
                        {"area": "North-East", "name": "Woodland shrunk & Lake reduced to small Pond", "status": "converted"},
                        {"area": "North", "name": "Car park & triangular Offices (Bãi đỗ xe & Tòa nhà văn phòng)", "status": "new"},
                        {"area": "Center", "name": "University campus built (Đại học mới)", "status": "new"},
                        {"area": "Center-West", "name": "Multi-screen cinema replaced Arts Centre; School retained", "status": "new"},
                        {"area": "West", "name": "Large Shopping centre replaced residential homes (Trung tâm thương mại lớn)", "status": "new"},
                        {"area": "East", "name": "Industrial complex doubled in size (Khu công nghiệp mở rộng gấp đôi)", "status": "expanded"},
                        {"area": "South", "name": "Residential area along southern river unchanged", "status": "existing"}
                    ]
                }
            }
        },
        {
            "id": "t1_cam_island_resort",
            "title": "Tropical Island Tourism Resort Development (Cambridge - Before & After)",
            "prompt": "The two maps show an island before and after the construction of some tourist facilities.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "type": "Bản đồ / Quy hoạch (Map)",
            "sub_type": "map",
            "keywords": ["uninhabited island developed into holiday resort", "western and eastern accommodation huts", "pier constructed to receive sailing yachts", "restaurant and central reception building", "footpaths and vehicle tracks connecting facilities"],
            "min_words": 150,
            "recommended_time": 20,
            "visual_data": {
                "type": "map",
                "map_preset": "island_resort",
                "image_url": "/images/writing/island_map.png",
                "title": "Tropical Island Tourist Facilities (Before vs After)",
                "period_a": {
                    "year": "Before (Đảo hoang sơ ban đầu)",
                    "zones": [
                        {"area": "West", "name": "Natural beach (Bãi cát tự nhiên)", "status": "existing"},
                        {"area": "North & Center", "name": "Wild palm trees & vegetation (Rặng cọ hoang dã)", "status": "existing"},
                        {"area": "East", "name": "Open land with scattered palm trees", "status": "existing"},
                        {"area": "Surroundings", "name": "Open sea with no access infrastructure (Biển bao quanh)", "status": "existing"}
                    ]
                },
                "period_b": {
                    "year": "After (Khu nghỉ dưỡng du lịch hoàn chỉnh)",
                    "zones": [
                        {"area": "West", "name": "Designated swimming beach with connecting footpaths", "status": "expanded"},
                        {"area": "West-Central", "name": "6 accommodation huts around palm trees (Cụm nhà gỗ phía tây)", "status": "new"},
                        {"area": "Center", "name": "Central Reception building encircled by vehicle track (Nhà đón tiếp)", "status": "new"},
                        {"area": "North", "name": "Restaurant facility (Nhà hàng phục vụ du khách)", "status": "new"},
                        {"area": "East", "name": "9 accommodation huts arranged in a circular cluster (Cụm nhà gỗ phía đông)", "status": "new"},
                        {"area": "South", "name": "Wooden Pier for boats and yachts (Cầu tàu bến du thuyền)", "status": "new"}
                    ]
                }
            }
        },
        {
            "id": "t1_cam15_pie",
            "title": "Household Energy Consumption & Carbon Emissions (Cambridge 15 Test 3)",
            "prompt": "The pie charts illustrate the percentage of electricity consumed by different appliances in an average Australian household and the resulting greenhouse gas emissions.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "type": "Biểu đồ tròn (Pie Chart)",
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
                            {"name": "Chiếu sáng (Lighting)", "value": 8, "color": "#eab308"},
                            {"name": "Hệ thống làm lạnh (Cooling)", "value": 17, "color": "#06b6d4"}
                        ]
                    }
                ]
            }
        },
        {
            "id": "t1_cam12_table",
            "title": "Consumer Spending on Three Categories in Five Countries (Cambridge 12 Test 5)",
            "prompt": "The table below shows the percentages of national consumer expenditure on three categories of items in five countries in 2002.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "type": "Bảng số liệu (Table)",
            "sub_type": "table",
            "keywords": ["consumer expenditure", "food, drinks and tobacco", "clothing and footwear", "leisure and education", "highest proportion"],
            "min_words": 150,
            "recommended_time": 20,
            "visual_data": {
                "type": "table",
                "title": "Percentage of Consumer Expenditure in 5 Countries (2002)",
                "columns": ["Quốc gia (Country)", "Lương thực, đồ uống (%)", "Quần áo & Giày dép (%)", "Giải trí & Giáo dục (%)"],
                "rows": [
                    ["Ireland", "28.91%", "6.43%", "2.21%"],
                    ["Ý (Italy)", "16.36%", "9.00%", "3.20%"],
                    ["Tây Ban Nha (Spain)", "18.80%", "6.51%", "1.98%"],
                    ["Thổ Nhĩ Kỳ (Turkey)", "32.14%", "4.37%", "4.35%"],
                    ["Thụy Điển (Sweden)", "15.77%", "5.40%", "3.22%"]
                ]
            }
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
}
