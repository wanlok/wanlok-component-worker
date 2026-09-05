import { getHtml } from "../getHtml";
import { Product } from "../Types";

const decodeHTMLEntities = (value: string): string =>
  value.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');

export const getColesProduct = async (url: string): Promise<Product | null> => {
  if (!url.includes("coles.com.au")) {
    return null;
  }
  const html = await getHtml(url);
  if (!html) {
    return null;
  }
  const name = html.match(/data-testid="title">([^<]*)</)?.[1];
  const price = html.match(/aria-label="Price \$([\d.]+)"/)?.[1];
  if (!name || !price) {
    return null;
  }
  return { name: decodeHTMLEntities(name), type: "supermarkets", price: Number(price) };
};
