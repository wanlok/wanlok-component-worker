import { getFolders } from "./firebase/getFolders";
import { toSlug } from "./toSlug";
import { Folder } from "./Types";

export const getFolder = async (env: Env, slug: string): Promise<Folder | undefined> => {
  const response = await getFolders(env);
  if (response.status === "error") {
    return undefined;
  }
  return response.data.find((folder) => toSlug(folder.name) === slug);
};
