import type { ImageMetadata } from "astro";
import { z } from "astro/zod";
import photoData from "../data/photos.json";
import recommendationData from "../data/recommendations.json";

const nonempty = z.string().trim().min(1);
const secureLink = z.url({ protocol: /^https$/ });
const localFilename = nonempty.regex(
  /^[\w.-]+\.(avif|jpe?g|png|webp)$/i,
  "Use a local image filename.",
);
const source = z.union([secureLink, localFilename]);
const dimension = z.number().int().positive();
const photo = z
  .object({
    src: source,
    alt: nonempty,
    title: nonempty.optional(),
    description: nonempty.optional(),
    location: nonempty.optional(),
    date: nonempty.optional(),
    credit: nonempty.optional(),
    creditUrl: secureLink.optional(),
    fallback: localFilename.optional(),
    width: dimension.optional(),
    height: dimension.optional(),
    sample: z.boolean().optional(),
  })
  .strict()
  .refine(
    (p) => !p.src.startsWith("https://") || (p.width && p.height),
    "Remote photographs need a width and height.",
  );
const recommendation = z
  .object({
    category: nonempty,
    title: nonempty,
    creator: nonempty,
    note: nonempty,
    url: secureLink,
    year: z.number().int().optional(),
    cover: source.optional(),
    favorite: z.boolean().optional(),
    rating: z.number().min(1).max(5).optional(),
    sample: z.boolean().optional(),
  })
  .strict();

const assets = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/{photos,covers}/*.{avif,jpg,jpeg,png,webp}",
  { eager: true },
);
function localImage(group: "photos" | "covers", filename: string) {
  const image = assets[`../assets/${group}/${filename}`]?.default;
  if (!image)
    throw new Error(
      `Missing image: add ${filename} to src/assets/${group}/ or correct its data entry.`,
    );
  return image;
}

export const photos = z
  .array(photo)
  .parse(photoData)
  .map((p) => {
    const local = p.src.startsWith("https://")
      ? undefined
      : localImage("photos", p.src);
    const backup = p.fallback ? localImage("photos", p.fallback) : undefined;
    return {
      ...p,
      original: local?.src ?? p.src,
      thumbnail: local ?? backup,
      backup: backup?.src,
      width: local?.width ?? p.width!,
      height: local?.height ?? p.height!,
    };
  });
export const recommendations = z
  .array(recommendation)
  .parse(recommendationData)
  .map((item) => {
    const local =
      item.cover && !item.cover.startsWith("https://")
        ? localImage("covers", item.cover)
        : undefined;
    return { ...item, image: local?.src ?? item.cover };
  });
