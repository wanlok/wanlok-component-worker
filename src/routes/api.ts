import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCollection } from "../lib/firebase/getCollection";
import { getFolders } from "../lib/firebase/getFolders";

export const route = new Hono<{ Bindings: Env }>();

route.use(cors());

route.get("/collections", async (c) => {
  const folders = await getFolders(c.env);
  const data = folders.map(({ name, counts }) => ({ name, counts }));
  return c.json({ status: "ok", data });
});

route.get("/collections/:slug", async (c) => {
  const slug = decodeURIComponent(c.req.param("slug"));
  const filters = [...new URL(c.req.url).searchParams.entries()];
  const data = await getCollection(c.env, slug, filters);
  return c.json({ status: "ok", data });
});
