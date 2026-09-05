import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCollection } from "../lib/firebase/getCollection";
import { getFolders } from "../lib/firebase/getFolders";
import { getGames } from "../lib/firebase/products/getGames";
import { postGame } from "../lib/firebase/products/postGame";
import { putGames } from "../lib/firebase/products/putGames";
import { patchGame } from "../lib/firebase/products/patchGame";
import { deleteGame } from "../lib/firebase/products/deleteGame";
import { postProduct } from "../lib/firebase/products/postProduct";
import { getProducts } from "../lib/products/getProducts";
import { Platform, Product } from "../lib/Types";

export const route = new Hono<{ Bindings: Env }>();

route.use(cors());

route.get("/collections", async (c) => {
  const response = await getFolders(c.env);
  if (response.status === "error") {
    return c.json(response);
  }
  const data = response.data.map(({ name, counts }) => ({ name, counts }));
  return c.json({ status: "ok", data });
});

route.get("/collections/:slug", async (c) => {
  const slug = decodeURIComponent(c.req.param("slug"));
  const filters = [...new URL(c.req.url).searchParams.entries()];
  const response = await getCollection(c.env, slug, filters);
  return c.json(response);
});

route.get("/games", async (c) => {
  const response = await getGames(c.env);
  return c.json(response);
});

route.post("/games", async (c) => {
  const { name, url } = await c.req.json<{ name: string; url: string }>();
  const response = await postGame(c.env, name, url);
  return c.json(response);
});

route.put("/games", async (c) => {
  const response = await putGames(c.env);
  return c.json(response);
});

route.patch("/games", async (c) => {
  const { platform, name, newName } = await c.req.json<{ platform: Platform; name: string; newName: string }>();
  const response = await patchGame(c.env, platform, name, newName);
  return c.json(response);
});

route.delete("/games", async (c) => {
  const { platform, name } = await c.req.json<{ platform: Platform; name: string }>();
  const response = await deleteGame(c.env, platform, name);
  return c.json(response);
});

route.get("/products", async (c) => {
  const product = await getProducts(c.req.query("url"));
  return c.json({ status: "ok", data: product });
});

route.post("/products", async (c) => {
  const { url, ...product } = await c.req.json<Product & { url: string }>();
  const response = await postProduct(c.env, url, product);
  return c.json(response);
});
