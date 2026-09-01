export const extractNintendoUrlType = (url: string): "titles" | "bundles" | undefined => {
  const type = url.match(/\/(titles|bundles)\//)?.[1] as "titles" | "bundles" | undefined;
  if (type) {
    return type;
  }
  return url.includes("nintendo.com.au") ? "titles" : undefined;
};
