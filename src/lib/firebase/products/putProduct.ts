import { getProducts } from "./getProducts";
import { writeFirestoreDocument } from "../writeFirestoreDocument";
import { getSearchProducts } from "../../products/getSearchProducts";
import { ApiResponse, Product, ProductType } from "../../Types";

export const putProduct = async (
  env: Env,
  type: ProductType,
  name: string
): Promise<ApiResponse<Record<string, Record<string, Product>>>> => {
  const response = await getProducts(env, type);
  if (response.status === "error") {
    return response;
  }
  const products = response.data;
  const urls = products[name];
  if (!urls) {
    return { status: "error", message: `Product not found: ${name}` };
  }
  const datetime = new Date().toISOString();
  const today = datetime.slice(0, 10);
  for (const [url, product] of Object.entries(urls)) {
    const last = product.prices[product.prices.length - 1];
    if (last?.datetime.slice(0, 10) === today) {
      continue;
    }
    const searchProduct = await getSearchProducts(url);
    if (searchProduct) {
      product.prices.push({ datetime, price: searchProduct.price });
    }
  }
  await writeFirestoreDocument(env, `prices/${type}`, products);
  return { status: "ok", data: products };
};
