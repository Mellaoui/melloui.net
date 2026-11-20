/**
 * Tiny toolkit for drawing shapes with particles. Each part has a weight
 * (roughly its visual length/area) and a sampler that returns a random point on it.
 */
export type Vec3 = [number, number, number];
export type Rng = () => number;
export interface Part {
  weight: number;
  sample: (rng: Rng) => Vec3;
}

/** Deterministic PRNG so shapes look the same on every load. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const range = (rng: Rng, min: number, max: number) => min + rng() * (max - min);

export function gaussian(rng: Rng): number {
  const u = Math.max(rng(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

export function line(a: Vec3, b: Vec3, density = 1): Part {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  return {
    weight: length * density,
    sample: (rng) => {
      const t = rng();
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    },
  };
}

/** Rectangle outline in the XY plane at depth z. */
export function rect(x0: number, y0: number, x1: number, y1: number, z = 0, density = 1): Part[] {
  return [
    line([x0, y0, z], [x1, y0, z], density),
    line([x1, y0, z], [x1, y1, z], density),
    line([x1, y1, z], [x0, y1, z], density),
    line([x0, y1, z], [x0, y0, z], density),
  ];
}

/** Filled rectangle in the XY plane (sparse texture). */
export function area(x0: number, y0: number, x1: number, y1: number, z = 0, weight = 0.5): Part {
  return { weight, sample: (rng) => [range(rng, x0, x1), range(rng, y0, y1), z] };
}

/** Circle arc. `plane: 'xz'` lies flat (like a cylinder rim), `'xy'` faces the camera. */
export function arc(center: Vec3, radius: number, plane: 'xz' | 'xy', from = 0, to = Math.PI * 2, density = 1): Part {
  return {
    weight: Math.abs(to - from) * radius * density,
    sample: (rng) => {
      const t = range(rng, from, to);
      const c = Math.cos(t) * radius;
      const s = Math.sin(t) * radius;
      return plane === 'xz' ? [center[0] + c, center[1], center[2] + s] : [center[0] + c, center[1] + s, center[2]];
    },
  };
}

/** Soft blob of points around a centre. */
export function dot(center: Vec3, spread: number, weight = 0.15): Part {
  return {
    weight,
    sample: (rng) => [center[0] + gaussian(rng) * spread, center[1] + gaussian(rng) * spread, center[2] + gaussian(rng) * spread],
  };
}

/** Four-pointed sparkle (astroid curve) facing the camera. */
export function sparkle(center: Vec3, radius: number, density = 1): Part {
  return {
    weight: radius * 6 * density,
    sample: (rng) => {
      const t = rng() * Math.PI * 2;
      return [center[0] + radius * Math.cos(t) ** 3, center[1] + radius * Math.sin(t) ** 3, center[2]];
    },
  };
}

/** Quadratic Bézier curve a → b bending towards control point c. */
export function curve(a: Vec3, c: Vec3, b: Vec3, density = 1): Part {
  const at = (t: number): Vec3 => {
    const u = 1 - t;
    return [0, 1, 2].map((i) => u * u * a[i]! + 2 * u * t * c[i]! + t * t * b[i]!) as Vec3;
  };
  let length = 0;
  for (let k = 0; k < 16; k++) {
    const p = at(k / 16);
    const q = at((k + 1) / 16);
    length += Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]);
  }
  return { weight: length * density, sample: (rng) => at(rng()) };
}

/** Rotate a set of parts around the Z axis (pivot at the origin). */
export function rotateZ(parts: Part[], angle: number): Part[] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return parts.map((part) => ({
    weight: part.weight,
    sample: (rng) => {
      const [x, y, z] = part.sample(rng);
      return [x * c - y * s, x * s + y * c, z];
    },
  }));
}

/** Faint ambient particles around the shape. */
export function dust(weight: number, inner = 2.6, outer = 3.4): Part {
  return {
    weight,
    sample: (rng) => {
      const r = range(rng, inner, outer);
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(range(rng, -1, 1));
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.7, r * Math.sin(phi) * Math.sin(theta) * 0.6];
    },
  };
}

/** Distribute `count` particles across the parts by weight. */
export function build(parts: Part[], count: number, seed: number, jitter = 0.018): Float32Array {
  const rng = createRng(seed);
  const total = parts.reduce((sum, p) => sum + p.weight, 0);
  const out = new Float32Array(count * 3);
  let i = 0;
  parts.forEach((part, index) => {
    const n = index === parts.length - 1 ? count - i : Math.round((part.weight / total) * count);
    for (let k = 0; k < n && i < count; k++, i++) {
      const [x, y, z] = part.sample(rng);
      out[i * 3] = x + gaussian(rng) * jitter;
      out[i * 3 + 1] = y + gaussian(rng) * jitter;
      out[i * 3 + 2] = z + gaussian(rng) * jitter;
    }
  });
  return out;
}
