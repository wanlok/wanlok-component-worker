import { Hono } from "hono";
import { putGames } from "./lib/firebase/putGames";
import { route as shareRoute } from "./routes/share";
import { route as apiRoute } from "./routes/api";

const app = new Hono<{ Bindings: Env }>({ strict: false });

app.route("/share", shareRoute);
app.route("/api", apiRoute);

export default {
  fetch: app.fetch,
  scheduled: async (event, env, ctx) => {
    ctx.waitUntil(putGames(env));
  }
} satisfies ExportedHandler<Env>;
