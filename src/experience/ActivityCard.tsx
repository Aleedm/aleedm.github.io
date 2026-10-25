import { useEffect, useState } from 'react';
import { formatDate, formatDuration, loadStrava, type Activity, type Sport, type StravaData } from './strava';

const LABELS: Record<Sport, string> = { hiking: 'Last hike', snowboarding: 'Last day on the snow', sup: 'Last paddle', tennis: 'Last match' };
// Strava's automatic titles ("Afternoon Hike") add nothing; custom ones are worth showing.
const AUTOMATIC_NAME = /^(Morning|Lunch|Afternoon|Evening|Night) /;

const km = (metres: number) => `${(metres / 1000).toFixed(metres < 10000 ? 2 : 1)} km`;
const kmh = (metresPerSecond: number) => `${(metresPerSecond * 3.6).toFixed(1)} km/h`;

// Also decides which of hiking and snowboarding sits higher on the trail.
const highest = (a: Activity): [string, string][] => a.elevHigh == null ? [] : [['Highest', `${Math.round(a.elevHigh).toLocaleString('en-US')} m`]];

function stats(sport: Sport, a: Activity): [string, string][] {
  switch (sport) {
    case 'hiking': return [['Distance', km(a.distance)], ['Time', formatDuration(a.movingTime)], ['Climb', `${Math.round(a.elevation)} m`], ...highest(a)];
    case 'snowboarding': return [['Distance', km(a.distance)], ['Time', formatDuration(a.movingTime)], ['Top speed', kmh(a.maxSpeed)], ...highest(a)];
    case 'sup': return [['Distance', km(a.distance)], ['Time', formatDuration(a.movingTime)], ['Average', kmh(a.averageSpeed)]];
    case 'tennis': return [['Time', formatDuration(a.movingTime)], ...(a.averageHeartrate ? [['Heart rate', `${Math.round(a.averageHeartrate)} bpm`] as [string, string]] : [])];
  }
}

function Route({ route }: { route: NonNullable<Activity['route']> }) {
  const start = route.path.match(/^M([\d.]+) ([\d.]+)/), end = route.path.match(/L([\d.]+) ([\d.]+)$/);
  return (
    <svg className="act-route" viewBox={`-8 -8 ${route.width + 16} ${route.height + 16}`} aria-label="Route shape">
      <path d={route.path} />
      {start && <circle className="act-start" cx={start[1]} cy={start[2]} r="3" />}
      {end && <circle className="act-end" cx={end[1]} cy={end[2]} r="3" />}
    </svg>
  );
}

/** The latest Strava activity for a sport; falls back to the waypoint's note. */
export function ActivityCard({ sport, note }: { sport: Sport; note: string }) {
  const [data, setData] = useState<StravaData | null>(null);
  useEffect(() => { loadStrava().then(setData); }, []);

  const activity = data?.activities?.[sport];
  if (!data || !activity) return <p>{note}</p>;
  return (
    <div className="act">
      <p className="run-label">{LABELS[sport]} · {formatDate(activity.date)}</p>
      {!AUTOMATIC_NAME.test(activity.name) && <p className="act-name">{activity.name}</p>}
      <div className="act-body">
        {activity.route && <Route route={activity.route} />}
        <dl className="act-stats">
          {stats(sport, activity).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </div>
      <a className="strava-link" href={activity.url}>View on Strava</a>
      <p className="run-powered"><a href={data.athleteUrl}>Powered by Strava</a></p>
    </div>
  );
}
