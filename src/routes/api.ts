import { Hono } from "hono";
import { fetchFirestoreDocument } from "../lib/fetchFirestoreDocument";
import { toSlug } from "../lib/toSlug";
import { Folder } from "../lib/Types";

export const apiRoutes = new Hono<{ Bindings: Env }>();

apiRoutes.get("/collections", async (c) => {
  const document = await fetchFirestoreDocument(c.env, "configs/folders");
  const folders = (document?.folders as Folder[] | undefined) ?? [];
  const collections = folders.map((folder) => ({ name: folder.name, slug: toSlug(folder.name) }));
  return c.json(collections);
});
