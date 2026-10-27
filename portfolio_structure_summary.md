# portfolio_structure_summary.md

## 1. Project Overview

### Top-level folders
- `.astro/`
  Astro-generated build metadata and type artifacts.
- `.git/`
  Git repository metadata.
- `.vscode/`
  Editor configuration.
- `.wrangler/`
  Wrangler local state plus the build-generated redirect `.wrangler/deploy/config.json` (gitignored).
- `dist/`
  Build output (gitignored): `dist/client/` static assets, `dist/server/` Worker bundle plus generated `wrangler.json`.
- `node_modules/`
  Installed dependencies.
- `public/`
  Static public assets served as-is.
- `src/`
  Application source code.
- `tmp/`
  Scratch folder, gitignored.

### Top-level config files
- `astro.config.mjs`
  Astro config: `mdx()` and `sitemap()` integrations, the `cloudflare()` adapter, and `site` defaulting to `https://unakaya.work`, overridable by a validated build-time `SITE_URL` env var (see README).
- `wrangler.jsonc`
  Source Wrangler config: Worker `unakaya-portfolio`, compatibility date/flags, `ASSETS` binding, observability. The adapter turns it into `dist/server/wrangler.json`, and that generated file is what gets deployed.
- `.env.example`
  Template for the local `.env`, which can hold an optional `SITE_URL` override.
- `package.json`
  Scripts `dev`, `build`, `preview` (build plus `wrangler dev`), `deploy` (build plus `wrangler deploy`), `generate-types`, `astro`.

### `src/` folder purposes
- `src/assets/`
  Source-managed image assets used by Astro processing.
- `src/components/`
  Reusable UI components, split by responsibility.
- `src/content/`
  Content collection entries for portfolio works.
- `src/data/`
  Small global site-level data module.
- `src/layouts/`
  Shared page layout wrappers.
- `src/pages/`
  Astro route files. It also holds an empty leftover `blog/` directory, which is untracked and adds no routes.
- `src/styles/`
  Global styling.

### Conceptual organization
- The project is organized as a **portfolio-first Astro site**.
- It is no longer structured as a blog.
- It is a **hybrid portfolio**:
  - a curated homepage at `/`
  - generated detail pages at `/works/[slug]`

## 2. Routing Structure

### Current routes
- `/`
  Homepage portfolio landing page.
- `/works/[slug]`
  Dynamic detail route for each work entry.

### How routing is implemented
- Astro maps files in `src/pages/` to routes.
- `src/pages/index.astro` creates `/`.
- `src/pages/works/[slug].astro` creates the dynamic work detail route.

### Rendering / deployment mode
- No `output` is set, so Astro uses its default of static. Every route is prerendered.
- The `@astrojs/cloudflare` adapter (v13) still builds a Worker (`dist/server/entry.mjs`) that serves the static files in `dist/client/` through the `ASSETS` binding.
- Deployment target: Cloudflare Workers (`npm run deploy`), not Cloudflare Pages.

### Dynamic routes
- `/works/[slug]` is the only dynamic route.
- Static pages are generated through `getStaticPaths()` in `src/pages/works/[slug].astro`.
- Each route is created from entries in the `works` content collection.

## 3. Content System

### Content management approach
- Content is managed with an Astro content collection in `src/content.config.ts`.
- The collection name is `works`.
- Entries are stored in `src/content/works/`.

### Collection structure
- Collection: `works`
- Loader: `glob({ base: './src/content/works', pattern: '**/*.md' })`. Only `.md` files are loaded, so `.bk` backups are ignored.

### Frontmatter schema
The `works` schema includes:
- `title`
- `subtitle`
- `category`
  - enum: `personal`, `commercial`, `team`, `tool`, `rnd`
- `layoutVariant`
- `featured`
- `order`
- `year`
- `role`
- `software`
- `techniques`
- `summary`
- `projectContext`
- `officialLink`
- `officialLinkLabel`
- `officialLinkNote`
- `technicalFocus`
- `contribution`
- `gallery`
- `additionalNotes`
- `thumbnail`
- `video`
- `localVideo`
- `poster`

