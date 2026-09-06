import { getHtml } from "../getHtml";
import { SearchProduct } from "../Types";

export const getWoolworthsProduct = async (url: string): Promise<SearchProduct | null> => {
  if (!url.includes("woolworths.com.au")) {
    return null;
  }
  const html = await getHtml(url);
  if (!html) {
    return null;
  }
  const json = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)?.[1];
  if (!json) {
    return null;
  }
  const data = JSON.parse(json) as { name?: string; offers?: { price?: number } };
  if (!data.name || data.offers?.price === undefined) {
    return null;
  }
  return { type: "supermarkets", seller: "Woolworths", name: data.name, price: data.offers.price };
};
