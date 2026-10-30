// Scaffolds a new section from the same shape as projects and musings:
//   npm run new:section -- notes "Notes"
// Edits only src/content.config.ts and src/data/nav.ts, and adds new files
// under src/content/<name>/ and src/pages/<name>/. Then run `npm run build`.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [name, label = name[0]?.toUpperCase() + name.slice(1)] = process.argv.slice(2);
if (!name || !/^[a-z][a-z0-9-]*$/.test(name) || name.includes('-')) {
  console.error('Usage: npm run new:section -- <name> ["Nav label"]\n<name>: lowercase letters and digits, e.g. notes');
  process.exit(1);
}
const root = process.env.SECTION_ROOT ?? '.';
const p = (...a) => join(root, ...a);
if (existsSync(p('src/content', name)) || existsSync(p('src/pages', name))) {
  console.error(`Section "${name}" already exists.`);
  process.exit(1);
}

// content.config.ts: add the collection above the export, and to the export.
let config = readFileSync(p('src/content.config.ts'), 'utf-8');
config = config.replace(
  /export const collections = \{([^}]*)\}/,
  (_, list) => {
    const names = list.split(',').map((s) => s.trim()).filter(Boolean);
    return `const ${name} = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/${name}' }),
  schema: z
    .object({
      title: z.string().min(1),
      date: z.coerce.date(),
      summary: z.string().min(1),
    })
    .strict(),
});

export const collections = { ${[...names, name].join(', ')} }`;
  },
);
writeFileSync(p('src/content.config.ts'), config);

// nav.ts: add an entry before the closing bracket.
const nav = readFileSync(p('src/data/nav.ts'), 'utf-8');
writeFileSync(p('src/data/nav.ts'), nav.replace(/\n\];/, `\n  { label: '${label}', href: '/${name}' },\n];`));

const write = (file, text) => {
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, text);
};
write(p('src/content', name, 'fixture.md'), `---
title: Fixture ${name} entry
date: 2000-01-01
summary: A made-up entry that exists only to prove the ${name} section builds and renders.
---

This is fixture content. Delete it when the first real entry lands.
`);
write(p('src/pages', name, 'index.astro'), `---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import PageHeader from '../../components/PageHeader.astro';
import EntryList from '../../components/EntryList.astro';

const entries = (await getCollection('${name}')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const items = entries.map((e) => ({
  href: \`/${name}/\${e.id}\`,
  title: e.data.title,
  summary: e.data.summary,
  meta: String(e.data.date.getUTCFullYear()),
}));
---

<Base title="${label} · damiano.dev">
  <PageHeader title="${label}" />
  <EntryList items={items} />
</Base>
`);
write(p('src/pages', name, '[id].astro'), `---
import { getCollection, render } from 'astro:content';
import Base from '../../layouts/Base.astro';
import PageHeader from '../../components/PageHeader.astro';

export async function getStaticPaths() {
  const entries = await getCollection('${name}');
  return entries.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const { title, summary } = entry.data;
---

<Base title={\`\${title} · damiano.dev\`} description={summary}>
  <PageHeader title={title} lede={summary} />
  <Content />
</Base>
`);
console.log(`Created section "${name}". Next: edit the schema in src/content.config.ts, then npm run build.`);
