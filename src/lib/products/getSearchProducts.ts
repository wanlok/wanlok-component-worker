import { getAldiProduct } from "./getAldiProduct";
import { getCapitalProduct } from "./getCapitalProduct";
import { getCentralfieldProduct } from "./getCentralfieldProduct";
import { getColesProduct } from "./getColesProduct";
import { getJumboProduct } from "./getJumboProduct";
import { getWoolworthsProduct } from "./getWoolworthsProduct";
import { SearchProduct } from "../Types";

const GETTERS = [
  getAldiProduct,
  getCapitalProduct,
  getCentralfieldProduct,
  getColesProduct,
  getJumboProduct,
  getWoolworthsProduct
];

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
