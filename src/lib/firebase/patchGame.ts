import { getGames } from "./getGames";
import { writeFirestoreDocument } from "./writeFirestoreDocument";
import { Games, Platform } from "../Types";

export const patchGame = async (env: Env, platform: Platform, name: string, newName: string): Promise<Games> => {
  const games = await getGames(env);
  const collection = games[platform];
  if (!collection[name]) {
    throw new Error(`Game not found: ${name}`);
  }
  if (collection[newName]) {
    throw new Error(`Game already exists: ${newName}`);
  }
  collection[newName] = collection[name];
  delete collection[name];
  await writeFirestoreDocument(env, "configs/games", games);
  return games;
};
