import { getProducts } from "./getProducts";
import { writeFirestoreDocument } from "../writeFirestoreDocument";
import { ApiResponse, Product, ProductType } from "../../Types";

export const patchProduct = async (
  env: Env,
  type: ProductType,
  name: string,
  newName: string
): Promise<ApiResponse<Record<string, Record<string, Product>>>> => {
  const response = await getProducts(env, type);
  if (response.status === "error") {
    return response;
  }
  const products = response.data;
  if (!products[name]) {
    return { status: "error", message: `Product not found: ${name}` };
  }
  const urls = products[newName] ?? {};
  for (const [url, product] of Object.entries(products[name])) {
    const existing = urls[url];
    urls[url] = existing ? { seller: product.seller, prices: [...existing.prices, ...product.prices] } : product;
  }
  products[newName] = urls;
  delete products[name];
  await writeFirestoreDocument(env, `prices/${type}`, products);
  return { status: "ok", data: products };
};
