import { arc, build, dot, dust, line, sparkle, type Part, type Vec3 } from './shapes';

/** Orchestrate: an AI hub coordinating agents that orbit around it. */
export function orchestrateShape(count: number): Float32Array {
  const parts: Part[] = [];
  const hub: Vec3 = [0, 0.15, 0];

  parts.push(sparkle(hub, 0.6, 2), dot(hub, 0.08, 0.5), arc(hub, 0.85, 'xy', 0, Math.PI * 2, 1.3));

  // Orbit in a horizontal plane so it reads in 3D as the structure turns.
  const orbit = 2.0;
  for (let k = 0; k < 14; k++) {
    const from = (k / 14) * Math.PI * 2;
    parts.push(arc(hub, orbit, 'xz', from, from + 0.28, 0.7));
  }

  // Agents on the orbit, each wired to the hub.
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + 0.3;
    const agent: Vec3 = [Math.cos(a) * orbit, hub[1], Math.sin(a) * orbit];
    parts.push(arc(agent, 0.2, 'xy', 0, Math.PI * 2, 2.6), dot(agent, 0.05, 0.25));
    const start: Vec3 = [Math.cos(a) * 0.9, hub[1], Math.sin(a) * 0.9];
    parts.push(line(start, agent, 0.9));
  }

  // A vertical ring for a gyroscope feel.
  parts.push(arc(hub, 1.45, 'xy', 0, Math.PI * 2, 0.4));
  parts.push(dust(1.2));

  return build(parts, count, 303);
}
