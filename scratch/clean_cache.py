import re
import glob
import json

def clean_credits(text: str) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"\[.*?\]|\(.*?\)", "", text).strip()
    
    # Common Vietnamese sentence starters
    starters = r"(?:Khi|Tôi|Chúng|Bạn|Hôm|Đó|Và|Năm|Trong|Một|Chào|Cảm|Nếu|Tại|Để|Mỗi|Có|Sau|Trước|Theo|Với|Là|Đây|Ở|[0-9]|\"|“)"
    
    # 1. Match any credit prefix including Reviewer: <Name> before the sentence
    cleaned = re.sub(
        rf"(?i)^.*?(?:reviewer|translator|subtitles?\s+by|phụ\s+đề\s+bởi|dịch\s+bởi|biên\s+dịch|hiệu\s+đính)[:\s].*?(?=\s+{starters})",
        "",
        cleaned,
    ).strip()
    
    # 2. Also handle if there are remnants like "Chloe Mai Reviewer: Nguyễn Hà Thi Ân"
    cleaned = re.sub(
        rf"(?i)^.*?(?:reviewer|translator)[:\s].*?(?=\s+{starters})",
        "",
        cleaned,
    ).strip()

    # 3. If line contains purely credits (e.g. "Translator: Chloe Mai")
    if re.match(r"(?i)^(?:translator|reviewer|subtitles?\s+by|phụ\s+đề\s+bởi|dịch\s+bởi|biên\s+dịch|hiệu\s+đính)\b", cleaned):
        return ""

    return cleaned

# Test on TED sentence
sample = "Translator: Chloe Mai Reviewer: Nguyễn Hà Thi Ân Khi con trai Patrick của tôi khoảng ba hoặc bốn tuổi, tôi thường xuyên vào phòng giải trí của con, và thấy con đang chơi với những khối vuông có chữ cái."
assert "Khi con trai Patrick" in clean_credits(sample)

# Apply to all cache files
for path in glob.glob("data/cache/*.json"):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if "challenges" in data:
        modified = False
        for c in data["challenges"]:
            if c.get("translation"):
                new_t = clean_credits(c["translation"])
                if new_t != c["translation"]:
                    c["translation"] = new_t
                    modified = True
        if modified:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print("Cleaned cache:", path)
