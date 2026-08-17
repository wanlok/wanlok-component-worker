import { getFolders } from "./firebase/getFolders";
import { toSlug } from "./toSlug";
import { Folder } from "./Types";

export const getFolder = async (env: Env, slug: string): Promise<Folder | undefined> => {
  const folders = await getFolders(env);
  return folders.find((folder) => toSlug(folder.name) === slug);
};
