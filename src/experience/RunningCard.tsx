import { useEffect, useState } from 'react';
import { formatDate, formatDuration, formatPace, loadStrava, type Distance, type StravaData } from './strava';

const DISTANCES: [Distance, string][] = [['5k', '5K'], ['10k', '10K'], ['half', 'Half'], ['marathon', 'Marathon']];

// Set once there is a photo of the marathon medal, e.g. { src: '/running/marathon-medal.webp', alt: '…' }.
const MARATHON_MEDAL: { src: string; alt: string } | null = null;

export function RunningCard({ note }: { note: string }) {
  const [data, setData] = useState<StravaData | null>(null);
  useEffect(() => { loadStrava().then(setData); }, []);

  if (!data) return <p>{note}</p>;
  const { bests, latest } = data;
  return (
    <div className="run">
      {MARATHON_MEDAL && <img className="run-medal" src={MARATHON_MEDAL.src} alt={MARATHON_MEDAL.alt} loading="lazy" />}
      <p className="run-label">Personal bests</p>
      <dl className="run-bests">
        {DISTANCES.map(([key, label]) => {
          const best = bests[key];
          return (
            <div key={key} data-distance={key}>
              <dt>{label}</dt>
              <dd>{best
                ? <a href={best.url} title={`Set on ${formatDate(best.date)} — view on Strava`}>{formatDuration(best.seconds)}</a>
                : <span className="run-empty">—</span>}</dd>
              {best && <dd className="run-when">{formatDate(best.date)}</dd>}
            </div>
          );
        })}
      </dl>
      {latest && (
        <div className="run-latest">
          <p className="run-label">Last run · {formatDate(latest.date)}</p>
          <p className="run-stats">
            <span>{(latest.distance / 1000).toFixed(2)} km</span>
            <span>{formatDuration(latest.movingTime)}</span>
            <span>{formatPace(latest.movingTime, latest.distance)}</span>
            {latest.elevation > 0 && <span>↑ {Math.round(latest.elevation)} m</span>}
          </p>
          <a className="strava-link" href={latest.url}>View on Strava</a>
        </div>
      )}
      <p className="run-powered"><a href={data.athleteUrl}>Powered by Strava</a></p>
    </div>
  );
}
