import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCollection } from "../lib/firebase/getCollection";
import { getFolders } from "../lib/firebase/getFolders";
import { getQuizzes } from "../lib/firebase/getQuizzes";
import { postQuizzes } from "../lib/firebase/postQuizzes";
import { Quiz } from "../lib/Types";

export const route = new Hono<{ Bindings: Env }>();

route.use(cors());

route.get("/collections", async (c) => {
  const folders = await getFolders(c.env);
  const data = folders.map((folder) => folder.name);
  return c.json({ status: "ok", data });
});

route.get("/collections/:slug", async (c) => {
  const slug = decodeURIComponent(c.req.param("slug"));
  const filters = [...new URL(c.req.url).searchParams.entries()];
  const data = await getCollection(c.env, slug, filters);
  return c.json({ status: "ok", data });
});

route.get("/quizzes", async (c) => {
  const quizzes = await getQuizzes(c.env);
  return c.json({ status: "ok", data: quizzes });
});

route.post("/quizzes", async (c) => {
  const quizzes = await c.req.json<Quiz[]>();
  const ok = await postQuizzes(c.env, quizzes);
  return c.json({ status: ok ? "ok" : "error" });
});
