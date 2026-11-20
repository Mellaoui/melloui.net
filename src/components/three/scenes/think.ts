import { arc, build, curve, dot, dust, line, type Part } from './shapes';

/** Think: a lightbulb with a glowing filament and rays. */
export function thinkShape(count: number): Float32Array {
  const parts: Part[] = [];
  const cy = 0.45;
  const r = 1.05;
  const open = 0.85; // radians left open at the bottom of the glass

  // Glass: a circle open at the bottom.
  parts.push(arc([0, cy, 0], r, 'xy', -Math.PI / 2 + open, (3 * Math.PI) / 2 - open, 1.7));
  const nx = Math.cos(-Math.PI / 2 + open) * r;
  const ny = cy + Math.sin(-Math.PI / 2 + open) * r;
  parts.push(curve([nx, ny, 0], [0.42, ny - 0.25, 0], [0.42, -0.85, 0], 1.7));
  parts.push(curve([-nx, ny, 0], [-0.42, ny - 0.25, 0], [-0.42, -0.85, 0], 1.7));

  // Screw base and tip.
  [-0.95, -1.12, -1.29].forEach((y, i) => parts.push(line([-0.42 + i * 0.03, y, 0], [0.42 - i * 0.03, y, 0], 1.8)));
  parts.push(curve([-0.3, -1.38, 0], [0, -1.6, 0], [0.3, -1.38, 0], 1.6));

  // Filament: two supports and a coil.
  parts.push(line([-0.2, -0.85, 0], [-0.25, 0.25, 0], 1.2), line([0.2, -0.85, 0], [0.25, 0.25, 0], 1.2));
  parts.push({
    weight: 1.2,
    sample: (rng) => {
      const t = rng();
      return [-0.25 + t * 0.5, 0.3 + Math.sin(t * Math.PI * 6) * 0.08, 0];
    },
  });
  parts.push(dot([0, 0.3, 0], 0.16, 0.6));

  // Rays.
  for (let k = 0; k < 7; k++) {
    const a = Math.PI * (0.08 + (k / 6) * 0.84);
    parts.push(line([Math.cos(a) * 1.35, cy + Math.sin(a) * 1.35, 0], [Math.cos(a) * 1.7, cy + Math.sin(a) * 1.7, 0], 1.6));
  }
  parts.push(dust(1.2));

  return build(parts, count, 101);
}
