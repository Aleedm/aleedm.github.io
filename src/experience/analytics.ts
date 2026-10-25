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
}
