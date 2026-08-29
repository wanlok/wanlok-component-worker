export const extractNintendoTitleId = (url: string): string | undefined => url.match(/\d{10,}/)?.[0];
