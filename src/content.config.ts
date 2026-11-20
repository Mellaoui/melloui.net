import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Files starting with "_" are ignored (use them for templates).
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      technologies: z.array(z.string()).default([]),
      role: z.string(),
      date: z.coerce.date(),
      featured: z.boolean().default(false),
      // draft = hidden everywhere (no card, no page) until set to false.
      draft: z.boolean().default(false),
      coverImage: image().optional(),
      // live = a product running in production; `url` links to it.
      status: z.enum(['live']).optional(),
      url: z.url().optional(),
    }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // draft = hidden everywhere.
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
