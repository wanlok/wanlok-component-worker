import { splitAnswers } from "./splitAnswers";
import { Quiz, Region } from "./Types";

export const getQuiz = (layout: string | undefined, regions: Region[] | undefined): Quiz[] | undefined => {
  if (layout !== "quiz" || !regions) {
    return undefined;
  }
  const quiz: Quiz[] = [];
  let collectingQuestion = false;
  regions.forEach((region) => {
    const type = region.type ?? "question";
    if (type === "question") {
      const currentEntry = quiz[quiz.length - 1];
      if (currentEntry && collectingQuestion) {
        currentEntry.question.push({ type: "text", value: region.recognisedText ?? "" });
      } else {
        quiz.push({ question: [{ type: "text", value: region.recognisedText ?? "" }], answers: [] });
        collectingQuestion = true;
      }
      return;
    }
    if (type !== "answers") {
      return;
    }
    const currentEntry = quiz[quiz.length - 1];
    if (!currentEntry) {
      return;
    }
    collectingQuestion = false;
    splitAnswers(region.recognisedText ?? "", region.delimiter ?? "letterDot").forEach((text, i) => {
      currentEntry.answers.push({
        content: [{ type: "text", value: text }],
        correct: region.correctAnswerIndices?.includes(i) ?? false
      });
    });
  });
  return quiz;
};
