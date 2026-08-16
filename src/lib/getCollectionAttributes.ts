import { fetchFirestoreDocument } from "./fetchFirestoreDocument";
import { toSlug } from "./toSlug";
import { CollectionAttributes, Folder } from "./Types";

export const getCollectionAttributes = async (env: Env, slug: string): Promise<CollectionAttributes> => {
  const document = await fetchFirestoreDocument(env, "configs/folders");
  const folders = (document?.folders as Folder[] | undefined) ?? [];
  const folder = folders.find((folder) => toSlug(folder.name) === slug);
  return folder?.attributes ?? [];
};
