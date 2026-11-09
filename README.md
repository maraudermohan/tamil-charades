# Tamil Charades

A dumb charades game for Tamil and English movies, live at [tamilcharades.com](https://www.tamilcharades.com). Players pick a mode (Classic, Story, Song, Hollywood or Kids), act out titles against a timer, and get a score card they can share.

## Stack

- Next.js (App Router) as a fully static export (`output: "export"`), with React Compiler, typed routes and Strict Mode on
- React 19, TypeScript, CSS Modules
- PHP endpoints on the same origin serve the title lists (`classic-movies.php`, `songs.php`, ...) and collect analytics (`track-metrics.php`). They are deployed separately and are not part of this repo.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on [http://localhost:3000](http://localhost:3000). To get real titles locally, create `.env.local` and point the dev proxy at a backend that serves the PHP endpoints:

```bash
# Proxies /classic-movies.php, /story-movies.php, etc. during `npm run dev` only.
BACKEND_PROXY_TARGET=https://your-backend.example
```

Analytics aren't proxied, so `npm run dev` never records events in production. To test them, set `NEXT_PUBLIC_TRACK_METRICS_URL` to a local sink.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Type-checks and writes the static site to `out/` |
| `npm run preview` | Serves `out/` on port 4175 to check a production build |
| `npm run lint` | ESLint (Next core web vitals and React hooks rules) |

## Project layout

- `src/app`: routes. `/` lists the modes and `/game/[slug]` is one page per mode, generated at build time.
- `src/components`: UI. `GameController` picks the screen (intro, game, results or error) from the game store.
- `src/hooks/useGameStore.tsx`: game state, using a pure reducer plus context.
- `src/constant/gameModes.ts`: mode definitions. `GAME_SLUGS` drives the routes, sitemap and SEO entries.
- `src/utils`: API client, analytics and the share-card generator.

To add a game mode, add its slug to `GAME_SLUGS`, define it in `GAME_MODES_DATA` and add its SEO entry in `src/app/game/[slug]/seo.ts`. TypeScript flags anything missing.

## Deployment

The site is hosted on Hostinger (LiteSpeed) behind Cloudflare. Run `rm -rf out && npm run build` and upload the contents of `out/`, including `.htaccess`. Starting from an empty `out/` matters: a leftover file there, such as a local mock of a PHP endpoint, would overwrite the real one. That file handles the canonical HTTPS `www` redirect, trailing slashes, the 404 page, cache headers and security headers (CSP and others).
