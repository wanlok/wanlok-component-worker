// The Firestore REST API wraps every value in a { <type>Value: ... } envelope; the client
// SDK does this unwrapping for you, but plain fetch() calls need to do it manually.
export interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  mapValue?: { fields?: Record<string, FirestoreValue> };
  arrayValue?: { values?: FirestoreValue[] };
}

export interface RegionPoint {
  x: number;
  y: number;
}

export interface Region {
  points: RegionPoint[];
  recogniseLanguage?: string;
  recognisedText?: string;
  translateLanguage?: string;
  translatedText?: string;
  type?: "question" | "answers";
  delimiter?: string;
  correctAnswerIndices?: number[];
}

export type QuizContent = { type: "text" | "image"; value: string };

export type Quiz = { question: QuizContent[]; answers: { content: QuizContent[]; correct: boolean }[] };

export type Attributes = { [key: string]: string };

export type TypedAttributes = { [key: string]: number | string };

export type CollectionAttributes = { name: string; type: "text" | "number"; visible?: boolean }[];

export interface Folder {
  name: string;
  attributes: CollectionAttributes;
}

interface ParentInfo {
  attributes?: Attributes;
}

export interface CloudinaryFileInfo extends ParentInfo {
  name: string;
  mimeType: string;
  url: string;
  layout?: string;
  regions?: Region[];
}

export interface SteamInfo extends ParentInfo {
  name: string;
  imageUrl: string;
}

export interface YouTubeInfo extends ParentInfo {
  name: string;
  imageUrl: string;
}

export interface CollectionDocument {
  files: { [key: string]: CloudinaryFileInfo };
  steam: { [key: string]: SteamInfo };
  youtubeRegular: { [key: string]: YouTubeInfo };
  youtubeShorts: { [key: string]: YouTubeInfo };
}

export type CollectionItem = Record<string, string | number | Quiz[]>;

export type ApiResponse<T> = { status: string; data: T };

export interface Preview {
  title: string;
  description: string;
  image: string | undefined;
}
