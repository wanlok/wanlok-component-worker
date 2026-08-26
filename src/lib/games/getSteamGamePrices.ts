import { GamePrice } from "../Types";

const STEAM_APP_DETAILS_URL = "https://store.steampowered.com/api/appdetails";

type SteamAppDetailsResponse = {
  success: boolean;
  data?: {
    price_overview?: {
      final: number;
    };
  };
};

export const getSteamGamePrices = async (appIds: string[], currency: string): Promise<(GamePrice | undefined)[]> => {
  if (appIds.length === 0) {
    return [];
  }
  const appids = appIds.join(",");
  const filters = "price_overview";
  const cc = currency;
  const response = await fetch(`${STEAM_APP_DETAILS_URL}?appids=${appids}&filters=${filters}&cc=${cc}`);
  if (!response.ok) {
    return appIds.map(() => undefined);
  }
  const data = (await response.json()) as Record<string, SteamAppDetailsResponse>;
  return appIds.map((appId) => {
    const priceOverview = data[appId]?.data?.price_overview;
    if (!priceOverview) {
      return undefined;
    }
    return {
      price: priceOverview.final / 100
    };
  });
};
