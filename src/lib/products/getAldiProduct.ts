import { getHtml } from "../getHtml";
import { SearchProduct } from "../Types";

export const getAldiProduct = async (url: string): Promise<SearchProduct | null> => {
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
  return { type: "supermarkets", seller: "aldi", name, price: Number(price) };
};
