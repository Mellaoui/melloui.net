import { arc, build, curve, dust, gaussian, line, rotateZ, type Part } from './shapes';

/** Deliver: a rocket lifting off. */
export function deliverShape(count: number): Float32Array {
  const rocket: Part[] = [];
  const w = 0.5;

  // Nose cone and body.
  rocket.push(curve([-w, 0.5, 0], [-w, 1.35, 0], [0, 1.8, 0], 2), curve([w, 0.5, 0], [w, 1.35, 0], [0, 1.8, 0], 2));
  rocket.push(line([-w, 0.5, 0], [-w, -0.85, 0], 1.8), line([w, 0.5, 0], [w, -0.85, 0], 1.8), line([-w, -0.85, 0], [w, -0.85, 0], 1.8));
  rocket.push(arc([0, 0.55, 0], 0.22, 'xy', 0, Math.PI * 2, 2.4));
  rocket.push(arc([0, 0.5, 0], w, 'xz', 0, Math.PI * 2, 0.5), arc([0, -0.85, 0], w, 'xz', 0, Math.PI * 2, 0.5));

  // Fins.
  for (const side of [-1, 1]) {
    rocket.push(line([side * w, -0.25, 0], [side * 0.95, -1.0, 0], 1.8), line([side * 0.95, -1.0, 0], [side * w, -0.85, 0], 1.8));
  }

  // Exhaust flame.
  rocket.push({
    weight: 1.6,
    sample: (rng) => {
      const t = rng();
      return [gaussian(rng) * 0.18 * (1 - t * 0.6), -1.0 - t * 0.9, gaussian(rng) * 0.1];
    },
  });

  // Speed lines.
  rocket.push(
    line([-1.3, 0.1, 0], [-1.3, -0.9, 0], 0.9),
    line([1.3, 0.4, 0], [1.3, -0.5, 0], 0.9),
    line([-0.95, -1.3, 0], [-0.95, -1.8, 0], 0.9),
  );

  return build([...rotateZ(rocket, -0.35), dust(1.2)], count, 505);
}
