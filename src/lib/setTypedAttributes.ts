import { Attributes, CollectionAttributes, TypedAttributes } from "./Types";

export const setTypedAttributes = (
  typedAttributes: TypedAttributes,
  collectionAttributes: CollectionAttributes,
  attributes: Attributes | undefined
) => {
  collectionAttributes.forEach(({ name, type }) => {
    const value = attributes?.[name];
    if (value) {
      if (type === "number") {
        typedAttributes[name] = Number(value);
      } else {
        typedAttributes[name] = value;
      }
    }
  });
};
