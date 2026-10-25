// Fetches running data from Strava for the site.
//
// Personal bests come from each run's best efforts, which Strava only returns per
// activity. They are kept in data/strava-bests.json so later runs only inspect new
// activities, along with the latest activity of each other sport on the site. The
// public summary is written to public/data/strava.json; both are committed so a
// failed refresh still deploys the last good data.
//
// Credentials come from the environment: STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET,
// STRAVA_REFRESH_TOKEN (see scripts/strava-auth.mjs). Without them this is a no-op.
// Pass --wait to sleep through Strava's 15-minute rate limit instead of stopping
// (useful for the first full scan).

import { mkdir, readFile, writeFile } from 'node:fs/promises';

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = process.env;
const STATE = new URL('../data/strava-bests.json', import.meta.url);
const OUTPUT = new URL('../public/data/strava.json', import.meta.url);
const WAIT = process.argv.includes('--wait');
const RUNS = new Set(['Run', 'TrailRun', 'VirtualRun']);
// Strava's best-effort names → the distances shown on the site.
// Matched case-insensitively: the API returns e.g. "5K" and "Half-Marathon".
const EFFORTS = { '5k': '5k', '10k': '10k', 'half-marathon': 'half', 'marathon': 'marathon' };

// The other sports on the site, and which of them show their route.
const SPORTS = { hiking: ['Hike'], snowboarding: ['Snowboard'], sup: ['StandUpPaddling'], tennis: ['Tennis'] };
const ROUTES = new Set(['hiking', 'snowboarding', 'sup']);
// Routes lose this much at each end (like Strava's "hide start and end"), and are
// published only as a normalised shape, never as coordinates.
const PRIVATE_ENDS_METRES = 250;

class RateLimited extends Error {}

if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
  console.log('Strava credentials not set; skipping.');
  process.exit(0);
}

// Strava trouble (rate limits, network, an expired token) must never block a deploy:
// warn, keep the last committed public/data/strava.json, and exit cleanly.
main().catch((error) => {
  const reason = error instanceof RateLimited ? 'rate limited' : error.message;
  console.warn(`::warning::Strava data not refreshed (${reason}); keeping the last published data.`);
});

async function main() {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    body: new URLSearchParams({ client_id: STRAVA_CLIENT_ID, client_secret: STRAVA_CLIENT_SECRET, grant_type: 'refresh_token', refresh_token: STRAVA_REFRESH_TOKEN }),
  });
  if (!response.ok) throw new Error(`Strava token refresh failed: ${response.status} ${await response.text()}`);
  const auth = await response.json();
  if (auth.refresh_token !== STRAVA_REFRESH_TOKEN) console.warn('::warning::Strava issued a new refresh token; update the STRAVA_REFRESH_TOKEN secret.');

  async function api(path) {
    for (;;) {
      const res = await fetch(`https://www.strava.com/api/v3${path}`, { headers: { Authorization: `Bearer ${auth.access_token}` } });
      if (res.status === 429) {
        if (!WAIT) throw new RateLimited();
        // Limits reset at the next quarter hour.
        const next = Math.ceil(Date.now() / 900_000) * 900_000 + 5_000;
        console.log(`Rate limited; waiting until ${new Date(next).toLocaleTimeString()}…`);
        await new Promise((resolve) => setTimeout(resolve, next - Date.now()));
        continue;
      }
      if (!res.ok) throw new Error(`Strava ${res.status} ${path}: ${await res.text()}`);
      return res.json();
    }
  }

  const isPublic = (a) => !a.private && a.visibility !== 'only_me';
  const isPublicRun = (a) => RUNS.has(a.sport_type ?? a.type) && isPublic(a);
  const activityUrl = (id) => `https://www.strava.com/activities/${id}`;

  const state = JSON.parse(await readFile(STATE, 'utf8').catch(() => 'null')) ?? { checkedThrough: null, bests: {} };
  const athlete = await api('/athlete');

  // Activities since the last check. The first time other sports are tracked, list everything.
  const after = state.checkedThrough && state.latest ? Math.floor(Date.parse(state.checkedThrough) / 1000) : 0;
  const summaries = [];
  for (let page = 1; ; page++) {
    const batch = await api(`/athlete/activities?after=${after}&per_page=200&page=${page}`);
    summaries.push(...batch);
    if (batch.length < 200) break;
  }
  state.latest ??= {};
  for (const [sport, types] of Object.entries(SPORTS)) {
    for (const activity of summaries) {
      if (!types.includes(activity.sport_type ?? activity.type) || !isPublic(activity)) continue;
      if (!state.latest[sport] || activity.start_date > state.latest[sport].date) state.latest[sport] = { id: activity.id, date: activity.start_date };
    }
  }

  // New runs, oldest first, so progress can be saved as we go.
  const runs = summaries
    .filter((a) => isPublicRun(a) && (!state.checkedThrough || a.start_date > state.checkedThrough))
    .sort((a, b) => Date.parse(a.start_date) - Date.parse(b.start_date));
  console.log(`${runs.length} new run(s) to inspect.`);

  let inspected = 0, improved = 0, complete = true;
  for (const run of runs) {
    if (run.distance >= 4900) {
      let detail;
      try { detail = await api(`/activities/${run.id}`); } catch (error) {
        if (error instanceof RateLimited) { complete = false; break; }
        throw error;
      }
      for (const effort of detail.best_efforts ?? []) {
        const key = EFFORTS[effort.name.toLowerCase()];
        if (!key) continue;
        const best = state.bests[key];
        if (!best || effort.elapsed_time < best.seconds) {
          state.bests[key] = { seconds: effort.elapsed_time, date: effort.start_date_local, activityId: run.id };
          improved++;
        }
      }
      inspected++;
    }
    state.checkedThrough = run.start_date;
  }
  console.log(`Inspected ${inspected} run(s), ${improved} personal best(s) updated${complete ? '' : '; stopped at the rate limit, the next run continues'}.`);

  await mkdir(new URL('.', STATE), { recursive: true });
  await writeFile(STATE, JSON.stringify(state, null, 2) + '\n');

  const [latest] = (await api('/athlete/activities?per_page=30')).filter(isPublicRun);
  const summary = {
    athleteUrl: `https://www.strava.com/athletes/${athlete.id}`,
    bests: Object.fromEntries(Object.entries(state.bests).map(([key, best]) => [key, { seconds: best.seconds, date: best.date, url: activityUrl(best.activityId) }])),
    // No route or start location: only what's needed for the card.
    latest: latest ? {
      name: latest.name, date: latest.start_date_local, distance: latest.distance,
      movingTime: latest.moving_time, elevation: latest.total_elevation_gain, url: activityUrl(latest.id),
    } : null,
  };
  // Latest activity of each other sport, with a route shape where the site shows one.
  const activities = {};
  for (const [sport, { id }] of Object.entries(state.latest)) {
    const a = await api(`/activities/${id}`);
    activities[sport] = {
      name: a.name, date: a.start_date_local, distance: a.distance, movingTime: a.moving_time, elapsedTime: a.elapsed_time,
      elevation: a.total_elevation_gain, maxSpeed: a.max_speed, averageSpeed: a.average_speed,
      averageHeartrate: a.average_heartrate ?? null, elevHigh: a.elev_high ?? null, url: activityUrl(a.id),
      route: ROUTES.has(sport) ? routeShape(a.map?.summary_polyline) : null,
    };
  }
  summary.activities = activities;

  await mkdir(new URL('.', OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(summary, null, 2) + '\n');
  console.log(`Wrote ${OUTPUT.pathname}`);
}

