import { getAldiProduct } from "./getAldiProduct";
import { getCapitalProduct } from "./getCapitalProduct";
import { getColesProduct } from "./getColesProduct";
import { getWoolworthsProduct } from "./getWoolworthsProduct";
import { SearchProduct } from "../Types";

const GETTERS = [getAldiProduct, getCapitalProduct, getColesProduct, getWoolworthsProduct];

export const getSearchProducts = async (url: string | undefined): Promise<SearchProduct | null> => {
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
