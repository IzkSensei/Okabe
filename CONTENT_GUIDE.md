# Publishing and editing

Most updates touch one content file. Use GitHub’s editor to commit the change to `main`, or make a local edit and push it. Once Pages is configured, the workflow rebuilds the site automatically.

| To change | Edit or add |
| --- | --- |
| Name, affiliation, biography, interests, contact, profile links or site title | `src/config/profile.ts` |
| CV entries, publications and selected projects | `src/data/cv.ts` |
| Downloadable résumé | `public/cv.pdf` |
| An English or Persian article | A Markdown file under `src/content/blog/` |
| A post image | A file under `src/assets/blog/` or an absolute image URL in the article |
| Photographs | `src/data/photos.json` and local originals in `src/assets/photos/` |
| Recommendations | `src/data/recommendations.json` and optional artwork in `src/assets/covers/` |

## Personalize the profile

Open `src/config/profile.ts`. Replace `Your Name` and `you@example.com`, review `title`, `bio` and `affiliation`, then add your actual profile URLs to `profiles`. Empty URLs hide their links. `siteTitle` controls the site identity. Edit `interests` to change the research topics. The personal details are shared by Home and CV. Use complete HTTPS URLs for Google Scholar, ORCID, GitHub and LinkedIn.

## Update education, employment and projects

Open `src/data/cv.ts`. Education, research experience, professional experience, awards and activities are arrays named `education`, `research`, `experience`, `awards` and `activities`. Each entry accepts `title` and optional `institution`, `period` and `description`. List items in your preferred display order. Use descriptions for role or research details and keep dates in `period`.

```ts
// Example shape for an item in education. Replace the bracketed fields.
{
  title: '[Degree and field]',
  institution: '[University]',
  period: '[Start year – end year]',
  description: '[Thesis topic or specialization]',
},
```

Projects use `id`, `title`, `summary`, `tags` and `selected`, with an optional `url`. Use a short, unique, lowercase ID and keep it stable after sharing links. Set `selected: true` for work you want shown in Selected Projects on the CV and featured on Home. Skills are grouped as `{ area: 'Languages', tools: ['Python', 'SQL'] }`. Leave unfilled arrays empty.

## Publish a paper

Add an object to `publications` in `src/data/cv.ts`. Start from the commented example there or copy the following shape. Replace the example values, remove unavailable fields, and set the actual status. The year is a number, and the authors array preserves author order.

```ts
{
  title: '[Paper title]',
  authors: ['[First author]', '[Second author]'],
  venue: '[Conference or journal]',
  year: 2026,
  status: 'accepted',
  selected: true,
  pdf: 'papers/article.pdf',
},
```

- Supported statuses are `published`, `accepted`, `preprint` and `submitted`.
- Use `doi` for the identifier or DOI URL, `preprint` for the arXiv/preprint URL, `code` for a repository, and `project` for the project page.
- To serve a PDF yourself, put it in `public/papers/article.pdf` and write `pdf: 'papers/article.pdf'`. You can also supply a complete HTTPS PDF URL.
- The full CV lists publications in descending year order. `selected: true` also exposes a paper in the Home selection.

## Replace or print the CV

Replace `public/cv.pdf` with the final file. The linked filename remains stable. To use another filename, place it in `public/` and update `cvPdf` in `src/config/profile.ts`. Editing the online CV and replacing the PDF are separate updates. To produce a fresh PDF from the current online version, visit the **CV** page, press Ctrl+P and choose **Save as PDF**, review the exported pages, then replace the file. The print stylesheet removes screen navigation.

## Publish an English article

Create `src/content/blog/my-first-note.md`. The filename becomes the final URL segment, such as `blog/my-first-note/`. Choose a stable filename when first publishing. Paste the following and replace its contents.

````markdown
---
title: "Comparing two baselines"
description: "A small experiment in choosing a reference model."
date: 2026-11-24
lang: en
tags: [Evaluation, Python]
---

A short opening paragraph can state the question and the dataset.

## Measurements

Compare each model against the same baseline.

```python
difference = score - baseline
```
````

The title is already the page’s H1. Begin sections with `##`. The archive, recent writing, feed, chronology links and reading-time estimate use the post automatically. The date is a Gregorian ISO date. To hold back a work in progress, add `draft: true` in the frontmatter. Remove the field or set it to `false` to publish. A draft committed to a public repository remains readable in the repository. The three included demonstration articles use `sample: true`. Omit that field for your own article.

## Publish a Persian article

