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

export const isBotRequest = (userAgent: string | null): boolean => {
  if (!userAgent) {
    return false;
  }
  const value = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => value.includes(bot));
};
