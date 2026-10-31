import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { readFile } from 'node:fs/promises';
import { z } from 'astro/zod';
import { parse } from 'yaml';

// Months as "YYYY-MM" so they sort as strings.
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM, e.g. 2024-03');

const bullets = z.array(z.string().min(1)).min(1);

const project = z
  .object({
    name: z.string().min(1),
    url: z.url().optional(),
    bullets,
  })
  .strict();

// A job has either a flat list of bullets or headed groups of them, not both.
const job = z
  .object({
    role: z.string().min(1),
    company: z.string().min(1),
    location: z.string().min(1).optional(),
    start: month,
    end: z.union([month, z.literal('present')]),
    bullets: bullets.optional(),
    sections: z
      .array(z.object({ heading: z.string().min(1), bullets }).strict())
      .min(1)
      .optional(),
    projects: z.array(project).min(1).optional(),
  })
  .strict()
  .refine((j) => (j.bullets === undefined) !== (j.sections === undefined), {
    message: 'use either bullets or sections',
    path: ['bullets'],
  })
  .refine((j) => j.end === 'present' || j.end >= j.start, {
    message: 'end is before start',
    path: ['end'],
  });

const cert = z
  .object({
    name: z.string().min(1),
    issuer: z.string().min(1),
    year: z.number().int().min(1990).max(2100).optional(),
  })
  .strict();

const degree = z
  .object({
    degree: z.string().min(1),
    school: z.string().min(1),
  })
  .strict();

const skillGroup = z
  .object({
    group: z.string().min(1),
    items: z.array(z.string().min(1)).min(1),
  })
  .strict();

const RESUME_FILE = 'src/data/resume.yaml';

// The whole resume is one entry, so a typo or missing field anywhere fails the build.
// A custom loader instead of file(): file() only logs YAML syntax errors, and the
// build then passes using the last good data it cached.
const resume = defineCollection({
  loader: {
    name: 'resume-yaml',
    load: async ({ store, parseData, watcher }) => {
      const data = parse(await readFile(RESUME_FILE, 'utf-8'));
      store.clear();
      store.set({ id: 'resume', data: await parseData({ id: 'resume', data }), filePath: RESUME_FILE });
      watcher?.add(RESUME_FILE);
    },
  },
  schema: z
    .object({
      name: z.string().min(1),
      headline: z.string().min(1).optional(),
      location: z.string().min(1).optional(),
      // Shown in the PDF only, not on the web page.
      email: z.email().optional(),
      summary: z.string().min(1).optional(),
      experience: z.array(job),
      education: z.array(degree),
      certifications: z.array(cert),
      skills: z.array(skillGroup),
    })
    .strict(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/projects' }),
  schema: z
    .object({
      title: z.string().min(1),
      date: z.coerce.date(),
      summary: z.string().min(1),
      status: z.enum(['active', 'shipped', 'paused']),
      tags: z.array(z.string().min(1)),
      // The live product, when there is one. Never a private repo.
      url: z.url().optional(),
      // Featured projects show on the home page.
      featured: z.boolean().default(false),
    })
    .strict(),
});

// A musing can't build until Skylar has approved it: `approved` must be exactly
// true, so a missing or false value fails the build. Musings are drafted in the
// private drafts repo and promoted by PR; see docs/drafts-flow.md.
const musings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/musings' }),
  schema: z
    .object({
      title: z.string().min(1),
      date: z.coerce.date(),
      summary: z.string().min(1),
      approved: z.literal(true, { error: 'Musings need approved: true, set by Skylar after review' }),
    })
    .strict(),
});

export const collections = { resume, projects, musings };
