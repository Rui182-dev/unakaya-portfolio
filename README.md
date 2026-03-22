# Urui Nakaya Portfolio

Professional portfolio site for an FX Artist focused on Houdini, simulation, and procedural workflows.

## Project Overview

This project is built with Astro and structured as a portfolio site rather than a blog.

Current site structure:
- `/`
  Curated homepage with hero, demoreel, selected work, commercial work, tool/R&D, and combined about/contact section.
- `/works/[slug]`
  Detail pages for individual work items.

The site is designed for static deployment and is compatible with Cloudflare Pages.

## Content Structure

Portfolio entries are stored in `src/content/works/`.

Supported work categories:
- `personal`
- `commercial`
- `tool`

Common frontmatter fields include:
- `title`
- `subtitle`
- `category`
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
- `contribution`
- `gallery`
- `additionalNotes`
- `thumbnail`
- `video`
- `localVideo`
- `poster`

## Media Conventions

Recommended storage:
- `src/assets/`
  Images processed by Astro such as thumbnails, stills, and portraits.
- `public/media/`
  Local reel clips, GIFs, and work videos served directly.
- `public/posters/`
  Poster images used by local videos.

Examples:
- `thumbnail: ../../assets/placeholders/personal-shot-01.jpg`
- `localVideo: /media/works/my-shot/clip.mp4`
- `poster: /posters/my-shot.jpg`

## Development

All commands run from the project root.

- `npm install`
  Install dependencies.
- `npm run dev`
  Start the local dev server.
- `npm run build`
  Build the static site into `dist/`.
- `npm run preview`
  Preview the production build locally.

## Temporary Cloudflare Pages Deployment

For a first public test deploy on a temporary Pages URL:

1. Push this repository to GitHub.
2. In Cloudflare Pages, create a new project and connect the GitHub repository.
3. Use these build settings:
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy to the default `*.pages.dev` URL first.
5. Add a custom domain later if needed.

## Notes

- The project still uses some placeholder media and text that should be replaced with final portfolio content.
- `portfolio_structure_summary.md` contains a structural summary of the current project.
