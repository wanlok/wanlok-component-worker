import { getAldiProduct } from "./getAldiProduct";
import { getColesProduct } from "./getColesProduct";
import { getWoolworthsProduct } from "./getWoolworthsProduct";
import { Product } from "../Types";

const GETTERS = [getAldiProduct, getColesProduct, getWoolworthsProduct];

export const getProducts = async (url: string | undefined): Promise<Product | null> => {
  if (!url) {
    return null;
  }
  for (const getter of GETTERS) {
    const product = await getter(url);
    if (product !== null) {
      return product;
    }
  }
  return null;
};
