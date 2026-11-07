import React from "react";
import { IconAlert } from "../Icons";

export function WritingUnderLengthAlert({
  isUnderLength,
  studentWords,
  minRequiredWords = 150,
  genreName = "IELTS Writing",
  customMessage,
}) {
  if (!isUnderLength) return null;

  return (
    <div className="writing-underlength-banner" role="alert">
      <div className="wub-icon">
        <IconAlert size={20} />
      </div>
      <div className="wub-content">
        <div className="wub-title">
          Cảnh báo thiếu số lượng từ ({studentWords} / {minRequiredWords} từ)
        </div>
        <div className="wub-desc">
          {customMessage || (
            <span>
              Bài viết của bạn chỉ có <strong>{studentWords} từ</strong>, chưa đạt mức tối thiểu chuẩn{" "}
              <strong>{minRequiredWords} từ</strong> của {genreName}. Trong kỳ thi thật, bài viết dưới{" "}
              {minRequiredWords} từ sẽ bị trừ điểm nặng ở tiêu chí <em>Task Achievement / Task Response</em>.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
