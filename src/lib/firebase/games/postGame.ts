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
    const titleId = await extractNintendoTitleId(url);
    const currency = extractNintendoCurrency(url);
    const type = extractNintendoUrlType(url);
    if (!titleId || !currency) {
      return { status: "error", message: "Could not determine the Nintendo title id or currency for this URL" };
    }
    const [price] = await getNintendoGamePrices([titleId], COUNTRIES[currency]);
    const prices = price !== undefined ? [{ datetime: new Date().toISOString(), price }] : [];
    const [point] = prices;
    games.nintendo[name] = {
      ...games.nintendo[name],
      [currency]: { id: titleId, type, prices, lowest: point, highest: point }
    };
  } else if (url.includes("steampowered.com")) {
    const appId = extractSteamAppId(url);
    if (!appId) {
      return { status: "error", message: "Could not determine the Steam app id for this URL" };
    }
    const game: Game = {};
    for (const currency of CURRENCY_CODES) {
      const [price] = await getSteamGamePrices([appId], COUNTRIES[currency]);
      const prices = price !== undefined ? [{ datetime: new Date().toISOString(), price }] : [];
      const [point] = prices;
      game[currency] = { id: appId, prices, lowest: point, highest: point };
    }
    games.steam[name] = game;
  } else {
    return { status: "error", message: "Invalid URL" };
  }
  await writeFirestoreDocument(env, "configs/games", games);
  return { status: "ok", data: games };
};
