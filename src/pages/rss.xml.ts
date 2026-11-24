import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts, postUrl } from "../lib/posts";
import { href } from "../lib/paths";
import { profile } from "../config/profile";

export async function GET({ site }: APIContext) {
  const posts = await getPosts();
  return rss({
    title: profile.siteTitle + " — Blog",
    description: "Technical field notes in English and Persian.",
    site: new URL(href(""), site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: new URL(postUrl(post), site).href,
    })),
  });
}
