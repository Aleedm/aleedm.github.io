export interface Star {
  x: number; y: number; vx: number; vy: number;
  driftX: number; driftY: number; size: number; phase: number;
}
export interface StarPointer { x: number; y: number; active: boolean }

export function makeStars(width: number, height: number, random = Math.random): Star[] {
  return Array.from({ length: Math.min(650, Math.round(width * height / 2200)) }, () => {
    const speed = 2 + random() * 4;
    const angle = -.45 + random() * 1.5;
    const driftX = Math.cos(angle) * speed;
    const driftY = Math.sin(angle) * speed;
    return { x: random() * width, y: random() * height, vx: driftX, vy: driftY,
      driftX, driftY, size: .35 + random() ** 3 * 1.5, phase: random() * Math.PI * 2 };
  });
}

export function stepStar(star: Star, pointer: StarPointer, dt: number, time: number, width: number, height: number) {
  // Restore only the travelling speed. There is deliberately no home position.
  const drag = Math.exp(-1.25 * dt);
  const driftX = star.driftX + Math.sin(time * .13 + star.y * .003 + star.phase) * .9;
  const driftY = star.driftY + Math.cos(time * .11 + star.x * .002 + star.phase) * .7;
  star.vx = driftX + (star.vx - driftX) * drag;
  star.vy = driftY + (star.vy - driftY) * drag;
  if (pointer.active) {
    const dx = star.x - pointer.x, dy = star.y - pointer.y;
    const distance = Math.hypot(dx, dy);
    const radius = Math.min(190, width * .34);
    if (distance < radius && distance > .01) {
      const acceleration = 155 * (1 - distance / radius) ** 2;
      star.vx += dx / distance * acceleration * dt;
      star.vy += dy / distance * acceleration * dt;
    }
  }
  star.x += star.vx * dt;
  star.y += star.vy * dt;
  // A toroidal world lets stars continue through the edges without respawning.
  const margin = 12;
  if (star.x > width + margin) star.x -= width + margin * 2;
  if (star.x < -margin) star.x += width + margin * 2;
  if (star.y > height + margin) star.y -= height + margin * 2;
  if (star.y < -margin) star.y += height + margin * 2;
}
