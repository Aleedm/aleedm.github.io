// Strava data written by scripts/strava.mjs to public/data/strava.json and committed.

export type Distance = '5k' | '10k' | 'half' | 'marathon';
export interface Effort { seconds: number; date: string; url: string }
export interface LatestRun { name: string; date: string; distance: number; movingTime: number; elevation: number; url: string }
export type Sport = 'hiking' | 'snowboarding' | 'sup' | 'tennis';
/** A route shape fitted in a 100-unit box, with no coordinates. */
export interface RouteShape { width: number; height: number; path: string }
export interface Activity {
  name: string; date: string; distance: number; movingTime: number; elapsedTime: number; elevation: number;
  maxSpeed: number; averageSpeed: number; averageHeartrate: number | null; url: string; route: RouteShape | null;
  /** Highest point reached, in metres above sea level. */
  elevHigh: number | null;
}
export interface StravaData {
  athleteUrl: string;
  bests: Partial<Record<Distance, Effort>>;
  latest: LatestRun | null;
  activities?: Partial<Record<Sport, Activity>>;
}

let request: Promise<StravaData | null> | null = null;
export const loadStrava = () => request ??= fetch('/data/strava.json')
  .then((response) => response.ok ? response.json() as Promise<StravaData> : null)
  .catch(() => null);

export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = Math.round(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export const formatPace = (seconds: number, metres: number) => `${formatDuration(seconds / (metres / 1000))} /km`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
