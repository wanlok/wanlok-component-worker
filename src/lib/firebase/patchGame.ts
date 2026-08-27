import { getGames } from "./getGames";
import { writeFirestoreDocument } from "./writeFirestoreDocument";
import { ApiResponse, Games, Platform } from "../Types";

export const patchGame = async (
  env: Env,
  platform: Platform,
  name: string,
  newName: string
): Promise<ApiResponse<Games>> => {
  const response = await getGames(env);
  if (response.status === "error") {
    return response;
  }
  const games = response.data;
  const collection = games[platform];
  if (!collection[name]) {
    return { status: "error", message: `Game not found: ${name}` };
  }
  if (collection[newName]) {
    return { status: "error", message: `Game already exists: ${newName}` };
  }
  collection[newName] = collection[name];
  delete collection[name];
  await writeFirestoreDocument(env, "configs/games", games);
  return { status: "ok", data: games };
};
