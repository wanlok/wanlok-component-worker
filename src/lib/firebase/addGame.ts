import { extractNintendoTitleId } from "../games/extractNintendoTitleId";
import { extractSteamAppId } from "../games/extractSteamAppId";
import { getGames } from "./getGames";
import { writeFirestoreDocument } from "./writeFirestoreDocument";
import { Games } from "../Types";

export const addGame = async (env: Env, name: string, url: string): Promise<Games> => {
  const games = await getGames(env);
  if (url.includes("nintendo.com")) {
    const titleId = extractNintendoTitleId(url);
    if (titleId) {
      games.nintendo[titleId] = { name };
    }
  } else if (url.includes("steampowered.com")) {
    const appId = extractSteamAppId(url);
    if (appId) {
      games.steam[appId] = { name };
    }
  }
  await writeFirestoreDocument(env, "configs/games", games);
  return games;
};
