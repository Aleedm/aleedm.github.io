import { useEffect, useRef } from 'react';
import { sea } from './journey';

const photos = [
  { src: '/salento/3.jpeg', alt: 'Clear shallow water over a rocky seabed' },
  { src: '/salento/4.jpeg', alt: 'A watchtower on the limestone coast' },
  { src: '/salento/16.jpeg', alt: 'A bridge spanning a narrow sea inlet' },
  { src: '/salento/13.jpeg', alt: 'Sunset over the sea beside a lifeguard tower' },
  { src: '/salento/17.jpeg', alt: 'A fishing boat stranded on the rocks' },
];

/** Photographs floating on the water, carried by the visitor's current. */
export function Driftwood({ paused }: { paused: boolean }) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const bodies = photos.map((_, i) => ({ x: 0, y: 0, vx: 0, vy: 0, phase: i * 1.9, home: { x: 0, y: 0 } }));
    let frame = 0, last = 0, time = 0;
    const measure = () => itemsRef.current.forEach((item, i) => {
      if (!item) return;
      const rect = item.parentElement!.getBoundingClientRect();
      bodies[i].home = { x: rect.left + rect.width / 2, y: rect.top + window.scrollY + rect.height / 2 };
    });
    const render = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, .04) : 1 / 60;
      last = now;
      if (!pausedRef.current && !reduced.matches) {
        time += dt;
        const width = window.innerWidth, height = window.innerHeight, scroll = window.scrollY;
        bodies.forEach((body, i) => {
          const sx = body.home.x + body.x, sy = body.home.y + body.y - scroll;
          if (sy > -300 && sy < height + 300) {
            const [fx, fy] = sea.field.sampleVelocity(Math.max(0, Math.min(1, sx / width)), Math.max(0, Math.min(1, 1 - sy / height)));
            body.vx += fx * width * 1.6 * dt;
            body.vy -= fy * height * 1.6 * dt;
          }
          // A loose mooring: the current carries them off, then they drift back.
          body.vx += -body.x * 1.1 * dt; body.vy += -body.y * 1.1 * dt;
          body.vx *= Math.exp(-1.6 * dt); body.vy *= Math.exp(-1.6 * dt);
          body.x += body.vx * dt; body.y += body.vy * dt;
          const bob = Math.sin(time * .8 + body.phase) * 4;
          const tilt = Math.sin(time * .5 + body.phase) * 1.4 + Math.max(-6, Math.min(6, body.vx * .03));
          const item = itemsRef.current[i];
          if (item) item.style.transform = `translate(${body.x}px, ${body.y + bob}px) rotate(${tilt}deg)`;
        });
      }
      frame = requestAnimationFrame(render);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.querySelector('main')!);
    measure();
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  return (
    <div className="driftwood page-width">
      {photos.map((photo, i) => (
        <div key={photo.src} className="drift-slot">
          <div ref={(element) => { itemsRef.current[i] = element; }} className="drift">
            <img src={photo.src} alt={photo.alt} loading="lazy" />
          </div>
        </div>
      ))}
    </div>
  );
}
