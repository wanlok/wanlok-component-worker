import { writeFirestoreDocument } from "./writeFirestoreDocument";
import { Quiz } from "../Types";

export const postQuizzes = (env: Env, quizzes: Quiz[]): Promise<boolean> => {
  return writeFirestoreDocument(env, "configs/quizzes", { quizzes });
};
