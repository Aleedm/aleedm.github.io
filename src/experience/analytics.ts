import AES from 'crypto-js/aes';

declare global {
  interface Window {
    sa_event?: ((name: string, metadata?: Record<string, string | number | boolean>) => void) & { q?: unknown[] };
  }
}

export function track(name: string, metadata?: Record<string, string | number | boolean>) {
  if (import.meta.env.PROD && !isLocal()) window.sa_event?.(name, metadata);
}

function isLocal() {
  return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(window.location.hostname);
}

export function installAnalytics() {
  if (!import.meta.env.PROD || isLocal()) return;
  // Keep early chapter events queued until the existing tracker is available.
  window.sa_event = window.sa_event || Object.assign(
    (name: string, metadata?: Record<string, string | number | boolean>) => {
      window.sa_event!.q!.push([name, metadata]);
    }, { q: [] as unknown[] },
  );
  ['latest.js', 'auto-events.js'].forEach((file) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://scripts.simpleanalyticscdn.com/${file}`;
    document.head.appendChild(script);
  });
  notifyVisit();
}

// A Telegram message per visit, via a Make scenario that decrypts the payload with this key.
// Both come from repository secrets at build time (see .github/workflows/pages.yml), so they
// stay out of the source; without them, visits are simply not notified.
const VISIT_HOOK: string | undefined = import.meta.env.VITE_VISIT_HOOK;
const VISIT_KEY: string | undefined = import.meta.env.VITE_VISIT_KEY;

async function notifyVisit() {
  if (!VISIT_HOOK || !VISIT_KEY) return;
  let place = { country: 'Unknown', region: 'Unknown', city: 'Unknown' };
  try {
    const info = await (await fetch('https://ipapi.co/json/')).json();
    place = { country: info.country_name, region: info.region, city: info.city };
  } catch { /* still notify, without a place */ }
  track('Visitor', { c: place.city ?? 'Unknown', r: place.region ?? 'Unknown' });
  fetch(VISIT_HOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ d: AES.encrypt(JSON.stringify(place), VISIT_KEY).toString() }),
  }).catch(() => {});
}
