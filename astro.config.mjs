import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import articleHeadings from "./src/lib/article-headings.mjs";

// GitHub Actions supplies these from the Pages configuration, including custom domains.
const site = process.env.SITE_URL || "http://localhost:4321";
const base =
  "/" + (process.env.BASE_PATH || "").split("/").filter(Boolean).join("/");
export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, articleHeadings],
    }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    },
  },
});
