/** Hero animation settings and phase content (SPEC §6). */
export const heroConfig = {
  /** Seconds each phase is shown before auto-advancing. */
  hold: 5,
  /** Seconds a morph between shapes takes. */
  morphDuration: 1.8,
  /** Particle count on wide / narrow containers. */
  particles: { wide: 6000, narrow: 3500 },
  /** Base point size (scaled by distance and pixel ratio). */
  pointSize: 2.4,
  /** Strength of mouse parallax on the structure (0 disables it). */
  parallax: 0.25,
  /** Cap device pixel ratio to keep the GPU cost low. */
  maxPixelRatio: 2,
} as const;

export interface HeroPhase {
  label: string;
  caption: string;
  /** Two colours blended across the shape. */
  colors: [string, string];
  /** Tilt of the structure (radians) so 3D shapes read well. */
  tilt: number;
}

// Order must match the shape builders in SceneManager.ts.
export const heroPhases: HeroPhase[] = [
  { label: 'Think', caption: 'Understand the real problem before writing any code.', colors: ['#fde68a', '#f59e0b'], tilt: 0.05 },
  { label: 'Design', caption: 'Shape the architecture, data, and interfaces.', colors: ['#7dd3fc', '#818cf8'], tilt: 0.12 },
  { label: 'Orchestrate', caption: 'Direct AI agents and tools to build it with focus.', colors: ['#c4b5fd', '#f0abfc'], tilt: 0.55 },
  { label: 'Validate', caption: 'Test, review, and verify every critical path.', colors: ['#6ee7b7', '#22d3ee'], tilt: 0.06 },
  { label: 'Deliver', caption: 'Ship reliable software that keeps running.', colors: ['#fda4af', '#fb923c'], tilt: 0.08 },
];

export type HeroConfig = typeof heroConfig;
