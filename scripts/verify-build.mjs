// Offline smoke test for the files that GitHub Pages actually serves.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const dist = 'dist';
const origin = new URL(process.env.SITE_URL || 'http://localhost:4321').origin;
const segment = (process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '');
const root = new URL(segment ? `/${segment}/` : '/', origin);
const failures = new Set();
const pages = new Map();
const articleURLs = new Set();
let localReferenceCount = 0;

async function inventory(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await inventory(full));
    else if (entry.isFile()) found.push(path.relative(dist, full).split(path.sep).join('/'));
  }
  return found;
}

const files = new Set(await inventory(dist));
const read = (file) => readFile(path.join(dist, file), 'utf8');
const fail = (file, message) => failures.add(`${file}: ${message}`);
const urlFor = (file) => new URL(file.split('/').map(encodeURIComponent).join('/').replace(/(^|\/)index\.html$/, '$1'), root);

for (const file of files) {
  if (!file.endsWith('.html')) continue;
  const $ = load(await read(file));
  const ids = new Set();
  $('[id]').each((_, el) => {
    const id = $(el).attr('id');
    if (ids.has(id)) fail(file, `duplicate id "${id}"`);
    ids.add(id);
  });
  pages.set(file, { $, ids, url: urlFor(file) });
}

function checkLink(value, from, owner, mustBeLocal = false) {
  if (!value?.trim()) return;
  let url;
  try {
    url = new URL(value, from);
  } catch {
    return fail(owner, `invalid URL "${value}"`);
  }
  if (url.origin !== origin || !['https:', 'http:'].includes(url.protocol)) {
    if (mustBeLocal) fail(owner, `expected a site URL: ${url}`);
    return;
  }
  if (!url.pathname.startsWith(root.pathname) && url.pathname + '/' !== root.pathname) {
    return fail(owner, `outside configured base ${root.pathname}: ${value}`);
  }
  let relative, anchor;
  try {
    relative = decodeURIComponent(url.pathname.slice(root.pathname.length)).replace(/\/$/, '');
    anchor = decodeURIComponent(url.hash.slice(1)).split(':~:text=')[0];
  } catch {
    return fail(owner, `invalid URL encoding: ${value}`);
  }
  const target = files.has(relative) ? relative : [relative, 'index.html'].filter(Boolean).join('/');
  if (!files.has(target)) return fail(owner, `missing local target: ${value}`);
  localReferenceCount++;
  if (anchor && pages.has(target) && !pages.get(target).ids.has(anchor) && anchor.toLowerCase() !== 'top') {
    fail(owner, `missing fragment: ${value}`);
  }
  return target;
}

for (const [file, { $, url }] of pages) {
  if (!$('html').attr('lang') || !$('head title').text().trim() || !$('meta[name="description"]').attr('content')?.trim()) {
    fail(file, 'missing document language, title, or description');
  }
  if ($('main').length !== 1 || $('h1').length !== 1) fail(file, 'expected one main landmark and one h1');
  const canonical = $('link[rel="canonical"]').attr('href');
  if (file !== '404.html' && canonical !== url.href) fail(file, `canonical should be ${url.href}, got ${canonical}`);
  $('img').each((_, img) => {
    if ($(img).attr('alt') === undefined) fail(file, 'image missing alt attribute');
  });
  for (const attr of ['href', 'src', 'poster']) {
    $(`[${attr}]`).each((_, el) => checkLink($(el).attr(attr), url, file));
  }
  $('[srcset]').each((_, el) => {
    // Browsers allow a comma inside a URL (including data:). A descriptor ends at a comma.
    const candidates = $(el).attr('srcset').matchAll(/(?:^|,)[\t\n\f\r ]*([^\s,]+(?:,[^\s,]+)*)(?:\s+[^,]*)?/g);
    for (const match of candidates) checkLink(match[1], url, file);
  });
  if (file.startsWith('blog/') && file !== 'blog/index.html') {
    articleURLs.add(url.href);
    const article = $('main article').first();
    const lang = article.attr('lang');
    const dir = article.attr('dir');
    if (!['en', 'fa'].includes(lang) || dir !== (lang === 'fa' ? 'rtl' : 'ltr')) {
      fail(file, `unexpected article language/direction: ${lang}/${dir}`);
    }
  }
}

for (const file of files) {
  if (!file.endsWith('.css')) continue;
  const css = await read(file);
  for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) {
    if (!match[2].startsWith('#')) checkLink(match[2], urlFor(file), file);
  }
}

for (const file of ['index.html', 'cv/index.html', 'blog/index.html', 'photography/index.html', 'interests/index.html', 'rss.xml', 'sitemap-index.xml', 'robots.txt']) {
  if (!files.has(file)) fail(file, 'missing expected output');
}

const indexed = new Set();
for (const file of files) {
  if (!/^sitemap(?:-index|-\d+)?\.xml$/.test(file)) continue;
  const $ = load(await read(file), { xml: true });
  if (!$('sitemapindex, urlset').length) fail(file, 'missing sitemap root');
  $('loc').each((_, el) => {
    const loc = $(el).text();
    const target = checkLink(loc, urlFor(file), file, true);
    if (target && pages.has(target)) indexed.add(target);
  });
}
for (const file of pages.keys()) {
  if (file !== '404.html' && !indexed.has(file)) fail(file, 'missing from sitemap');
}

if (files.has('robots.txt')) {
  const robots = await read('robots.txt');
  if (!robots.split(/\r?\n/).some(line => line.trim() === `Sitemap: ${urlFor('sitemap-index.xml')}`)) {
    fail('robots.txt', 'missing absolute sitemap URL');
  }
}

if (files.has('rss.xml')) {
  const $ = load(await read('rss.xml'), { xml: true });
  if (!$('rss > channel > title').text().trim()) fail('rss.xml', 'missing channel title');
  const feedURLs = new Set();
  $('channel > link, item > link').each((_, el) => {
    const link = $(el).text();
    checkLink(link, root, 'rss.xml', true);
    if ($(el).parent().is('item')) feedURLs.add(link);
  });
  for (const article of articleURLs) {
    if (!feedURLs.has(article)) fail('rss.xml', `missing article ${article}`);
  }
}

if (failures.size) {
  console.error([...failures].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${pages.size} HTML pages, ${articleURLs.size} articles and ${localReferenceCount} local references at ${root}.`);
}
