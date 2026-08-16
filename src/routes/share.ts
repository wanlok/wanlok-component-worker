import { Hono } from "hono";
import { isBotRequest } from "../lib/isBotRequest";
import { buildCollectionPreview } from "../lib/buildCollectionPreview";
import { renderPreviewHtml } from "../lib/renderPreviewHtml";

const SITE_ORIGIN = "https://wanlok.github.io";

export const route = new Hono<{ Bindings: Env }>();

route.get("/collections/:slug", async (c) => {
  const slug = decodeURIComponent(c.req.param("slug"));
  const destination = `${SITE_ORIGIN}/#/collections/${slug}`;

  if (!isBotRequest(c.req.header("user-agent") ?? null)) {
    return c.redirect(destination, 302);
  }

  const preview = await buildCollectionPreview(c.env, slug);
  return c.html(renderPreviewHtml(preview, destination));
});
