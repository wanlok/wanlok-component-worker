import { PLATFORMS, PRODUCT_TYPES } from "./Constants";

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
  text?: string;
  translateLanguage?: string;
  translatedText?: string;
  type?: "question" | "answers";
  delimiter?: string;
  correctAnswerIndices?: number[];
}

export type QuizContent = { type: "text" | "image"; value: string };

export type Question = { content: QuizContent[]; answers: { content: QuizContent[]; correct: boolean }[] };

export type Attribute = { name: string; type: "text" | "number"; visible?: boolean };

export type AttributeValues = { [key: string]: string };

export type Counts = {
  chart: number;
  file: number;
  hyperlink: number;
  image: number;
  pdf: number;
  quiz: number;
  region: number;
  steam: number;
  video: number;
  youTubeRegular: number;
  youTubeShort: number;
};

export interface Folder {
  name: string;
  attributes: Attribute[];
  counts: Counts;
}

interface ParentInfo {
  attributes?: AttributeValues;
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

export type ProductType = (typeof PRODUCT_TYPES)[number];

export type Product = {
  type: ProductType;
  name: string;
  price: number;
};

export type ProductPrice = { datetime: string; price: number };

export type ProductPrices = Record<string, Record<string, ProductPrice[]>>;

export type GameEntry = {
  id: string;
  type?: "titles" | "bundles";
  prices: ProductPrice[];
  lowest?: ProductPrice;
  highest?: ProductPrice;
};

export type Game = {
  aud?: GameEntry;
  cad?: GameEntry;
  hkd?: GameEntry;
};

export type Platform = (typeof PLATFORMS)[number];

export type Games = Record<Platform, Record<string, Game>>;

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

export type CollectionItem = Record<string, string | number | Question[] | Region[]>;

export type ApiResponse<T> = { status: "ok"; data: T } | { status: "error"; message: string };

export interface Preview {
  title: string;
  description: string;
  image: string | undefined;
}
