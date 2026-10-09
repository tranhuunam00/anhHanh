import React from "react";
import {
  BinaryChoiceExercise,
  RewriteCorrectionExercise,
  BracketVerbExercise,
  WordBankExercise,
  MultipleChoiceExercise,
  PassageClozeExercise,
  MatchingExercise,
  ExtraWordExercise,
  KeyWordTransformationExercise,
} from "./exercises";

/**
 * Exercise items dispatcher / orchestrator.
 * Delegates to dedicated components based on exercise type / archetype.
 * Rule 1: Only internal icons.
 * Rule 4: File strictly under 500 lines.
 */
export const B2ExerciseItemsRenderer = ({
  exercise,
  userAnswers,
  result,
  onAnswerChange,
}) => {
  if (!exercise) return null;

  const exCode = exercise.exercise_code;
  const exType = exercise.exercise_type;
  const items = exercise.items || [];

  // Dạng A: Binary Choice trong câu
  if (exCode === "A" || exType === "binary_choice") {
    return (
      <BinaryChoiceExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Dạng B: Sửa cụm từ in đậm
  if (exCode === "B" || exType === "correction") {
    return (
      <RewriteCorrectionExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Dạng C: Chia động từ trong ngoặc đơn
  if (exCode === "C" || exType === "bracket_verb") {
    return (
      <BracketVerbExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Dạng D: Điền từ từ hộp từ vựng có sẵn
  if (exCode === "D" || exType === "word_bank") {
    return (
      <WordBankExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Dạng E: Trắc nghiệm 4 lựa chọn (A, B, C, D)
  if (exCode === "E" || exType === "multiple_choice") {
    return (
      <MultipleChoiceExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Dạng F, I: Bài đọc / hội thoại có chỗ trống đánh số
  if (exCode === "F" || exCode === "I" || exType === "passage_gap_fill" || exType === "dialogue_cloze") {
    return (
      <PassageClozeExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Dạng G: Ghép 2 vế câu (Matching)
  if (exCode === "G" || exType === "matching") {
    return (
      <MatchingExercise
        items={items}
        exercise={exercise}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Dạng H: Tìm từ thừa theo dòng văn bản (Extra word)
  if (exCode === "H" || exType === "extra_word") {
    return (
      <ExtraWordExercise
        items={items}
        exercise={exercise}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Dạng J: Biến đổi câu với từ khóa in hoa (Key word transformation)
  if (exCode === "J" || exType === "key_word_transformation") {
    return (
      <KeyWordTransformationExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Fallback mặc định
  return (
    <BracketVerbExercise
      items={items}
      userAnswers={userAnswers}
      result={result}
      onAnswerChange={onAnswerChange}
    />
  );
};
