import React from "react";
import { Google, Volume2 } from "../../Icons";
import { normalizeOverviewKeyWords } from "../../../utils/googleAiWordModalUtils";

/** "Key words in this phrase" section of the Google AI overview (long phrases only). */
export const GoogleAiKeyWords = ({ keyWords, sourceLang = "en", onSpeak, onOpenGoogle }) => {
  const items = normalizeOverviewKeyWords(keyWords);
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="google-ai-section-title">
        <span>Từ quan trọng trong cụm</span>
      </h4>
      <div className="google-ai-keyword-list">
        {items.map((kw) => (
          <div key={kw.word} className="google-ai-keyword-card">
            <div className="google-ai-keyword-head">
              <strong className="google-ai-keyword-word">{kw.word}</strong>
              {kw.pos && <span className="google-ai-keyword-pos">{kw.pos}</span>}
              {kw.phonetic && <span className="google-ai-keyword-ipa">{kw.phonetic}</span>}
              <span className="google-ai-keyword-actions">
                <button
                  type="button"
                  className="google-ai-speak-btn"
                  onClick={() => onSpeak && onSpeak(kw.word, sourceLang)}
                  title={`Nghe phát âm "${kw.word}"`}
                  aria-label={`Nghe phát âm ${kw.word}`}
                >
                  <Volume2 size={14} />
                </button>
                <button
                  type="button"
                  className="google-ai-speak-btn"
                  onClick={() => onOpenGoogle && onOpenGoogle(kw.word)}
                  title={`Xem "${kw.word}" trên Google`}
                  aria-label={`Xem ${kw.word} trên Google`}
                >
                  <Google size={13} />
                </button>
              </span>
            </div>
            {kw.meaning && <div className="google-ai-keyword-meaning">{kw.meaning}</div>}
            {kw.example_en && (
              <div className="google-ai-keyword-example">
                <span>{kw.example_en}</span>
                <button
                  type="button"
                  className="google-ai-speak-btn"
                  onClick={() => onSpeak && onSpeak(kw.example_en, sourceLang)}
                  title="Nghe câu ví dụ"
                  aria-label="Nghe câu ví dụ"
                >
                  <Volume2 size={12} />
                </button>
                {kw.example_vi && <div className="google-ai-keyword-example-vi">{kw.example_vi}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleAiKeyWords;
