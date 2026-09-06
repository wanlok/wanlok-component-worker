import { getProducts } from "./getProducts";
import { writeFirestoreDocument } from "../writeFirestoreDocument";
import { ApiResponse, Product, ProductType } from "../../Types";

export const deleteProduct = async (
  env: Env,
  type: ProductType,
  name: string
): Promise<ApiResponse<Record<string, Record<string, Product>>>> => {
  const response = await getProducts(env, type);
  if (response.status === "error") {
    return response;
  }
  const products = response.data;
  if (!products[name]) {
    return { status: "error", message: `Product not found: ${name}` };
  }
  delete products[name];
  await writeFirestoreDocument(env, `prices/${type}`, products);
  return { status: "ok", data: products };
};
