import { fetchFirestoreDocument } from "./fetchFirestoreDocument";
import { Game, Games } from "../Types";

export const getGames = async (env: Env): Promise<Games> => {
  const document = await fetchFirestoreDocument(env, "configs/games");
  const nintendo = (document?.nintendo as Record<string, Game> | undefined) ?? {};
  const steam = (document?.steam as Record<string, Game> | undefined) ?? {};
  return { nintendo, steam };
};
