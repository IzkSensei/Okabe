# Fieldnotes

A personal academic website with a structured CV, an English/Persian technical journal, a photography gallery and a recommendations shelf. Astro compiles the project into the static files in `dist/`. Visitors can read the site without an account, and ordinary publishing works through GitHub’s file editor.

## First visit

| Page | What visitors find |
| --- | --- |
| Home | A short profile, research projects, publications and recent writing |
| CV | Education, research, professional experience, publication resources, a downloadable PDF and a print layout |
| Blog | A chronological archive and individual articles with local fonts, highlighted code and typeset mathematics |
| Photography | Captioned local or externally hosted images with keyboard-accessible enlargement |
| Interests | Personal notes on books, films, music and other recommendations |

**Before sharing your URL**, replace the name and email in `src/config/profile.ts`, enter your profile links, review the academic entries in `src/data/cv.ts`, and replace `public/cv.pdf`. The supplied project descriptions and education are based on the supplied background. Publications, awards and activities can stay empty until you have entries to publish. Review the sample posts, sample images and suggested recommendations before presenting them as your own.

## Run on Ubuntu

Use a current Node.js 24 LTS release and its bundled npm. To install Node in your own account on Ubuntu 24.04 with Bash, the following commands use Git and nvm. If you already use nvm, start at `nvm install 24`. If Node 24 is already installed, go straight to the project commands.

```bash
sudo apt update
sudo apt install git unzip ca-certificates
git clone --branch v0.41.0 --depth 1 https://github.com/nvm-sh/nvm.git "$HOME/.nvm"
source "$HOME/.nvm/nvm.sh"
nvm install 24
nvm use 24
node --version
npm --version
```

In future shells run `source "$HOME/.nvm/nvm.sh"` and `nvm use 24`, or add the source line to `~/.bashrc`. Open the extracted source folder in a terminal. The project root contains `package.json`, `package-lock.json` and `.github/`.

```bash
npm ci
npm run dev
```

Open the **Local** address printed by Astro, normally <http://localhost:4321/>. Saving a content file refreshes the local preview. Stop the server with Ctrl+C.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install exact dependency versions recorded in the lockfile |
| `npm run dev` | Edit with a local server and live reload |
| `npm run check` | Check Astro and TypeScript source |
| `npm run build` | Validate Markdown frontmatter, render pages and emit static assets |
| `npm run verify` | Check the generated output after a build |
| `npm run preview` | Serve the most recent production build locally |

## Why Astro

| Generator | Fit for this site |
| --- | --- |
| Astro | Markdown content collections validate article metadata. Native components share layouts across five different sections. The Node build handles Shiki, KaTeX and fonts in the same toolchain. |
| Hugo | A fast Go-based generator with built-in multilingual publishing. A good choice if you prefer Go templates and a standalone executable. |
| Jekyll | A natural fit for a conventional Markdown blog on Pages. It uses Liquid templates and a Ruby build environment. |

This implementation uses Astro’s static build and plain CSS. A few browser scripts enhance the theme, archive and gallery. English and Persian posts share a layout, with direction, font and date formatting selected from each post’s metadata. No paid service, API key, database or CMS is required.

The archive’s year groupings and generous spacing draw on the supplied Persian screenshot. The article layout draws on the reference’s compact metadata, linked sections and readable technical examples. The implementation and visual identity are original. [TheWhite theme](https://github.com/TheYahya/thewhite) · [Reference article](https://theyahya.com/posts/go-pgo/)

## Maintain and publish

- For day-to-day editing, start with [the content guide](CONTENT_GUIDE.md).
- To publish on your own account or configure a custom domain, follow [the deployment guide](DEPLOYMENT.md).
- [Photograph and artwork credits](src/assets/CREDITS.md) identify the source of each gallery and shelf image.
- The design tokens and responsive layout are under `src/styles/`. Page templates live under `src/pages/`, shared layouts under `src/layouts/`, and reusable UI under `src/components/`. Ordinary content updates do not require editing these folders.
- Build dependencies and self-hosted font packages are locked. When updating packages, commit the resulting lockfile with your changes and run the checks before publishing.

Framework and hosting references: [Astro content collections](https://docs.astro.build/en/guides/content-collections/) · [Astro on GitHub Pages](https://docs.astro.build/en/guides/deploy/github/) · [Hugo introduction](https://gohugo.io/about/introduction/) · [Jekyll](https://jekyllrb.com/).

[Verification report](VERIFICATION.md) records the tested build configurations, browser interactions and remaining verification limits.
