import type { APIRoute } from 'astro';
import { href } from '../lib/paths';
export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\nSitemap: ${new URL(href('sitemap-index.xml'), site)}\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
