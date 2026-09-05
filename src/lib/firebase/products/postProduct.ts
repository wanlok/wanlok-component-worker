import { fetchFirestoreDocument } from "../fetchFirestoreDocument";
import { writeFirestoreDocument } from "../writeFirestoreDocument";
import { ApiResponse, Product, ProductPrices } from "../../Types";

export const postProduct = async (env: Env, url: string, product: Product): Promise<ApiResponse<ProductPrices>> => {
  const path = `prices/${product.type}`;
  const document = await fetchFirestoreDocument(env, path);
  const prices = (document as ProductPrices | undefined) ?? {};
  const urls = prices[product.name] ?? {};
  const newPrices = urls[url] ?? [];
  newPrices.push({ datetime: new Date().toISOString(), price: product.price });
  prices[product.name] = { ...urls, [url]: newPrices };
  await writeFirestoreDocument(env, path, prices);
  return { status: "ok", data: prices };
};
