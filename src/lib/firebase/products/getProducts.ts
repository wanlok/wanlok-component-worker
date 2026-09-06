import { fetchFirestoreDocument } from "../fetchFirestoreDocument";
import { ApiResponse, Product, ProductType } from "../../Types";

export const getProducts = async (
  env: Env,
  type: ProductType
): Promise<ApiResponse<Record<string, Record<string, Product>>>> => {
  const document = await fetchFirestoreDocument(env, `prices/${type}`);
  const products = (document as Record<string, Record<string, Product>> | undefined) ?? {};
  return { status: "ok", data: products };
};
