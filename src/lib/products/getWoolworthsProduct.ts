import { getHtml } from "../getHtml";
import { Product } from "../Types";

export const getWoolworthsProduct = async (url: string): Promise<Product | null> => {
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
  return { name: data.name, type: "supermarkets", price: data.offers.price };
};
