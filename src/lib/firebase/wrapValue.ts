import { wrapValues } from "./wrapValues";
import { FirestoreValue } from "../Types";

export const wrapValue = (value: unknown): FirestoreValue => {
  if (value === null) {
    return { nullValue: null };
  }
  if (typeof value === "string") {
    return { stringValue: value };
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === "boolean") {
    return { booleanValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(wrapValue) } };
  }
  return { mapValue: { fields: wrapValues(value as Record<string, unknown>) } };
};
