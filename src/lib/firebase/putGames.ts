import { CURRENCIES, COUNTRIES } from "../games/currencies";
import { getNintendoGamePrices } from "../games/getNintendoGamePrices";
import { getSteamGamePrices } from "../games/getSteamGamePrices";
import { getGames } from "./getGames";
import { writeFirestoreDocument } from "./writeFirestoreDocument";
import { ApiResponse, Games } from "../Types";

export const putGames = async (env: Env): Promise<ApiResponse<Games>> => {
  const response = await getGames(env);
  if (response.status === "error") {
    return response;
  }
  const games = response.data;
  const datetime = new Date().toISOString();

  for (const currency of CURRENCIES) {
    const names: string[] = [];
    const ids: string[] = [];
    for (const [name, game] of Object.entries(games.nintendo)) {
      const entry = game[currency];
      if (entry) {
        names.push(name);
        ids.push(entry.id);
      }
    }
    if (ids.length === 0) {
      continue;
    }
    const prices = await getNintendoGamePrices(ids, COUNTRIES[currency]);
    names.forEach((name, index) => {
      const price = prices[index];
      if (price !== undefined) {
        games.nintendo[name][currency]?.prices.push({ datetime, price });
      }
    });
  }

  for (const currency of CURRENCIES) {
    const names: string[] = [];
    const ids: string[] = [];
    for (const [name, game] of Object.entries(games.steam)) {
      const entry = game[currency];
      if (entry) {
        names.push(name);
        ids.push(entry.id);
      }
    }
    if (ids.length === 0) {
      continue;
    }
    const prices = await getSteamGamePrices(ids, COUNTRIES[currency]);
    names.forEach((name, index) => {
      const price = prices[index];
      if (price !== undefined) {
        games.steam[name][currency]?.prices.push({ datetime, price });
      }
    });
  }

  await writeFirestoreDocument(env, "configs/games", games);
  return { status: "ok", data: games };
};
