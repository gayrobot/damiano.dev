// Run with: npm test. Checks that the section check catches each kind of gap
// and that the scaffold produces a section that passes it.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { checkSections } from '../scripts/check-sections.mjs';

const copy = () => {
  const root = mkdtempSync(join(tmpdir(), 'sections-'));
  cpSync('src', join(root, 'src'), { recursive: true });
  return root;
};

test('the real repo is consistent', () => {
  assert.deepEqual(checkSections('.'), []);
});

test('scaffolded section passes, and removing each piece is caught', () => {
  const root = copy();
  try {
    execFileSync('node', ['scripts/new-section.mjs', 'throwaway', 'Throwaway'], { env: { ...process.env, SECTION_ROOT: root } });
    assert.deepEqual(checkSections(root), []);

    const navPath = join(root, 'src/data/nav.ts');
    const nav = readFileSync(navPath, 'utf-8');
    writeFileSync(navPath, nav.replace(/.*throwaway.*\n/, ''));
    assert.match(checkSections(root).join('\n'), /throwaway: no nav entry/);
    writeFileSync(navPath, nav);

    rmSync(join(root, 'src/pages/throwaway'), { recursive: true });
    assert.match(checkSections(root).join('\n'), /throwaway: no page/);
    cpSync('src/pages/projects', join(root, 'src/pages/throwaway'), { recursive: true });

    const cfgPath = join(root, 'src/content.config.ts');
    const cfg = readFileSync(cfgPath, 'utf-8');
    writeFileSync(cfgPath, cfg.replace(/(const throwaway[\s\S]*?)schema:/, '$1noschema:'));
    assert.match(checkSections(root).join('\n'), /throwaway: collection has no schema/);
    writeFileSync(cfgPath, cfg.replace(/, throwaway \}/, ' }'));
    assert.match(checkSections(root).join('\n'), /throwaway: .*not in `collections`/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
