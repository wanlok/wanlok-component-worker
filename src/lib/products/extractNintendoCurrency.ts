const COUNTRY_CURRENCIES: Record<string, "aud" | "cad" | "hkd"> = {
  AU: "aud",
  CA: "cad",
  HK: "hkd"
};

export const extractNintendoCurrency = (url: string): "aud" | "cad" | "hkd" | undefined => {
  if (url.includes("nintendo.com.hk")) {
    return "hkd";
  }
  if (url.includes("nintendo.com.au")) {
    return "aud";
  }
  const segment = url.match(/nintendo\.com\/([a-zA-Z-]+)\//)?.[1];
  const country = segment?.split("-").pop()?.toUpperCase();
  return country ? COUNTRY_CURRENCIES[country] : undefined;
};
