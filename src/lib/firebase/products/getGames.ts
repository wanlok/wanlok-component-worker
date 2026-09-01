import { fetchFirestoreDocument } from "../fetchFirestoreDocument";
import { ApiResponse, Game, Games } from "../../Types";

export const getGames = async (env: Env): Promise<ApiResponse<Games>> => {
  const document = await fetchFirestoreDocument(env, "configs/games");
  const nintendo = (document?.nintendo as Record<string, Game> | undefined) ?? {};
  const steam = (document?.steam as Record<string, Game> | undefined) ?? {};
  return { status: "ok", data: { nintendo, steam } };
};
