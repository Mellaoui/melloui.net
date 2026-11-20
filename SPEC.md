# Project Setup — mellaoui.net

You are a senior frontend engineer and software architect experienced with Astro, TypeScript, Three.js, web performance, and modern UI/UX.

Your task is to initialize a production-quality personal portfolio website named **mellaoui.net**, developed as a Leveluper project.

## 1. Project Overview

**Website:** mellaoui.net
**Owner:** Mohamed Elghazali Mellaoui
**Professional identity:** Senior Backend Engineer
**Development organization:** Leveluper

This website will establish my professional identity as an experienced backend engineer, showcasing engineering achievements, architecture case studies, technical articles, and independent projects.

The website should feel like a premium, creative engineering portfolio, not a generic developer template or software agency website.

**Design inspiration:** [https://msaied.com/](https://msaied.com/)

Use the reference for its visual creativity, polished presentation, and interactive Three.js hero experience. Do not copy its source code, assets, animations, layouts, or branding.

### Source of facts

All biographical and professional facts must come from existing sources, never invented:

- Roles and experience: `~/apps/leveluper/src/content/journey/*.md`
- Projects: `~/apps/leveluper/src/content/projects/*.md`
- Email, social links, about text: `~/apps/leveluper/src/data/site.ts`

If a fact is not in these sources, leave a clearly marked placeholder instead.

> Note: leveluper.com uses the title "Backend & System Architecture Engineer · Algiers". mellaoui.net uses "Senior Backend Engineer" by choice.

### Brand statement

**Engineering reliable systems. Exploring intelligent ones.**

Focus areas:

- Backend engineering and system architecture
- Distributed systems and data consistency
- APIs, integrations, and production reliability
- AI engineering, RAG, and intelligent applications

## 2. Technology Stack

Use:

- Astro (latest stable version)
- TypeScript with strict mode
- Tailwind CSS (current Astro-supported integration)
- Three.js for the interactive hero animation
- Astro Content Collections for structured content
- MDX for technical articles and case studies
- Lucide icons
- ESLint and Prettier
- pnpm as package manager

Do not introduce React, Vue, Nuxt, Laravel, databases, authentication, or backend APIs unless a concrete requirement makes them necessary.

Use static site generation.

Check the current official documentation before selecting package versions and configuration conventions.

## 3. Project Architecture

Create a maintainable, feature-oriented structure similar to:

```text
src/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── home/
│   ├── projects/
│   └── three/
│       ├── HeroScene.ts
│       ├── SceneManager.ts
│       ├── scenes/
│       │   ├── DataScene.ts
│       │   ├── SystemsScene.ts
│       │   └── IntelligenceScene.ts
│       └── utils/
├── content/
│   ├── projects/
│   └── writing/
├── layouts/
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── work/
│   └── writing/
├── styles/
└── lib/

public/
├── images/
└── fonts/
```

Adapt the structure to current Astro best practices where appropriate. Avoid unnecessary abstraction.

### Naming

| Concept | Content collection | Route |
|---------|-------------------|-------|
| Case studies / projects | `projects` (`src/content/projects/`) | `/work/` and `/work/[slug]/` |
| Articles | `writing` (`src/content/writing/`) | `/writing/` and `/writing/[slug]/` |

UI labels use "Work" and "Writing".

## 4. Visual Design System

Design direction: **Light editorial + dark technical sections.**

The website should feel:

- Creative but professional
- Technically sophisticated
- Minimal without being boring
- Modern and distinctive
- Fast and accessible

### Color palette

- Background: `#F8F8FC`
- Primary text: `#101829`
- Dark sections: `#111629`
- Dark surfaces: `#252846`
- Primary accent: `#6554ED`
- Secondary accent: `#9A85F8`

Use design tokens through CSS variables.

### Typography

- Headings: Manrope
- Body: Inter
- Code: JetBrains Mono

Use responsive fluid typography with `clamp()`.

### Layout

- Maximum content width: approximately 1200px
- Generous whitespace
- Responsive grid layouts
- Large editorial headlines
- Subtle borders and shadows
- Rounded project cards
- Consistent spacing system
- Accessible contrast ratios

Avoid generic gradient-heavy SaaS layouts, glassmorphism everywhere, excessive animations, and decorative technology-logo walls.

## 5. Homepage Structure

Create an initial homepage with the following sections:

### Hero

Two-column desktop layout:

**Left:**

- Professional name
- Senior Backend Engineer title
- Brand statement
- Concise professional introduction
- Links to selected work, writing, and contact

**Right:**

- A dedicated responsive Three.js animation container

### Engineering Domains

Introduce three areas:

1. **Data** — database architecture, synchronization, consistency, and event-driven workflows.
2. **Systems** — APIs, distributed components, queues, and production reliability.
3. **Intelligence** — RAG, retrieval systems, and LLM-powered applications.

### Selected Work

Show published work only: products running in production (Verifeye, TravelTo) first, then case studies once they are written.

Planned case studies (kept as `draft: true` files, hidden from the site until written):

- Multi-database synchronization
- Authentication and SSO integration
- Production backend integrations

Do not invent business results, metrics, or completed AI projects.

### Writing

A section for future technical articles.

### About

A concise introduction emphasizing backend expertise, technical judgment, and product development.

### Contact

A minimal professional contact section:

- A `mailto:` link to the email in `~/apps/leveluper/src/data/site.ts` (no form, no third-party form service in Phase 1).
- Links to LinkedIn, X, and GitHub from the same file.

## 6. Three.js Hero Foundation

Build the technical foundation for an original interactive 3D visualization.

The concept is a continuously evolving engineering system with three states:

**Data → Systems → Intelligence**

### Data scene

Represent interconnected databases and event-driven synchronization.

### Systems scene

Represent APIs, services, background workers, and queues.

### Intelligence scene

Represent a RAG pipeline with documents, embeddings, retrieval, and contextual generation.

### Animation requirements

- Use Three.js directly.
- One canvas and one renderer for the entire hero.
- Smooth transitions between the three states.
- Subtle floating movement and camera motion.
- Gentle mouse parallax on desktop.
- Avoid excessive particles and GPU-heavy effects.
- Provide a static visual fallback.
- Respect `prefers-reduced-motion`.
- Pause rendering when the hero is outside the viewport or the tab is hidden.
- Dispose of geometries, materials, textures, and renderer resources during cleanup.
- Make animation speed and scene timing configurable.

### Visual concept (updated 2026-11-18)

Hero copy:

- **Headline:** I turn complex problems into simple, reliable software.
- **Intro:** I'm a software engineer who combines deep technical experience with AI-powered workflows to architect systems, build products, and deliver meaningful results.

Like the reference, each step is a recognizable object drawn by a single particle cloud that morphs between them:

| Step | Object | Caption |
|------|--------|---------|
| 01 Think | Lightbulb | Understand the real problem before writing any code. |
| 02 Design | Architecture diagram on a blueprint grid | Shape the architecture, data, and interfaces. |
| 03 Orchestrate | AI hub with orbiting agents | Direct AI agents and tools to build it with focus. |
| 04 Validate | Shield with a check mark | Test, review, and verify every critical path. |
| 05 Deliver | Rocket lifting off | Ship reliable software that keeps running. |

The panel shows the phase number, caption, and a tab control with an autoplay progress bar (paused on hover/focus, disabled under reduced motion). The shapes are original; no code or assets are copied from the reference.

## 7. Performance and SEO

Implement:

- Static HTML generation
- Responsive design
- Semantic HTML
- Accessible keyboard navigation
- Proper heading hierarchy
- Open Graph metadata
- Sitemap and robots.txt
- Canonical URLs
- Lazy-loaded Three.js bundle
- Font optimization
- Responsive image handling
- Meaningful page titles and descriptions
- `llms.txt` summarizing the site, work, and writing for AI agents (same idea as leveluper.com)

The Three.js scene must not block initial content rendering.

## 8. Content Management

Use Astro Content Collections and MDX.

Define schemas for:

**Projects:**

- title
- description
- category
- technologies
- role
- date
- featured
- draft
- coverImage (optional)

**Writing:**

- title
- description
- publishedAt
- updatedAt (optional)
- tags
- draft

Use example content clearly marked as illustrative. Do not invent professional accomplishments or performance metrics.

## 9. Developer Experience

Configure:

- TypeScript strict mode
- ESLint
- Prettier and Astro formatting support
- Useful package scripts
- Environment variable examples only if needed
- README with installation, development, build, and deployment instructions
- Git ignore rules
- A basic GitHub Actions CI workflow for type checking, linting, and building

Include:

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm check
```

Use supported commands and ensure scripts actually work.

## 10. Deployment

Prepare the project for static deployment on Coolify using the same approach as leveluper.com:

- Multi-stage `Dockerfile`: build with Node + pnpm, serve `dist/` with `nginx:stable-alpine` on port 80.
- `nginx.conf` based on `~/apps/leveluper/nginx.conf` (relative redirects, gzip, immutable caching for `/_astro/`).
- TLS and the domain are handled by Coolify's proxy.

Do not deploy anything yet or configure production credentials.

## 11. Working Method

Follow this process:

1. Inspect the current repository and existing files.
2. Identify whether the repository is empty or contains code that must be preserved.
3. Check current official Astro, Tailwind, MDX, and Three.js documentation.
4. Propose a concise implementation plan, then continue without waiting for approval unless a requirement is ambiguous or conflicting.
5. Initialize the project.
6. Build the foundation and initial homepage.
7. Implement the basic Three.js proof of concept.
8. Run type checks, linting, and production builds.
9. Fix any issues found.
10. Summarize the changes and remaining work.

Do not overwrite existing files without checking their purpose.

Avoid overengineering, unnecessary dependencies, and speculative features.

## 12. Definition of Done

The initial setup is complete when:

- The Astro project runs locally.
- TypeScript and styling are configured.
- Homepage sections are responsive.
- Content Collections are working.
- A basic Three.js hero scene renders correctly.
- A static fallback exists.
- Basic accessibility and SEO requirements are satisfied.
- Type checks, linting, and the production build pass.
- The README documents the project clearly.

Do not claim checks passed unless they were actually executed.

**Important:** This is Phase 1 — project foundation. Prioritize quality, maintainability, and performance over completing the full visual experience.
