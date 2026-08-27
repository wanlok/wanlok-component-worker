import { fetchFirestoreDocument } from "./fetchFirestoreDocument";
import { ApiResponse, Folder } from "../Types";

export const getFolders = async (env: Env): Promise<ApiResponse<Folder[]>> => {
  const document = await fetchFirestoreDocument(env, "configs/folders");
  const folders = (document?.folders as Folder[] | undefined) ?? [];
  return { status: "ok", data: folders };
};
