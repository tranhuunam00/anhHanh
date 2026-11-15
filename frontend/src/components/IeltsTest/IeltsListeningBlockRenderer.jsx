import React from "react";
import { IeltsListeningNoteBlock } from "./IeltsListeningNoteBlock.jsx";
import { IeltsListeningFormBlock } from "./IeltsListeningFormBlock.jsx";
import { IeltsListeningTableBlock } from "./IeltsListeningTableBlock.jsx";
import { IeltsListeningFlowchartBlock } from "./IeltsListeningFlowchartBlock.jsx";

export {
  extractQuestionNumbersFromBlock,
  extractAllHandledQuestionNumbers
} from "../../utils/ieltsListeningBlockUtils.js";

export function renderNoteBlock(noteBlock, answers, onChange, evaluation, isReview) {
  return (
    <IeltsListeningNoteBlock
      noteBlock={noteBlock}
      answers={answers}
      onChange={onChange}
      evaluation={evaluation}
      isReview={isReview}
    />
  );
}

export function renderFormBlock(formBlock, answers, onChange, evaluation, isReview) {
  return (
    <IeltsListeningFormBlock
      formBlock={formBlock}
      answers={answers}
      onChange={onChange}
      evaluation={evaluation}
      isReview={isReview}
    />
  );
}

export function renderTableBlock(tableBlock, answers, onChange, evaluation, isReview) {
  return (
    <IeltsListeningTableBlock
      tableBlock={tableBlock}
      answers={answers}
      onChange={onChange}
      evaluation={evaluation}
      isReview={isReview}
    />
  );
}

export function renderFlowchartBlock(flowchartBlock, answers, onChange, evaluation, isReview) {
  return (
    <IeltsListeningFlowchartBlock
      flowchartBlock={flowchartBlock}
      answers={answers}
      onChange={onChange}
      evaluation={evaluation}
      isReview={isReview}
    />
  );
}

/**
 * Dispatcher to render a block of any supported type
 */
export function renderBlock(block, answers, onChange, evaluation, isReview) {
  if (!block) return null;
  if (block.type === "notes") {
    return renderNoteBlock(block, answers, onChange, evaluation, isReview);
  }
  if (block.type === "form") {
    return renderFormBlock(block, answers, onChange, evaluation, isReview);
  }
  if (block.type === "table") {
    return renderTableBlock(block, answers, onChange, evaluation, isReview);
  }
  if (block.type === "flowchart") {
    return renderFlowchartBlock(block, answers, onChange, evaluation, isReview);
  }
  return null;
}
