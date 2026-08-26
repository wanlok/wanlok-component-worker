const COUNTRY_CURRENCIES: Record<string, "aud" | "hkd" | "rmb"> = {
  AU: "aud",
  HK: "hkd",
  CN: "rmb"
};

export const extractNintendoCurrency = (url: string): "aud" | "hkd" | "rmb" | undefined => {
  if (url.includes("nintendo.com.hk")) {
    return "hkd";
  }
  const country = url.match(/nintendo\.com\/([A-Z]{2})\//)?.[1];
  return country ? COUNTRY_CURRENCIES[country] : undefined;
};
