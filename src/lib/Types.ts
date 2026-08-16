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

export interface Preview {
	title: string;
	description: string;
	image: string | undefined;
}

export interface CloudinaryFile {
	mimeType?: string;
	url?: string;
}

export interface ThumbnailItem {
	imageUrl?: string;
}
