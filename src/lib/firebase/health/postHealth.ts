import { writeFirestoreDocument } from "../writeFirestoreDocument";
import { ApiResponse, Health } from "../../Types";

export const postHealth = async (env: Env): Promise<ApiResponse<Health>> => {
  const health: Health = { datetime: new Date().toISOString() };
  await writeFirestoreDocument(env, "configs/health", health);
  return { status: "ok", data: health };
};
