# mellaoui.net

Personal portfolio of Mohamed Elghazali Mellaoui — senior backend engineer. Built by [Leveluper](https://leveluper.com).

Static site: Astro 7, TypeScript (strictest), Tailwind CSS 4, MDX, Three.js. The full brief is in [`SPEC.md`](SPEC.md).

## Requirements

- Node.js ≥ 22.12 (24 recommended)
- pnpm 10 (`corepack enable` picks the version from `package.json`)

## Commands

| Command                             | Action                                              |
| ----------------------------------- | --------------------------------------------------- |
| `pnpm install`                      | Install dependencies                                |
| `pnpm dev`                          | Dev server at http://localhost:4321                 |
| `pnpm build`                        | Production build to `dist/`                         |
| `pnpm preview`                      | Serve the production build locally                  |
| `pnpm check`                        | Type-check `.astro` and `.ts` files (`astro check`) |
| `pnpm lint`                         | ESLint                                              |
| `pnpm format` / `pnpm format:check` | Prettier                                            |

## Project structure

```text
src/
├── components/
│   ├── layout/      Header, Footer
│   ├── ui/          Shared building blocks
│   ├── home/        Homepage sections
│   ├── projects/    Project card
│   └── three/       Hero scene (Three.js, lazy-loaded)
├── content/
│   ├── projects/    Case studies (MDX) → /work/<slug>/
│   └── writing/     Articles (MDX) → /writing/<slug>/
├── content.config.ts  Collection schemas
├── layouts/         BaseLayout (SEO, fonts)
├── lib/             site.ts (facts), content.ts (queries)
├── pages/
└── styles/          global.css (design tokens)
```

## Editing content

- **Site facts** (name, title, email, socials, about, experience): `src/lib/site.ts`. Only add facts that can be backed up.
- **Case study:** copy `src/content/projects/_template.mdx` to `<slug>.mdx`. `draft: true` hides it everywhere (no card, no page); set `draft: false` to publish.
- **Article:** copy `src/content/writing/_template.mdx` to `<slug>.mdx`. `draft: true` hides it everywhere.
- **Hero animation timing:** `src/components/three/config.ts`.
- **Colours and dark theme:** tokens in `src/styles/global.css`. The dark palette follows the system setting until the visitor uses the header toggle; the choice is saved in `localStorage`.

## Hero scene

One particle cloud morphs between five objects: a lightbulb (Think), an architecture diagram (Design), an AI hub with agents (Orchestrate), a shield with a check mark (Validate) and a rocket (Deliver). Shapes are defined in `src/components/three/scenes/`; captions, colours and timing in `src/components/three/config.ts`.

`HeroCanvas.astro` renders static icons first. When the hero is near the viewport and the browser is idle, it imports `SceneManager` (Three.js is a separate lazy chunk) and fades the canvas in. Tabs switch phases; autoplay pauses on hover/focus, off-screen and in hidden tabs, and is off under `prefers-reduced-motion`. The render loop stops when the hero is not visible, and all GPU resources are disposed on unload. Without WebGL, the icons stay.

## Deployment (Coolify)

1. Create an application from this repository with Build Pack **Dockerfile**, port **80**.
2. Set the domain to `mellaoui.net`; Coolify's proxy handles TLS.

The `Dockerfile` builds with pnpm and serves `dist/` with nginx (`nginx.conf`: gzip, immutable caching for `/_astro/`, custom 404).
