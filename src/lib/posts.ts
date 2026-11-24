import { getCollection, type CollectionEntry } from "astro:content";
import { href } from "./paths";

export type Post = CollectionEntry<"blog">;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id),
  );
}

export function postUrl(post: Post) {
  return href("blog/" + post.id + "/");
}

export function displayDate(date: Date, lang: "en" | "fa", full = true) {
  return new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-GB", {
    day: "numeric",
    month: full ? "long" : "short",
    ...(full ? { year: "numeric" as const } : {}),
    timeZone: "UTC",
  }).format(date);
}

export function readingMinutes(source: string) {
  const prose = source.replace(/```[^]*?```/g, " ").replace(/<[^>]+>/g, " ");
  const words = prose.match(/[\p{L}\p{N}]+(?:[’'\u200c-][\p{L}\p{N}]+)*/gu);
  return Math.max(1, Math.ceil((words?.length ?? 0) / 200));
}
