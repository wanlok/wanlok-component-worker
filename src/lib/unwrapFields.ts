import { unwrapValue } from "./unwrapValue";
import { FirestoreValue } from "./Types";

export const unwrapFields = (fields: Record<string, FirestoreValue> | undefined): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields ?? {})) {
    result[key] = unwrapValue(value);
  }
  return result;
};
