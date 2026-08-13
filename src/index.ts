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

const SITE_ORIGIN = "https://wanlok.github.io";
const FIRESTORE_BASE = "https://firestore.googleapis.com/v1";

// UA substrings used by link-preview crawlers. Case-insensitive match against the full
// User-Agent header. Note: iMessage previews are fetched by the sender's own device with
// an ordinary Safari-like UA, so they can't be distinguished from a real visitor this way.
const BOT_USER_AGENTS = [
	"whatsapp",
	"facebookexternalhit",
	"facebot",
	"twitterbot",
	"slackbot",
	"discordbot",
	"linkedinbot",
	"telegrambot",
	"skypeuripreview",
	"pinterest",
	"redditbot",
	"vkshare"
];

const isBotRequest = (userAgent: string | null): boolean => {
	if (!userAgent) {
		return false;
	}
	const value = userAgent.toLowerCase();
	return BOT_USER_AGENTS.some((bot) => value.includes(bot));
};

const toSlug = (value: string): string =>
	value
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9.-]/g, "");

const humanizeSlug = (slug: string): string =>
	slug
		.split("-")
		.filter(Boolean)
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ");

// --- Firestore REST document parsing ---
// The REST API wraps every value in a { <type>Value: ... } envelope; the client SDK does
// this unwrapping for you, but plain fetch() calls need to do it manually.

interface FirestoreValue {
	stringValue?: string;
	integerValue?: string;
	doubleValue?: number;
	booleanValue?: boolean;
	nullValue?: null;
	mapValue?: { fields?: Record<string, FirestoreValue> };
	arrayValue?: { values?: FirestoreValue[] };
}

const unwrapValue = (value: FirestoreValue | undefined): unknown => {
	if (!value) {
		return undefined;
	}
	if (value.stringValue !== undefined) {
		return value.stringValue;
	}
	if (value.integerValue !== undefined) {
		return Number(value.integerValue);
	}
	if (value.doubleValue !== undefined) {
		return value.doubleValue;
	}
	if (value.booleanValue !== undefined) {
		return value.booleanValue;
	}
	if (value.nullValue !== undefined) {
		return null;
	}
	if (value.mapValue) {
		return unwrapFields(value.mapValue.fields);
	}
	if (value.arrayValue) {
		return (value.arrayValue.values ?? []).map(unwrapValue);
	}
	return undefined;
};

const unwrapFields = (fields: Record<string, FirestoreValue> | undefined): Record<string, unknown> => {
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(fields ?? {})) {
		result[key] = unwrapValue(value);
	}
	return result;
};

const fetchFirestoreDocument = async (projectId: string, path: string): Promise<Record<string, unknown> | undefined> => {
	const response = await fetch(`${FIRESTORE_BASE}/projects/${projectId}/databases/(default)/documents/${path}`);
	if (!response.ok) {
		return undefined;
	}
	const document = (await response.json()) as { fields?: Record<string, FirestoreValue> };
	return unwrapFields(document.fields);
};

// --- Building the preview from Firestore data ---

interface Preview {
	title: string;
	description: string;
	image: string | undefined;
}

interface CloudinaryFile {
	mimeType?: string;
	url?: string;
}

interface ThumbnailItem {
	imageUrl?: string;
}

const buildCollectionPreview = async (env: Env, slug: string): Promise<Preview> => {
	const [folders, collection] = await Promise.all([
		fetchFirestoreDocument(env.FIREBASE_PROJECT_ID, "configs/folders"),
		fetchFirestoreDocument(env.FIREBASE_PROJECT_ID, `collections/${slug}`)
	]);

	const folderList = (folders?.folders as { name?: string }[] | undefined) ?? [];
	const folder = folderList.find((candidate) => candidate.name && toSlug(candidate.name) === slug);
	const title = folder?.name ?? humanizeSlug(slug);

	const files = (collection?.files as Record<string, CloudinaryFile> | undefined) ?? {};
	const youtubeRegular = (collection?.youtubeRegular as Record<string, ThumbnailItem> | undefined) ?? {};
	const youtubeShorts = (collection?.youtubeShorts as Record<string, ThumbnailItem> | undefined) ?? {};
	const steam = (collection?.steam as Record<string, ThumbnailItem> | undefined) ?? {};

	const itemCount = [files, youtubeRegular, youtubeShorts, steam].reduce((total, bucket) => total + Object.keys(bucket).length, 0);

	const imageFile = Object.values(files).find((file) => file.mimeType?.startsWith("image/"));
	const image =
		imageFile?.url ??
		Object.values(youtubeRegular)[0]?.imageUrl ??
		Object.values(youtubeShorts)[0]?.imageUrl ??
		Object.values(steam)[0]?.imageUrl;

	const description = itemCount > 0 ? `${itemCount} item${itemCount === 1 ? "" : "s"} in this collection` : "A collection on wanlok's site";

	return { title, description, image };
};

const escapeHtml = (value: string): string =>
	value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const renderPreviewHtml = (preview: Preview, pageUrl: string): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(preview.title)}</title>
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(preview.title)}">
<meta property="og:description" content="${escapeHtml(preview.description)}">
<meta property="og:url" content="${escapeHtml(pageUrl)}">
${preview.image ? `<meta property="og:image" content="${escapeHtml(preview.image)}">` : ""}
<meta name="twitter:card" content="${preview.image ? "summary_large_image" : "summary"}">
</head>
<body>
<p>${escapeHtml(preview.title)}</p>
<p>${escapeHtml(preview.description)}</p>
</body>
</html>`;

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		const match = url.pathname.match(/^\/share\/collections\/([^/]+)\/?$/);

		if (!match) {
			return new Response("Not found", { status: 404 });
		}

		const slug = decodeURIComponent(match[1]);
		const destination = `${SITE_ORIGIN}/#/collections/${slug}`;

		if (!isBotRequest(request.headers.get("user-agent"))) {
			return Response.redirect(destination, 302);
		}

		const preview = await buildCollectionPreview(env, slug);
		return new Response(renderPreviewHtml(preview, request.url), {
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} satisfies ExportedHandler<Env>;
