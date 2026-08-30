const extractProductSlug = (url: string): string | undefined => url.match(/\/store\/products\/([^/?]+)/)?.[1];

const extractIdFromHtml = (html: string, slug: string | undefined): string | undefined => {
  if (slug) {
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const nsuidMatch = html.match(new RegExp(`"nsuid":"(\\d+)","name":"[^"]*","urlKey":"${escapedSlug}"`));
    if (nsuidMatch) {
      return nsuidMatch[1];
    }
  }
  return html.match(/ec\.nintendo\.com\/titles\/(\d+)\/redirect/)?.[1];
};

export const extractNintendoTitleId = async (url: string): Promise<string | undefined> => {
  const embeddedId = url.match(/\d{10,}/)?.[0];
  if (embeddedId) {
    return embeddedId;
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });
  if (!response.ok) {
    return undefined;
  }
  const html = await response.text();
  return extractIdFromHtml(html, extractProductSlug(url));
};
