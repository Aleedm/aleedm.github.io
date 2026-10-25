export interface FlowStroke {
  fromX: number; fromY: number; toX: number; toY: number;
  seconds: number;
}

/** A directional, semi-Lagrangian flow map. No radial waves or prescribed curl. */
export class FlowField {
  readonly size: number;
  readonly pixels: Uint8Array;
  private vx: Float32Array;
  private vy: Float32Array;
  private nextX: Float32Array;
  private nextY: Float32Array;

  constructor(size = 96) {
    this.size = size;
    const count = size * size;
    this.vx = new Float32Array(count);
    this.vy = new Float32Array(count);
    this.nextX = new Float32Array(count);
    this.nextY = new Float32Array(count);
    this.pixels = new Uint8Array(count * 4);
    this.encode();
  }

  private sample(field: Float32Array, x: number, y: number) {
    const n = this.size;
    x = Math.max(0, Math.min(n - 1.001, x));
    y = Math.max(0, Math.min(n - 1.001, y));
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const index = iy * n + ix;
    return (field[index] * (1 - fx) + field[index + 1] * fx) * (1 - fy)
      + (field[index + n] * (1 - fx) + field[index + n + 1] * fx) * fy;
  }

  advance(seconds: number) {
    if (seconds <= 0) return;
    const dt = Math.min(seconds, .05), n = this.size;
    const decay = Math.exp(-2.1 * dt);
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const index = y * n + x;
        const backX = x - this.vx[index] * dt * (n - 1);
        const backY = y - this.vy[index] * dt * (n - 1);
        this.nextX[index] = this.sample(this.vx, backX, backY) * decay;
        this.nextY[index] = this.sample(this.vy, backX, backY) * decay;
      }
    }
    [this.vx, this.nextX] = [this.nextX, this.vx];
    [this.vy, this.nextY] = [this.nextY, this.vy];
  }

  addStroke(stroke: FlowStroke, aspect: number) {
    const dx = stroke.toX - stroke.fromX, dy = stroke.toY - stroke.fromY;
    const length = Math.hypot(dx * aspect, dy);
    if (length < .00001 || stroke.seconds <= 0) return;
    const speedX = Math.max(-.8, Math.min(.8, dx / Math.max(.008, stroke.seconds))) * .34;
    const speedY = Math.max(-.8, Math.min(.8, dy / Math.max(.008, stroke.seconds))) * .34;
    const radius = .052;
    const samples = Math.min(20, Math.max(1, Math.ceil(length / (radius * .4))));
    const strength = Math.min(.85, length / radius * 1.2) / Math.sqrt(samples);
    const n = this.size;
    for (let s = 0; s <= samples; s++) {
      const f = s / samples;
      const px = stroke.fromX + dx * f, py = stroke.fromY + dy * f;
      const minX = Math.max(0, Math.floor((px - radius * 2 / aspect) * (n - 1)));
      const maxX = Math.min(n - 1, Math.ceil((px + radius * 2 / aspect) * (n - 1)));
      const minY = Math.max(0, Math.floor((py - radius * 2) * (n - 1)));
      const maxY = Math.min(n - 1, Math.ceil((py + radius * 2) * (n - 1)));
      for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
        const rx = (x / (n - 1) - px) * aspect;
        const ry = y / (n - 1) - py;
        const influence = Math.exp(-(rx * rx + ry * ry) / (radius * radius * .5)) * strength;
        const index = y * n + x;
        // Every affected sample points along the gesture, never around it.
        this.vx[index] += (speedX - this.vx[index]) * influence;
        this.vy[index] += (speedY - this.vy[index]) * influence;
      }
    }
  }

  encode() {
    for (let i = 0; i < this.vx.length; i++) {
      this.pixels[i * 4] = Math.round(128 + this.vx[i] * 127);
      this.pixels[i * 4 + 1] = Math.round(128 + this.vy[i] * 127);
      this.pixels[i * 4 + 2] = Math.round(Math.min(1, Math.hypot(this.vx[i], this.vy[i]) * 4) * 255);
      this.pixels[i * 4 + 3] = 255;
    }
    return this.pixels;
  }

  sampleVelocity(x: number, y: number): [number, number] {
    return [this.sample(this.vx, x * (this.size - 1), y * (this.size - 1)),
      this.sample(this.vy, x * (this.size - 1), y * (this.size - 1))];
  }

  energy() {
    let sum = 0;
    for (let i = 0; i < this.vx.length; i++) sum += this.vx[i] ** 2 + this.vy[i] ** 2;
    return sum;
  }
}