// Google encoded polyline → [lat, lon] pairs.
function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lon = 0;
  while (index < encoded.length) {
    for (const axis of [0, 1]) {
      let result = 0, shift = 0, byte;
      do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 31) << shift; shift += 5; } while (byte >= 32);
      const delta = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === 0) lat += delta; else lon += delta;
    }
    points.push([lat / 1e5, lon / 1e5]);
  }
  return points;
}

function metresBetween([lat1, lon1], [lat2, lon2]) {
  const rad = Math.PI / 180, dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

// Drops points within the private distance of either end.
function trimEnds(points) {
  const keep = (list) => {
    let travelled = 0;
    for (let i = 1; i < list.length; i++) {
      travelled += metresBetween(list[i - 1], list[i]);
      if (travelled >= PRIVATE_ENDS_METRES) return list.slice(i);
    }
    return [];
  };
  return keep(keep(points).reverse()).reverse();
}

// Ramer–Douglas–Peucker in the normalised plane.
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const [ax, ay] = points[0], [bx, by] = points.at(-1);
  const length = Math.hypot(bx - ax, by - ay) || 1;
  let worst = 0, at = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const distance = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / length;
    if (distance > worst) { worst = distance; at = i; }
  }
  if (worst <= tolerance) return [points[0], points.at(-1)];
  return [...simplify(points.slice(0, at + 1), tolerance).slice(0, -1), ...simplify(points.slice(at), tolerance)];
}

// A north-up SVG path fitted in a 100-unit box: shape only, no coordinates.
function routeShape(encoded) {
  if (!encoded) return null;
  const points = trimEnds(decodePolyline(encoded));
  if (points.length < 2) return null;
  const meanLat = points.reduce((sum, [lat]) => sum + lat, 0) / points.length;
  const planar = points.map(([lat, lon]) => [lon * Math.cos(meanLat * Math.PI / 180), -lat]);
  const xs = planar.map((p) => p[0]), ys = planar.map((p) => p[1]);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  const span = Math.max(Math.max(...xs) - minX, Math.max(...ys) - minY) || 1;
  const fitted = simplify(planar.map(([x, y]) => [(x - minX) / span * 100, (y - minY) / span * 100]), .3);
  const width = Math.max(...fitted.map((p) => p[0])), height = Math.max(...fitted.map((p) => p[1]));
  const round = (n) => Math.round(n * 10) / 10;
  return { width: round(width), height: round(height), path: fitted.map(([x, y], i) => `${i ? 'L' : 'M'}${round(x)} ${round(y)}`).join('') };
}
