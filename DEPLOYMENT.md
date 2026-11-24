# Deploy to GitHub Pages

Use **a new public GitHub repository** to host this site on GitHub Free. The included workflow builds on every push to `main`. Source stays in Git and the workflow publishes `dist/` as a Pages artifact. [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

## First publication

1. Extract the source ZIP to a folder. Open the folder containing `package.json`, personalize the content, and confirm that `.github/workflows/deploy.yml` is present. On Ubuntu, Ctrl+H shows hidden files in Files. Drag-and-drop uploads can omit `.github`; Git includes it.
2. On GitHub, create an **empty public repository** in your account. Leave the README, license and .gitignore options unchecked, since you are importing an existing project. Name it `USERNAME.github.io` for an account homepage or choose a repository name such as `academic-site` for a project site.
3. Open a terminal in the extracted project root. Replace the uppercase placeholders below with your actual GitHub username and repository name. Use these commands for a newly extracted copy and an empty remote.

   ```bash
   git init -b main
   git add .
   git status --short
   git commit -m "Add academic website"
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```

   If Git asks for your commit identity, set `git config user.name "Your Name"` and `git config user.email "YOUR_GITHUB_EMAIL"` inside this repository, then repeat the commit. For the push, use your usual GitHub HTTPS credentials or an SSH remote if you already have one.
4. In the repository open **Settings → Pages → Build and deployment → Source → GitHub Actions**. If the first run started before Pages was enabled, open **Actions**, choose the deployment workflow, select **Run workflow**, then run it on `main`.
5. Wait until both build and deployment have succeeded. Open the URL in the deployment job or under **Settings → Pages → Visit site**. Open a blog article directly and navigate back to Home. Verify the PDF, themes and photo gallery using that URL.

Future updates only require committing content to `main` or merging a pull request into it. For browser-only editing, open a Markdown or data file on GitHub, use the pencil icon, and commit the edit. For a new file use **Add file → Create new file**. [GitHub Pages workflow setup](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Addresses and assets

| Repository and settings | Site origin | Base path | Homepage |
| --- | --- | --- | --- |
| `ada/ada.github.io` | `https://ada.github.io` | `/` | `https://ada.github.io/` |
| `ada/academic-site` | `https://ada.github.io` | `/academic-site` | `https://ada.github.io/academic-site/` |
| Repository with its own custom domain | `https://research.example.org` | `/` | `https://research.example.org/` |

The workflow reads GitHub’s Pages metadata and passes the origin and path to Astro as `SITE_URL` and `BASE_PATH`. The site URL is the origin only. The base path appears once in site links, feed URLs, sitemap entries and generated assets. Keep editable local file paths relative to the project’s content directories. [Pages metadata outputs](https://github.com/actions/configure-pages/blob/main/action.yml) · [Astro Pages configuration](https://docs.astro.build/en/guides/deploy/github/)

The build also emits `robots.txt` and `sitemap-index.xml`. Crawlers read robots directives at the host root. For a project site under `/academic-site/`, its sitemap can be submitted directly or listed in the account site's root `robots.txt` if you control that site. [Robots file location](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)

To rehearse a repository-subpath deployment locally, run these commands from the project root. Keep the variables in the same shell through preview.

```bash
export SITE_URL=https://ada.github.io
export BASE_PATH=/academic-site
npm run check
npm run build
npm run verify
npm run preview
```

Open <http://localhost:4321/academic-site/> (substitute the port printed by Astro). Stop preview, then run `unset SITE_URL BASE_PATH` to return to root-path development. To test an account site, use `BASE_PATH=/` instead.

## Optional custom domain

1. Choose a domain you control and verify it in your GitHub account’s Pages settings.
2. Set it for this repository in **Settings → Pages → Custom domain**. Enter only the hostname.
3. At your DNS provider, point a subdomain to `USERNAME.github.io` with a CNAME record. For an apex domain, use the ALIAS, ANAME or IP records in GitHub’s current instructions. DNS targets contain no repository path.
4. After GitHub’s DNS check succeeds, enable **Enforce HTTPS** when it becomes available. Run the workflow again so canonical URLs, feeds and sitemap reflect the new hostname. An Actions-based deployment takes the domain from Pages settings. [GitHub’s custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## Troubleshooting

| Symptom | Check |
| --- | --- |
| No workflow appears | Open `.github/workflows/deploy.yml` in the GitHub repository. Confirm Actions are enabled, the file is in the repository root’s `.github` directory, and pushes target `main`. |
| Pages configuration returns 404 | Enable Pages with **GitHub Actions** as its source, then start a fresh workflow run. |
| The deployment job reports a permission error | Confirm Actions are permitted in the account or organization and the workflow retains its Pages write and OpenID token permissions. Check environment protection requirements on `github-pages`. |
| The homepage works but CSS, links or photographs 404 | Check the URL shown by the deployment, then compare `BASE_PATH` with the repository path. Inspect the case of filenames and remove hardcoded domain-root paths from custom content. |
| The install fails in CI | Commit `package-lock.json` alongside `package.json`. A local `npm ci` on Node 24 should succeed before retrying. |
| An article does not appear | Check the file is under `src/content/blog/`, its extension is `.md`, frontmatter passes the build, and `draft` is false or omitted. Read the failed build’s first content error. |
| A previous version is still visible | Inspect the newest run and the commit SHA on the Pages deployment. A failed build leaves the previous successful deployment active. |
