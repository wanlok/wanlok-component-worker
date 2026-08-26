import { COUNTRIES } from "../games/currencies";
import { extractNintendoCurrency } from "../games/extractNintendoCurrency";
import { extractNintendoTitleId } from "../games/extractNintendoTitleId";
import { extractSteamAppId } from "../games/extractSteamAppId";
import { getNintendoGamePrices } from "../games/getNintendoGamePrices";
import { getSteamGamePrices } from "../games/getSteamGamePrices";
import { getGames } from "./getGames";
import { writeFirestoreDocument } from "./writeFirestoreDocument";
import { Games } from "../Types";

export const postGame = async (env: Env, name: string, url: string): Promise<Games> => {
  const games = await getGames(env);
  if (url.includes("nintendo.com")) {
    const titleId = extractNintendoTitleId(url);
    const currency = extractNintendoCurrency(url);
    if (titleId && currency) {
      const [price] = await getNintendoGamePrices([titleId], COUNTRIES[currency]);
      const prices = price !== undefined ? [{ datetime: new Date().toISOString(), price }] : [];
      games.nintendo[name] = { ...games.nintendo[name], [currency]: { id: titleId, prices } };
    }
  } else if (url.includes("steampowered.com")) {
    const appId = extractSteamAppId(url);
    if (appId) {
      const [aud] = await getSteamGamePrices([appId], COUNTRIES.aud);
      const [hkd] = await getSteamGamePrices([appId], COUNTRIES.hkd);
      const [rmb] = await getSteamGamePrices([appId], COUNTRIES.rmb);
      games.steam[name] = {
        aud: { id: appId, prices: aud !== undefined ? [{ datetime: new Date().toISOString(), price: aud }] : [] },
        hkd: { id: appId, prices: hkd !== undefined ? [{ datetime: new Date().toISOString(), price: hkd }] : [] },
        rmb: { id: appId, prices: rmb !== undefined ? [{ datetime: new Date().toISOString(), price: rmb }] : [] }
      };
    }
  }
  await writeFirestoreDocument(env, "configs/games", games);
  return games;
};
