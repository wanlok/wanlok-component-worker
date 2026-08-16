import { fetchFirestoreDocument } from "./fetchFirestoreDocument";
import { toSlug } from "./toSlug";
import { humanizeSlug } from "./humanizeSlug";
import { CloudinaryFile, Folder, Preview, ThumbnailItem } from "./Types";

export const buildCollectionPreview = async (env: Env, slug: string): Promise<Preview> => {
  const [folders, collection] = await Promise.all([
    fetchFirestoreDocument(env.FIREBASE_PROJECT_ID, "configs/folders"),
    fetchFirestoreDocument(env.FIREBASE_PROJECT_ID, `collections/${slug}`)
  ]);

  const folderList = (folders?.folders as Folder[] | undefined) ?? [];
  const folder = folderList.find((candidate) => toSlug(candidate.name) === slug);
  const title = folder?.name ?? humanizeSlug(slug);

  const files = (collection?.files as Record<string, CloudinaryFile> | undefined) ?? {};
  const youtubeRegular = (collection?.youtubeRegular as Record<string, ThumbnailItem> | undefined) ?? {};
  const youtubeShorts = (collection?.youtubeShorts as Record<string, ThumbnailItem> | undefined) ?? {};
  const steam = (collection?.steam as Record<string, ThumbnailItem> | undefined) ?? {};

  const itemCount = [files, youtubeRegular, youtubeShorts, steam].reduce(
    (total, bucket) => total + Object.keys(bucket).length,
    0
  );

  const imageFile = Object.values(files).find((file) => file.mimeType?.startsWith("image/"));
  const image =
    imageFile?.url ??
    Object.values(youtubeRegular)[0]?.imageUrl ??
    Object.values(youtubeShorts)[0]?.imageUrl ??
    Object.values(steam)[0]?.imageUrl;

  const description =
    itemCount > 0
      ? `${itemCount} item${itemCount === 1 ? "" : "s"} in this collection`
      : "A collection on wanlok's site";

  return { title, description, image };
};
