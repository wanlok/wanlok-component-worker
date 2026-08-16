import { Hono } from "hono";
import { route as shareRoute } from "./routes/share";
import { route as apiRoute } from "./routes/api";

const app = new Hono<{ Bindings: Env }>({ strict: false });

app.route("/share", shareRoute);
app.route("/api", apiRoute);

export default app;
