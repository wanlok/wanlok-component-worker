import { getHtml } from "../getHtml";
import { Product } from "../Types";

export const getCapitalProduct = async (url: string): Promise<Product | null> => {
  if (!url.includes("cap.com.hk")) {
    return null;
  }
  const html = await getHtml(url);
  if (!html) {
    return null;
  }
  const name = html.match(/<h1 class="mb-3">([^<]*)<\/h1>/)?.[1];
  const price = html.match(/price-current[^"]*">\s*HK\$([\d,]+(?:\.\d+)?)/)?.[1];
  if (!name || !price) {
    return null;
  }
  return { name, type: "computer-hardware", price: Number(price.replace(/,/g, "")) };
};
