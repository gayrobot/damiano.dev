import type { TileIcon } from '../components/Tile.astro';

// The site nav, in order. Every collection's index page needs an entry here
// (scripts/check-sections.mjs enforces it). `icon` picks the line icon on the
// section's Home tile (see Tile.astro); without one it gets a plain page.
export const nav: { label: string; href: string; icon?: TileIcon }[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects', icon: 'folder' },
  { label: 'Musings', href: '/musings', icon: 'pencil' },
  { label: 'Resume', href: '/resume', icon: 'file-text' },
];
