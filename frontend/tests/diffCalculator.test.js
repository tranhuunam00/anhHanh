import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanWord,
  evaluateMasked,
  getNextLetterHint,
  getNextWordHint
} from '../src/utils/diffCalculator.js';

describe('Frontend diffCalculator Unit Tests', () => {
  describe('cleanWord', () => {
    it('handles happy path word cleaning', () => {
      assert.equal(cleanWord('Hello'), 'hello');
      assert.equal(cleanWord('World!'), 'world');
      assert.equal(cleanWord('“Serendipity”'), 'serendipity');
      assert.equal(cleanWord("don't"), 'dont');
    });

    it('handles empty and boundary inputs', () => {
      assert.equal(cleanWord(''), '');
      assert.equal(cleanWord(null), '');
      assert.equal(cleanWord(undefined), '');
      assert.equal(cleanWord('   '), '');
      assert.equal(cleanWord('!@#$%^&*()'), '');
    });
  });

  describe('evaluateMasked', () => {
    it('evaluates completely correct input', () => {
      const target = 'Hello world.';
      const input = 'hello world';
      const res = evaluateMasked(target, input, false);

      assert.equal(res.isCompleted, true);
      assert.equal(res.hasWrong, false);
      assert.equal(res.correctLetterCount, 10);
      assert.equal(res.totalLetterCount, 10);
      assert.equal(res.words.length, 2);
    });

    it('evaluates partially typed input with masked letters', () => {
      const target = 'Hello world.';
      const input = 'hel';
      const res = evaluateMasked(target, input, false);

      assert.equal(res.isCompleted, false);
      assert.equal(res.hasWrong, false);
      assert.equal(res.correctLetterCount, 3);
      assert.equal(res.totalLetterCount, 10);
      // Word 1: h(correct), e(correct), l(correct), l(masked), o(masked)
      assert.equal(res.words[0][0].status, 'correct');
      assert.equal(res.words[0][3].status, 'masked');
    });

    it('detects typo and marks hasWrong = true', () => {
      const target = 'Hello world.';
      const input = 'hx';
      const res = evaluateMasked(target, input, false);

      assert.equal(res.isCompleted, false);
      assert.equal(res.hasWrong, true);
      assert.equal(res.words[0][1].status, 'wrong');
      assert.equal(res.words[0][1].typedChar, 'x');
    });

    it('handles empty user input cleanly', () => {
      const target = 'Dictation practice';
      const res = evaluateMasked(target, '', false);

      assert.equal(res.isCompleted, false);
      assert.equal(res.hasWrong, false);
      assert.equal(res.correctLetterCount, 0);
      assert.equal(res.totalLetterCount, 17);
    });
  });

  describe('getNextLetterHint & getNextWordHint', () => {
    it('provides next letter hint', () => {
      const target = 'Hello world.';
      const hint = getNextLetterHint(target, 'hel', false);
      assert.equal(hint, 'hell');
    });

    it('provides next full word hint', () => {
      const target = 'Hello world.';
      const hint = getNextWordHint(target, 'hel', false);
      assert.equal(hint, 'Hello ');
    });

    it('handles empty target text gracefully', () => {
      assert.equal(getNextLetterHint('', 'abc'), '');
      assert.equal(getNextWordHint('', 'abc'), '');
    });
  });
});
