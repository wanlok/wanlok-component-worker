import { GamePrice } from "./Types";

const NINTENDO_PRICE_URL = "https://api.ec.nintendo.com/v1/price";

type NintendoPriceResponse = {
  prices: {
    title_id: number;
    regular_price?: {
      raw_value: string;
    };
    discount_price?: {
      raw_value: string;
    };
  }[];
};

export const getNintendoGamePrices = async (
  titleIds: string[],
  currency: string
): Promise<(GamePrice | undefined)[]> => {
  if (titleIds.length === 0) {
    return [];
  }
  const country = currency.toUpperCase();
  const lang = "en";
  const ids = titleIds.join(",");
  const response = await fetch(`${NINTENDO_PRICE_URL}?country=${country}&lang=${lang}&ids=${ids}`);
  if (!response.ok) {
    return titleIds.map(() => undefined);
  }
  const { prices } = (await response.json()) as NintendoPriceResponse;
  return titleIds.map((titleId) => {
    const price = prices.find(({ title_id }) => String(title_id) === titleId);
    const rawValue = price?.discount_price?.raw_value ?? price?.regular_price?.raw_value;
    if (!rawValue) {
      return undefined;
    }
    return {
      price: Number(rawValue)
    };
  });
};
