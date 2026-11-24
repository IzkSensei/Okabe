import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    lang: z.enum(["en", "fa"]),
    tags: z.array(z.string().min(1)).default([]),
    sample: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
