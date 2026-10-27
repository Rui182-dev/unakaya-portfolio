# Urui Nakaya Portfolio

Professional portfolio site for an FX Artist focused on Houdini, simulation, and procedural workflows.

## Project Overview

This project is built with Astro 6 and structured as a portfolio site rather than a blog.
It is deployed as a **Cloudflare Worker with static assets** through `@astrojs/cloudflare` (not Cloudflare Pages).

Current site structure:
- `/`
  Curated homepage with hero, demoreel, selected personal work, commercial/team work, tool/R&D, and a combined about/contact section.
- `/works/[slug]`
  Detail pages for individual work items.

Every route is prerendered at build time. There is no on-demand server rendering; the Worker exists because the Cloudflare adapter always produces one, and it mostly hands requests to the static assets.

Toolchain versions resolved in `package-lock.json`:
- `astro` 6.0.8
- `@astrojs/cloudflare` 13.1.3
- `wrangler` 4.77.0
- Node `>=22.12.0` (from `engines`)

## Content Structure

Portfolio entries are Markdown files in `src/content/works/`. The collection is defined in `src/content.config.ts` and only loads `**/*.md`, so other files in that folder (for example `*.bk` backups) are ignored.

Active entries (7):
- `personal-fx-shot-01.md` (personal)
- `personal-fx-shot-02.md` (personal)
- `personal-fx-shot-03.md` (personal)
- `commercial-hda-work-01.md` (commercial)
- `matrix-team-project.md` (team)
- `tool-rnd-video-01.md` (tool)
- `tool-rnd-video-02.md` (rnd)

Ignored backups: `commercial-hda-work-02.bk`, `personal-fx-shot-05.bk`. To restore one, rename it back to `.md`.

Supported work categories:
- `personal`
- `commercial`
- `team`
- `tool`
- `rnd`

On the homepage, `commercial` and `team` share one section, and `tool` and `rnd` share another.

Frontmatter fields (see `src/content.config.ts` for which are required):
- `title`, `subtitle`
- `category`, `layoutVariant` (`default` | `editorial`)
- `featured`, `order`, `year`
- `role`, `software`, `techniques`
- `summary`, `projectContext`, `technicalFocus`
- `officialLink`, `officialLinkLabel`, `officialLinkNote`
- `contribution`, `gallery`, `additionalNotes`
- `thumbnail`, `video`, `localVideo`, `poster`

## Media Conventions

Where files are stored:
- `src/assets/`
  Images processed by Astro: thumbnails, gallery stills, portraits.
- `public/media/`
  Local clips served as-is (`reel/`, `personal/`, `works/<name>/`, `RD/<name>/`).
- `public/posters/`
  Poster images for local videos and the reel.

Examples taken from current entries:
- `thumbnail: ../../assets/Demoreel2024_stills/fx-shot-01_thumb.png`
- `localVideo: /media/reel/FP1_001_0010.mp4`
- `localVideo: /media/works/BlueReel/shot01_full.mp4`

Every active entry except `tool-rnd-video-01.md` sets `localVideo`. The homepage reel is a Vimeo embed (`reelEmbedUrl` in `src/data/site.ts`).

Everything in `public/` is uploaded as a Worker static asset. Workers static assets have a 25 MiB per-file limit (`MAX_ASSET_SIZE` in the installed Wrangler 4.77). The largest current file is under 20 MiB.

## Site URL (`SITE_URL`)

The production origin is `https://unakaya.work`. It is the checked-in default `site` in `astro.config.mjs`, so a plain `npm run build` (local or CI) generates canonical and `og:url` tags, absolute OG image URLs, and `sitemap-index.xml` for it. No `.env` or Cloudflare variable is needed.

`SITE_URL` is an optional override for building against a different host. It can come from the shell or a local `.env` file (copy `.env.example`).

- Unset or empty: `https://unakaya.work` is used.
- Set: it must be an `https://` origin only, with no path, query, or hash. Placeholder domains (`example.com/.net/.org`) and local addresses are rejected and fail the build.

```sh
# .env (only for an alternate host)
SITE_URL=https://staging.your-domain
```

