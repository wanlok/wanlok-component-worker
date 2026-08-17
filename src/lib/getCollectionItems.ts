import { applyTypedAttributes } from "./applyTypedAttributes";
import { fetchFirestoreDocument } from "./firebase/fetchFirestoreDocument";
import { filterCollectionItems } from "./filterCollectionItems";
import { getQuiz } from "./getQuiz";
import { CollectionAttributes, CollectionDocument, CollectionItem } from "./Types";

export const getCollectionItems = async (
  env: Env,
  slug: string,
  collectionAttributes: CollectionAttributes,
  filters: [string, string][]
): Promise<Record<string, CollectionItem>> => {
  const data = (await fetchFirestoreDocument(env, `collections/${slug}`)) as unknown as CollectionDocument | undefined;

  if (!data) {
    return {};
  }

  const result: Record<string, CollectionItem> = {};

  Object.entries(data.files ?? {}).forEach(([key, { name, url, attributes, layout, regions }]) => {
    const item = applyTypedAttributes({ name, url }, collectionAttributes, attributes);
    const quiz = getQuiz(layout, regions);
    result[key] = quiz ? { ...item, quiz } : item;
  });

  Object.entries(data.youtubeRegular ?? {}).forEach(([key, { name, imageUrl, attributes }]) => {
    result[key] = applyTypedAttributes({ name, imageUrl }, collectionAttributes, attributes);
  });

  Object.entries(data.youtubeShorts ?? {}).forEach(([key, { name, imageUrl, attributes }]) => {
    result[key] = applyTypedAttributes({ name, imageUrl }, collectionAttributes, attributes);
  });

  Object.entries(data.steam ?? {}).forEach(([key, { name, imageUrl, attributes }]) => {
    result[key] = applyTypedAttributes({ name, imageUrl }, collectionAttributes, attributes);
  });

  return filterCollectionItems(result, collectionAttributes, filters);
};
