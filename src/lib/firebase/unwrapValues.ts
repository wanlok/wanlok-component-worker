import { unwrapValue } from "./unwrapValue";
import { FirestoreValue } from "../Types";

export const unwrapValues = (values: Record<string, FirestoreValue> | undefined): Record<string, unknown> => {
  const unwrapped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values ?? {})) {
    unwrapped[key] = unwrapValue(value);
  }
  return unwrapped;
};
