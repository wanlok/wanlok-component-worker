import { wrapValue } from "./wrapValue";
import { FirestoreValue } from "../Types";

export const wrapValues = (values: Record<string, unknown>): Record<string, FirestoreValue> => {
  const wrapped: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(values)) {
    wrapped[key] = wrapValue(value);
  }
  return wrapped;
};
