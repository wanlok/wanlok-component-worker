import { BROWSER_HEADERS } from "../Constants";
import { Product } from "../Types";

export const getWoolworthsPrice = async (url: string): Promise<Product | null> => {
  if (!url.includes("woolworths.com.au")) {
    return null;
  }
  const response = await fetch(url, { headers: BROWSER_HEADERS });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const json = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)?.[1];
  if (!json) {
    return null;
  }
  const data = JSON.parse(json) as { name?: string; offers?: { price?: number } };
  if (!data.name || data.offers?.price === undefined) {
    return null;
  }
  return { name: data.name, price: data.offers.price };
};
