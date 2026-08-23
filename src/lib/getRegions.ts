import { Region } from "./Types";

export const getRegions = (layout: string | undefined, regions: Region[] | undefined): Region[] | undefined => {
  if (layout !== "regions" || !regions) {
    return undefined;
  }
  return regions;
};
