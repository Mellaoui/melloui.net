import { build, dust, line, rect, type Part, type Vec3 } from './shapes';

/** Design: an architecture diagram on a blueprint grid. */
export function designShape(count: number): Float32Array {
  const parts: Part[] = [];

  const box = (cx: number, cy: number, w: number, h: number, lines: number[]) => {
    parts.push(...rect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, 0, 1.6));
    parts.push(...rect(cx - w / 2 + 0.06, cy - h / 2 - 0.06, cx + w / 2 + 0.06, cy + h / 2 - 0.06, -0.25, 0.35));
    lines.forEach((len, i) => {
      const y = cy + h / 2 - 0.2 - i * 0.16;
      parts.push(line([cx - w / 2 + 0.15, y, 0], [cx - w / 2 + 0.15 + len, y, 0], 1.6));
    });
  };
  const wire = (points: Vec3[]) => points.slice(1).forEach((p, i) => parts.push(line(points[i]!, p, 1.3)));

  box(0, 1.25, 1.5, 0.6, [0.7, 0.45]);
  box(-1.35, -0.2, 1.3, 0.6, [0.6, 0.4]);
  box(1.35, -0.2, 1.3, 0.6, [0.5, 0.65]);
  box(0, -1.45, 1.7, 0.55, [0.9, 0.5]);

  wire([
    [0, 0.95, 0],
    [0, 0.5, 0],
    [-1.35, 0.5, 0],
    [-1.35, 0.1, 0],
  ]);
  wire([
    [0, 0.5, 0],
    [1.35, 0.5, 0],
    [1.35, 0.1, 0],
  ]);
  wire([
    [-1.35, -0.5, 0],
    [-1.35, -1.45, 0],
    [-0.85, -1.45, 0],
  ]);
  wire([
    [1.35, -0.5, 0],
    [1.35, -1.45, 0],
    [0.85, -1.45, 0],
  ]);

  // Blueprint grid behind the diagram.
  parts.push({
    weight: 2.2,
    sample: (rng) => [-2.4 + Math.floor(rng() * 13) * 0.4, -1.8 + Math.floor(rng() * 10) * 0.4, -0.6],
  });
  parts.push(dust(1));

  return build(parts, count, 202, 0.014);
}
