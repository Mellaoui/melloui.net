import { build, curve, dust, line, type Part } from './shapes';

/** Validate: a shield with a check mark. */
export function validateShape(count: number): Float32Array {
  const parts: Part[] = [];

  const shield = (scale: number, z: number, density: number) => {
    const s = (x: number, y: number) => [x * scale, 0.05 + (y - 0.05) * scale, z] as [number, number, number];
    parts.push(
      curve(s(-1.25, 1.2), s(-0.6, 1.25), s(0, 1.55), density),
      curve(s(0, 1.55), s(0.6, 1.25), s(1.25, 1.2), density),
      line(s(-1.25, 1.2), s(-1.25, 0.15), density),
      line(s(1.25, 1.2), s(1.25, 0.15), density),
      curve(s(-1.25, 0.15), s(-1.2, -1.0), s(0, -1.6), density),
      curve(s(1.25, 0.15), s(1.2, -1.0), s(0, -1.6), density),
    );
  };
  shield(1, 0, 1.8);
  shield(0.8, -0.2, 0.6);

  // Check mark.
  parts.push(line([-0.6, 0.1, 0.1], [-0.15, -0.38, 0.1], 3.2), line([-0.15, -0.38, 0.1], [0.7, 0.62, 0.1], 3.2));
  parts.push(dust(1.2));

  return build(parts, count, 404);
}
