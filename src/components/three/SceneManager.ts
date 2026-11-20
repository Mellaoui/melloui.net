import { heroConfig, heroPhases, type HeroConfig, type HeroPhase } from './config';
import { HeroScene } from './HeroScene';
import { deliverShape } from './scenes/deliver';
import { designShape } from './scenes/design';
import { orchestrateShape } from './scenes/orchestrate';
import { thinkShape } from './scenes/think';
import { validateShape } from './scenes/validate';

// One builder per phase, in the same order as heroPhases.
const shapeBuilders = [thinkShape, designShape, orchestrateShape, validateShape, deliverShape];

/**
 * Owns the hero scene lifecycle: builds the shapes, runs the render loop only while
 * the hero is visible (or still settling), honours prefers-reduced-motion, tracks the
 * pointer and resizes, and releases every GPU resource on dispose.
 */
export class SceneManager {
  private scene: HeroScene | null = null;
  private frame = 0;
  private last = 0;
  private inView = true;
  private readonly abort = new AbortController();
  private readonly resizeObserver = new ResizeObserver(() => this.resize());
  private readonly intersectionObserver = new IntersectionObserver(([entry]) => {
    this.inView = entry?.isIntersecting ?? false;
    this.wake();
  });
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(
    private readonly container: HTMLElement,
    private readonly canvas: HTMLCanvasElement,
    private readonly config: HeroConfig = heroConfig,
    private readonly phases: HeroPhase[] = heroPhases,
  ) {}

  /** Returns false if WebGL is unavailable; the static fallback then stays visible. */
  start(initialPhase = 0): boolean {
    const count = this.container.clientWidth < 520 ? this.config.particles.narrow : this.config.particles.wide;
    const shapes = shapeBuilders.map((build) => build(count));
    try {
      this.scene = new HeroScene(this.canvas, this.config, this.phases, shapes, this.reducedMotion);
    } catch {
      return false;
    }
    this.scene.setPhase(initialPhase);

    const { signal } = this.abort;
    this.resizeObserver.observe(this.container);
    this.intersectionObserver.observe(this.container);
    document.addEventListener('visibilitychange', () => this.wake(), { signal });
    this.canvas.addEventListener('webglcontextlost', (e) => e.preventDefault(), { signal });

    const toNdc = (e: PointerEvent) => {
      const r = this.container.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 };
    };
    this.container.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse') return;
        this.scene?.setPointer(toNdc(e));
        this.wake();
      },
      { passive: true, signal },
    );
    this.container.addEventListener('pointerleave', () => this.scene?.setPointer(null), { passive: true, signal });

    this.resize();
    this.scene.update(0);
    this.scene.render();
    this.wake();
    return true;
  }

  setPhase(index: number): void {
    this.scene?.setPhase(index);
    this.wake();
  }

  private resize(): void {
    const { width, height } = this.container.getBoundingClientRect();
    this.scene?.resize(width, height);
    this.scene?.render();
  }

  /** Ensure the loop is running when there is something to draw. */
  private wake(): void {
    if (!this.frame && this.inView && !document.hidden) {
      this.last = performance.now();
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  private readonly tick = (now: number): void => {
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    const changing = this.scene?.update(dt) ?? false;
    this.scene?.render();
    // Keep drifting while visible; under reduced motion only render until settled.
    const keepGoing = this.inView && !document.hidden && (!this.reducedMotion || changing);
    this.frame = keepGoing ? requestAnimationFrame(this.tick) : 0;
  };

  dispose(): void {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.abort.abort();
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.scene?.dispose();
    this.scene = null;
  }
}
