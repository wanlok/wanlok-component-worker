import { fetchFirestoreDocument } from "./firebase/fetchFirestoreDocument";
import { filterCollectionItems } from "./filterCollectionItems";
import { getFolder } from "./getFolder";
import { getQuiz } from "./getQuiz";
import { Attribute, AttributeValues, CollectionDocument, CollectionItem } from "./Types";

const getAttributes = async (env: Env, slug: string): Promise<Attribute[]> => {
  const folder = await getFolder(env, slug);
  if (!folder) {
    return [];
  }
  return folder.attributes;
};

export const parseAttributeValues = (
  base: Record<string, string | number>,
  attributes: Attribute[],
  attributeValues: AttributeValues | undefined
): CollectionItem => {
  const typedAttributeValues: { [key: string]: number | string } = {};
  attributes.forEach(({ name, type }) => {
    const value = attributeValues?.[name];
    if (value) {
      if (type === "number") {
        typedAttributeValues[name] = Number(value);
      } else {
        typedAttributeValues[name] = value;
      }
    }
  });
  return { ...base, ...typedAttributeValues };
};

const getItems = async (
  env: Env,
  slug: string,
  attributes: Attribute[],
  filters: [string, string][]
): Promise<Record<string, CollectionItem>> => {
  const data = (await fetchFirestoreDocument(env, `collections/${slug}`)) as unknown as CollectionDocument | undefined;
  if (!data) {
    return {};
  }
  const result: Record<string, CollectionItem> = {};
  Object.entries(data.files ?? {}).forEach(([key, { name, url, attributes: attributeValues, layout, regions }]) => {
    const item = parseAttributeValues({ name, url }, attributes, attributeValues);
    const quiz = getQuiz(layout, regions);
    result[key] = quiz ? { ...item, quiz } : item;
  });
  Object.entries(data.youtubeRegular ?? {}).forEach(([key, { name, imageUrl, attributes: attributeValues }]) => {
    result[key] = parseAttributeValues({ name, imageUrl }, attributes, attributeValues);
  });
  Object.entries(data.youtubeShorts ?? {}).forEach(([key, { name, imageUrl, attributes: attributeValues }]) => {
    result[key] = parseAttributeValues({ name, imageUrl }, attributes, attributeValues);
  });
  Object.entries(data.steam ?? {}).forEach(([key, { name, imageUrl, attributes: attributeValues }]) => {
    result[key] = parseAttributeValues({ name, imageUrl }, attributes, attributeValues);
  });
  return filterCollectionItems(result, attributes, filters);
};

export const getCollection = async (
  env: Env,
  slug: string,
  filters: [string, string][]
): Promise<Record<string, CollectionItem>> => {
  const collectionAttributes = await getAttributes(env, slug);
  return getItems(env, slug, collectionAttributes, filters);
};