Create another file, for example `src/content/blog/validation-fa.md`. Use `lang: fa`. English titles and Persian titles may coexist in the same archive. Translations may use separate filenames and dates.

```markdown
---
title: "اعتبارسنجی مدل"
description: "چرا نمونه‌های آزمون را از داده‌های آموزش جدا می‌کنیم؟"
date: 2026-11-24
lang: fa
tags: [یادگیری ماشین, Python]
---

## جداسازی داده‌ها

برای اجرای آزمایش از <bdi lang="en" dir="ltr">Python 3.12</bdi> استفاده می‌کنیم.
مقدار `test_size=0.2` یعنی یک‌پنجم داده‌ها را برای آزمون کنار می‌گذاریم.
```

The article container sets Persian language and RTL direction. The site’s English navigation keeps its own direction. The Persian font is served locally, and article dates use locale-appropriate formatting. Backticks are suitable for identifiers and paths. Use the `bdi` example when an English phrase, URL or adjacent punctuation needs an explicit LTR boundary.

### Technical writing

- Use fenced code blocks with a language label such as `python`, `sql` or `bash` for static highlighting.
- Use `$a+b$` for inline math. For a displayed formula, put `$$` on its own lines around the expression. KaTeX runs at build time.
- Use standard Markdown tables, ordered/bulleted lists, `>` for a blockquote, and `[^note]` plus a later `[^note]: Explanation.` for a footnote.
- Three or more level-two headings enable the article table of contents. Heading links support deep linking.
- In a top-level Markdown post, reference a tracked image under `src/assets/blog/` as `![Meaningful description](../../assets/blog/example.webp)`. Paths are relative to the Markdown file, so account for additional folders if you nest posts. For externally hosted images, an HTML `img` with an HTTPS `src`, meaningful `alt`, dimensions and `loading="lazy"` preserves a static build.
- Link to another post with a relative URL such as `[Other note](../other-note/)` for two top-level article routes. A link starting with `/` points to the domain root and can leave a GitHub project site.
- The blog feed is available at `rss.xml` beneath the site’s base path.

## Add a photograph

Edit the array in `src/data/photos.json`. For a local photo place the image directly in `src/assets/photos/` and use its filename for `src`. Choose a simple filename with letters, digits, periods, dashes or underscores and a lowercase `.avif`, `.jpg`, `.jpeg`, `.png` or `.webp` extension. The same conventions apply to local recommendation covers. For a remote photo use a full direct HTTPS image URL and include the original pixel width and height. Preserve the real proportions. A web page containing an image is different from the image’s direct URL.

```json
{
  "src": "evening-light.webp",
  "alt": "Long shadows from a row of columns crossing a stone arcade",
  "title": "Evening light",
  "description": "The last patch of sunlight reaches the tiled floor.",
  "location": "Turin",
  "date": "2026-11-20"
}
```

The same entry can use `"src": "https://images.example.org/evening-light.jpg", "width": 1800, "height": 1200`. Replace the example domain with your actual host. To keep a local backup, place it in `src/assets/photos/` and add `"fallback": "evening-light.webp"` to the remote entry. The included Bellagio photograph demonstrates this. Use `credit` and `creditUrl` for third-party work when appropriate. Copy a sample entry to retain the schema, then remove `sample: true` for your own photographs. An alternative text description should describe the scene to someone who cannot see the image.

## Add a recommendation

Add an object to `src/data/recommendations.json`. Use an existing category value to keep it together with similar items. A new `category` value creates another group automatically. Categories appear in the order in which they first occur in the data.

```json
{
  "category": "Books",
  "title": "[Book title]",
  "creator": "[Author]",
  "note": "[One specific reason you would recommend it.]",
  "url": "https://example.org/book",
  "year": 2026,
  "favorite": true
}
```

Optional `cover` accepts a filename under `src/assets/covers/` or a direct HTTPS image URL. Omit it for a text-only entry. Optional `rating` is a number from 1 to 5. Remove the sample flag for personal entries. Titles and notes are ordinary text. JSON uses double quotes and requires commas **between** array entries. Leave the final entry without a trailing comma.

## Review an edit

Run `npm run check`, `npm run build` and `npm run verify`, then use `npm run preview` to visit the edited page. On GitHub, check that the deployment workflow completed for the same commit. See [deployment instructions](DEPLOYMENT.md) for the initial Pages setup and repository-subpath testing.

On the home page, a project's optional `shortSummary` supplies a single-line description. Its optional `image` points to a site-relative file in `public/` or a full external URL. The CV keeps the full `summary`. The first three selected projects appear on Home.
