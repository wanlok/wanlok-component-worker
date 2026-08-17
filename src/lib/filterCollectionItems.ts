import { toSlug } from "./toSlug";
import { Attribute, CollectionItem } from "./Types";

export const filterCollectionItems = (
  items: Record<string, CollectionItem>,
  attributes: Attribute[],
  filters: [string, string][]
): Record<string, CollectionItem> => {
  if (filters.length === 0) {
    return items;
  }
  return Object.fromEntries(
    Object.entries(items).filter(([, item]) =>
      filters.every(([key, value]) => {
        const attribute = attributes.find((a) => toSlug(a.name) === key);
        if (!attribute) {
          return false;
        }
        return toSlug(String(item[attribute.name] ?? "")) === toSlug(value);
      })
    )
  );
};
