import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeText,
  cleanCredits,
  extractYouTubeId,
  toCanonicalYouTubeUrl,
  cleanYouTubeUrl,
  splitContextSentence,
} from '../src/utils/textNormalizer.js';

import {
  getVoiceLang,
  getLanguageLabel,
} from '../src/utils/languageVoices.js';

import {
  exportVocabToCSV,
  exportVocabToAnki,
} from '../src/utils/vocabExporter.js';

describe('Frontend Utils Unit Tests (Input & Output Verification)', () => {
  describe('textNormalizer.js', () => {
    it('normalizeText: input coverage and output verification', () => {
      // Happy path
      assert.equal(normalizeText('Hello, World!'), 'hello world');
      // Strict punctuation retains punctuation
      assert.equal(normalizeText('Hello, World!', true), 'Hello, World!');
      // Empty and falsy inputs
      assert.equal(normalizeText(''), '');
      assert.equal(normalizeText(null), '');
      assert.equal(normalizeText(undefined), '');
      // Multiple whitespace collapse
      assert.equal(normalizeText('  Lots   of    spaces   '), 'lots of spaces');
    });

    it('cleanCredits: input coverage and output verification', () => {
      assert.equal(cleanCredits('Subtitles by TED Conferences'), '');
      assert.equal(cleanCredits('Transcript by John Doe'), '');
      assert.equal(cleanCredits('Phụ đề bởi Ban Biên Tập'), '');
      assert.equal(cleanCredits(''), '');
      assert.equal(cleanCredits(null), null);
    });

    it('extractYouTubeId: handles various YouTube inputs', () => {
      // 11-char direct
      assert.equal(extractYouTubeId('dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
      // Full watch URL
      assert.equal(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
      // Shorts URL
      assert.equal(extractYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
      // youtu.be URL
      assert.equal(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
      // Empty input
      assert.equal(extractYouTubeId(''), '');
      assert.equal(extractYouTubeId(null), '');
    });

    it('toCanonicalYouTubeUrl & cleanYouTubeUrl: format output verification', () => {
      const canonical = toCanonicalYouTubeUrl('dQw4w9WgXcQ');
      assert.equal(canonical, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

      const cleaned = cleanYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123&si=xyz');
      assert.equal(cleaned, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    it('splitContextSentence: splits bilingual context sentences', () => {
      // Newline separation
      const res1 = splitContextSentence('Bonjour le monde\nXin chào thế giới');
      assert.equal(res1.orig, 'Bonjour le monde');
      assert.equal(res1.trans, 'Xin chào thế giới');

      // Quotes separation
      const res2 = splitContextSentence('"Hello world" "Chào thế giới"');
      assert.equal(res2.orig, 'Hello world');
      assert.equal(res2.trans, 'Chào thế giới');

      // Empty input
      assert.deepEqual(splitContextSentence(''), { orig: '', trans: '' });
      assert.deepEqual(splitContextSentence(null), { orig: '', trans: '' });
    });
  });

  describe('languageVoices.js', () => {
    it('getVoiceLang: maps source languages correctly', () => {
      assert.equal(getVoiceLang('fr'), 'fr-FR');
      assert.equal(getVoiceLang('de'), 'de-DE');
      assert.equal(getVoiceLang('ja'), 'ja-JP');
      assert.equal(getVoiceLang('zh'), 'zh-CN');
      assert.equal(getVoiceLang('ko'), 'ko-KR');
      assert.equal(getVoiceLang('es'), 'es-ES');
      assert.equal(getVoiceLang('vi'), 'vi-VN');
      assert.equal(getVoiceLang('en'), 'en-US');
    });

    it('getVoiceLang: heuristic script detection when sourceLang is null', () => {
      // Japanese kana
      assert.equal(getVoiceLang(null, 'こんにちは'), 'ja-JP');
      // Korean Hangul
      assert.equal(getVoiceLang(null, '안녕하세요'), 'ko-KR');
      // Chinese Kanji
      assert.equal(getVoiceLang(null, '你好'), 'zh-CN');
      // French accents
      assert.equal(getVoiceLang(null, 'café'), 'fr-FR');
      // German umlaut
      assert.equal(getVoiceLang(null, 'schön'), 'de-DE');
      // Fallback
      assert.equal(getVoiceLang(null, 'plain text'), 'en-US');
    });

    it('getLanguageLabel: returns correct Vietnamese language label', () => {
      assert.equal(getLanguageLabel('en'), 'Tiếng Anh');
      assert.equal(getLanguageLabel('fr'), 'Tiếng Pháp');
      assert.equal(getLanguageLabel('ja'), 'Tiếng Nhật');
      assert.equal(getLanguageLabel('unknown'), 'Từ vựng');
    });
  });

  describe('vocabExporter.js', () => {
    it('exportVocabToCSV & exportVocabToAnki: empty list returns false safely', () => {
      assert.equal(exportVocabToCSV([]), false);
      assert.equal(exportVocabToCSV(null), false);
      assert.equal(exportVocabToAnki([]), false);
      assert.equal(exportVocabToAnki(null), false);
    });
  });
});
