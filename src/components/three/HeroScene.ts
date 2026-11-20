import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { HeroConfig, HeroPhase } from './config';
import { createRng } from './scenes/shapes';

const vertexShader = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uTime;
  uniform float uDrift;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uPointerOn;
  uniform vec3 uPointer;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vColor;
  varying float vAlpha;

  float easeInOut(float t) { return t * t * (3.0 - 2.0 * t); }

  void main() {
    // Each particle starts its move a little later than the previous one.
    float k = easeInOut(clamp(uProgress * 1.5 - aSeed * 0.5, 0.0, 1.0));
    vec3 p = mix(position, aTarget, k);
    float swirl = sin(k * 3.14159265) * (0.4 + aSeed * 0.6);
    p += vec3(-p.z, 0.0, p.x) * swirl * 0.3;
    p += vec3(sin(uTime * 0.4 + aSeed * 40.0), cos(uTime * 0.33 + aSeed * 57.0), sin(uTime * 0.29 + aSeed * 23.0)) * 0.03 * uDrift;

    vec4 world = modelMatrix * vec4(p, 1.0);
    vec2 away = world.xy - uPointer.xy;
    world.xy += normalize(away + 1e-4) * uPointerOn * 0.4 * smoothstep(1.1, 0.0, length(away));

    vec4 view = viewMatrix * world;
    gl_Position = projectionMatrix * view;
    gl_PointSize = uSize * uPixelRatio * (0.6 + aSeed * 0.8) * (9.0 / -view.z);

    vColor = mix(uColorA, uColorB, clamp(0.5 + p.y * 0.22 + p.x * 0.12, 0.0, 1.0));
    vAlpha = (0.35 + 0.65 * aSeed) * smoothstep(14.0, 7.0, -view.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.0, r));
  }
