import type { APIRoute } from 'astro';
import { getArticles, getProjects } from '@/lib/content';
import { about, site, socials } from '@/lib/site';

// Plain-text summary of the site for AI agents (https://llmstxt.org).
export const GET: APIRoute = async ({ site: base }) => {
  const url = (path: string) => new URL(path, base).href;
  const projects = await getProjects();
  const articles = await getArticles();

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    ...about.paragraphs.flatMap((p) => [p, '']),
    `- Title: ${site.title}`,
    `- Location: ${site.location}`,
    `- Email: ${site.email}`,
    ...socials.map((s) => `- ${s.label}: ${s.href}`),
    '',
    '## Pages',
    '',
    `- [About](${url('/about/')}): background and experience`,
    `- [Work](${url('/work/')}): architecture case studies`,
    `- [Writing](${url('/writing/')}): technical articles`,
    '',
    '## Work',
    '',
    ...(projects.length
      ? projects.map((p) => `- [${p.data.title}](${url(`/work/${p.id}/`)}): ${p.data.description}`)
      : ['- Case studies are in preparation.']),
    '',
    '## Writing',
    '',
    ...(articles.length
      ? articles.map((a) => `- [${a.data.title}](${url(`/writing/${a.id}/`)}): ${a.data.description}`)
      : ['- No articles published yet.']),
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