`site` is resolved **at build time** only and baked into the HTML, so a runtime Worker variable in the Cloudflare dashboard has no effect. To override, set `SITE_URL` in the shell or `.env` before `npm run build` / `npm run deploy`, or as a Workers Builds build variable.

## Development

Run all commands from the project root. These are the exact scripts in `package.json`:

| Command | Runs | Purpose |
| --- | --- | --- |
| `npm install` | | Install dependencies |
| `npm run dev` | `astro dev` | Local dev server (Astro default `http://localhost:4321`) |
| `npm run build` | `astro build` | Build into `dist/` |
| `npm run preview` | `npm run build && wrangler dev` | Rebuild, then serve the built Worker locally in workerd (default `http://localhost:8787`) |
| `npm run deploy` | `npm run build && wrangler deploy` | Rebuild, then deploy to Cloudflare Workers |
| `npm run generate-types` | `wrangler types` | Generate Worker binding types |
| `npm run astro -- <args>` | `astro <args>` | Run the Astro CLI |

Note that `preview` and `deploy` both rebuild first.

## Build Output and Generated Wrangler Config

`npm run build` produces:

- `dist/client/`
  Static files: prerendered HTML (`index.html`, `works/<slug>/index.html`), `_astro/` bundles and hashed copies of `src/assets` images (components use `image.src` directly, so these are not resized), plus the copied `public/` files (`media/`, `posters/`, `fonts/`, favicons). The sitemap files are always generated for the resolved `site` origin.
- `dist/server/`
  The Worker bundle (`entry.mjs`, `chunks/`) and a **generated** `dist/server/wrangler.json`.
- `.wrangler/deploy/config.json`
  A redirect file that points Wrangler at `../../dist/server/wrangler.json`.

The root `wrangler.jsonc` is the **source** config you edit. It contains the Worker name `unakaya-portfolio`, the compatibility date/flags, observability, and an `ASSETS` binding. At build time the adapter turns it into `dist/server/wrangler.json`, with these differences:
- `main` becomes `entry.mjs`
- `assets.directory` becomes `../client`, which is `dist/client`. The root file's `./dist` is not what gets deployed.
- A `SESSION` KV binding is added. That is the adapter's default Astro sessions driver, and this site doesn't use it.

When you run `wrangler dev` or `wrangler deploy` with no `--config`, Wrangler finds `.wrangler/deploy/config.json` and prints "Using redirected Wrangler configuration." Always deploy through `npm run deploy`, or plain `wrangler deploy` right after a build. Do **not** run `wrangler deploy -c wrangler.jsonc`: that bypasses the generated config and would upload all of `dist/` (including the server bundle) as assets.

`public/.assetsignore` keeps `_worker.js` and `_routes.json` out of the uploaded assets.

## Deploying to Cloudflare Workers

First-time setup:

```sh
npm install
npx wrangler login          # once per machine
cp .env.example .env        # optional: only to override SITE_URL for another host
```

Check locally:

```sh
npm run preview             # builds, then serves at http://localhost:8787
```

Deploy:

```sh
npm run deploy              # builds, then deploys Worker "unakaya-portfolio"
```

By default the Worker is reachable at `https://unakaya-portfolio.<your-account-subdomain>.workers.dev`, unless the `workers.dev` route is disabled for the account or Worker. Custom domains are added later in the Cloudflare dashboard, under Workers & Pages → `unakaya-portfolio` → Settings → Domains & Routes. The production custom domain is `https://unakaya.work`, which is the default `site`. Builds served from any other host should set `SITE_URL` to that origin so canonical/OG URLs and the sitemap match it.

Because the generated config declares a `SESSION` KV binding with no namespace id, the installed Wrangler 4.77 auto-creates a KV namespace on first deploy (its resource-provisioning and auto-create options both default to on). This is expected. The site never reads or writes it.

To deploy from Git, use Cloudflare **Workers Builds**, not Pages. Settings: build command `npm run build`, deploy command `npx wrangler deploy`, root directory = repo root. No `SITE_URL` build variable is needed for `https://unakaya.work`.

## Notes

- `portfolio_structure_summary.md` contains a structural summary of the current project.
- `src/pages/blog/` is an empty leftover directory from the starter. It is not tracked by git and adds no routes.
- `src/components/sections/ContactSection.astro` is legacy. The homepage uses the combined `AboutSection`.
