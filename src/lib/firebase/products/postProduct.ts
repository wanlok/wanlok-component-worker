import { fetchFirestoreDocument } from "../fetchFirestoreDocument";
import { writeFirestoreDocument } from "../writeFirestoreDocument";
import { ApiResponse, Product, SearchProduct } from "../../Types";

export const postProduct = async (
  env: Env,
  url: string,
  searchProduct: SearchProduct
): Promise<ApiResponse<Record<string, Record<string, Product>>>> => {
  const { type, seller, name, price } = searchProduct;
  const path = `prices/${type}`;
  const document = await fetchFirestoreDocument(env, path);
  const products = (document as Record<string, Record<string, Product>> | undefined) ?? {};
  const urls = products[name] ?? {};
  const product = urls[url] ?? { seller, prices: [] };
  product.prices.push({ datetime: new Date().toISOString(), price });
  products[name] = { ...urls, [url]: product };
  await writeFirestoreDocument(env, path, products);
  return { status: "ok", data: products };
};
