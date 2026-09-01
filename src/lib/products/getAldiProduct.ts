import { BROWSER_HEADERS } from "../Constants";
import { Product } from "../Types";

export const getAldiProduct = async (url: string): Promise<Product | null> => {
  if (!url.includes("aldi.com.au")) {
    return null;
  }
  const response = await fetch(url, { headers: BROWSER_HEADERS });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const name = html.match(/product-details__title">([^<]*)</)?.[1];
  const price = html.match(/base-price__regular"><span>\$([\d.]+)</)?.[1];
  if (!name || !price) {
    return null;
  }
  return { name, price: Number(price) };
};
