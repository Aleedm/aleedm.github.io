import { useEffect, useRef, useState } from 'react';
import { formatAltitude, measureJourney } from './journey';
import { heightAt, metres } from './terrain';
import { track } from './analytics';
import { RunningCard } from './RunningCard';
import { ActivityCard } from './ActivityCard';
import { loadStrava, type Sport, type StravaData } from './strava';

interface Waypoint {
  id: string; name: string; note: string;
  image?: { src: string; alt: string };
  // Latest activity from Strava, when the sport is tracked there.
  sport?: Sport;
  // A fixed altitude in metres for the label; otherwise it reads the map under the pin.
  elevation?: number;
}

// Places along the trail, from the ridge down to the shore. Waypoints fill them in order.
const slots = [{ x: 70, y: 7 }, { x: 24, y: 25 }, { x: 66, y: 44 }, { x: 26, y: 62 }, { x: 68, y: 79 }, { x: 36, y: 95 }];

// Ordered by altitude. Snowboarding and hiking swap when the latest hike went higher.
const waypoints: Waypoint[] = [
  { id: 'snowboarding', name: 'Snowboarding', note: 'Fall, get up, try the turn again.', sport: 'snowboarding' },
  { id: 'hiking', name: 'Hiking', note: 'Worth every metre of the climb.', sport: 'hiking',
    image: { src: '/me.jpg', alt: 'Alessandro sitting by a turquoise mountain lake' } },
  { id: 'climbing', name: 'Climbing', note: 'An excellent example of my technique.', elevation: 500,
    image: { src: '/falling_down.gif', alt: 'A doodled stick figure falling off a bouldering wall' } },
  { id: 'tennis', name: 'Tennis', note: 'Chasing every ball, catching some.', sport: 'tennis', elevation: 450 },
  { id: 'running', name: 'Running', note: 'All the way down to the valley.', elevation: 410 },
  { id: 'sup', name: 'Stand up paddle', note: 'The calmest way onto the sea.', sport: 'sup', elevation: 0 },
];

function byAltitude(data: StravaData | null) {
  const hike = data?.activities?.hiking?.elevHigh, snow = data?.activities?.snowboarding?.elevHigh;
  if (hike == null || snow == null || hike <= snow) return waypoints;
  const [snowboarding, hiking, ...rest] = waypoints;
  return [hiking, snowboarding, ...rest];
}

// Catmull-Rom through the slots, from the ridge above to the valley below.
const points = [{ x: 86, y: -4 }, ...slots, { x: 52, y: 104 }];
const path = points.slice(0, -1).map((p, i) => {
  const p0 = points[Math.max(0, i - 1)], p1 = points[i + 1], p2 = points[Math.min(points.length - 1, i + 2)];
  const c1 = { x: p.x + (p1.x - p0.x) / 6, y: p.y + (p1.y - p0.y) / 6 };
  const c2 = { x: p1.x - (p2.x - p.x) / 6, y: p1.y - (p2.y - p.y) / 6 };
  return `${i ? '' : `M${p.x} ${p.y}`} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p1.x} ${p1.y}`;
}).join(' ');

export function Trail() {
  const hostRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<SVGRectElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [elevations, setElevations] = useState<string[]>([]);
  const [order, setOrder] = useState(waypoints);

  useEffect(() => { loadStrava().then((data) => setOrder(byAltitude(data))); }, []);

  useEffect(() => {
    const host = hostRef.current!;
    let frame = 0;
    const measure = () => {
      const journey = measureJourney(), rect = host.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      setElevations(slots.map((slot) =>
        formatAltitude(Math.max(0, metres(heightAt(rect.left + rect.width * slot.x / 100, top + rect.height * slot.y / 100, journey))))));
    };
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    // The trail only ever heads downhill, so revealing it down to the reading line follows the route.
    const reveal = () => {
      frame = 0;
      const rect = host.getBoundingClientRect();
      const progress = still.matches ? 1 : Math.max(0, Math.min(1, (window.innerHeight * .65 - rect.top) / rect.height));
      revealRef.current!.setAttribute('height', String(10 + progress * 100));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(reveal); };
    const observer = new ResizeObserver(() => { measure(); schedule(); });
    observer.observe(document.querySelector('main')!);
    window.addEventListener('scroll', schedule, { passive: true });
    reveal();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', schedule); };
  }, []);

  const toggle = (id: string) => {
    setOpen((current) => current === id ? null : id);
    track('waypoint_open', { waypoint: id });
  };

  return (
    <div ref={hostRef} className="trail page-width">
      <svg className="trail-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <clipPath id="trail-reveal">
            <rect ref={revealRef} x="-10" y="-10" width="120" height="10" />
          </clipPath>
        </defs>
        <path d={path} className="trail-halo trail-ghost" />
        <path d={path} className="trail-ghost" />
        <g clipPath="url(#trail-reveal)">
          <path d={path} className="trail-halo" />
          <path d={path} className="trail-route" />
        </g>
      </svg>
      {order.map((w, index) => (
        <div key={w.id} className="waypoint" data-side={slots[index].x > 50 ? 'left' : 'right'} data-open={open === w.id || undefined}
          style={{ left: `${slots[index].x}%`, top: `${slots[index].y}%` }}
          onPointerEnter={(event) => { if (event.pointerType === 'mouse') setOpen(w.id); }}
          onPointerLeave={(event) => { if (event.pointerType === 'mouse') setOpen((current) => current === w.id ? null : current); }}>
          <button type="button" className="waypoint-pin" aria-expanded={open === w.id} onClick={() => toggle(w.id)}>
            <span className="waypoint-dot" aria-hidden="true" />
            <span className="waypoint-label">
              <span className="waypoint-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="waypoint-name">{w.name}</span>
              <span className="waypoint-elevation">{w.elevation != null ? formatAltitude(w.elevation) : elevations[index] ?? ''}</span>
            </span>
          </button>
          <div className="waypoint-card" data-card={w.id}>
            {w.image && <img src={w.image.src} alt={w.image.alt} loading="lazy" />}
            {w.id === 'running' ? <RunningCard note={w.note} />
              : w.sport ? <ActivityCard sport={w.sport} note={w.note} />
              : <p>{w.note}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
