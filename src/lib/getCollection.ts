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

const parseAttributeValues = (
  attributes: Attribute[],
  attributeValues: AttributeValues | undefined
): { [key: string]: number | string } => {
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
  return typedAttributeValues;
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
  const items: Record<string, CollectionItem> = {};
  Object.entries(data.files ?? {}).forEach(([key, { name, url, attributes: attributeValues, layout, regions }]) => {
    const item = { name, url, ...parseAttributeValues(attributes, attributeValues) };
    const quiz = getQuiz(layout, regions);
    items[key] = quiz ? { ...item, quiz } : item;
  });
  Object.entries(data.youtubeRegular ?? {}).forEach(([key, { name, imageUrl, attributes: attributeValues }]) => {
    items[key] = { name, imageUrl, ...parseAttributeValues(attributes, attributeValues) };
  });
  Object.entries(data.youtubeShorts ?? {}).forEach(([key, { name, imageUrl, attributes: attributeValues }]) => {
    items[key] = { name, imageUrl, ...parseAttributeValues(attributes, attributeValues) };
  });
  Object.entries(data.steam ?? {}).forEach(([key, { name, imageUrl, attributes: attributeValues }]) => {
    items[key] = { name, imageUrl, ...parseAttributeValues(attributes, attributeValues) };
  });
  return filterCollectionItems(items, attributes, filters);
};

export const getCollection = async (
  env: Env,
  slug: string,
  filters: [string, string][]
): Promise<Record<string, CollectionItem>> => {
  const collectionAttributes = await getAttributes(env, slug);
  return getItems(env, slug, collectionAttributes, filters);
};
