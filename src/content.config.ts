import { defineCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { z } from 'astro/zod';
import { parse } from 'yaml';

// Months as "YYYY-MM" so they sort as strings.
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM, e.g. 2024-03');

const job = z
  .object({
    role: z.string().min(1),
    company: z.string().min(1),
    start: month,
    end: z.union([month, z.literal('present')]),
    bullets: z.array(z.string().min(1)).min(1),
  })
  .strict()
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
      experience: z.array(job),
      certifications: z.array(cert),
      skills: z.array(skillGroup),
    })
    .strict(),
});

export const collections = { resume };
