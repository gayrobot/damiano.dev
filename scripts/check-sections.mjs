// Fails when a content collection is missing a piece of its section: schema,
// page, nav entry, or content folder (and the reverse: a content folder with
// no collection). Recipe: docs/adding-a-section.md. Scaffold: npm run new:section.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// Collections that are one data file, not a folder of entries.
const DATA_ONLY = new Set(['resume']);

export function checkSections(root = '.') {
  const read = (p) => readFileSync(join(root, p), 'utf-8');
  const problems = [];

  const config = read('src/content.config.ts');
  const exported = config.match(/export const collections\s*=\s*\{([^}]*)\}/);
  if (!exported) return ['src/content.config.ts: no `export const collections = { ... }` found'];
  const names = exported[1].split(',').map((s) => s.trim()).filter(Boolean);

  const nav = read('src/data/nav.ts');

  for (const name of names) {
    const def = config.match(new RegExp(`const ${name}\\s*=\\s*defineCollection\\(([\\s\\S]*?)\\n\\}\\);`));
    if (!def) problems.push(`${name}: no \`const ${name} = defineCollection(...)\` in src/content.config.ts`);
    else if (!/\bschema\s*:/.test(def[1])) problems.push(`${name}: collection has no schema`);

    if (!existsSync(join(root, `src/pages/${name}.astro`)) && !existsSync(join(root, `src/pages/${name}/index.astro`))) {
      problems.push(`${name}: no page at src/pages/${name}.astro or src/pages/${name}/index.astro`);
    }
    if (!nav.includes(`href: '/${name}'`)) problems.push(`${name}: no nav entry with href '/${name}' in src/data/nav.ts`);
    if (!DATA_ONLY.has(name) && !existsSync(join(root, `src/content/${name}`))) {
      problems.push(`${name}: no content folder src/content/${name}/`);
    }
  }

  const contentDir = join(root, 'src/content');
  if (existsSync(contentDir)) {
    for (const d of readdirSync(contentDir, { withFileTypes: true })) {
      if (d.isDirectory() && !names.includes(d.name)) {
        problems.push(`${d.name}: src/content/${d.name}/ exists but is not in \`collections\``);
      }
    }
  }
  return problems;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const problems = checkSections();
  if (problems.length) {
    console.error(`Section check failed:\n${problems.map((p) => `  ${p}`).join('\n')}`);
    process.exit(1);
  }
  console.log('Section check: every collection has its schema, page, nav entry and content folder.');
}