### Current content entries (7 active)
| File | Category | Order | `localVideo` |
| --- | --- | --- | --- |
| `personal-fx-shot-01.md` | personal | 1 | `/media/reel/FP1_001_0010.mp4` |
| `personal-fx-shot-02.md` | personal | 2 | `/media/reel/FP2.mp4` |
| `personal-fx-shot-03.md` | personal | 3 | `/media/reel/FP3.mp4` |
| `commercial-hda-work-01.md` | commercial | 4 | `/media/works/BlueReel/shot01_full.mp4` |
| `matrix-team-project.md` | team | 5 | `/media/personal/matrix.mp4` |
| `tool-rnd-video-02.md` | rnd | 6 | `/media/RD/Rain_RD/car_rain.mp4` |
| `tool-rnd-video-01.md` | tool | 7 | none (Vimeo `video` link and thumbnail only) |

Ignored backups that are not part of the collection: `commercial-hda-work-02.bk`, `personal-fx-shot-05.bk`.

The three `personal-fx-shot-*.md` entries now use the richer project-breakdown style as well, with `projectContext`, `contribution`, `additionalNotes`, and `gallery` populated.

### Content flow into pages
- `src/pages/index.astro`
  - loads all works with `getCollection('works')`
  - sorts by `order`
  - filters by `category`
  - passes grouped entries into homepage sections
- `src/pages/works/[slug].astro`
  - loads collection entries for `getStaticPaths()`
  - generates one detail page per work
  - renders markdown body content into `WorkLayout`
- `subtitle`, when present, is rendered in both work cards and work detail pages
- `software` and `techniques` are used as portfolio metadata and rendered in work cards/detail pages
- `localVideo`, when present, is used as local media on work detail pages instead of the thumbnail image
- GIF paths in `localVideo` are rendered as images rather than video tags

## 4. Component Architecture

### `src/components/layout/`
- `BaseHead.astro`
  - Shared metadata, favicon, Open Graph, Twitter tags, font preloads.
  - Canonical URL, `og:url`, absolute OG image URL, and the sitemap link render only when `Astro.site` is set. It always is: `https://unakaya.work` by default, or the build-time `SITE_URL` override.
- `SiteHeader.astro`
  - Main navigation bar with anchor links and reel CTA.
- `SiteFooter.astro`
  - Minimal footer with site identity and copyright.

### `src/components/sections/`
- `HeroSection.astro`
  - Homepage hero with name, role, focus, and primary CTAs.
- `ReelSection.astro`
  - Demoreel block near the top of the homepage and the most visually dominant content area.
  - Can render either an external iframe embed, a local video file, or a local GIF path.
- `SectionHeader.astro`
  - Reusable section heading block with eyebrow, title, optional copy.
- `WorkGridSection.astro`
  - Generic homepage work section wrapper.
  - Supports section variants such as `featured`, `compact`, and `spotlight`.
- `AboutSection.astro`
  - Combined homepage about/contact section with portrait image and contact actions.
- `ContactSection.astro`
  - Legacy standalone contact component still present in the codebase, but no longer used on the homepage.

### `src/components/works/`
- `WorkCard.astro`
  - Reusable card for work previews.
  - Supports display variants matching homepage section hierarchy.
  - Optionally renders `subtitle` above the title.
  - Displays combined software and techniques tags.

### Homepage composition
The homepage is assembled from:
- `MainLayout`
- `HeroSection`
- `ReelSection`
- `WorkGridSection` for personal work
- `WorkGridSection` for commercial/HDA work
- `WorkGridSection` for tool/R&D work, combining `tool` and `rnd` categories with the same compact card treatment as the production/team section
- a single combined `AboutSection` used as the compact homepage closing section

## 5. Layout System

### `MainLayout.astro`
- Shared wrapper for standard pages.
- Includes:
  - `BaseHead`
  - `SiteHeader`
  - page shell container
  - `SiteFooter`
- Used by the homepage.
- Accepts:
  - `title`
  - `description`
  - `image`

