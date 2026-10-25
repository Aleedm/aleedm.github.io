import { createProgram, createTexture } from './gl';
import { TERRAIN_GLSL, type Layout } from './terrain';
import type { FlowField } from './flow-field';

// A single top-down world: orbit, clouds, alpine relief, coast and seabed.
const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0., 1.); }
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 viewport;
uniform float pixelScale;
uniform float camY;
uniform float zoom;
uniform float day;
uniform float cloudPass;
uniform float time;
uniform float natureTop;
uniform float coastY;
uniform sampler2D flowMap;
out vec4 outColor;

${TERRAIN_GLSL}

const vec3 SPACE = vec3(.031, .055, .075);

vec2 worldAt(vec2 screen) {
  vec2 centre = viewport * .5;
  return vec2(centre.x, camY + centre.y) + (screen - centre) / zoom;
}
float fbm(vec2 p) {
  float sum = 0., amplitude = .5;
  for (int i = 0; i < 4; i++) { sum += gnoise(p) * amplitude; p = mat2(.8, .6, -.6, .8) * p * 2.1; amplitude *= .5; }
  return sum;
}
float contour(float value, float width) {
  float fw = max(fwidth(value), 1e-4);
  float line = 1. - smoothstep(fw * .5 * width, fw * 1.5 * width, abs(fract(value + .5) - .5));
  return line * (1. - smoothstep(.25, .7, fw));
}

// Calm directional swell. Gradient refracts the seabed; curvature focuses light.
void swell(vec2 p, out vec2 gradient, out mat2 curvature) {
  gradient = vec2(0.); curvature = mat2(0.);
  float lengths[7] = float[7](46., 31., 58., 24., 39., 72., 28.);
  for (int i = 0; i < 7; i++) {
    // Directions spread by the golden angle so no lattice forms.
    float angle = float(i) * 2.39996 + .4, wavelength = lengths[i];
    vec2 k = vec2(cos(angle), sin(angle)) * 6.2831 / wavelength;
    // Amplitude scales with wavelength squared, so every wave focuses light equally.
    float amplitude = 7e-5 * wavelength * wavelength;
    float phase = dot(k, p) - time * (9. * length(k) + .2) + float(i) * 1.7;
    gradient += amplitude * k * cos(phase);
    curvature -= amplitude * sin(phase) * mat2(k.x * k.x, k.x * k.y, k.x * k.y, k.y * k.y);
  }
}

vec3 landColour(float h, vec2 w) {
  vec3 colour = mix(vec3(.91, .87, .76), vec3(.80, .82, .66), smoothstep(.0, .05, h));
  colour = mix(colour, vec3(.87, .85, .75), smoothstep(.2, .5, h));
  colour = mix(colour, vec3(.81, .79, .75), smoothstep(.6, .8, h));
  float snowline = .94 + gnoise(w / 70.) * .04;
  return mix(colour, vec3(.975, .975, .96), smoothstep(snowline, snowline + .025, h));
}

