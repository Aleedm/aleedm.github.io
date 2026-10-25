import { FlowField } from './flow-field';
import type { Layout } from './terrain';
import { OPEN_WATER } from './release';

export interface Journey extends Layout { descentTop: number; end: number }

const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const ease = (n: number) => { const v = clamp(n); return v * v * (3 - 2 * v); };

/** Document positions of the four stages: orbit, re-entry, the Alps, the coast. */
export function measureJourney(): Journey {
  const top = (selector: string) => {
    const element = document.querySelector<HTMLElement>(selector);
    return element ? element.getBoundingClientRect().top + window.scrollY : 0;
  };
  return {
    descentTop: top('.descent'),
    natureTop: top('#mountains'),
    coastY: top('#coastline'),
    end: document.documentElement.scrollHeight,
  };
}

/** 0 in orbit, 1 once the camera is down among the summits. */
export function descentProgress(scroll: number, journey: Journey, viewport: number) {
  return clamp((scroll - journey.descentTop + viewport * .35) / Math.max(1, journey.natureTop - journey.descentTop - viewport * .1));
}

/** Camera altitude in metres for the centre of the viewport. */
export function altitudeAt(scroll: number, journey: Journey, viewport: number) {
  // Without the seabed chapter the page ends in the shallows, so the readout stays in daylight.
  const orbit = 408_000, ridge = 4_800, seabed = OPEN_WATER ? -40 : -6;
  const descent = descentProgress(scroll, journey, viewport);
  if (descent < 1) return Math.exp(Math.log(orbit) + (Math.log(ridge) - Math.log(orbit)) * ease(descent));
  const centre = scroll + viewport / 2;
  if (centre < journey.coastY) {
    const t = clamp((centre - journey.natureTop - viewport / 2) / Math.max(1, journey.coastY - journey.natureTop - viewport / 2));
    return ridge * (1 - t);
  }
  return seabed * clamp((centre - journey.coastY) / Math.max(1, journey.end - viewport / 2 - journey.coastY));
}

// From Zurich to the tip of Salento, following the same scroll as the map.
const ZURICH = [47.37, 8.54], SALENTO = [40.08, 18.51];
export function coordinatesAt(scroll: number, journey: Journey, viewport: number) {
  const t = ease((scroll + viewport / 2 - journey.natureTop) / Math.max(1, journey.coastY - journey.natureTop));
  return [ZURICH[0] + (SALENTO[0] - ZURICH[0]) * t, ZURICH[1] + (SALENTO[1] - ZURICH[1]) * t];
}

export function formatAltitude(metres: number) {
  if (Math.abs(metres) >= 10_000) return `${Math.round(metres / 1000).toLocaleString('en-US')} km`;
  return `${metres < 0 ? '−' : ''}${Math.abs(Math.round(metres)).toLocaleString('en-US')} m`;
}

/** The sea's current is shared by the water shader and the floating photographs. */
export const sea = { field: new FlowField() };
