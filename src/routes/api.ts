import { Hono } from "hono";
import { fetchFirestoreDocument } from "../lib/fetchFirestoreDocument";
import { toSlug } from "../lib/toSlug";
import { Folder } from "../lib/Types";

export const apiRoutes = new Hono<{ Bindings: Env }>();

apiRoutes.get("/collections", async (c) => {
  const folders = await fetchFirestoreDocument(c.env.FIREBASE_PROJECT_ID, "configs/folders");
  const folderList = (folders?.folders as Folder[] | undefined) ?? [];

  const collections = folderList.map((folder) => ({ name: folder.name, slug: toSlug(folder.name) }));

  return c.json(collections);
});