void main() {
  vec2 screen = vec2(gl_FragCoord.x, viewport.y * pixelScale - gl_FragCoord.y) / pixelScale;
  vec2 w = worldAt(screen);
  float h = heightAt(w);
  float e = 2.5 / zoom;
  vec2 slope = vec2(heightAt(w + vec2(e, 0.)) - h, heightAt(w + vec2(0., e)) - h) / e * TERRAIN_SCALE * .9;
  vec3 normal = normalize(vec3(-slope, 1.));
  // Swiss-style relief: light from the north-west, cool shadows.
  float shade = dot(normal, normalize(vec3(-1., -1., 1.2))) - .667;

  vec3 colour = landColour(h, w);
  // Calmer relief under the text column on the left.
  float veil = (1. - smoothstep(.28, .6, screen.x / viewport.x)) * smoothstep(700., 900., viewport.x);
  shade *= 1. - veil * .5;
  colour *= 1. + clamp(shade, -.5, .35) * .5;
  colour = mix(colour, colour * vec3(.84, .88, .97), clamp(-shade * 1.2, 0., .45));
  colour *= mix(.86, 1., smoothstep(0., .007, h));

  float reveal = smoothstep(1.3 - day * 1.5, 1.4 - day * 1.5, h);
  float lines = max(contour(h * 40., 1.) * .42, contour(h * 8., 1.8) * .7) * reveal * step(.0, h);
  colour = mix(colour, vec3(.52, .38, .25), lines * (1. - veil * .4));
  colour = mix(colour, vec3(.95, .93, .87), veil * .3 * step(0., h));

  if (h < 0.) {
    vec2 uv = screen / viewport;
    vec2 flow = (texture(flowMap, vec2(uv.x, 1. - uv.y)).rg * 255. - 128.) / 127.;
    vec2 push = vec2(flow.x, -flow.y) * 140.;
    vec2 gradient; mat2 curvature;
    swell(w - push, gradient, curvature);
    float depth = -h;
    float focus = mix(25., 210., smoothstep(.0, .25, depth));
    // Light concentrates where the refracted grid folds: thin, bright filaments.
    float caustic = 1. / max(abs(determinant(mat2(1.) + focus * curvature)), .05);
    caustic = clamp((caustic - 1.5) * .055, 0., 1.);

    vec2 bedPoint = w + gradient * 700. - push * .25;
    float bed = heightAt(bedPoint);
    float bedDepth = max(-bed, 0.);
    vec3 seabed = vec3(.90, .86, .74);
    float meadow = smoothstep(.16, .4, gnoise(bedPoint / 170.) + gnoise(bedPoint / 48.) * .35 + gnoise(bedPoint / 14.) * .12) * smoothstep(.02, .1, bedDepth);
    seabed = mix(seabed, vec3(.3, .38, .24), meadow * .6);
    float rock = smoothstep(.25, .45, gnoise(bedPoint / 90. + 9.) + gnoise(bedPoint / 23.) * .3) * (1. - smoothstep(.08, .35, bedDepth));
    seabed = mix(seabed, vec3(.6, .58, .5), rock * .75);
    seabed *= 1. + caustic * mix(.7, .2, smoothstep(.0, .5, bedDepth));

    vec3 transmit = exp(-bedDepth * vec3(9.5, 3.1, 2.2));
    vec3 scatter = mix(vec3(.22, .72, .74), vec3(.02, .26, .38), smoothstep(.04, .6, bedDepth));
    vec3 water = seabed * transmit + scatter * (1. - transmit);
    water += vec3(.75, .95, 1.) * length(flow) * .12;

    float shore = 1. - smoothstep(0., .009, depth);
    float lap = .5 + .5 * sin(time * .9 - depth * 520. + gnoise(w / 45.) * 3.);
    colour = mix(water, vec3(.97, .98, .96), shore * mix(.35, .9, lap));
  }

  vec3 night = SPACE * 1.3 + vec3(.55, .78, .84) * lines * .55;
  colour = mix(night, colour, smoothstep(.3, .85, day));
  colour = mix(SPACE, colour, smoothstep(.0, .35, day));

  float cloudAmount = pow(max(sin(3.14159 * clamp(cloudPass, 0., 1.)), 0.), .8);
  if (cloudAmount > .001) {
    vec2 c = (screen - viewport * .5) / viewport.y * mix(4.5, .7, cloudPass) + vec2(time * .012, -camY / viewport.y * (1.4 + cloudPass * 2.5));
    float shadow = smoothstep(-.05, .35, fbm(c + vec2(.12, .1)));
    float cloud = smoothstep(-.05, .35, fbm(c)) * cloudAmount;
    colour *= 1. - shadow * cloudAmount * .3;
    colour = mix(colour, vec3(.96, .97, .98) * mix(.22, 1., day), cloud * .92);
  }
  outColor = vec4(colour, 1.);
}
`;

export interface WorldFrame {
  camY: number; zoom: number; day: number; cloudPass: number; time: number;
  layout: Layout;
}
export interface World {
  resize: (width: number, height: number) => void;
  draw: (frame: WorldFrame, flow: FlowField | null) => void;
  dispose: () => void;
}

export function createWorld(canvas: HTMLCanvasElement): World | null {
  const gl = canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  let shader: ReturnType<typeof createProgram> | undefined;
  let buffer: WebGLBuffer | null = null, flowTexture: WebGLTexture | null = null;
  let width = 1, height = 1, scale = 1;
  const dispose = () => { gl.deleteBuffer(buffer); gl.deleteTexture(flowTexture); shader?.dispose(); };
  try {
    shader = createProgram(gl, vertex, fragment);
    const program = shader.program;
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const names = ['viewport', 'pixelScale', 'camY', 'zoom', 'day', 'cloudPass', 'time', 'natureTop', 'coastY', 'flowMap'] as const;
    const u = Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)])) as Record<typeof names[number], WebGLUniformLocation | null>;
    flowTexture = createTexture(gl, 0);
    gl.uniform1i(u.flowMap, 0);
    return {
      resize(nextWidth, nextHeight) {
        width = nextWidth; height = nextHeight;
        // The relief is computed per pixel; cap the backing store on dense screens.
        scale = Math.min(window.devicePixelRatio || 1, 1.25, 1700 / width);
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        gl.viewport(0, 0, canvas.width, canvas.height);
      },
      draw(frame, flow) {
        if (gl.isContextLost()) return;
        if (flow) {
          gl.bindTexture(gl.TEXTURE_2D, flowTexture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, flow.size, flow.size, 0, gl.RGBA, gl.UNSIGNED_BYTE, flow.encode());
        }
        gl.uniform2f(u.viewport, width, height);
        gl.uniform1f(u.pixelScale, scale);
        gl.uniform1f(u.camY, frame.camY);
        gl.uniform1f(u.zoom, frame.zoom);
        gl.uniform1f(u.day, frame.day);
        gl.uniform1f(u.cloudPass, frame.cloudPass);
        gl.uniform1f(u.time, frame.time);
        gl.uniform1f(u.natureTop, frame.layout.natureTop);
        gl.uniform1f(u.coastY, frame.layout.coastY);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      dispose,
    };
  } catch (error) {
    console.warn('Static world fallback:', error);
    dispose();
    return null;
  }
}