`;

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * One particle cloud that morphs between the phase shapes
 * (lightbulb → architecture diagram → AI hub → shield → rocket).
 */
export class HeroScene {
  readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(40, 1, 0.1, 100);
  private readonly group = new Group();
  private readonly geometry = new BufferGeometry();
  private readonly material: ShaderMaterial;
  private readonly seeds: Float32Array;
  private readonly raycaster = new Raycaster();
  private readonly plane = new Plane(new Vector3(0, 0, 1), 0);
  private readonly pointerNdc = new Vector2(0, 0);
  private pointerActive = 0;
  private phase = 0;
  private time = 0;
  private readonly colorA = new Color();
  private readonly colorB = new Color();

  constructor(
    canvas: HTMLCanvasElement,
    private readonly config: HeroConfig,
    private readonly phases: HeroPhase[],
    private readonly shapes: Float32Array[],
    private readonly reducedMotion: boolean,
  ) {
    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.maxPixelRatio));
    this.camera.position.set(0, 0, 9);

    const first = shapes[0]!;
    const count = first.length / 3;
    const rng = createRng(7);
    this.seeds = Float32Array.from({ length: count }, () => rng());

    this.geometry.setAttribute('position', new BufferAttribute(first.slice(), 3));
    this.geometry.setAttribute('aTarget', new BufferAttribute(first.slice(), 3));
    this.geometry.setAttribute('aSeed', new BufferAttribute(this.seeds, 1));

    const [a, b] = phases[0]!.colors;
    this.colorA.set(a);
    this.colorB.set(b);
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uProgress: { value: 1 },
        uTime: { value: 0 },
        uDrift: { value: reducedMotion ? 0 : 1 },
        // Fewer particles on small screens, so draw each one a little larger.
        uSize: { value: config.pointSize * (count < config.particles.wide ? 1.35 : 1) },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uPointerOn: { value: 0 },
        uPointer: { value: new Vector3(99, 99, 0) },
        uColorA: { value: this.colorA.clone() },
        uColorB: { value: this.colorB.clone() },
      },
    });

    this.group.add(new Points(this.geometry, this.material));
    this.group.rotation.x = phases[0]!.tilt;
    // Sit above the caption area at the bottom of the panel.
    this.group.position.y = 0.75;
    this.group.scale.setScalar(0.88);
    this.scene.add(this.group);
  }

  private uniform<T>(name: string): { value: T } {
    return this.material.uniforms[name] as { value: T };
  }

  /** Start morphing to `index`. Mid-morph interruptions continue from where particles are now. */
  setPhase(index: number): void {
    if (index === this.phase) return;
    const position = this.geometry.getAttribute('position') as BufferAttribute;
    const target = this.geometry.getAttribute('aTarget') as BufferAttribute;
    const from = position.array as Float32Array;
    const to = target.array as Float32Array;
    const progress = this.uniform<number>('uProgress').value;

    // Bake the current (mid-morph) positions into the start buffer, mirroring the shader.
    for (let i = 0; i < this.seeds.length; i++) {
      const k = smooth(Math.min(1, Math.max(0, progress * 1.5 - this.seeds[i]! * 0.5)));
      const swirl = Math.sin(k * Math.PI) * (0.4 + this.seeds[i]! * 0.6) * 0.3;
      const j = i * 3;
      const x = from[j]! + (to[j]! - from[j]!) * k;
      const y = from[j + 1]! + (to[j + 1]! - from[j + 1]!) * k;
      const z = from[j + 2]! + (to[j + 2]! - from[j + 2]!) * k;
      from[j] = x - z * swirl;
      from[j + 1] = y;
      from[j + 2] = z + x * swirl;
    }
    to.set(this.shapes[index]!);
    position.needsUpdate = true;
    target.needsUpdate = true;

    this.phase = index;
    const [a, b] = this.phases[index]!.colors;
    this.colorA.set(a);
    this.colorB.set(b);
    this.uniform<number>('uProgress').value = this.reducedMotion ? 1 : 0;
    if (this.reducedMotion) {
      this.uniform<Color>('uColorA').value.copy(this.colorA);
      this.uniform<Color>('uColorB').value.copy(this.colorB);
      this.group.rotation.x = this.phases[index]!.tilt;
    }
  }

  /** Pointer in normalised device coordinates relative to the canvas, or null when it leaves. */
  setPointer(ndc: { x: number; y: number } | null): void {
    if (ndc) this.pointerNdc.set(ndc.x, ndc.y);
    this.pointerActive = ndc && !this.reducedMotion ? 1 : 0;
  }

  resize(width: number, height: number): void {
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    // Pull back on narrow containers so the widest shape still fits.
    this.camera.position.z = width / height < 0.9 ? 10.5 : 9;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  /** Advance by `dt` seconds. Returns true while something is still changing. */
  update(dt: number): boolean {
    const progress = this.uniform<number>('uProgress');
    const pointerOn = this.uniform<number>('uPointerOn');
    const ease = Math.min(1, dt * 2.5);

    this.time += dt;
    this.uniform<number>('uTime').value = this.time;
    progress.value = Math.min(1, progress.value + dt / this.config.morphDuration);
    pointerOn.value += (this.pointerActive - pointerOn.value) * Math.min(1, dt * 5);
    this.uniform<Color>('uColorA').value.lerp(this.colorA, ease);
    this.uniform<Color>('uColorB').value.lerp(this.colorB, ease);

    if (this.pointerActive) {
      this.raycaster.setFromCamera(this.pointerNdc, this.camera);
      this.raycaster.ray.intersectPlane(this.plane, this.uniform<Vector3>('uPointer').value);
    }

    const parallax = this.config.parallax * pointerOn.value;
    const yaw = Math.sin(this.time * 0.25) * 0.35 + this.pointerNdc.x * parallax;
    const pitch = this.phases[this.phase]!.tilt - this.pointerNdc.y * parallax * 0.5;
    this.group.rotation.y += (yaw - this.group.rotation.y) * ease;
    this.group.rotation.x += (pitch - this.group.rotation.x) * ease;

    return progress.value < 1 || pointerOn.value > 0.001;
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