### `WorkLayout.astro`
- Specialized layout for work detail pages.
- Wraps detail content inside `MainLayout`.
- Renders:
  - work title
  - optional subtitle
  - category
  - summary
  - metadata panel
  - hero media block
  - markdown content body
- Metadata panel includes software and, when present, techniques.
- Hero media prefers `localVideo` when present, otherwise falls back to the thumbnail image.
- If `localVideo` points to a `.gif`, it is rendered as an image instead of a video element.
- Commercial entries use a dedicated editorial breakdown layout with:
  - heading/context block
  - project summary card
  - large hero media
  - main breakdown content column
  - contribution sidebar
  - optional still gallery.
- Non-commercial entries can opt into the same editorial shell with `layoutVariant: editorial`.
- Editorial personal pages use the markdown body as the main breakdown section and can additionally render:
  - technical focus
  - additional notes
  - contribution sidebar
  - additional stills gallery.
- Non-editorial detail pages can also render optional structured fields when present:
  - project context under the hero summary
  - contribution block
  - additional notes block
  - additional stills gallery.

### Shared UI elements
- Header: `SiteHeader`
- Footer: `SiteFooter`
- Metadata: `BaseHead`

## 6. Homepage Structure

### File analyzed
- `src/pages/index.astro`

### Data loading
- Calls `getCollection('works')`
- Sorts entries by `data.order`
- Splits entries into:
  - `personalWorks`
  - `commercialWorks` (commercial + team entries)
  - `toolWorks` (`tool` + `rnd` entries)

### Sections in order
1. `HeroSection`
   - Renders:
     - role
     - name
     - focus line
     - short positioning text
     - CTA buttons
2. `ReelSection`
   - Renders:
     - reel title
     - short summary
     - reel media
     - compact sidebar notes and CTA
   - Treated as the dominant homepage feature
   - Reel media can be either external embed or local video
3. `WorkGridSection` for selected personal work
   - Uses `personalWorks`
   - Variant: `featured`
   - Largest work preview section on the homepage
   - Uses a horizontal scrolling card row with snap behavior when multiple featured entries are present
   - Desktop controls include left/right scroll buttons for the featured row only when more than three items are present
4. `WorkGridSection` for commercial / team work
   - Uses `commercialWorks`
   - Variant: `compact`
   - Secondary preview section with reduced visual weight
   - Includes production contributions, team projects, and HDA-oriented work
  - On mobile, it switches to a one-card-at-a-time swipe carousel with dot indicators
5. `WorkGridSection` for tool / R&D
   - Uses `toolWorks`
   - Variant: `compact`
   - Uses the same horizontal carousel shell as the selected personal work section
   - Tool entries are displayed one at a time and navigated with the carousel arrows
6. `AboutSection`
   - Combined About / Contact closing section
   - Renders short bio, contact actions, and a portrait image

### Homepage data sources
- Global site data from `src/data/site.ts`
- Work data from `src/content/works/*`

## 7. Work Detail Pages

### File analyzed
- `src/pages/works/[slug].astro`

### How pages are generated
- Uses `getCollection('works')`
- Maps each entry into `getStaticPaths()`
- Generates one route per work using `work.id`

### How content is passed
- `props: { work }` is returned from `getStaticPaths()`
- The page renders markdown with `render(work)`
- `WorkLayout` receives the full `work` entry
- `<Content />` renders the markdown body inside the layout

### Result
Each work page is:
- content-driven
- statically generated
- wrapped in a shared detail layout
- able to show local video media when configured in frontmatter
- commercial entries render with a different page composition than personal/tool entries
- commercial pages support editorial breakdown fields such as official link, contribution list, project context, gallery, and additional notes

## 8. Styling System

### Style organization
- Primary styling is centralized in `src/styles/global.css`
- There are no major per-component style blocks in the portfolio structure
- Styling is mostly class-based and shared globally

### Styling approach
- Dark visual theme
- Premium/minimal portfolio presentation
- Large typography
- Grid-based layout
- Reusable section and card variants
- Responsive behavior handled in global media queries

