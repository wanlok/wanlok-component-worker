export const CURRENCY_CODES = ["aud", "cad", "hkd"] as const;

export const COUNTRIES: Record<(typeof CURRENCY_CODES)[number], string> = {
  aud: "AU",
  cad: "CA",
  hkd: "HK"
};

export const PLATFORMS = ["nintendo", "steam"] as const;

export const PRODUCT_TYPES = ["computer-hardware", "games", "supermarkets"] as const;
