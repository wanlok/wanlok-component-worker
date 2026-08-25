import { extractNintendoTitleId } from "./extractNintendoTitleId";
import { getNintendoGamePrices } from "./getNintendoGamePrices";
import { GamePrice } from "./Types";

export const getNintendoGamePrice = async (urlString: string, currency: string): Promise<GamePrice | undefined> => {
  if (!urlString.includes("nintendo.com")) {
    return undefined;
  }
  const titleId = extractNintendoTitleId(urlString);
  if (!titleId) {
    return undefined;
  }
  const [price] = await getNintendoGamePrices([titleId], currency);
  return price;
};
