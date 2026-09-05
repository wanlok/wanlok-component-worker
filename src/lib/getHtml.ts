const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9"
};

export const getHtml = async (url: string): Promise<string | null> => {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    return null;
  }
  return await response.text();
};
