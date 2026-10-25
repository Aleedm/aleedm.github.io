import { useEffect, useRef } from 'react';
import { createWorld } from './world';
import { makeStars, stepStar, type Star } from './particles';
import type { FlowStroke } from './flow-field';
import { altitudeAt, descentProgress, measureJourney, sea, type Journey } from './journey';

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const v = clamp(n); return v * v * (3 - 2 * v); };

export function Atmosphere({ paused }: { paused: boolean }) {
  const starsRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<HTMLCanvasElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = starsRef.current!, ctx = canvas.getContext('2d');
    if (!ctx) return;
    const world = createWorld(worldRef.current!);
    const root = document.documentElement;
    root.dataset.world = world ? 'live' : 'static';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, journey: Journey = measureJourney();
    let stars: Star[] = [];
    let frame = 0, lastTime = 0, elapsed = 0, needsRender = true, lastScroll = -1;
    const pointer = { x: -1000, y: -1000, active: false, lastEvent: 0 };
    const strokes: FlowStroke[] = [];

    const resize = () => {
      const nextWidth = window.innerWidth, nextHeight = window.innerHeight;
      if (nextWidth !== width || nextHeight !== height) {
        if (stars.length) stars.forEach((star) => { star.x *= nextWidth / width; star.y *= nextHeight / height; });
        else stars = makeStars(nextWidth, nextHeight);
        width = nextWidth; height = nextHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr; canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        world?.resize(width, height);
      }
      journey = measureJourney();
      needsRender = true;
    };
    const inSea = () => window.scrollY + height > journey.coastY - height * .3;
    const onPointer = (event: PointerEvent) => {
      const now = performance.now();
      if (pointer.active && !pausedRef.current && !reduced.matches && inSea()) {
        strokes.push({ fromX: pointer.x / width, fromY: 1 - pointer.y / height,
          toX: event.clientX / width, toY: 1 - event.clientY / height,
          seconds: Math.max(.008, Math.min(.08, (now - pointer.lastEvent) / 1000)) });
        if (strokes.length > 64) strokes.shift();
      }
      pointer.x = event.clientX; pointer.y = event.clientY;
      pointer.lastEvent = now; pointer.active = true;
    };
    const leave = () => { pointer.active = false; };
    const onPointerUp = (event: PointerEvent) => { if (event.pointerType !== 'mouse') leave(); };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; strokes.length = 0; }
      else if (!frame) { lastTime = 0; frame = requestAnimationFrame(render); }
    };

    const render = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, .04) : 1 / 60;
      lastTime = now;
      const still = pausedRef.current || reduced.matches;
      root.dataset.motion = still ? 'paused' : 'running';
      if (!still) elapsed += dt;
      const scroll = window.scrollY;
      if (scroll !== lastScroll) { needsRender = true; lastScroll = scroll; }

      const descent = descentProgress(scroll, journey, height);
      const altitude = altitudeAt(scroll, journey, height);
      root.dataset.tone = descent < .55 ? 'night' : altitude < -13 ? 'deep' : 'day';
      const starOpacity = 1 - smooth(descent / .45);
      canvas.style.opacity = String(starOpacity);
      hazeRef.current!.style.opacity = String(starOpacity);

      if (starOpacity > 0 && (!still || needsRender)) {
        ctx.clearRect(0, 0, width, height);
        for (const star of stars) {
          if (!still) stepStar(star, pointer, dt, elapsed, width, height);
          const alpha = .35 + (Math.sin(elapsed * .3 + star.phase) + 1) * .24;
          ctx.fillStyle = `rgba(235,245,248,${alpha})`;
          ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill();
          if (star.size > 1.5) {
            ctx.fillStyle = `rgba(200,234,235,${alpha * .045})`;
            ctx.beginPath(); ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      if (world && descent > 0) {
        const seaVisible = inSea();
        let flow = null;
        if (seaVisible && !still) {
          sea.field.advance(dt);
          strokes.forEach((stroke) => sea.field.addStroke(stroke, width / height));
          flow = sea.field;
        }
        strokes.length = 0;
        const clouds = descent > 0 && descent < 1;
        if (needsRender || (!still && (seaVisible || clouds))) {
          world.draw({
            camY: scroll, zoom: .28 + .72 * smooth(descent), day: smooth((descent - .05) / .75),
            cloudPass: clamp((descent - .08) / .84), time: elapsed, layout: journey,
          }, flow);
        }
      } else strokes.length = 0;

      needsRender = false;
      frame = requestAnimationFrame(render);
    };

    resize();
    const layoutObserver = new ResizeObserver(resize);
    layoutObserver.observe(document.querySelector('main')!);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', leave, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', onVisibility);
    const onMotion = () => { needsRender = true; };
    reduced.addEventListener('change', onMotion);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame); layoutObserver.disconnect(); world?.dispose();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', leave);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onMotion);
    };
  }, []);

  return (
    <div className="atmosphere" aria-hidden="true">
      <canvas ref={worldRef} className="world" />
      <div ref={hazeRef} className="cosmic-haze" />
      <canvas ref={starsRef} className="star-field" />
      <div className="grain" />
    </div>
  );
}
