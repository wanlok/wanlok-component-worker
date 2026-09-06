import { getHtml } from "../getHtml";
import { SearchProduct } from "../Types";

export const getCentralfieldProduct = async (url: string): Promise<SearchProduct | null> => {
  if (!url.includes("centralfield.com")) {
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
  const data = JSON.parse(json) as { name?: string; offers?: { price?: string } };
  if (!data.name || data.offers?.price === undefined) {
    return null;
  }
  return { type: "computer-hardware", seller: "centralfield", name: data.name, price: Number(data.offers.price) };
};
