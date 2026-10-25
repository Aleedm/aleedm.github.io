import { useEffect, useRef } from 'react';
import { altitudeAt, coordinatesAt, formatAltitude, measureJourney } from './journey';
import { track } from './analytics';
import { OPEN_WATER } from './release';

const stops = [
  { id: 'space', label: 'Orbit' },
  { id: 'mountains', label: 'Alps' },
  { id: 'sea', label: 'Sea level' },
  { id: 'seabed', label: 'Seabed' },
].filter((stop) => OPEN_WATER || stop.id !== 'seabed');

export function Altimeter({ active }: { active: string }) {
  const readoutRef = useRef<HTMLSpanElement>(null);
  const coordinatesRef = useRef<HTMLSpanElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let journey = measureJourney(), frame = 0;
    const update = () => {
      frame = 0;
      const scroll = window.scrollY, viewport = window.innerHeight;
      readoutRef.current!.textContent = formatAltitude(altitudeAt(scroll, journey, viewport));
      const [lat, lon] = coordinatesAt(scroll, journey, viewport);
      coordinatesRef.current!.textContent = `${lat.toFixed(2)}° N  ${lon.toFixed(2)}° E`;
      // Each stage takes an equal share of the scale, whatever its length on the page.
      const marks = [0, journey.natureTop, journey.coastY - viewport * .5, journey.end - viewport].slice(0, stops.length);
      const segments = marks.length - 1;
      let position = 1;
      for (let i = 0; i < segments; i++) {
        if (scroll < marks[i + 1]) { position = (i + Math.max(0, scroll - marks[i]) / Math.max(1, marks[i + 1] - marks[i])) / segments; break; }
      }
      needleRef.current!.style.top = `${position * 100}%`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const remeasure = () => { journey = measureJourney(); schedule(); };
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.querySelector('main')!);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure);
    update();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
    };
  }, []);

  return (
    <nav className="altimeter" aria-label="Chapters">
      <div className="altimeter-readout" aria-hidden="true">
        <span ref={readoutRef} className="altitude">408 km</span>
        <span ref={coordinatesRef} className="coordinates" />
      </div>
      <div className="altimeter-scale">
        <span ref={needleRef} className="needle" aria-hidden="true" />
        {stops.map((stop) => (
          <a key={stop.id} href={`#${stop.id}`} aria-label={stop.label} aria-current={active === stop.id ? 'location' : undefined}
            onClick={() => track('chapter_navigation', { chapter: stop.id })}>
            <span>{stop.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
