import { wrapValues } from "./wrapValues";

const FIRESTORE_BASE = "https://firestore.googleapis.com/v1";

export const writeFirestoreDocument = async (
  env: Env,
  path: string,
  values: Record<string, unknown>
): Promise<boolean> => {
  const response = await fetch(
    `${FIRESTORE_BASE}/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${path}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: wrapValues(values) })
    }
  );
  return response.ok;
};
