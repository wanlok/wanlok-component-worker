import { fetchFirestoreDocument } from "./fetchFirestoreDocument";
import { Folder } from "../Types";

export const getFolders = async (env: Env): Promise<Folder[]> => {
  const document = await fetchFirestoreDocument(env, "configs/folders");
  if (!document) {
    return [];
  }
  const folders = document.folders as Folder[] | undefined;
  if (!folders) {
    return [];
  }
  return folders;
};
