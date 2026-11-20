// Site-wide facts. Sources: ~/apps/leveluper/src/data/site.ts and src/content/journey/*.md (SPEC §1).
// Do not add facts that are not in those sources.

export const site = {
  name: 'Mohamed Elghazali Mellaoui',
  shortName: 'Mellaoui',
  domain: 'mellaoui.net',
  url: 'https://mellaoui.net',
  title: 'Senior Backend Engineer',
  location: 'Algiers',
  statement: 'Engineering reliable systems. Exploring intelligent ones.',
  description:
    'Mohamed Elghazali Mellaoui is a senior backend engineer who designs and builds SaaS platforms, enterprise integrations and distributed systems, and explores AI engineering and RAG.',
  intro:
    'I design and build reliable backend systems, SaaS platforms, and integrations between complex business applications — with a focus on architecture, API design, data modeling, and long-term maintainability.',
  email: 'e.mellaoui@gmail.com',
  organization: { name: 'Leveluper', url: 'https://leveluper.com' },
};

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohamedelghazali' },
  { label: 'X', href: 'https://x.com/weimin_devOps' },
  { label: 'GitHub', href: 'https://github.com/Mellaoui' },
] as const;

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/#contact' },
] as const;

export const about = {
  paragraphs: [
    'I design and build reliable backend systems, SaaS platforms, and integrations between complex business applications. My work focuses on system architecture, API design, data modeling, authentication, multi-tenancy, asynchronous processing, observability, and long-term maintainability.',
    'I use AI-assisted engineering to work efficiently across programming languages and technology stacks, selecting tools based on system requirements rather than being limited to one framework or language.',
  ],
  focus: ['SaaS', 'Enterprise integrations', 'Distributed systems', 'AI-assisted software development'],
};

// Condensed from ~/apps/leveluper/src/content/journey/*.md (newest first).
export const experience = [
  { role: 'Founder & Technical Director', company: 'Levelupper LLC', period: '2026 — present' },
  { role: 'Full-Stack Developer (backend focus)', company: 'Zad Group', period: '2025 — present' },
  { role: 'Back End Developer', company: 'Orcloud', period: '2022' },
  { role: 'Full-Stack Developer', company: 'Freelance', period: '2020 — 2025' },
  { role: 'Full-Stack Developer', company: 'Presence International', period: '2016 — 2025' },
] as const;
