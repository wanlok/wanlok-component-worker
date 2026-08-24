export const extractSteamAppId = (url: string): string | undefined => url.match(/\/app\/(\d+)/)?.[1];
