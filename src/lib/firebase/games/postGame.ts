import { extractNintendoCurrency } from "../../games/extractNintendoCurrency";
import { extractNintendoTitleId } from "../../games/extractNintendoTitleId";
import { extractNintendoUrlType } from "../../games/extractNintendoUrlType";
import { extractSteamAppId } from "../../games/extractSteamAppId";
import { getNintendoGamePrices } from "../../games/getNintendoGamePrices";
import { getSteamGamePrices } from "../../games/getSteamGamePrices";
import { getGames } from "./getGames";
import { writeFirestoreDocument } from "../writeFirestoreDocument";
import { ApiResponse, COUNTRIES, CURRENCY_CODES, Game, Games } from "../../Types";

export const postGame = async (env: Env, name: string, url: string): Promise<ApiResponse<Games>> => {
  const response = await getGames(env);
  if (response.status === "error") {
    return response;
  }
  const games = response.data;
  if (url.includes("nintendo.com")) {
    const titleId = extractNintendoTitleId(url);
    const currency = extractNintendoCurrency(url);
    const type = extractNintendoUrlType(url);
    if (titleId && currency) {
      const [price] = await getNintendoGamePrices([titleId], COUNTRIES[currency]);
      const prices = price !== undefined ? [{ datetime: new Date().toISOString(), price }] : [];
      games.nintendo[name] = { ...games.nintendo[name], [currency]: { id: titleId, type, prices } };
    }
  } else if (url.includes("steampowered.com")) {
    const appId = extractSteamAppId(url);
    if (appId) {
      const game: Game = {};
      for (const currency of CURRENCY_CODES) {
        const [price] = await getSteamGamePrices([appId], COUNTRIES[currency]);
        const prices = price !== undefined ? [{ datetime: new Date().toISOString(), price }] : [];
        game[currency] = { id: appId, prices };
      }
      games.steam[name] = game;
    }
  }
  await writeFirestoreDocument(env, "configs/games", games);
  return { status: "ok", data: games };
};
