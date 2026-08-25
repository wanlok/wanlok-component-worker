import { extractSteamAppId } from "./extractSteamAppId";
import { getSteamGamePrices } from "./getSteamGamePrices";
import { GamePrice } from "./Types";

export const getSteamGamePrice = async (urlString: string, currency: string): Promise<GamePrice | undefined> => {
  if (!urlString.includes("steampowered.com")) {
    return undefined;
  }
  const appId = extractSteamAppId(urlString);
  if (!appId) {
    return undefined;
  }
  const [price] = await getSteamGamePrices([appId], currency);
  return price;
};
