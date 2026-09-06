import { fetchFirestoreDocument } from "../fetchFirestoreDocument";
import { ApiResponse, ProductPrices, ProductType } from "../../Types";

export const getProducts = async (env: Env, type: ProductType): Promise<ApiResponse<ProductPrices>> => {
  const document = await fetchFirestoreDocument(env, `prices/${type}`);
  const prices = (document as ProductPrices | undefined) ?? {};
  return { status: "ok", data: prices };
};
