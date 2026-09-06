import { getHtml } from "../getHtml";
import { SearchProduct } from "../Types";

export const getJumboProduct = async (url: string): Promise<SearchProduct | null> => {
  if (!url.includes("jumbo-computer.com")) {
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
  const data = JSON.parse(json) as { name?: string; offers?: { price?: number }[] };
  const price = data.offers?.[0]?.price;
  if (!data.name || price === undefined) {
    return null;
  }
  return { type: "computer-hardware", seller: "jumbo", name: data.name, price };
};
