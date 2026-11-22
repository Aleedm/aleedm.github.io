# Alessandro De Marco — Personal Website

An interactive personal website told as one descent, with the camera always looking down: from orbit, through the clouds, over the Alps, down to the Salento coast and the seabed. Scroll is altitude. Built with React, TypeScript, and Vite for static hosting on [GitHub Pages](https://aleedm.github.io/).

This is the first visual prototype. The copy and content selection are provisional; the focus is on atmosphere, transitions, and interaction.

## Development

Use Node.js 22.12+ (or 20.19+).

```bash
npm install
npm start
```

Open the local URL printed by Vite, normally http://127.0.0.1:5173/.

```bash
npm run typecheck
npm run test:motion
npm run build
npm run preview
```

The production build is written to `dist/`. Preview serves the production build locally.

## Deployment

Pushing to `main` publishes the site: the `Publish site` workflow (`.github/workflows/pages.yml`) refreshes the Strava data, builds, and deploys to GitHub Pages. It also runs every 6 hours and can be started by hand from the Actions tab. The Vite base is `/` for `aleedm.github.io`; running the development server does not publish anything. The old `gh-pages` branch is no longer served.

## Structure

- `src/App.tsx`: chapter content (orbit, Alps, sea level, seabed) and motion control.
- `src/experience/release.ts`: `OPEN_WATER`. While it is `false` the journey ends at the shore with a short closing; the sea and seabed chapters stay in the code, hidden.
- `src/experience/Atmosphere.tsx`: frame loop — star particles, the descent, and the sea current.
- `src/experience/world.ts`: one WebGL2 shader for the whole top-down world — night map and clouds during re-entry, Swiss-style relief and contours, coast, seabed, and caustics focused by the swell.
- `src/experience/terrain.ts`: the shared heightfield, in TypeScript and GLSL, so DOM labels report the same elevations the map draws.
- `src/experience/journey.ts`: page measurements, scroll-to-altitude mapping, Zurich → Salento coordinates, and the shared sea current.
- `src/experience/Constellation.tsx`: the path so far (studies, projects, teaching) as an interactive constellation with an observation panel.
- `src/experience/PingPongConsole.tsx` and `public/pingpong/play.html`: the original PingPong (Java 8 / Swing, written at 15) in a dialog via CheerpJ, on desktop. Touch devices see a note instead: the JVM lags badly on iPhone. `public/pingpong/` holds the JAR built from the repository's compiled classes plus its original assets.
- `src/experience/RunningCard.tsx`, `ActivityCard.tsx` and `strava.ts`: running personal bests (5K, 10K, half, marathon) and the latest run, plus the latest hike, snowboard day, stand-up paddle and tennis session, read from `/data/strava.json`.
- `scripts/strava.mjs`: fetches that data from Strava (see below); `data/strava-bests.json` keeps the bests between runs.
- `src/experience/Altimeter.tsx`: altitude/coordinate readout that doubles as chapter navigation.
- `src/experience/Trail.tsx`: GPS-style trail with sports waypoints, drawn as you scroll.
- `src/experience/Driftwood.tsx`: Salento photographs floating on the water, carried by the visitor's current.
- `src/experience/experience.css`: responsive layout and typography.
- `src/experience/particles.ts`: continuous star drift and proximity repulsion without return anchors.
- `src/experience/flow-field.ts`: directional stroke injection, semi-Lagrangian advection, and dissipation.
- `src/experience/analytics.ts`: Simple Analytics integration.
- `docs/motion-study.md`: concept, technical choices, and acceptance criteria.
- `public/`: existing personal photos and project assets.

The earlier `src/Home`, `src/Theme`, and `src/Appbar` components and CRA entry files remain as reference, including pre-existing local edits. They are not part of the Vite entry graph or the current TypeScript check. Material UI and Create React App are no longer runtime/build dependencies. `public/index.html` is the old CRA template; Vite uses the root `index.html` and emits its built version to `dist/index.html`.

## Motion and accessibility

The page uses native scrolling and semantic HTML for its content. Every chapter has a direct anchor link from the altimeter. A pause button freezes ambient motion; system `prefers-reduced-motion` settings are respected. Touch input retains native page scrolling. Rendering pauses in background tabs and the world canvas resolution is capped; static land frames are only redrawn on scroll or pointer movement. Without WebGL2 the page falls back to a static gradient. The landscape is fully procedural: no generated or stock imagery, only original personal photographs.

## Strava

The Running waypoint shows personal bests and the latest run. GitHub Pages cannot keep secrets, so a scheduled GitHub Action (`.github/workflows/pages.yml`, every 6 hours, on push to `main`, or by hand) refreshes the data with credentials stored as repository secrets, then builds and deploys the site. The browser only ever sees the resulting `strava.json`: times, dates, and links. Snowboarding and hiking swap places on the trail so the one whose latest activity reached the higher point (Strava's `elev_high`) sits on top. Hikes, snowboard days and paddles include their route, but only as a shape fitted in a 100-unit box (no coordinates), with the first and last 250 m removed. Only runs visible to Everyone or Followers are used.

Personal bests come from Strava's per-run best efforts. The first scan reads every run once (rate-limited, so it may take a while); afterwards only new runs are inspected. `data/strava-bests.json` (state) and `public/data/strava.json` (what the site reads) are both committed when they change, so if Strava is unreachable or rate-limited the script only warns and the site deploys with the last good data.

One-time setup:

1. Create an API app at https://www.strava.com/settings/api with Authorization Callback Domain `localhost`.
2. Put `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET` in `.env.local`, then run `npm run strava:auth` and approve access. The refresh token is saved to `.env.local`.
3. Run `npm run strava -- --wait` for the first full scan, and commit `data/strava-bests.json` and `public/data/strava.json`.
4. In the repository settings: add the three values as Actions secrets; set Pages → Source to "GitHub Actions"; make `main` the default branch (scheduled workflows only run there).

## Analytics

Production keeps the existing Simple Analytics `latest.js` and `auto-events.js` scripts, with queued custom events for chapter views (once per chapter per page load), chapter navigation, and motion control. Localhost and development do not load analytics. Existing automatic email, outbound-link, and download tracking remains available.

Each production visit sends a Telegram notification through a Make webhook (`src/experience/analytics.ts`). The webhook URL and its payload key are repository secrets (`VISIT_HOOK`, `VISIT_KEY`), passed to the build as `VITE_VISIT_HOOK` and `VITE_VISIT_KEY`; they still end up in the published JavaScript, as anything a browser calls must.

## PingPong

Clicking the PingPong star opens the original game on desktop. Touch devices are currently excluded (`canPlayPingPong` in `src/experience/pingpong.ts`) because the game's busy `Thread.sleep(1)` loops make CheerpJ lag badly on iPhone. The touch support is kept for a future attempt: the dialog goes full screen, scales the 770×530 window to fit, and adds held ▲/▼ buttons for each paddle plus Serve (beside the table when the phone is on its side). Those buttons post W/S/O/L/Enter to the frame, which dispatches them as key events with Java key codes; as on the original desktop, the game panel only takes keyboard focus after a click, so the frame first clicks an empty corner. CheerpJ's input methods are off and its hidden text fields use `inputmode="none"`, so the phone keyboard never opens. It runs in its own iframe: closing the dialog removes the frame and shuts the JVM down, and reopening starts a fresh one. CheerpJ is loaded from `cjrtnc.leaningtech.com` on first open only (about 1.5 MB, a few seconds), under its Community License for personal projects, which requires loading from that CDN and crediting CheerpJ (done in the dialog footer). The game reads its assets relative to the working directory, which in CheerpJ is `/files/`, so they are copied there before the JAR starts. The only change to the original bytecode widens the title button by 4px (`MenuPanel`, `setBounds(246, 50, 281, 100)` → `(244, 50, 285, 100)`, same centre): with Arial's exact metrics the title needs 281.2px and Swing truncated it to "Ping Po…". Hosting needs HTTP Range support, which GitHub Pages and Vite both provide.
