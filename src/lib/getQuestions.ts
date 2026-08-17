import { Question, Region } from "./Types";

const ANSWER_DELIMITER_PATTERNS: { [key: string]: RegExp } = {
  letterDot: /(?<![A-Za-z])(?=[A-Za-z]\.\s)/,
  letterParen: /(?<![A-Za-z])(?=[A-Za-z]\)\s)/,
  numberDot: /(?<!\d)(?=\d+\.\s)/,
  numberParen: /(?<!\d)(?=\d+\)\s)/,
  romanDot: /(?<![A-Za-z])(?=[ivxlcdm]+\.\s)/i,
  romanParen: /(?<![A-Za-z])(?=[ivxlcdm]+\)\s)/i,
  dash: /(?<!\S)(?=-\s)/
};

const ANSWER_LABEL_PATTERNS: { [key: string]: RegExp } = {
  letterDot: /^[A-Za-z]\.\s*/,
  letterParen: /^[A-Za-z]\)\s*/,
  numberDot: /^\d+\.\s*/,
  numberParen: /^\d+\)\s*/,
  romanDot: /^[ivxlcdm]+\.\s*/i,
  romanParen: /^[ivxlcdm]+\)\s*/i,
  dash: /^-\s*/
};

const getQuestionAnswers = (text: string, delimiter: string): string[] => {
  return text
    .split(ANSWER_DELIMITER_PATTERNS[delimiter])
    .map((answer) => answer.replace(ANSWER_LABEL_PATTERNS[delimiter], "").trim())
    .filter((answer) => answer.length > 0);
};

export const getQuestions = (layout: string | undefined, regions: Region[] | undefined): Question[] | undefined => {
  if (layout !== "quiz" || !regions) {
    return undefined;
  }
  const questions: Question[] = [];
  let collectingQuestion = false;
  regions.forEach((region) => {
    const type = region.type ?? "question";
    if (type === "question") {
      const currentEntry = questions[questions.length - 1];
      if (currentEntry && collectingQuestion) {
        currentEntry.content.push({ type: "text", value: region.recognisedText ?? "" });
      } else {
        questions.push({ content: [{ type: "text", value: region.recognisedText ?? "" }], answers: [] });
        collectingQuestion = true;
      }
      return;
    }
    if (type !== "answers") {
      return;
    }
    const currentEntry = questions[questions.length - 1];
    if (!currentEntry) {
      return;
    }
    collectingQuestion = false;
    getQuestionAnswers(region.recognisedText ?? "", region.delimiter ?? "letterDot").forEach((text, i) => {
      currentEntry.answers.push({
        content: [{ type: "text", value: text }],
        correct: region.correctAnswerIndices?.includes(i) ?? false
      });
    });
  });
  return questions;
};
