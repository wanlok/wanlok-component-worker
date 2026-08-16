import { escapeHTML } from "./escapeHTML";
import { Preview } from "./Types";

export const renderPreviewHtml = (preview: Preview, pageUrl: string): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHTML(preview.title)}</title>
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHTML(preview.title)}">
<meta property="og:description" content="${escapeHTML(preview.description)}">
<meta property="og:url" content="${escapeHTML(pageUrl)}">
${preview.image ? `<meta property="og:image" content="${escapeHTML(preview.image)}">` : ""}
<meta name="twitter:card" content="${preview.image ? "summary_large_image" : "summary"}">
</head>
<body>
<p>${escapeHTML(preview.title)}</p>
<p>${escapeHTML(preview.description)}</p>
</body>
</html>`;
