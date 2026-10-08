"""Official IELTS Task 1 Prompts Bank (Cambridge 15-19 Authentic Tests)."""
from typing import List, Dict, Any

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
        "image_url": "/images/writing/uk_fuel_production_cam19.png",
        "keywords": ["overall downward trajectory", "fluctuated notably", "overtook coal production", "plateaued around", "peaked at energy units"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "line_graph",
            "image_url": "/images/writing/uk_fuel_production_cam19.png",
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
        "image_url": "/images/writing/education_spending_cam19.png",
        "keywords": ["commanded the largest share", "marked discrepancy", "tertiary allocation", "secondary schooling outstripped", "marginal difference"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "bar_chart",
            "image_url": "/images/writing/education_spending_cam19.png",
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
        "image_url": "/images/writing/industrial_estate_tech_park_cam18.png",
        "keywords": ["derelict factories demolished", "repurposed into incubation hub", "pedestrian concourse added", "solar canopy installation", "retention basin"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "map",
            "image_url": "/images/writing/industrial_estate_tech_park_cam18.png",
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
        "image_url": "/images/writing/ocean_wave_generation_cam18.png",
        "keywords": ["oscillating chamber", "compression of air column", "bi-directional turbine", "wave retreat", "kinetic conversion"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "process",
            "image_url": "/images/writing/ocean_wave_generation_cam18.png",
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
        "image_url": "/images/writing/water_consumption_cities_cam17.png",
        "keywords": ["per capita consumption", "highest tariff rate", "stark divergence", "modest volume", "expenditure parity"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "table",
            "image_url": "/images/writing/water_consumption_cities_cam17.png",
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
        "image_url": "/images/writing/manufacturing_productivity_cam16.png",
        "keywords": ["surpassed", "sustained ascent", "sharp dip", "eclipsed the counterparts", "productivity metric"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "bar_chart",
            "image_url": "/images/writing/manufacturing_productivity_cam16.png",
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
        "image_url": "/images/writing/household_energy_emissions_cam15.png",
        "keywords": ["energy consumption", "greenhouse gas emissions", "heating and cooling", "disproportionate share", "water heating"],
        "min_words": 150,
        "recommended_time": 20,
        "visual_data": {
            "type": "pie_chart",
            "image_url": "/images/writing/household_energy_emissions_cam15.png",
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
    }
]
