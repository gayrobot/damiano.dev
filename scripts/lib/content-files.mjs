// Every file whose text ends up on the site (or in the resume PDF).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const ROOTS = ['src/pages', 'src/content', 'src/data'];
const EXTS = new Set(['.astro', '.md', '.mdx', '.yaml', '.yml', '.json']);

const walk = (dir) => {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return []; // e.g. src/content doesn't exist yet
  }
  return entries.flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : EXTS.has(extname(p)) ? [p] : [];
  });
};

export const contentFiles = () => ROOTS.flatMap(walk);

// [{ file, line, text }] for every line of content.
export const contentLines = () =>
  contentFiles().flatMap((file) =>
    readFileSync(file, 'utf-8')
      .split('\n')
      .map((text, i) => ({ file, line: i + 1, text })),
  );

export const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
