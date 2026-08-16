import { unwrapFields } from "./unwrapFields";
import { FirestoreValue } from "./Types";

export const unwrapValue = (value: FirestoreValue | undefined): unknown => {
  if (!value) {
    return undefined;
  }
  if (value.stringValue !== undefined) {
    return value.stringValue;
  }
  if (value.integerValue !== undefined) {
    return Number(value.integerValue);
  }
  if (value.doubleValue !== undefined) {
    return value.doubleValue;
  }
  if (value.booleanValue !== undefined) {
    return value.booleanValue;
  }
  if (value.nullValue !== undefined) {
    return null;
  }
  if (value.mapValue) {
    return unwrapFields(value.mapValue.fields);
  }
  if (value.arrayValue) {
    return (value.arrayValue.values ?? []).map(unwrapValue);
  }
  return undefined;
};
