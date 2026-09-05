import { getHtml } from "../getHtml";

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

  const html = await getHtml(url);
  if (!html) {
    return undefined;
  }
  return extractIdFromHtml(html, extractProductSlug(url));
};
