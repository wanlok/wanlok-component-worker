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

export const splitAnswers = (text: string, delimiter: string): string[] => {
  return text
    .split(ANSWER_DELIMITER_PATTERNS[delimiter])
    .map((answer) => answer.replace(ANSWER_LABEL_PATTERNS[delimiter], "").trim())
    .filter((answer) => answer.length > 0);
};
