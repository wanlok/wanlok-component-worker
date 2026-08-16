/**
 * Serves link-preview pages for collections shared from https://wanlok.github.io.
 *
 * That site is a hash-routed SPA (e.g. #/collections/hong-kong-food), so social apps
 * (WhatsApp, Facebook, etc.) can never see the hash fragment and always get the same
 * generic homepage preview. This Worker exposes the same collection at a real path
 * (/share/collections/:slug), reads the actual title/item data from Firestore, and:
 *  - serves an HTML page with Open Graph tags when the requester is a known bot/crawler
 *  - 302-redirects real visitors straight to the hash-routed page on the real site
 */

import { Hono } from "hono";
import { shareRoutes } from "./routes/share";
import { apiRoutes } from "./routes/api";

const app = new Hono<{ Bindings: Env }>({ strict: false });

app.route("/share", shareRoutes);
app.route("/api", apiRoutes);

export default app;
