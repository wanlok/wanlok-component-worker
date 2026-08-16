import { toSlug } from "./toSlug";
import { CollectionAttributes, CollectionItem } from "./Types";

export const filterCollectionItems = (
  result: Record<string, CollectionItem>,
  collectionAttributes: CollectionAttributes,
  filters: [string, string][]
): Record<string, CollectionItem> => {
  if (filters.length === 0) {
    return result;
  }
  return Object.fromEntries(
    Object.entries(result).filter(([, item]) =>
      filters.every(([paramKey, paramValue]) => {
        const attribute = collectionAttributes.find((a) => toSlug(a.name) === paramKey);
        if (!attribute) {
          return false;
        }
        return toSlug(String(item[attribute.name] ?? "")) === toSlug(paramValue);
      })
    )
  );
};