### Visual system characteristics
- Dark background with subtle gradients
- Glass/panel-like cards
- Rounded corners
- Accent color used sparingly
- Shared layout classes for:
  - hero
  - reel block
  - featured / compact / spotlight work grids
  - work cards
  - compact bottom row
  - work detail pages
  - subtitle styling for cards and detail pages
  - local video display in reel/detail media areas

## 9. Data Layer

### `src/data/site.ts`
This is the main global data file.

### Current global site data
- `title`
- `description`
- `role`
- `focus`
- `email`
- `linkedin`
- `instagram`
- `reelTitle`
- `reelSummary`
- `reelEmbedUrl`
- `reelLocalVideo`
- `reelPoster`

### How it is used
- `BaseHead.astro`
  - title/description defaults via layouts
- `SiteHeader.astro`
  - site title
- `SiteFooter.astro`
  - site identity
- `HeroSection.astro`
  - role, title, focus
- `ReelSection.astro`
  - reel title, summary, embed/local video selection, poster
- `AboutSection.astro`
  - email, LinkedIn, Instagram contact links
- `ContactSection.astro` (legacy, unused)
  - contact links and email
- `MainLayout.astro`
  - metadata defaults

### Other data files
- No other data modules are currently present.

## 10. Assets

### Asset locations
- `src/assets/` (processed by Astro)
  - `Demoreel2024_stills/`, `BlueReel_stills/`, `Matrix/`, `Rain_RD/`, `path_replace_stills/`: work thumbnails and gallery stills
  - `Personal/`: portrait/background images
  - `placeholders/`: old starter images, no longer referenced by any active entry
- `public/` (copied as-is into `dist/client/` and uploaded as Worker static assets)
  - `favicon.ico`, `favicon.svg`, `fonts/`
  - `posters/`: video and reel posters
  - `media/reel/`, `media/personal/`, `media/works/BlueReel/`, `media/RD/Rain_RD/`: local mp4 clips
  - `.assetsignore`: keeps `_worker.js` and `_routes.json` out of the asset upload
- Workers static assets have a 25 MiB per-file limit (installed Wrangler `MAX_ASSET_SIZE`). All current media files are under 20 MiB.

### How assets are referenced
- Work thumbnails are referenced in markdown frontmatter through `thumbnail`
- The content schema uses Astro `image()` for thumbnail typing
- `WorkCard.astro` and `WorkLayout.astro` use `data.thumbnail.src`
- Reel media can use either `reelEmbedUrl` or `reelLocalVideo` from `site.ts`
- Work detail media can use `localVideo` from frontmatter or fall back to the thumbnail image
- Poster fields exist in content and `site.ts` for video poster usage

## 11. Observations

### Remaining blog-related structures or naming
- No major blog routes remain in the active architecture.
- The project has been structurally converted away from the original Astro blog starter.
- The dependency list may still contain packages associated with older starter usage, but the active source structure is portfolio-oriented.

### Structural inconsistencies
- The site uses a global CSS approach rather than co-located component styles, while components are otherwise separated by role.
- `subtitle` is supported, but only some work entries currently define it.
- `techniques` is supported with a default empty array, so older entries do not need immediate updates.
- Six of the seven active entries use `localVideo`. The homepage reel uses a Vimeo embed (`reelLocalVideo` is empty).

### Areas that still feel like a starter template
- Social/profile URLs in `src/data/site.ts` are real (LinkedIn `urui-nakaya`, Instagram `nakayaurui`), not placeholders.
- `src/assets/placeholders/`, the legacy `ContactSection.astro`, the empty `src/pages/blog/`, and the unused `@astrojs/rss` dependency are starter leftovers.
- The adapter adds a `SESSION` KV binding to the generated Wrangler config, and the installed Wrangler 4.77 auto-creates that namespace on first deploy. The site never uses sessions.

### Potential high-level UX or architecture issues
- The homepage relies heavily on final media quality to feel complete.
- Most visual differentiation is achieved through CSS variants rather than distinct component families.
- The detail-page system is structurally sound, but the current content depth is still light.
- The architecture is intentionally simple and beginner-maintainable, which keeps complexity low but also keeps some abstractions coarse.
