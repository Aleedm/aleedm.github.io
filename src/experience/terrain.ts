// One heightfield drives both the WebGL map and the DOM labels. The GLSL below
// mirrors these functions; keep the two in sync when tuning the landscape.

export const TERRAIN_SCALE = 760;
export const LAND_METRES = 4200;
export const SEA_METRES = 60;

export interface Layout { natureTop: number; coastY: number }

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
// Shading reads slope, so every blend in the height must also have smooth slope.
const smootherstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
const softMax = (a: number, b: number, k: number) => .5 * (a + b + Math.sqrt((a - b) ** 2 + k));

// PCG2D integer hash: float hashes correlate neighbouring cells into visible blocks.
function hash22(x: number, y: number): [number, number] {
  let vx = (Math.imul(x | 0, 1664525) + 1013904223) >>> 0, vy = (Math.imul(y | 0, 1664525) + 1013904223) >>> 0;
  for (let round = 0; round < 2; round++) {
    vx = (vx + Math.imul(vy, 1664525)) >>> 0; vy = (vy + Math.imul(vx, 1664525)) >>> 0;
    vx = (vx ^ (vx >>> 16)) >>> 0; vy = (vy ^ (vy >>> 16)) >>> 0;
  }
  return [vx / 4294967295 * 2 - 1, vy / 4294967295 * 2 - 1];
}

export function gnoise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  // Quintic fade: hill shading uses the slope, so it must be smooth across cells.
  const ux = fx * fx * fx * (fx * (fx * 6 - 15) + 10), uy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
  const g = (ox: number, oy: number) => { const [hx, hy] = hash22(ix + ox, iy + oy); return hx * (fx - ox) + hy * (fy - oy); };
  return mix(mix(g(0, 0), g(1, 0), ux), mix(g(0, 1), g(1, 1), ux), uy);
}

function ridged(x: number, y: number) {
  // A gentle warp bends the ridges into ranges rather than isolated bumps.
  const wx = gnoise(x * .5, y * .5), wy = gnoise(x * .5 + 5.2, y * .5 + 1.3);
  x += wx * .6; y += wy * .6;
  let sum = 0, amplitude = .5, weight = 1;
  for (let i = 0; i < 4; i++) {
    // The broadest octave stays rounded; a crease that large reads as a straight scar.
    const g = gnoise(x, y) * 1.25;
    let n = 1 - (i ? Math.abs(g) : g * g * 1.6);
    n *= n;
    sum += amplitude * n * weight;
    weight = 1 - Math.exp(-1.8 * n);
    [x, y] = [(.8 * x - .6 * y) * 2.03, (.6 * x + .8 * y) * 2.03];
    amplitude *= .42;
  }
  return sum;
}

/** Normalised elevation: 1 ≈ alpine summits, 0 = sea level, negative = seabed. */
export function heightAt(x: number, y: number, layout: Layout) {
  const px = x / TERRAIN_SCALE, py = y / TERRAIN_SCALE;
  const span = Math.max(1, layout.coastY - layout.natureTop);
  const u = (y - layout.natureTop) / span + gnoise(px * .3 + 3.7, py * .3 + 1.3) * .35;
  const base = 1 - softMax(u, -.4, .04);
  const amplitude = mix(1.1, .1, smootherstep(-.2, 1.1, u));
  return base * .8 + (ridged(px, py) - .6) * amplitude;
}

export const metres = (h: number) => h >= 0 ? h * LAND_METRES : h * SEA_METRES;

export const TERRAIN_GLSL = `
const float TERRAIN_SCALE = ${TERRAIN_SCALE.toFixed(1)};
vec2 hash22(vec2 p) {
  uvec2 v = uvec2(ivec2(p)) * 1664525u + 1013904223u;
  for (int round = 0; round < 2; round++) {
    v.x += v.y * 1664525u; v.y += v.x * 1664525u;
    v ^= v >> 16u;
  }
  return vec2(v) * (2. / 4294967295.) - 1.;
}
float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
  return mix(mix(dot(hash22(i), f), dot(hash22(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
             mix(dot(hash22(i + vec2(0, 1)), f - vec2(0, 1)), dot(hash22(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
}
float ridged(vec2 p) {
  p += vec2(gnoise(p * .5), gnoise(p * .5 + vec2(5.2, 1.3))) * .6;
  float sum = 0., amplitude = .5, weight = 1.;
  for (int i = 0; i < 4; i++) {
    float g = gnoise(p) * 1.25;
    float n = 1. - (i > 0 ? abs(g) : g * g * 1.6);
    n *= n;
    sum += amplitude * n * weight;
    weight = 1. - exp(-1.8 * n);
    p = mat2(.8, .6, -.6, .8) * p * 2.03;
    amplitude *= .42;
  }
  return sum;
}
float heightAt(vec2 w) {
  vec2 p = w / TERRAIN_SCALE;
  float span = max(1., coastY - natureTop);
  float u = (w.y - natureTop) / span + gnoise(p * .3 + vec2(3.7, 1.3)) * .35;
  float base = 1. - .5 * (u - .4 + sqrt((u + .4) * (u + .4) + .04));
  float t = clamp((u + .2) / 1.3, 0., 1.);
  float amplitude = mix(1.1, .1, t * t * t * (t * (t * 6. - 15.) + 10.));
  return base * .8 + (ridged(p) - .6) * amplitude;
}
`;
