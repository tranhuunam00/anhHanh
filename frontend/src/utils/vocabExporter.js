/**
 * Vocabulary Exporter Utility for ShotLang
 * Supports:
 * 1. Excel/CSV (.csv) with UTF-8 BOM for perfect Vietnamese display in Microsoft Excel & Google Sheets.
 * 2. Anki Deck (.txt) in TSV format for 1-click Anki Flashcards import.
 */

const STATUS_LABELS = {
  NEW: "Mới lưu",
  LEARNING: "Đang học",
  MASTERED: "Đã thuộc",
};

const escapeCsvCell = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * Export vocabulary list to CSV file with UTF-8 BOM
 */
export const exportVocabToCSV = (items, filename = "ShotLang_TuVung") => {
  if (!items || items.length === 0) return false;

  const headers = [
    "STT",
    "Từ vựng",
    "Phiên âm IPA",
    "Nghĩa tiếng Việt",
    "Trạng thái",
    "Câu ví dụ",
    "Ngày lưu",
  ];

  const rows = items.map((item, idx) => {
    const createdDate = item.created_at
      ? new Date(item.created_at).toLocaleDateString("vi-VN")
      : "";
    const cleanContext = (item.context_sentence || "").replace(/\r?\n/g, " | ");

    return [
      idx + 1,
      item.word || "",
      item.phonetic ? `/${item.phonetic.replace(/^\/|\/$/g, "")}/` : "",
      item.meaning || "",
      STATUS_LABELS[item.status] || item.status || "Mới lưu",
      cleanContext,
      createdDate,
    ]
      .map(escapeCsvCell)
      .join(",");
  });

  // UTF-8 BOM (\uFEFF) ensures Excel renders Vietnamese diacritics perfectly
  const csvContent = "\uFEFF" + [headers.map(escapeCsvCell).join(","), ...rows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${filename}_${formatDate(new Date())}.csv`);
  return true;
};

/**
 * Export vocabulary list to Anki Deck TSV format
 */
export const exportVocabToAnki = (items, filename = "ShotLang_Anki") => {
  if (!items || items.length === 0) return false;

  const rows = items.map((item) => {
    // Front side: Word + IPA + Context Sentence
    const frontParts = [`<div style="font-size:24px;font-weight:bold;color:#4f46e5;">${escapeHtml(item.word)}</div>`];
    if (item.phonetic) {
      frontParts.push(`<div style="font-size:14px;color:#64748b;">/${escapeHtml(item.phonetic.replace(/^\/|\/$/g, ""))}/</div>`);
    }
    if (item.context_sentence) {
      const cleanSentence = escapeHtml(item.context_sentence).replace(/\n/g, "<br>");
      frontParts.push(`<div style="margin-top:12px;font-size:14px;font-style:italic;color:#334155;">${cleanSentence}</div>`);
    }
    const front = frontParts.join("");

    // Back side: Vietnamese Meaning + Image (if present)
    const backParts = [`<div style="font-size:18px;font-weight:600;color:#059669;">${escapeHtml(item.meaning || "")}</div>`];
    if (item.image_url) {
      backParts.push(`<div style="margin-top:10px;"><img src="${escapeHtml(item.image_url)}" style="max-width:200px;max-height:160px;border-radius:8px;object-fit:cover;"></div>`);
    }
    const back = backParts.join("");

    // Tab-separated: Front \t Back \t Tags
    return `${front}\t${back}\tShotLang`;
  });

  const ankiContent = rows.join("\r\n");
  const blob = new Blob([ankiContent], { type: "text/plain;charset=utf-8;" });
  triggerDownload(blob, `${filename}_Deck_${formatDate(new Date())}.txt`);
  return true;
};

const triggerDownload = (blob, fileName) => {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatDate = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
};

const escapeHtml = (unsafe) => {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
