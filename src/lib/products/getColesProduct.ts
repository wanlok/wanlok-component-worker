import { getHtml } from "../getHtml";
import { SearchProduct } from "../Types";

const decodeHTMLEntities = (value: string): string =>
  value.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');

export const getColesProduct = async (url: string): Promise<SearchProduct | null> => {
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
  return { type: "supermarkets", seller: "Coles", name: decodeHTMLEntities(name), price: Number(price) };
};
