import { getGames } from "./getGames";
import { writeFirestoreDocument } from "../writeFirestoreDocument";
import { PLATFORMS } from "../../Constants";
import { ApiResponse, Games, Platform } from "../../Types";

export const deleteGame = async (env: Env, platform: Platform, name: string): Promise<ApiResponse<Games>> => {
  if (!PLATFORMS.includes(platform)) {
    return { status: "error", message: `Invalid platform: ${platform}` };
  }
  const response = await getGames(env);
  if (response.status === "error") {
    return response;
  }
  const games = response.data;
  const collection = games[platform];
  if (!collection[name]) {
    return { status: "error", message: `Game not found: ${name}` };
  }
  delete collection[name];
  await writeFirestoreDocument(env, "configs/games", games);
  return { status: "ok", data: games };
};
