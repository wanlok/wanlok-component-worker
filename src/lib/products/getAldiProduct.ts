import { getHtml } from "../getHtml";
import { Product } from "../Types";

export const getAldiProduct = async (url: string): Promise<Product | null> => {
  if (!url.includes("aldi.com.au")) {
    return null;
  }
  const html = await getHtml(url);
  if (!html) {
    return null;
  }
  const name = html.match(/product-details__title">([^<]*)</)?.[1];
  const price = html.match(/base-price__regular"><span>\$([\d.]+)</)?.[1];
  if (!name || !price) {
    return null;
  }
  return { name, type: "supermarkets", price: Number(price) };
};
