const COUNTRY_CURRENCIES: Record<string, "aud" | "cad" | "hkd" | "rmb"> = {
  AU: "aud",
  CA: "cad",
  HK: "hkd",
  CN: "rmb"
};

export const extractNintendoCurrency = (url: string): "aud" | "cad" | "hkd" | "rmb" | undefined => {
  if (url.includes("nintendo.com.hk")) {
    return "hkd";
  }
  const segment = url.match(/nintendo\.com\/([a-zA-Z-]+)\//)?.[1];
  const country = segment?.split("-").pop()?.toUpperCase();
  return country ? COUNTRY_CURRENCIES[country] : undefined;
};
