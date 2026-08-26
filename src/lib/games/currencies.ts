export const CURRENCIES = ["aud", "hkd", "rmb"] as const;

export const COUNTRIES: Record<(typeof CURRENCIES)[number], string> = {
  aud: "AU",
  hkd: "HK",
  rmb: "CN"
};
