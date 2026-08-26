export const extractNintendoTitleId = (url: string): string | undefined => url.match(/\/(\d+)(?:[/?#]|$)/)?.[1];
