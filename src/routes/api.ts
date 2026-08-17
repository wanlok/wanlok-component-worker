import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchFirestoreDocument } from "../lib/firebase/fetchFirestoreDocument";
import { getCollectionAttributes } from "../lib/getCollectionAttributes";
import { getCollectionItems } from "../lib/getCollectionItems";
import { toSlug } from "../lib/toSlug";
import { ApiResponse, CollectionItem, Folder } from "../lib/Types";

export const route = new Hono<{ Bindings: Env }>();

route.use(cors());

route.get("/collections", async (c) => {
  const document = await fetchFirestoreDocument(c.env, "configs/folders");
  const folders = (document?.folders as Folder[] | undefined) ?? [];
  const collections = folders.map((folder) => ({ name: folder.name, slug: toSlug(folder.name) }));
  return c.json(collections);
});

route.get("/collections/:slug", async (c) => {
  const slug = decodeURIComponent(c.req.param("slug"));
  const filters = [...new URL(c.req.url).searchParams.entries()];
  const collectionAttributes = await getCollectionAttributes(c.env, slug);
  const items = await getCollectionItems(c.env, slug, collectionAttributes, filters);
  const response: ApiResponse<Record<string, CollectionItem>> = { status: "ok", data: items };
  return c.json(response);
});
