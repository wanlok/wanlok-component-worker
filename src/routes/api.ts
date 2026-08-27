import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCollection } from "../lib/firebase/getCollection";
import { getFolders } from "../lib/firebase/getFolders";
import { getGames } from "../lib/firebase/getGames";
import { postGame } from "../lib/firebase/postGame";
import { putGames } from "../lib/firebase/putGames";
import { patchGame } from "../lib/firebase/patchGame";
import { Platform } from "../lib/Types";

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

route.get("/games", async (c) => {
  const data = await getGames(c.env);
  return c.json({ status: "ok", data });
});

route.post("/games", async (c) => {
  const { name, url } = await c.req.json<{ name: string; url: string }>();
  const data = await postGame(c.env, name, url);
  return c.json({ status: "ok", data });
});

route.put("/games", async (c) => {
  const data = await putGames(c.env);
  return c.json({ status: "ok", data });
});

route.patch("/games", async (c) => {
  const { platform, name, newName } = await c.req.json<{ platform: Platform; name: string; newName: string }>();
  const data = await patchGame(c.env, platform, name, newName);
  return c.json({ status: "ok", data });
});
