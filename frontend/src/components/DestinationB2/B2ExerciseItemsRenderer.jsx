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
  WordFormationPassageExercise,
  WordFormationSentencesExercise,
  CollocationGapFillExercise,
} from "./exercises";

/**
 * Exercise items dispatcher / orchestrator.
 * Delegates strictly based on exercise_type across ALL Destination B2 units.
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

  const exType = exercise.exercise_type;
  const items = exercise.items || [];

  // 1. Trắc nghiệm 4 lựa chọn (A, B, C, D)
  if (exType === "multiple_choice") {
    return (
      <MultipleChoiceExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // 2. Chọn 1 trong 2 từ/cụm từ gạch chéo trong câu (world / earth, goes / is usually going)
  if (exType === "binary_choice") {
    return (
      <BinaryChoiceExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // 3. Điền từ từ hộp từ vựng có sẵn ở đầu bài
  if (exType === "word_bank") {
    return (
      <WordBankExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // 4. Sửa hoặc viết lại cụm từ in đậm/in nghiêng
  if (exType === "correction" || exType === "rewrite") {
    return (
      <RewriteCorrectionExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // 5. Cấu tạo từ theo đoạn văn (Cambridge B2 Word Formation Passage với TỪ GỐC IN HOA)
  if (exType === "word_formation_passage") {
    return (
      <WordFormationPassageExercise
        items={items}
        exercise={exercise}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // 6. Cấu tạo từ theo câu đơn lẻ (với từ in hoa trong ngoặc)
  if (exType === "word_formation_sentences") {
    return (
      <WordFormationSentencesExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // 7. Điền 1 từ vào câu (Collocation / prepositional phrases)
  if (exType === "collocation_gap_fill" || exType === "gap_fill") {
    return (
      <CollocationGapFillExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // 8. Chia động từ trong ngoặc đơn (Grammar brackets)
  if (exType === "bracket_verb") {
    return (
      <BracketVerbExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // 9. Tìm từ thừa theo dòng bài đọc (Notebook Paper Layout)
  if (exType === "extra_word") {
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

  // 10. Ghép 2 vế câu (Matching)
  if (exType === "matching") {
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

  // 11. Biến đổi câu với từ khóa in hoa (Key Word Transformation)
  if (exType === "key_word_transformation") {
    return (
      <KeyWordTransformationExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // 12. Bài đọc / hội thoại điền từ (Ancient Aviators, Holiday Blues...)
  if (exType === "passage_gap_fill" || exType === "dialogue_cloze") {
    return (
      <PassageClozeExercise
        items={items}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Fallback mặc định an toàn
  return (
    <BracketVerbExercise
      items={items}
      userAnswers={userAnswers}
      result={result}
      onAnswerChange={onAnswerChange}
    />
  );
};
