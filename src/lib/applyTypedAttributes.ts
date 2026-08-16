import { setTypedAttributes } from "./setTypedAttributes";
import { Attributes, CollectionAttributes, CollectionItem, TypedAttributes } from "./Types";

export const applyTypedAttributes = (
  base: Record<string, string | number>,
  collectionAttributes: CollectionAttributes,
  attributes: Attributes | undefined
): CollectionItem => {
  const typedAttributes: TypedAttributes = {};
  setTypedAttributes(typedAttributes, collectionAttributes, attributes);
  return { ...base, ...typedAttributes };
};
