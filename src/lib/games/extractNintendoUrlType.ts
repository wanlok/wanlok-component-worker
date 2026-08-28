export const extractNintendoUrlType = (url: string): "titles" | "bundles" | undefined =>
  url.match(/\/(titles|bundles)\//)?.[1] as "titles" | "bundles" | undefined;
