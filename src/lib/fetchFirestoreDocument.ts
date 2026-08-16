import { unwrapFields } from "./unwrapFields";
import { FirestoreValue } from "./Types";

const FIRESTORE_BASE = "https://firestore.googleapis.com/v1";

export const fetchFirestoreDocument = async (env: Env, path: string): Promise<Record<string, unknown> | undefined> => {
  const response = await fetch(
    `${FIRESTORE_BASE}/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${path}`
  );
  if (!response.ok) {
    return undefined;
  }
  const document = (await response.json()) as { fields?: Record<string, FirestoreValue> };
  return unwrapFields(document.fields);
};
