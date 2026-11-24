# Verification

The November 2026 release was built on Linux with Node 24 and npm 11. The source package contains five main routes, three sample article routes and the Pages deployment workflow.

| Check | Observed result |
| --- | --- |
| Reproducible installation | A clean `npm ci` completed with the committed lockfile. |
| Source diagnostics | `npm run check` reported zero errors, warnings or hints. |
| GitHub Pages URL shapes | Production builds passed at a root URL and at `https://researcher.github.io/portfolio/`. The latter was a simulated deployment address. |
| Generated output | The verifier checked eight HTML pages, three articles and 255 local references in each build, including links, fragments, image candidates, styles, fonts and the CV PDF. |
| Discovery and metadata | The verifier checked canonical URLs, sitemap page coverage, the robots sitemap declaration and RSS article URLs. |
| Technical articles | The generated output included Shiki code spans, KaTeX output, semantic tables, a figure, a footnote and working section links. English article containers used LTR and the Persian container used RTL. |
| Browser interactions | In Chromium the dark theme persisted between pages. Persian filtering reduced the archive to one post. An incompatible topic showed the empty state and resetting the filters restored the archive. |
| Gallery keyboard behavior | Enter opened a local image. Right Arrow advanced to the next photo. Escape dismissed the dialog and restored focus to the opening thumbnail. |
| Responsive layout | The homepage and Persian article received visual review. At a 375-pixel frame width, the five main sections used their small-screen layouts. The CV, gallery, interests, archive and Persian article fit the available 360-pixel content width without horizontal page scrolling. |
| PDF | The one-page sample CV was rendered, visually reviewed and checked for extractable text. |

Run `npm ci`, `npm run check`, `npm run build` and `npm run verify` from the extracted source to repeat the build checks. For a project URL, set the same `SITE_URL` and `BASE_PATH` in both the build and verification shells. See [DEPLOYMENT.md](DEPLOYMENT.md).

The personal GitHub repository, Actions runner, custom domain and DNS were outside this test. The browser review covered Chromium, with a narrow viewport for responsive checks. Physical phones, Safari, Firefox, assistive-technology audits and Lighthouse scoring were not tested.
