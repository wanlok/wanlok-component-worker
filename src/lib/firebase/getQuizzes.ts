import { fetchFirestoreDocument } from "./fetchFirestoreDocument";
import { Quiz } from "../Types";

export const getQuizzes = async (env: Env): Promise<Quiz[]> => {
  const document = await fetchFirestoreDocument(env, "configs/quizzes");
  if (!document) {
    return [];
  }
  const quizzes = document.quizItems as Quiz[] | undefined;
  if (!quizzes) {
    return [];
  }
  return quizzes;
};
