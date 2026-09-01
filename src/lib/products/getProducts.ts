import { getColesPrice } from "./getColesPrice";
import { getWoolworthsPrice } from "./getWoolworthsPrice";
import { Product } from "../Types";

const EXTRACTORS = [getColesPrice, getWoolworthsPrice];

export const getProducts = async (url: string | undefined): Promise<Product | null> => {
  if (!url) {
    return null;
  }
  for (const extractor of EXTRACTORS) {
    const product = await extractor(url);
    if (product !== null) {
      return product;
    }
  }
  return null;
};
